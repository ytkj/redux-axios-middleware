const path = require('path');
const nodeExternals = require('webpack-node-externals')
const { TSDeclerationsPlugin } = require('ts-loader-decleration');

module.exports = {
    entry: path.join(__dirname, 'src/index.ts'),
    output: {
        filename: 'index.js',
        path: __dirname,
        library: 'ReduxAxiosMiddleware',
        libraryTarget: 'umd',
        globalObject  : 'this',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /(node_modules|test)/,
            use: [{
                loader: 'ts-loader',
            }],
        }],
    },
    plugins: [
        new TSDeclerationsPlugin(),
    ],
    externals: [
        nodeExternals()
    ]
}