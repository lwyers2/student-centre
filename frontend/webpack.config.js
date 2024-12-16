const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output bundle file
    clean: true, // Clean the output directory before building
  },
  mode: 'development', // Set to 'production' for production builds
  devtool: 'inline-source-map', // Enable source maps for debugging
  devServer: {
    static: './dist', // Serve files from the output directory
    open: true, // Open the browser automatically
    port: 3000, // Specify the development server port
    hot: true, // Enable hot module replacement
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Match JavaScript files
        exclude: /node_modules/, // Exclude node_modules
        use: {
          loader: 'babel-loader', // Use Babel to transpile JS files
        },
      },
      {
        test: /\.css$/, // Match CSS files
        use: ['style-loader', 'css-loader'], // Handle CSS with loaders
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Template for the HTML file
    }),
  ],
};
