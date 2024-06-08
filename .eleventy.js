module.exports = function (eleventyConfig) {
    eleventyConfig.addCollection('games', function (collection) {
        return collection.getFilteredByGlob('content/games/*.md');
    });

    eleventyConfig.addFilter("notEmpty", function (value) {
        return value.trim().length > 0 ? value : false;
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
