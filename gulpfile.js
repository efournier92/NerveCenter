var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var del = require('del');
var gulpSequence = require('gulp-sequence')
var watch = require('gulp-watch');
// uglify dependencies
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
// images dependencies
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

gulp.task('concat', function () {
  gulp.src('./app_client/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    // .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('public/dist'));
});

gulp.task('babel2', () =>
  gulp.src('./app_client/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('app.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/dist'))
);

gulp.task('babel', function () {
  // gulp.src('app_client/app.min.js')
  gulp.src('./app_client/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    // .pipe(babel(''))
    .pipe(babel({
      presets: ['es2015'],
      minified: true,
      comments: false,
      // babelrc: false,
      // inputSourceMap: 'public/dist/app.min.js.map',
      sourceMaps: true,
      // sourceMapTarget: 'public/dist/app.bun.js.map'
    }))
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('public/dist/app.bun.js'))
});

gulp.task('uglify', function () {
  return gulp.src('./app_client/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('public/dist'))
});

gulp.task('watch', function () {
  watch(['./app_client/**/*.(js|html|css)',
    '!./app_client/app.min.js'], function () {
      gulp.start('default');
    });
});

gulp.task('clean', function () {
  return del.sync('public/dist');
})

gulp.task('default', ['dev', 'watch']);

gulp.task('dev', function (callback) {
  gulpSequence('babel', callback);
});

gulp.task('prod', function (callback) {
  gulpSequence('babel2', 'uglify', callback);
});

