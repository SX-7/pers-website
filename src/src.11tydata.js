module.exports = {
  eleventyComputed: {
    eleventyNavigation: (data) => {
      const url = data.page.url;

      if (url === "/" || !url) {
        return { key: "SX_7", title: "SX_7" };
      }

      const segments = url.split("/").filter(Boolean);
      const key = segments[segments.length - 1];
      const parent =
        segments.length > 1 ? segments[segments.length - 2] : "SX_7";

      // Title Helper: replaces dashes/underscores with spaces and capitalizes each word
      const formattedTitle = key
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return {
        key: key,
        parent: parent,
        title: data.title || formattedTitle, // Prioritize front matter if it exists
      };
    },
  },
};
