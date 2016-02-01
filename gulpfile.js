'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var header = require('gulp-header');
var image = require('gulp-image');
var del = require('del');

var sassSrc = 'src/sass/**/*.scss';
var cssDest = 'dist/css';
var imgSrc = 'src/img';
var imgDest = 'dist/img';
var jsSrc = 'src/js';
var jsDest = 'dist/js';


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


gulp.task('image', function () {
    gulp.src(imgSrc + '/*')
        .pipe(image())
        .pipe(gulp.dest(imgDest));
});


gulp.task('watch', function () {
    gulp.watch(sassSrc, ['css']);
});


gulp.task('clean', function() {
    return del.sync('dist');
})


gulp.task('default', ['css', 'minify', 'image']);
