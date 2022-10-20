// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");

const isProduction = process.env.NODE_ENV == "production";

const baseConfig = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist", ),
    clean: true
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
};

const devConfig = {
  ...baseConfig,
  mode: "development",
  output: {
    filename: 'kittens-manager.js'
  }

}

const prodConfig = {
  ...baseConfig,
  mode: "production",
  output: {
    filename: 'kittens-manager.min.js'
  }
}

module.exports = () => {
  if (isProduction) {
    return [devConfig, prodConfig];
  } else {
    return devConfig;
  }
};
