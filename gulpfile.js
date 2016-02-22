'use strict';

const gulp = require('gulp'),
      autoprefixer = require('gulp-autoprefixer'),
      concat = require('gulp-concat'),
      cssnano = require('gulp-cssnano'),
      eslint = require('gulp-eslint'),
      header = require('gulp-header'),
      image = require('gulp-image'),
      rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps'),
      stripDebug = require('gulp-strip-debug'),
      uglify = require('gulp-uglify'),
      del = require('del'),
      merge = require('merge-stream'),
      pkg = require('./package.json');

const sassSrc = 'src/sass/**/*.scss',
      cssDest = 'dist/css',
      imgSrc = 'src/img',
      imgDest = 'dist/img',
      jsSrc = 'src/js',
      jsDest = 'dist/js',
      fileHeader = '/* ' + pkg.name + ' | ' + new Date() + ' */\n';


// Build CSS from SASS with sourcemaps and autoprefix.
gulp.task('css', () => {
  return gulp.src(sassSrc)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(cssDest));
});


// Minify CSS.
gulp.task('minify', ['css'], () => {
  return gulp.src(cssDest + '/style.css')
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(header(fileHeader))
    .pipe(gulp.dest(cssDest));
});


// Concatenate vendor scripts and copy project code to the dist folder.
gulp.task('js', () => {
  const vendorScripts = gulp.src(jsSrc + '/vendor/*.js')
    .pipe(concat('libs.js'))
    .pipe(gulp.dest(jsDest));

  const appScripts = gulp.src(jsSrc + '/project.js')
    .pipe(gulp.dest(jsDest));

  return merge(vendorScripts, appScripts);
});


// Lint our JavaScript, aside from node modules and vendor scripts. Rule are in .eslintrc.
gulp.task('eslint', ['js'], () => {
  return gulp.src(['**/*.js', '!node_modules/**', '!**/*.min*', '!**/libs*', '!**/vendor/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});


// Remove debug stuff (console.log, alert), uglify and save with a .min suffix.
gulp.task('uglify', ['eslint'], () => {
  return gulp.src(jsDest + '/*[^.min].js')
    .pipe(rename({suffix: '.min'}))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(header(fileHeader))
    .pipe(gulp.dest(jsDest));
});


// Optimise images and put them in the dist folder.
gulp.task('image', () => {
  return gulp.src(imgSrc + '/*')
    .pipe(image())
    .pipe(gulp.dest(imgDest));
});


// Delete entire 'dist' folder.
gulp.task('clean', () => {
  return del.sync('dist');
});


// Watch for changes to CSS and JS files; compile SASS and lint JS accordingly.
gulp.task('watch', () => {
  gulp.watch(sassSrc, ['css']);
  gulp.watch(jsSrc + '/**', ['eslint']);
});


// Do everything.
gulp.task('default', ['minify', 'uglify', 'image']);
