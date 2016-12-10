var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var del = require('del');
var runSequence = require('run-sequence');
var include       = require("gulp-include");

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

gulp.task("js", function() {
  return gulp.src("app/js/dev/main.js")
  .pipe(include({
    extensions: "js",
    hardFail: true,
    includePaths: [
      __dirname + "/node_modules"
    ]
  }))
  .pipe(gulp.dest("app/js/dist"))
  .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']); 
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/dev/*.js', ['js']); 
});

gulp.task('build', function (callback) {
  runSequence('clean:dist', 
    ['sass', 'js', 'useref'],
    callback
  )
});

gulp.task('default', function (callback) {
  runSequence(['sass', 'js', 'browserSync', 'watch'],
    callback
  )
});
