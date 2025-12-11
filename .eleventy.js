const yaml = require("js-yaml");
const CleanCSS = require("clean-css");
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");
const htmlmin = require("html-minifier-terser");

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
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // outputs
    formats: ["webp"],

    filenameFormat: function (id, src, width, format) {
      const path = require("path");
      const name = path.basename(src, path.extname(src));
      return `${name}-${width}w.${format}`;
    },
    selector: "img[src]:not([src$='.ico'])",
  });

  // -----------------------------------------------------------------
  // TRANSFORMS
  // -----------------------------------------------------------------
  eleventyConfig.addTransform("htmlmin", async function (content) {
    if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
      // html-minifier-terser is ASYNC
      let minified = await htmlmin.minify(content, {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true, // defer="" -> defer
        removeScriptTypeAttributes: true, // Removes type="text/javascript"
        removeStyleLinkTypeAttributes: true, // Removes type="text/css"
        removeRedundantAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        sortAttributes: true,
        sortClassName: true,
      });

      return minified;
    }

    return content;
  });

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
