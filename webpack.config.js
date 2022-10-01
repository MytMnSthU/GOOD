const path = require("path");
const miniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
   // mode: "development",
   mode: "production",
   entry: "./src/js/main.js",
   output: {
      path: path.resolve(__dirname, "dist"),
      filename: "main.js",
   },
   plugins: [new miniCssExtractPlugin()],
   devServer: {
      static: __dirname,
      port: 8080,
      hot: true,
   },
   module: {
      rules: [
         {
            test: /\.scss$/,
            use: [
               //    {
               //       loader: "style-loader",
               //    },
               {
                  loader: miniCssExtractPlugin.loader,
               },
               {
                  loader: "css-loader",
               },
               {
                  loader: "postcss-loader",
                  options: {
                     postcssOptions: {
                        plugins: () => [require("autoprefixer")],
                     },
                  },
               },
               {
                  loader: "sass-loader",
               },
            ],
         },
      ],
   },
};
