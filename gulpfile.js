'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');


/* CSS (SASS compilation, autoprefixer and sourcemaps) */

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};
var autoprefixerOptions = {
    browsers: ['last 2 versions']
};

gulp.task('sass', function () {
    gulp.src('sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('css'));
});


/* TASKS */

// Watch
gulp.task('watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

// Default
gulp.task('default', ['sass']);
