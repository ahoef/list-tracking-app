var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    nunjucksify = require('nunjucksify'),
    through2 = require('through2'),
    source = require('vinyl-source-stream'),
    transform = require('vinyl-transform'),
    buffer = require('vinyl-buffer'),
    sass = require('gulp-ruby-sass'),
    connect = require('gulp-connect');

// set up localhost server - default port is 8080
gulp.task('connect', function() {
  connect.server();
});

//compile and minify css
gulp.task('sass', function () {
  gulp.src('src/css/*.scss')
  .pipe(sass())
  .pipe(minifycss())
  .pipe(concat("base.min.css"))
  .pipe(gulp.dest('dest/css'))
});

// bundle js
gulp.task('browserify',[],function(){
  return gulp.src('src/js/app.js')
    .pipe(through2.obj(function (file, enc, next) {
        browserify(file.path, {
            debug: true
        })
        .transform(babelify)
        .transform(nunjucksify)
        .bundle(function (err, res) {
            if (err) { return next(err);}
            file.contents = res;
            next(null, file);
        });
    }))
    .on('error', function (error) {
        console.log('browserify error');
        console.log(error);
        this.emit('end');
    })
    .pipe(buffer())
    .pipe(gulp.dest('dest/js'));
});

// set default tasks to run localhost, compile sass, and bundle js
gulp.task('default', [
    'connect',
    'sass',
    'browserify'
], function() {
  gulp.start('watch');
});

// watch for changes to css & js
gulp.task('watch', function() {
  gulp.watch(['src/css/*'], ['sass']);
  gulp.watch(['src/js/*'], ['browserify']);

});
