var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var babel = require('gulp-babel');

gulp.task('concat', function () {
  gulp.src(['./app_client/**/*.js', '!./app_client/app.min.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('./app.min.js'))
    .pipe(gulp.dest('app_client'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app_client'));
});

gulp.task('babel', () =>
	gulp.src('./app_client/app.min.js')
  .pipe(babel(
    // {
    //   'presets': ['es2015']
    // }
  ))
  .pipe(gulp.dest('dist'))
);

// gulp.task('babel', function() {
//   gulp.src('./app_client/app.min.js')
//     .pipe(babel({
//       presets: ['env']
//     })))
//     .pipe(gulp.dest('dist'))
// };

gulp.task('sass', function(){
  return gulp.src('app/scss/styles.scss')
    .pipe(sass())
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(gulp.dest('app/css'))
});

gulp.task('watch', ['browserSync', 'sass'], function () {
  gulp.watch(['./app_client/**/*.js', '!./app_client/app.min.js']);
  gulp.watch('./app_client/*.html');
  gulp.watch('./app_client/**/*.scss');
});

gulp.task('minify', function(){
  return gulp.src('./app_client/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
  return gulp.src('./public/img/ico/*.png')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

// gulp.task('clean', function() {
//   return del.sync('dist');
// })

gulp.task('default', function (callback) {
  runSequence('concat', 'babel', callback);
});

// gulp.task('default', ['concat', 'watch']);

