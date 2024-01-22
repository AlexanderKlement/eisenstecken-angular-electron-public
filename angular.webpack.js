//Polyfill Node.js core modules in Webpack. This module is only needed for webpack 5+.
var NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

/**
 * Custom angular webpack configuration
 */
module.exports = (config, options) => {
  config.target = 'electron-renderer';

  if (options.fileReplacements) {
    for (let fileReplacement of options.fileReplacements) {
      if (fileReplacement.replace !== 'src/environments/environment.ts') {
        continue;
      }

      let fileReplacementParts = fileReplacement['with'].split('.');
      if (fileReplacementParts.length > 1 && ['web'].indexOf(fileReplacementParts[1]) >= 0) {
        config.target = 'web';
      }
      break;
    }
  }

  config.plugins = [
    ...config.plugins,
    new NodePolyfillPlugin({
      excludeAliases: ['console'],
    }),
  ];


  config.resolve = {
    ...config.resolve, // keep existing resolve configurations
    fallback: {
      ...config.resolve?.fallback, // keep existing fallbacks
      'path': require.resolve('path-browserify'), // add fallback for 'path'
    },
  };

  const scssRule = {
    test: /\.scss$/,
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        ident: 'postcss',
        syntax: 'postcss-scss',
        plugins: [
          require('postcss-import'),
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    },
  };

  // Add the SCSS rule to the Webpack module rules
  config.module.rules.push(scssRule);

  return config;
};
