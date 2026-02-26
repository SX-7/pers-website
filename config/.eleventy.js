const yaml = require("js-yaml");
const postcss = require("postcss");
const cssnano = require("cssnano");
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");
const htmlmin = require("html-minifier-terser");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const eleventyVitePlugin = require("@11ty/eleventy-plugin-vite");
const markdownIt = require("markdown-it");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const ViteImageOptimizer =
  require("vite-plugin-image-optimizer").ViteImageOptimizer;

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
  // VITE
  eleventyConfig.addPlugin(eleventyVitePlugin.default, {
    viteOptions: {
      build: {
        minify: "terser",
        modulePreload: "true",
      },
      plugins: [
        ViteImageOptimizer({
          webp: { quality: 75 },
          avif: { quality: 70 },
          include: /.*\.(webp|avif|jpg|png)/i,
        }),
      ],
    },
  });
  // transform images to webp
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // outputs
    formats: ["webp", "avif"],
    widths: [320, 640, 768, 1024, 1280, 1536, 1920, "auto"],
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
      },
    },

    filenameFormat: function (id, src, width, format) {
      const path = require("path");
      const name = path.basename(src, path.extname(src));
      return `${name}-${width}w.${format}`;
    },
    selector: "img[src]:not([src$='.ico'])",
  });

  // Navigation
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addPlugin(syntaxHighlight);

  let options = {
    html: true,
    breaks: true,
    linkify: true,
  };

  eleventyConfig.setLibrary("md", markdownIt(options));

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
  eleventyConfig.addPassthroughCopy({ "src/_static": "static" });
  // Expose decap
  eleventyConfig.addPassthroughCopy("src/_admin");

  // -----------------------------------------------------------------
  // CONFIGURATION OPTIONS
  // -----------------------------------------------------------------
  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
};
