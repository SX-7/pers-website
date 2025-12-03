const yaml = require("js-yaml");

module.exports = function(eleventyConfig) {
  // Pass through static images/fonts so they get copied to _site
  eleventyConfig.addPassthroughCopy({"app/static" : "static"});
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

  return {
    dir: {
      input: "app/pages",
      output: "_site",    // The folder Firebase will deploy
      data: "../_data",
      includes: "app/elements"
    }
  };
};