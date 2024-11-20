module.exports = function override(config, env) {
    // Add externals
    config.externals = {
        react: 'React',
        'react-dom': 'ReactDOM'
    };

    // Disable code splitting
    config.optimization = {
        ...config.optimization,
        runtimeChunk: false,
        splitChunks: {
            cacheGroups: {
                default: false
            }
        }
    };

    // Ensure single output file
    config.output = {
        ...config.output,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js'
    };

    return config;
};
