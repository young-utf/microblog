/**
 * Created by youngmoon on 8/24/15.
 */
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

module.exports = {
  webpack_assets_file_path: 'webpack-stats.json',

    assets: {
      images: {
        extensions: [
          'jpeg',
          'jpg',
          'png',
          'gif',
          'svg'
        ],
        parser: WebpackIsomorphicToolsPlugin.url_loader_parser
      },
      style_modules: {
        extension: 'scss',
        development: true,
        filter: function (m, regex, options) {
          if (options.environment === 'production') {
            return regex.test(m.name);
          }
          return (regex.test(m.name) && m.name.slice(-2) === 'ss' && m.reasons[0].moduleName.slice(-2) === 'ss');
        },
        naming: function (m) {
          var srcIndex = m.name.indexOf('/src');
          var name = '.' + m.name.slice(srcIndex);
          if (name) {
            const i = name.indexOf(':');
            if (i >= 0) {
              name = name.slice(i + 1);
            }
          }
          return name;
        },
        parser: function (m, options) {
          if (m.source) {
            var regex = options.environment === 'production' ? /module\.exports = ((.|\n)+);/ : /exports\.locals = ((.|\n)+);/;
            var match = m.source.match(regex);
            return match ? JSON.parse(match[1]) : {};
          }
        }
      }
    }
};