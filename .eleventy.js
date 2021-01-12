const debug = require("debug")("homepage");
const sass = require("sass");
const fs = require("fs");
const uglifyJS = require("uglify-js");

module.exports = function (config) {
  config.setTemplateFormats(["html", "md", "hbs", "scss"]);
  config.addPassthroughCopy("./src/assets/");
  config.setDataDeepMerge(true);

  config.addFilter("sort", function (value) {
    return value.sort();
  });

  // create global scss file
  //config.addWatchTarget("./src/scss/");
  sass.render(
    {
      file: "./src/scss/stylesheet.scss",
      outputStyle: "compressed",
      includePaths: [
        "node_modules",
        "node_modules/bulma/sass/base",
        "node_modules/bulma/sass/components",
        "node_modules/bulma/sass/elements",
        "node_modules/bulma/sass/form",
        "node_modules/bulma/sass/layout",
        "node_modules/bulma/sass/columns",
        "node_modules/bulma/sass/utilities",
      ],
    },
    function (err, result) {
      if (err) {
        debug("SCSS Error: %o", err);
      } else {
        fs.writeFile(
          "./src/_includes/partials/stylesheet.hbs",
          result.css.toString(),
          function (ex) {
            if (ex) {
              debug("SCSS Error: %o", ex);
            }
          }
        );
      }
    }
  );

  // create global script file
  const jsContent = fs.readFileSync("./src/script/script.js").toString();
  const minified = uglifyJS.minify(jsContent);
  if (!minified.error) {
    fs.writeFileSync("./src/_includes/partials/script.hbs", minified.code);
  } else {
    debug("Uglify-js Error: %o", minified.error);
  }
};
