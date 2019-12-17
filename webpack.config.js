require('dotenv').config();

const path = require('path');
const webpack = require('webpack');

const HtmlWebPackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

module.exports = (env, argv) => {
    argv.env = { ...argv.env };
    const dist_path = JSON.stringify(argv.env.DIST_PATH || process.env.DIST_PATH)
    const config = {
        entry: './src/index.js',
        output: {
            filename: 'assets/js/app.[hash:8].js',
            chunkFilename: 'assets/js/[name].[hash:8].bundle.js',
            path: dist_path ? path.resolve(__dirname, `dist/${dist_path}` ) : path.resolve(__dirname, 'dist')
        },
        resolve: {
            alias: {
                '@actions': path.resolve(__dirname, './src/actions'),
                '@contexts': path.resolve(__dirname, './src/contexts'),
                '@constants': path.resolve(__dirname, './src/constants'),
                '@style': path.resolve(__dirname, './src/style'),
                '@components': path.resolve(__dirname, './src/components'),
                '@utils': path.resolve(__dirname, './src/utils'),
                '@selectors': path.resolve(__dirname, './src/selectors'),
                '@svg': path.resolve(__dirname, './src/svg'),
                '@img': path.resolve(__dirname, './src/img'),
                '@video': path.resolve(__dirname, './src/video'),
                '@fonts': path.resolve(__dirname, './src/fonts')
            }
        },
        module: {
            rules: [
                {
                    test: /\.(mp4)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            emitFile: true,
                            name: '[name].[hash:8].[ext]',
                            outputPath: 'assets/video/'
                        }
                    }
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /fonts[\/\\].*$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            emitFile: true,
                            name: '[name].[hash:8].[ext]',
                            outputPath: 'assets/fonts/'
                        }
                    }
                },
                {
                    test: /svg[\/\\].*\.svg$/,
                    use: [
                        {
                            loader: 'svg-sprite-loader',
                            options: {
                                symbolId: filePath => path.basename(filePath),
                                spriteFilename: 'sprite.svg',
                                esModule: true
                            }
                        },
                        {
                            loader: 'svgo-loader',
                            options: {
                                plugins: [
                                    { removeTitle: true },
                                    { inlineStyles: true },
                                    { cleanupIDs: true }
                                ]
                            }
                        }
                    ]
                },
                {
                    test: /\.(ico|gif|png|jpe?g)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                emitFile: true,
                                name: '[name].[hash:8].[ext]',
                                outputPath: 'assets/img/'
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: './src/index.html',
                filename: './index.html',
                alwaysWriteToDisk: true,
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true
                }
            }),
            new HtmlWebpackHarddiskPlugin(),
            new CleanWebpackPlugin(['dist']),
            new webpack.DefinePlugin({
                PERSONA_ID: JSON.stringify('1'),
                CAMERA_ID: JSON.stringify('CloseUp'),
                SCENE: JSON.stringify('wendy'),
                TOKEN_ISSUER: JSON.stringify(argv.env.TOKEN_ISSUER || process.env.TOKEN_ISSUER),
                VERSION: JSON.stringify(process.env.npm_package_version),
                FEEDBACK: JSON.stringify(argv.env.FEEDBACK_FORM || process.env.FEEDBACK_FORM) 
                        //JSON.stringify('https://sit03.www.westpac.com.au/wendy-feedback-form/')
            }),
            new SpriteLoaderPlugin()
        ],
        optimization: {
            splitChunks: {
                chunks: 'all'
            }
        },
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            host: 'localhost',
            port: 8000,
            historyApiFallback: true,
            disableHostCheck: true,
            publicPath: '/',
            https: true
        }
    };

    return config;
};
