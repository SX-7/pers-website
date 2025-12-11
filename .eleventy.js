const yaml = require("js-yaml");
const CleanCSS = require("clean-css");

module.exports = (eleventyConfig) => {
  // -----------------------------------------------------------------
  // FILTERS
  // -----------------------------------------------------------------
  eleventyConfig.addFilter("cssmin", (code) => {
    return new CleanCSS({}).minify(code).styles;
  });

  // -----------------------------------------------------------------
  // EXTENSIONS & PLUGINS
  // -----------------------------------------------------------------
  // Support YAML data files
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // -----------------------------------------------------------------
  // PASSTHROUGH COPIES
  // -----------------------------------------------------------------
  // Copy 'app/static' to '_site/static'
  eleventyConfig.addPassthroughCopy({ "app/static": "static" });

  // -----------------------------------------------------------------
  // CONFIGURATION OPTIONS
  // -----------------------------------------------------------------
  return {
    dir: {
      input: "app/pages",
      includes: "app/elements", // Note: This path is relative to the root
      data: "../_data", // Relative to 'input' (app/pages)
      output: "_site",
    },
  };
};
