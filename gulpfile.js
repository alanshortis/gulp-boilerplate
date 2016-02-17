'use strict';

const gulp = require('gulp'),
      sass = require('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps'),
      autoprefixer = require('gulp-autoprefixer'),
      cssnano = require('gulp-cssnano'),
      rename = require('gulp-rename'),
      header = require('gulp-header'),
      image = require('gulp-image'),
      del = require('del'),
      concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),
      eslint = require('gulp-eslint');

const sassSrc = 'src/sass/**/*.scss',
      cssDest = 'dist/css',
      imgSrc = 'src/img',
      imgDest = 'dist/img',
      jsSrc = 'src/js',
      jsDest = 'dist/js';


gulp.task('css', function () {
  return gulp.src(sassSrc)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(cssDest));
});


gulp.task('minify', ['css'], function() {
  return gulp.src(cssDest + '/style.css')
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(header('/* <%= new Date() %> */\n'))
    .pipe(gulp.dest(cssDest));
});


gulp.task('js', function() {
  return gulp.src(jsSrc + '/vendor/*.js')
    .pipe(concat('libs.js'))
    .pipe(gulp.dest(jsDest));
});


gulp.task('lint', function () {
  return gulp.src(['**/*.js', '!node_modules/**', '!**/*.min*', '!**/libs*', '!**/vendor/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});


gulp.task('uglify', ['js'], function() {
  return gulp.src(jsDest + '/libs.js')
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(jsDest));
});


gulp.task('image', function () {
  return gulp.src(imgSrc + '/*')
    .pipe(image())
    .pipe(gulp.dest(imgDest));
});


gulp.task('watch', function () {
  gulp.watch(sassSrc, ['css']);
  gulp.watch(jsSrc + '/**', ['lint']);
});


gulp.task('clean', function() {
  return del.sync('dist');
});


gulp.task('default', ['css', 'minify', 'js', 'lint', 'uglify', 'image']);
