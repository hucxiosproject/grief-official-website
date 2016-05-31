var gulp = require("gulp")
    ,del = require('del')
    ,gulpSequence = require('gulp-sequence')
    ,$ = require("gulp-load-plugins")();

var src = "./app/"
    ,dist = "./dist/"
    ,nodeModules = "./node_modules/"
    ,environment = $.util.env.type || 'development'
    ,isProduction = environment === "production"
    ,pkg = require("./package.json")
    ,banner = ['/**',
      ' * <%= pkg.name %> - <%= pkg.description %>',
      ' * @version v<%= pkg.version %>',
      ' * @author <%= pkg.author %>',
      ' */',
      ''].join('\n')
    ,genRandomName = function () {
      var seed = (new Date()).valueOf();
      return Math.round(seed * (Math.random()+0.5)).toString(16);
    };

gulp.task('index', function() {
  var indexLibsStreamOption = {ignorePath: "/dist"}
      ,indexJsStreamOption = {ignorePath: "/dist", "name" : "bundle"}
      ,indexCssStreamOption = {ignorePath: "/dist"};

  var indexLibsStream = gulp.src('./node_modules/jquery/dist/jquery.js')
    .pipe(!isProduction ? $.util.noop() : $.uglify())
    .pipe($.rename(function(path) {
      path.basename = genRandomName() + (isProduction ? "min" : "");
    }))
    .pipe(gulp.dest('./dist/js', {mode: 0644}));

  var indexJsStream = gulp.src('./app/js/index.js')
    .pipe(!isProduction ? $.util.noop() : $.uglify())
    .pipe($.banner(banner, {pkg: pkg}))
    .pipe($.rename(function(path) {
      path.basename = genRandomName() + (isProduction ? "min" : "");
    }))
    .pipe(gulp.dest('./dist/js', {mode: 0644}));

  var indexCssStream = gulp.src('./app/stylus/main.styl')
    .pipe($.stylus())
    .pipe(!isProduction ? $.util.noop() : $.cssnano())
    .pipe($.rename(function(path) {
      path.basename = genRandomName() + (isProduction ? "min" : "");
    }))
    .pipe(gulp.dest('./dist/css', {mode: 0644}));

  return gulp.src('./app/template/*.html')
    .pipe($.htmlincluder())
    .pipe($.inject(indexCssStream, indexCssStreamOption))
    .pipe($.inject(indexLibsStream, indexLibsStreamOption))
    .pipe($.inject(indexJsStream, indexJsStreamOption))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('mobile', function() {
  var indexLibsStreamOption = {ignorePath: "/dist"}
      ,indexJsStreamOption = {ignorePath: "/dist", "name" : "bundle"}
      ,indexCssStreamOption = {ignorePath: "/dist"};

  var indexLibsStream = gulp.src('./node_modules/jquery/dist/jquery.js')
    .pipe(!isProduction ? $.util.noop() : $.uglify())
    .pipe($.rename(function(path) {
      path.basename = genRandomName() + (isProduction ? "min" : "");
    }))
    .pipe(gulp.dest('./dist/js', {mode: 0644}));

  var indexJsStream = gulp.src('./app/js/index.mobile.js')
    .pipe(!isProduction ? $.util.noop() : $.uglify())
    .pipe($.banner(banner, {pkg: pkg}))
    .pipe($.rename(function(path) {
      path.basename = genRandomName() + (isProduction ? "min" : "");
    }))
    .pipe(gulp.dest('./dist/js', {mode: 0644}));

  var indexCssStream = gulp.src('./app/stylus/mobile.styl')
    .pipe($.stylus())
    .pipe(!isProduction ? $.util.noop() : $.cssnano())
    .pipe($.rename(function(path) {
      path.basename = genRandomName() + (isProduction ? "min" : "");
      console.log(path.basename);
    }))
    .pipe(gulp.dest('./dist/css', {mode: 0644}));

  return gulp.src('./app/mobile-template/*.html')
    .pipe($.htmlincluder())
    .pipe($.inject(indexLibsStream, indexLibsStreamOption))
    .pipe($.inject(indexJsStream, indexJsStreamOption))
    .pipe($.inject(indexCssStream, indexCssStreamOption))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('asset', function() {
  return gulp.src('./app/assets/*')
    .pipe(gulp.dest('./dist/assets'));
});

gulp.task('image', function() {
  return gulp.src('./app/image/*')
    .pipe($.cache($.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('./dist/image/'));
});

gulp.task("watch", function() {
  if (!isProduction) {
    console.log("going to watch");
    gulp.watch(src+'**', ['index', 'mobile']);
  }
});

gulp.task('clean', function(cb) {
  return del([dist+"**"], cb);
});

gulp.task('task2', ['mobile', 'asset']);

gulp.task('default', gulpSequence('clean', ['index', 'image']));
// gulp.task('default', gulpSequence(['clean'], ['image', 'index', 'mobile']));
