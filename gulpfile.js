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

var rollup = require('rollup-stream');
var source = require('vinyl-source-stream');

var webpack = require('gulp-webpack');

gulp.task('babelll', function () {
  return gulp.src('./app_client/app.min.js')
    .pipe(babel())
    .pipe(gulp.dest('./app_client/dist'));
});

gulp.task('webpack', function() {
    return gulp.src('app_client/main.js')
      .pipe(webpack())
      .pipe(gulp.dest('dist/'));
});

gulp.task('rollup', function() {
  return rollup({
      entry: './app_client/main.js'
    })

    // output file
    .pipe(source('app.js'))

    // output folder
    .pipe(gulp.dest('./app_client'));
});

gulp.task('concat', function () {
  gulp.src('./app_client/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    // .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('./app_client'));
});

gulp.task('babel', function () {
  gulp.src('app_client/app.min.js')
  .pipe(sourcemaps.init())
  .pipe(babel(''))
    .pipe(babel({
      presets: ['es2015']
      // minified: true,
      // comments: false,
      // babelrc: false,
      // inputSourceMap: 'public/dist/app.min.js.map',
      // sourceMaps: false,
      // sourceMapTarget: 'public/dist/app.bun.js.map'
    }))
  .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('public/dist'))
});

gulp.task('uglify', function () {
  return gulp.src('./app_client/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('sass', function (){
  return gulp.src('app/scss/styles.scss')
    .pipe(sass())
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(gulp.dest('app/css'))
});

gulp.task('images', function () {
  return gulp.src('./public/img/ico/*.png')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/images'))
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
  gulpSequence('concat', 'babel', callback);
});

gulp.task('prod', function (callback) {
  gulpSequence('concat', 'babel', ['uglify', 'sass', 'images'], ['watch'], callback);
});

