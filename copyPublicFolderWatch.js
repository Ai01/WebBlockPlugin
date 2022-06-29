const fs = require("fs-extra");
const path = require("path");
const chokidar = require("chokidar");

const copyPublicFolder = () => {
  fs.copySync(
    path.resolve(__dirname, "public"),
    path.resolve(__dirname, "dist"),
    {
      dereference: true,
    }
  );
};

chokidar.watch(".").add('./scripts').on("all", (event, path) => {
  copyPublicFolder();
});
