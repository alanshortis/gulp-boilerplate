'use strict';

var gulp = require('gulp');
var clone = require('gulp-clone');
var rename = require('gulp-rename');
var merge = require('merge-stream');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');


/* CSS (SASS compilation, autoprefixer and sourcemaps) */
gulp.task('sass', function () {

    var sassSrc = 'sass/**/*.scss';
    var sassDest = 'css';
    var sassOptions = {
        errLogToConsole: true,
        outputStyle: 'expanded'
    };
    var autoprefixerOptions = {
        browsers: ['last 2 versions']
    };
    var css = gulp.src(sassSrc)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(sassDest));

    var min = css.pipe(clone())
        .pipe(cssnano())
        .pipe(rename(sassDest + '/style.min.css'));

    return merge(css, min)
      .pipe(gulp.dest(''));

});


/* TASKS */

// Watch
gulp.task('watch', function () {
    gulp.watch(sassSrc, ['sass']);
});

// Default
gulp.task('default', ['sass']);
