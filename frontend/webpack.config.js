const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.jsx', // Entry point of your application
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
    port: 3001, // Specify the development server port
    hot: true, // Enable hot module replacement
    proxy: [
      {
        context: ['/api'], // Match paths starting with '/api'
        target: 'http://localhost:3000', // Backend server
        changeOrigin: true, // Change the origin header
        secure: false, // Allow HTTP for backend
      },
    ],
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Match JavaScript and JSX files
        exclude: /node_modules/, // Exclude node_modules
        use: {
          loader: 'babel-loader', // Use Babel to transpile JS and JSX files
        },
      },
      {
        test: /\.css$/, // Match CSS files
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/, // Match image files
        type: 'asset/resource', // Use Webpack's asset module
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Automatically resolve these extensions
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Template for the HTML file
    }),
  ],
};
