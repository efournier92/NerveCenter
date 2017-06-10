var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();

gulp.task('bundle', function () {
  gulp.src(['./app_client/**/*.js', '!./app_client/app.min.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('./app.min.js'))
    .pipe(gulp.dest('app_client'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app_client'));
});

// gulp.task('sass', function(){
//   return gulp.src('app/scss/styles.scss')
//     .pipe(sass()) // Converts Sass to CSS with gulp-sass
//     .pipe(browserSync.reload({
//       stream: true;
//     }))
//     .pipe(gulp.dest('app/css'))
// });

gulp.task('watch', ['browserSync', 'sass'], function () {
  gulp.watch(['./app_client/**/*.js', '!./app_client/app.min.js'], function () {
  gulp.watch('./app_client/*.html', function () {
  gulp.watch('./app_client/**/*.scss', function () {
  });
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

gulp.task('default', ['bundle', 'watch']);

