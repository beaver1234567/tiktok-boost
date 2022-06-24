const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

// const devServer = (isDev) =>
//     !isDev
//         ? {}
//         : {
//               devServer: {
//                   open: true,
//                   hot: false,
//                   port: 8080,
//               },
//           }

module.exports = ({ development }) => ({
    mode: development ? 'development' : 'production',
    devtool: development ? 'inline-source-map' : false,
    entry: {
        main: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/index.html'),
        }),
        new CopyPlugin({
            patterns: [
                { from: './src/assets/images/', to: 'public/images' },
                { from: './src/assets/static/', to: '' },
                { from: './src/app-ads.txt', to: '' },
                // { from: "./src/EULA", to: "" },
            ],
        }),
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    ],
    // ...devServer(development),
    devServer: {
        open: true,
        hot: false,
        port: 8080,
    },
})
