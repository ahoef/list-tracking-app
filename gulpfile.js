var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var connect = require('gulp-connect');
var sass = require('gulp-ruby-sass');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
// var watchcss = require('gulp-watch');
var concat = require('gulp-concat');

function compile(watch) {
  // gulp.src('src/css/base.scss')
  // .pipe(sass())
  // .pipe(minifycss())
  // .pipe(concat("base.min.css"))
  // .pipe(gulp.dest('dest/css'));


  var bundler = watchify(browserify('./src/js/app/app.js', { debug: true }).transform(babel));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(gulp.dest('./dest/js'));

    gulp.src('src/css/base.scss')
    .pipe(sass())
    .pipe(minifycss())
    .pipe(concat("base.min.css"))
    .pipe(gulp.dest('dest/css'));

  }


  if (watch) {
    bundler.on('update', function() {
      console.log('bundling...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
};

// gulp.watch('src/css/base.scss', function() {
//   gulp.run('sass');
// });

// gulp.task('sass', function () {
//   gulp.src('src/css/base.scss')
//   .pipe(sass())
//   .pipe(minifycss())
//   .pipe(concat("base.min.css"))
//   .pipe(gulp.dest('dest/css'))
// });


gulp.task('connect', function() {connect.server();});
gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });

gulp.task('default', ['watch', 'connect']);