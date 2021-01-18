const debug = require("debug")("eleventy-homepage");
const fs = require("fs");

module.exports = async function () {
  return {
    directories: fs
      .readdirSync("./src/", { withFileTypes: true })
      .filter(
        (item) =>
          item.isDirectory() &&
          /(_includes|assets|script|css)/i.exec(item.name) == null
      )
      .map((item) => (item.name[0] + "").toUpperCase() + item.name.slice(1)),
  };
};
