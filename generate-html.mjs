import fs from 'fs';
import { Liquid } from 'liquidjs';
import matter from 'gray-matter';
import path from 'path';

const engine = new Liquid();
const templatePath = 'index.liquid';
const outputPath = 'index.html';
const contentDir = 'content';
const collections = {};

function readDirectory(dirPath) {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            handleError('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    handleError('Error getting file stats:', err);
                    return;
                }

                if (stats.isDirectory()) {
                    processDirectory(filePath, file);
                } else if (file.endsWith('.md')) {
                    processMarkdownFile(filePath, dirPath);
                }
            });
        });
    });
}

function processDirectory(dirPath, dirName) {
    if (!collections[dirName]) {
        collections[dirName] = [];
    }
    readDirectory(dirPath);
}

function processMarkdownFile(filePath, dirPath) {
    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            handleError('Error reading file:', err);
            return;
        }

        const { data, content: markdownContent } = matter(content);
        const relativeDirPath = path.relative(contentDir, dirPath);
        if (!collections[relativeDirPath]) {
            collections[relativeDirPath] = [];
        }
        collections[relativeDirPath].push({ data, content: markdownContent });

        checkAllFilesProcessed();
    });
}

function checkAllFilesProcessed() {
    const allFiles = getAllFiles(contentDir);
    const processedFiles = Object.values(collections).reduce((acc, curr) => acc.concat(curr), []);
    if (processedFiles.length === allFiles.length) {
        generateHTML();
    }
}

function getAllFiles(dirPath) {
    let files = [];
    const fileList = fs.readdirSync(dirPath);
    fileList.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            files = files.concat(getAllFiles(filePath));
        } else {
            files.push(filePath);
        }
    });
    return files;
}

function generateHTML() {
    fs.readFile(templatePath, 'utf8', (err, template) => {
        if (err) {
            handleError('Error reading template:', err);
            return;
        }

        engine.parseAndRender(template, { collections })
            .then(html => {
                fs.writeFileSync(outputPath, html);
                console.log('HTML generated successfully.');
            })
            .catch(err => {
                handleError('Error generating HTML:', err);
            });
    });
}

function handleError(message, error) {
    console.error(message, error);
}

readDirectory(contentDir);
