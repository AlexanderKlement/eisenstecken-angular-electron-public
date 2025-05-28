const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = (config, options) => {
  // …your existing target + polyfill logic…

  // find the existing scss rule and inject postcss-loader
  const scssRule = config.module.rules.find(r =>
    r.test && r.test.toString().includes('scss') && Array.isArray(r.use)
  );
  if (scssRule) {
    const sassIndex = scssRule.use.findIndex(u =>
      (typeof u === 'string' && u.includes('sass-loader')) ||
      (u.loader && u.loader.includes('sass-loader'))
    );
    if (sassIndex !== -1) {
      scssRule.use.splice(sassIndex, 0, {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            // ← POINT AT your postcss.config.js
            config: path.resolve(__dirname, 'postcss.config.js'),
          },
        },
      });
    }
  }

  config.plugins.push(new NodePolyfillPlugin({ excludeAliases: ['console'] }));
  return config;
};
