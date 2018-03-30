'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var replace = require('gulp-replace');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
  return gulp.src([
    path.join(conf.paths.src, '/app/**/*.html'),
    path.join(conf.paths.tmp, '/serve/app/**/*.html')
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true,
      loose:  true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'cpo',
      root: 'app'
    }))
    .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(conf.paths.tmp, '/partials'),
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html', { restore: true });
  var jsFilter = $.filter('**/*.js', { restore: true });
  var cssFilter = $.filter('**/*.css', { restore: true });

  return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe($.useref())
    .pipe(jsFilter)
    .pipe($.sourcemaps.init())
    .pipe($.ngAnnotate())
    .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
    .pipe($.rev())
    .pipe($.sourcemaps.write('maps'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.sourcemaps.init())
    .pipe($.minifyCss({ processImport: false }))
    .pipe($.rev())
    .pipe($.sourcemaps.write('maps'))
    .pipe(cssFilter.restore)
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true,
      conditionals: true,
      loose:  true
    }))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
  });

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
	gulp.src(conf.paths.src + '/assets/css/fonts/**/*')
    .pipe(gulp.dest(path.join(conf.paths.dist, '/styles/fonts/')));

  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

// Only applies for google analytics
gulp.task('ga', function () {
  return gulp.src(conf.paths.src + '/assets/scripts/ga.js')
    .pipe(gulp.dest(path.join(conf.paths.dist, '/assets/scripts/')));
});

// Only applies for util js
gulp.task('util', function () {
	gulp.src('bower_components/angular-ui-grid/*.{eot,svg,ttf,woff,woff2}')
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/styles/')));
    
  return gulp.src(conf.paths.src + '/app/util/*.js')
    .pipe(gulp.dest(path.join(conf.paths.dist, '/app/util/')));
});

// Only applies for plugins js
gulp.task('plugins', function () {
    gulp.src('bower_components/bootstrap/**/*')
    .pipe(gulp.dest(path.join(conf.paths.dist, '/bower_components/bootstrap/')));
    gulp.src('bower_components/ng-file-upload/*')
    .pipe(gulp.dest(path.join(conf.paths.dist, '/bower_components/ng-file-upload/')));
  return gulp.src(conf.paths.src + '/assets/plugins/**/*')
    .pipe(gulp.dest(path.join(conf.paths.dist, '/assets/plugins/')));
});

gulp.task('other', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
    path.join(conf.paths.src, '/**/*'),
    path.join('!' + conf.paths.src, '/**/*.{html,css,js}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('clean', function () {
  return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
});

gulp.task('DEV',function(){
	var str = 'CURRENT_ENVIRONMENT = environment.DEV;';
	gulp.src(conf.paths.src + '/app/util/environment.js')
    .pipe(replace(/CURRENT_ENVIRONMENT = environment.*;/g, str))
    .pipe(gulp.dest(conf.paths.src + '/app/util/'));
});
gulp.task('LOCAL',function(){
	var str = 'CURRENT_ENVIRONMENT = environment.LOCAL;';
	gulp.src(conf.paths.src + '/app/util/environment.js')
    .pipe(replace(/CURRENT_ENVIRONMENT = environment.*;/g, str))
    .pipe(gulp.dest(conf.paths.src + '/app/util/'));
});
gulp.task('SIT',function(){
	var str = 'CURRENT_ENVIRONMENT = environment.SIT;';
	gulp.src(conf.paths.src + '/app/util/environment.js')
    .pipe(replace(/CURRENT_ENVIRONMENT = environment.*;/g, str))
    .pipe(gulp.dest(conf.paths.src + '/app/util/'));
});
gulp.task('UAT',function(){
	var str = 'CURRENT_ENVIRONMENT = environment.UAT;';
	gulp.src(conf.paths.src + '/app/util/environment.js')
    .pipe(replace(/CURRENT_ENVIRONMENT = environment.*;/g, str))
    .pipe(gulp.dest(conf.paths.src + '/app/util/'));
});
gulp.task('PROD',function(){
	var str = 'CURRENT_ENVIRONMENT = environment.PROD;';
	gulp.src(conf.paths.src + '/app/util/environment.js')
    .pipe(replace(/CURRENT_ENVIRONMENT = environment.*;/g, str))
    .pipe(gulp.dest(conf.paths.src + '/app/util/'));
});
gulp.task('PUBLIC',function(){
	var str = 'CURRENT_ENVIRONMENT = environment.PUBLIC;';
	gulp.src(conf.paths.src + '/app/util/environment.js')
    .pipe(replace(/CURRENT_ENVIRONMENT = environment.*;/g, str))
    .pipe(gulp.dest(conf.paths.src + '/app/util/'));
});

gulp.task('build', ['html', 'fonts', 'ga', 'util','plugins', 'other']);