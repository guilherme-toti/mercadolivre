var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync').create(),
  useref = require('gulp-useref'),
  uglify = require('gulp-uglify'),
  gulpIf = require('gulp-if'),
  cssnano = require('gulp-cssnano'),
  del = require('del'),
  runSequence = require('run-sequence'),
  include = require("gulp-include");

// Compile SASS
gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Activate browserSync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

// Compile JS
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

// Minify JS and CSS
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

// Clean DIST folder
gulp.task('clean:dist', function() {
  return del.sync('dist');
});

// Watch for changes
gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']); 
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/dev/*.js', ['js']); 
});

// Copy Chico related assets for DEV
gulp.task('copy', function () {
    // Everything in the assets folder
    return gulp
        .src([__dirname + '/node_modules/chico/src/shared/assets/**/*.*'], {
            base: __dirname + '/node_modules/chico/src/shared/'
        })
        .pipe(gulp.dest('app'));
});

// Copy assets for DIST
gulp.task('assets', function() {
  return gulp.src('app/assets/**/*')
  .pipe(gulp.dest('dist/assets'))
})

// Build for production
gulp.task('build', function (callback) {
  runSequence('clean:dist', 
    ['sass', 'js', 'useref', 'assets'],
    callback
  )
});

// Default DEV task
gulp.task('default', function (callback) {
  runSequence(['copy', 'sass', 'js', 'browserSync', 'watch'],
    callback
  )
});
