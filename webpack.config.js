const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const generateCommonConfig = (env) => {
  return {
    mode: 'production',
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
            {loader: 'style-loader'},
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

const configForPopupHtml = (env) => {
  const commonConfig = generateCommonConfig(env);

  return Object.assign({}, commonConfig, {
    entry: {
      popup: path.resolve(__dirname, "popup", "index.jsx"),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "popup", "popup.html"),
        filename: "popup.html",
        inject: true,
      }),
    ],
  });
};

const configForOptionsHtml = (env) => {
  const commonConfig = generateCommonConfig(env);

  return Object.assign({}, commonConfig, {
    entry: {
      option: path.resolve(__dirname, "option", "index.jsx"),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "option", "option.html"),
        filename: "options.html",
        inject: true,
      }),
    ],
  });
};

module.exports = [
  configForPopupHtml(),
  configForOptionsHtml(),
];
