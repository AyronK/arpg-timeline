module.exports = function (eleventyConfig) {
    eleventyConfig.addCollection('games', function (collection) {
        return collection.getFilteredByGlob('content/games/*.md');
    });

    eleventyConfig.setTemplateFormats(["liquid", "md"]);

    return {
        dir: {
            output: "dist",
            includes: "_includes",
            layouts: "_includes"
        }
    };
};
