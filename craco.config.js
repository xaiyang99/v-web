// CRACO (Create React App Configuration Override) is an easy and comprehensible configuration layer for create-react-app.
// https://github.com/gsoft-inc/craco

const path = require("path");
const dotenv = require("dotenv");
const webpack = require("webpack");
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const ENV = process.env.REACT_APP_ENV || process.env.NODE_ENV;

const envFile = dotenv.config({ path: `./.env.${ENV}` });

if (envFile.error) {
  throw envFile.error;
}

const envKeys = Object.keys(envFile.parsed).reduce((prev, next) => {
  prev[`process.env.${next.trim()}`] = JSON.stringify(
    envFile.parsed[next].trim(),
  );
  return prev;
}, {});

module.exports = {
  babel: {
    plugins: ["babel-plugin-graphql-tag"],
  },
  webpack: {
    entry: "./src/index.js",
    output: {
      filename: "[name].[contenthash].bundle.js",
      chunkFilename: "[name].js?id=[chunkhash]",
      path: path.resolve(__dirname, "build"),
      clean: true,
    },
    resolve: {
      extensions: [".js", ".jsx", "*"],
    },
    devServer: {
      contentBase: path.resolve(__dirname, "build"),
      historyApiFallback: { index: "/", disableDotRule: true },
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
        }),
      ],
      runtimeChunk: "single",
      splitChunks: {
        chunks: "async",
        minSize: 20000,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
      concatenateModules: true,
      mangleExports: "deterministic",
      flagIncludedChunks: true,
      chunkIds: "deterministic",
    },
    module: {
      rules: [
        {
          test: /\.(png|svg|jpg|gif|ico|json)$/,
          use: [
            {
              loader: "file-loader",
            },
          ],
        },
      ],
    },
    configure: {
      // Webpack ≥5 no longer ships with Node.js polyfills by default.
      // Reference: https://webpack.js.org/blog/2020-10-10-webpack-5-release/#automatic-nodejs-polyfills-removed
      // Solution: https://github.com/facebook/create-react-app/issues/11756#issuecomment-1001769356
      resolve: {
        fallback: {
          buffer: require.resolve("buffer"),
          vm: require.resolve("vm-browserify"),
          crypto: require.resolve("crypto-browserify"),
          process: require.resolve("process/browser.js"),
          stream: require.resolve("stream-browserify"),
          util: require.resolve("util"),
          querystring: require.resolve("querystring-es3"),
        },
      },
      plugins: [
        ...(process.env.NODE_ENV === "production"
          ? [
              new WorkboxPlugin.InjectManifest({
                swSrc: "./public/sw.js",
                swDest: "sw.js",
                exclude: [
                  /\.map$/,
                  /manifest$/,
                  /\.htaccess$/,
                  /service-worker\.js$/,
                  /sw\.js$/,
                ],
                maximumFileSizeToCacheInBytes: 5000000,
              }),
            ]
          : []),
        /* new BundleAnalyzerPlugin(), */
        new CleanWebpackPlugin(),
        new WebpackManifestPlugin(),
        new CompressionPlugin(),
        new HtmlWebpackPlugin({
          template: "./public/index.html",
          cache: false,
          inject: true,
        }),
        new HtmlWebpackPlugin({
          template: "./public/mitm.html",
          favicon: "./public/favicon.svg",
          filename: "mitm.html", // Output filename for mitm.html
        }),
        new webpack.DefinePlugin(envKeys),
        new ESLintPlugin({
          extensions: ["js", "jsx"],
          exclude: "node_modules",
          emitError: true,
          failOnError: true,
        }),
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser.js",
        }),
      ],
    },
  },
  eslint: {
    mode: "extends",
    configure: (eslintConfig, { env, paths }) => {
      return eslintConfig;
    },
  },
};
