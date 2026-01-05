const yaml = require("js-yaml");
const postcss = require("postcss");
const cssnano = require("cssnano");
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");
const htmlmin = require("html-minifier-terser");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = (eleventyConfig) => {
  // -----------------------------------------------------------------
  // FILTERS
  // -----------------------------------------------------------------
  // Minify css
  eleventyConfig.addNunjucksAsyncFilter("cssmin", function (code, callback) {
    postcss([cssnano])
      .process(code, { from: undefined })
      .then((result) => callback(null, result.css))
      .catch((error) => callback(error, null));
  });

  // -----------------------------------------------------------------
  // EXTENSIONS & PLUGINS
  // -----------------------------------------------------------------
  // Support YAML data files
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
  // transform images to webp
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
  // Navigation
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // -----------------------------------------------------------------
  // TRANSFORMS
  // -----------------------------------------------------------------
  // Minify html, not css tho, that's for filter
  eleventyConfig.addTransform("htmlmin", async function (content) {
    if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
      let minified = await htmlmin.minify(content, {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true, // defer="" -> defer
        removeScriptTypeAttributes: true, // Removes type="text/javascript"
        removeStyleLinkTypeAttributes: true, // Removes type="text/css"
        removeRedundantAttributes: true,
        decodeEntities: true,
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
      data: "../data", // Relative to 'input' (app/pages)
      output: "_site",
    },
  };
};
