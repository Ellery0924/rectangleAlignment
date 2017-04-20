var path = require('path');

module.exports = {
    entry: { demo: './demo/index.ts', module: './src/Matrix.ts' },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].js'
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