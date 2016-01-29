'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');


/* CSS (SASS compilation, autoprefixer and sourcemaps) */

var sassSrc = 'sass/**/*.scss';
var sassDest = 'css';
var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};
var autoprefixerOptions = {
    browsers: ['last 2 versions']
};

gulp.task('sass', function () {
    gulp.src(sassSrc)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(sassDest));
});


/* TASKS */

// Watch
gulp.task('watch', function () {
    gulp.watch(sassSrc, ['sass']);
});

// Default
gulp.task('default', ['sass']);
