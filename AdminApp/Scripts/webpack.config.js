var path = require('path');
var webpack = require('webpack');
var WebpackOnBuildPlugin = require('on-build-webpack');
var simpleGit = require('simple-git')('C:/github-projects/AdminAppBuild/spDevCdn');
const PostCompile = require('post-compile-webpack-plugin');
module.exports = {
    entry: [
        'babel-polyfill', './src/main.js'
    ],
    output: {
        path: path.resolve('C:/github-projects/AdminAppBuild/spDevCdn'),
        filename: 'main.bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    stats: {
        colors: true
    },

    plugins: [new PostCompile(() => {
            simpleGit
                .add('./*')
                .commit('auto-push' + Date())
                .push('origin', 'master')
        })],
    devtool: 'source-map'
};