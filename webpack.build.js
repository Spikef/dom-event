process.env.NODE_ENV = 'production';

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: process.env.NODE_ENV,
    context: __dirname,
    entry: {
        index: './src/index.ts',
    },
    output: {
        path: `${__dirname}/dist`,
        filename: 'index.js',
        publicPath: '/',
        libraryTarget: 'commonjs2',
    },
    optimization: {
        // minimize: false, // false for test
    },
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
        new CleanWebpackPlugin(),
    ],
    node: false,
};
