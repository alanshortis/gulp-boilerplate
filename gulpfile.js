'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const header = require('gulp-header');
const image = require('gulp-image');
const del = require('del');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const sassSrc = 'src/sass/**/*.scss';
const cssDest = 'dist/css';
const imgSrc = 'src/img';
const imgDest = 'dist/img';
const jsSrc = 'src/js';
const jsDest = 'dist/js';


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
});


gulp.task('clean', function() {
    return del.sync('dist');
})


gulp.task('default', ['css', 'minify', 'js', 'uglify', 'image']);
