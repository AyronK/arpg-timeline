import * as fsPromises from "fs/promises";
import remarkFrontmatter from "remark-frontmatter";
import remarkStringify from "remark-stringify";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { read } from "to-vfile";
import { matter } from "vfile-matter";
import path from "path";

export const loadFromMarkdown = async <T>(
  directoryPath: string,
): Promise<T[]> => {
  const fileNames = await fsPromises.readdir(directoryPath);
  const values: T[] = [];

  for (const fileName of fileNames) {
    const filePath = path.join(directoryPath, fileName);
    const file = await unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(remarkFrontmatter)
      .use(() => (_, file) => matter(file))
      .process(await read(filePath));
    values.push(file.data.matter as T);
  }

  return values;
};

