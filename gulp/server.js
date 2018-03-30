'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var gulpSequence = require('gulp-sequence');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var proxyMiddleware = require('http-proxy-middleware');

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  var server = {
    baseDir: baseDir,
    routes: routes
  };

  /*
   * You can add a proxy to your backend by uncommenting the line below.
   * You just have to configure a context which will we redirected and the target url.
   * Example: $http.get('/users') requests will be automatically proxified.
   *
   * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.9.0/README.md
   */
  // server.middleware = proxyMiddleware('/users', {target: 'http://jsonplaceholder.typicode.com', changeOrigin: true});

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: browser
  });
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('serve', ['watch'], function () {
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(conf.paths.dist);
});

gulp.task('serve:e2e', ['inject'], function () {
  browserSyncInit([conf.paths.tmp + '/serve', conf.paths.src], []);
});

gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit(conf.paths.dist, []);
});

gulp.task('patch:DEV', gulpSequence('clean','DEV','build'));
gulp.task('patch:LOCAL', gulpSequence('clean','LOCAL','build'));
gulp.task('patch:SIT', gulpSequence('clean','SIT','build'));
gulp.task('patch:UAT', gulpSequence('clean','UAT','build'));
gulp.task('patch:PROD', gulpSequence('clean','PROD','build'));
gulp.task('patch:PUBLIC', gulpSequence('clean','PUBLIC','build'));

gulp.task('serve:DEV', gulpSequence('DEV','serve'));
gulp.task('serve:LOCAL', gulpSequence('LOCAL','serve'));
gulp.task('serve:SIT', gulpSequence('SIT','serve'));
gulp.task('serve:UAT', gulpSequence('UAT','serve'));
gulp.task('serve:PROD', gulpSequence('PROD','serve'));
gulp.task('serve:PUBLIC', gulpSequence('PUBLIC','serve'));