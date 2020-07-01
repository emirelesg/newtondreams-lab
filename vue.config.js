module.exports = {
  transpileDependencies: ['vuetify'],
  // https://stackoverflow.com/questions/51482940/how-can-i-disable-source-maps-in-production-for-a-vue-js-app
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
  // https://cli.vuejs.org/config/#publicpath
  publicPath: process.env.NODE_ENV === 'production' ? '/lab/' : '/',
  // https://github.com/vuejs/vue-cli/issues/979
  chainWebpack: config => {
    config.optimization.splitChunks({
      cacheGroups: {
        vendors: {
          name: `chunk-vendors`,
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial'
        }
        // three: {
        //   test: /[\\/]node_modules[\\/](three)[\\/]/,
        //   name: 'three',
        //   chunks: 'all'
        // },
      }
    });
    if (config.plugins.has('prefetch')) {
      config.plugin('prefetch').tap(options => {
        options[0].fileBlacklist = options.fileBlacklist || [];
        options[0].fileBlacklist.push(/lab(.)+?\.js$/);
        return options;
      });
    }
    config.plugin('html').tap(args => {
      args[0].title = 'Lab - NewtonDreams';
      return args;
    });
    // https://stackoverflow.com/questions/53712783/configure-vue-cli-to-use-external-libraries-and-source-maps-devtools
    // config.externals({
    //   p$: 'p$'
    // });
    // config.resolve.symlinks(false);
  }
};
