const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ChromeExtensionReloader = require("webpack-ext-reloader");
const CopyPlugin = require("copy-webpack-plugin");

const generateCommonConfig = (env) => {
  return {
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.(jsx|js)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [
                  [
                    "@babel/preset-env",
                    {
                      targets: "defaults",
                    },
                  ],
                  "@babel/preset-react",
                ],
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          exclude: /node_modules/,
          use: [
            { loader: "style-loader" },
            {
              loader: "css-loader",
              options: {
                importLoaders: 0,
              },
            },
          ],
        },
      ],
    },
  };
};

const configForBackgroundJs = (env) => {
  const commonConfig = generateCommonConfig(env);

  return Object.assign({}, commonConfig, {
    entry: {
      popup: path.resolve(__dirname, "src", "background", "index.js"),
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "background.bundle.js",
    },
    plugins: [],
  });
};

const configForInjectedJs = (env) => {
  const commonConfig = generateCommonConfig(env);

  return Object.assign({}, commonConfig, {
    entry: {
      popup: path.resolve(__dirname, "src", "injectedScript", "index.js"),
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "injectedScript.bundle.js",
    },
    plugins: [],
  });
};

const configForPopupHtml = (env) => {
  const commonConfig = generateCommonConfig(env);

  return Object.assign({}, commonConfig, {
    entry: {
      popup: path.resolve(__dirname, "src", "popup", "index.jsx"),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "popup", "popup.html"),
        filename: "popup.html",
        inject: true,
      }),
      new ChromeExtensionReloader({
        port: "9090",
        entries: {
          extensionPage: "popup",
        },
      }),
    ],
  });
};

const configForOptionsHtml = (env) => {
  const commonConfig = generateCommonConfig(env);

  return Object.assign({}, commonConfig, {
    entry: {
      option: path.resolve(__dirname, "src", "option", "index.jsx"),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "option", "option.html"),
        filename: "options.html",
        inject: true,
      }),
      new ChromeExtensionReloader({
        port: "9091",
        entries: {
          extensionPage: "option",
        },
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "public"),
            to: path.resolve(__dirname, "dist"),
          },
        ],
      }),
    ],
  });
};

module.exports = [
  configForBackgroundJs(),
  configForInjectedJs(),
  configForPopupHtml(),
  configForOptionsHtml(),
];
