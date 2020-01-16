process.env.NODE_ENV = 'development';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: process.env.NODE_ENV,
    context: __dirname,
    entry: {
        app: './demo/app/index.js',
    },
    output: {
        path: `${__dirname}/dist`,
        filename: 'app/[name].js',
        publicPath: '/',
    },
    devServer: {
        contentBase: false,
        compress: true,
        hot: true,
        useLocalIp: true,
        disableHostCheck: true,
        host: '0.0.0.0',
        port: 8302,
        stats: 'minimal',
        open: false,
        writeToDisk: false,
    },
    devtool: 'cheap-module-eval-source-map',
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        alias: {},
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'babel-loader'
            },
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './demo/index.html',
            filename: 'index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
            },
            chunksSortMode: 'dependency',
        }),
    ],
    node: false,
};
