var path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        loaders: [{
            test: /\.ts$/,
            loader: 'ts-loader'
        }]
    }
};