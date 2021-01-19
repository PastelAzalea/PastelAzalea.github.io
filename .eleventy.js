const debug = require("debug")("eleventy-homepage");
const postcssImporter = require("postcss-import");
const autoprefixer = require("autoprefixer");
const tailwindcss = require("tailwindcss");
const postcss = require("postcss");
const fs = require("fs");
const uglifyJS = require("uglify-js");
const CleanCSS = require("clean-css");

module.exports = function (config) {
  config.setTemplateFormats(["html", "md", "hbs"]);
  config.addPassthroughCopy("./src/assets/");
  config.setDataDeepMerge(true);

  config.addFilter("sort", function (value) {
    return value.sort();
  });

  config.addFilter("toLocalDateString", function (value) {
    return value.toLocaleDateString("en-UK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  });

  const css = fs.readFileSync("./src/css/stylesheet.css").toString();
  postcss([postcssImporter, tailwindcss, autoprefixer])
    .process(css, {
      from: "./src/css/stylesheet.css",
      to: "./src/_includes/partials/stylesheet.hbs",
    })
    .then((result) => {
      fs.writeFileSync(
        "./src/_includes/partials/stylesheet.hbs",
        new CleanCSS({}).minify(result.css).styles
      );
    })
    .catch((error) => {
      debug("PostCSS Error: %o", error);
    });

  // create global script file
  const jsContent = fs.readFileSync("./src/script/script.js").toString();
  const minified = uglifyJS.minify(jsContent);
  if (!minified.error) {
    fs.writeFileSync("./src/_includes/partials/script.hbs", minified.code);
  } else {
    debug("Uglify-js Error: %o", minified.error);
  }

  debug("finished .eleventy.js");
};
