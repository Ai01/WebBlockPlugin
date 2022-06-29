const fs = require("fs-extra");
const path = require("path");

const copyPublicFolder = () => {
  fs.copySync(
    path.resolve(__dirname, "public"),
    path.resolve(__dirname, "dist"),
    {
      dereference: true,
    }
  );
  process.exit();
};

copyPublicFolder();
