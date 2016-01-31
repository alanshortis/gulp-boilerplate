'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var header = require('gulp-header');


var sassSrc = 'sass/**/*.scss';
var cssDest = 'css';

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
        .pipe(rename('style.min.css'))
        .pipe(cssnano())
        .pipe(header('/* <%= new Date() %> */\n'))
        .pipe(gulp.dest(cssDest));
});


gulp.task('watch', function () {
    gulp.watch(sassSrc, ['css']);
});


gulp.task('default', ['css', 'minify']);
