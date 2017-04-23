var path = require('path');

module.exports = {
    entry: { demo: './demo/index.ts', module: './src/Alignment.ts' },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].js',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.ts']
    },
    module: {
        loaders: [{
            test: /\.ts$/,
            loader: 'ts-loader'
        }]
    }
};