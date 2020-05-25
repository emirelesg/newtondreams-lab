module.exports = {
  transpileDependencies: ['vuetify'],
  // https://github.com/vuejs/vue-cli/issues/979
  chainWebpack: config => {
    // config.plugins.delete('prefetch');
    if (config.plugins.has('prefetch')) {
      config.plugin('prefetch').tap(options => {
        options[0].fileBlacklist = options.fileBlacklist || [];
        options[0].fileBlacklist.push(/lab(.)+?\.js$/);
        return options;
      });
    }
  }
};
