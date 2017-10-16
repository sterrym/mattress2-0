/*
|--------------------------------------------------------------------------
| Set path variables
|--------------------------------------------------------------------------
*/

var local_address = "mattress2-0.dev"
var public_assets_path = 'public/';
var sass_path = 'assets/sass/';
var templates_path = 'public/';

/*
|--------------------------------------------------------------------------
| Include dependencies
|--------------------------------------------------------------------------
*/

var autoprefixer = require('gulp-autoprefixer');
var globbing = require('gulp-css-globbing');
var gulp = require('gulp');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var sassimporter = require('sass-module-importer');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();

// Environment
var production = !!gutil.env.production

// Image compression
// var imagemin = require('gulp-imagemin');
// var pngquant = require('imagemin-pngquant');
// var tinypng = require('gulp-tinypng');

/*
|--------------------------------------------------------------------------
| Convert SASS to CSS
|--------------------------------------------------------------------------
*/

gulp.task('css', function () {
  var onError = function(err) {
    notify.onError({
      title:    "Gulp",
      subtitle: "Failure!",
      message:  "Error: <%= error.message %>"
    })(err);
    this.emit('end');
  };
  return gulp.src([
    sass_path + 'main.scss'
  ])
  .pipe(plumber({errorHandler: onError}))
  .pipe(globbing({
    extensions: ['.scss']
  }))
  // .pipe(sourcemaps.init())
  .pipe(sass({
    importer: sassimporter(),
    // outputStyle: production ? 'compressed' : 'nested',
    outputStyle: 'compressed',
    errLogToConsole: false
  }))
  .pipe(autoprefixer())
  // .pipe(sourcemaps.write())
  .pipe(gulp.dest(public_assets_path + 'css'))
  .pipe(browserSync.stream({ match: '**/*.css' }));

});

gulp.task('watch', ['default'], function() {
  browserSync.init({
    proxy: local_address
  });

  gulp.watch( [sass_path+'*.scss', sass_path+'**/*.scss'] , ['css'] );
  gulp.watch( [templates_path+'**/*.html', templates_path+'*.html', templates_path+'**/*.php', templates_path+'*.php'], function(file)
  {
    return gulp.src
    ([file.path])
    .pipe(browserSync.stream());
  }
);
});

gulp.task('default', ['css']);
