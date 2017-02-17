var webpack = require("webpack");
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: {
        bot: "./src/bot.js",
    },
    target: 'node',
    node: {
        __dirname: false,
        __filename: false
    },
    externals: nodeModules,
    output: {
        path: __dirname + "/build",
        filename: "bot.js",
        chunkFilename: "[id].bundle.js"
    },
    watch: true,
    module: {
        loaders: [
            {
                test: /\.js/,
                loader: "babel",
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: "json",
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        // new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};