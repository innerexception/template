const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './index.tsx',
  output: {
    path: path.resolve(__dirname, './public'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
        { test: /\.tsx?$/, include: path.join(__dirname, './'), loader: 'ts-loader' },
        {
            test: /\.css$/,
            use: [{
                    loader: "style-loader"
                },
                {
                    loader: "css-loader"
                }
            ]
        },
        {
            test: /sw.(j|t)s$/,
            use: [{
                loader: 'file-loader',
            }]
        },
        {
            test: /\.(png|jpg|gif|jpeg|wav|mp3)$/,
            use: [{
                loader: 'file-loader',
                options: {
                  outputPath: './',
                  esModule:false
                },
              }]
        },
        { test: /\.(eot|ttf|woff|otf)$/, use: ['url-loader?limit=1000000'] },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' })
  ]
}