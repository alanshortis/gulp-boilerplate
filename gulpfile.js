'use strict';

// Get our package manifest so we can use it's content
const pkg = require('./package.json');

// Import packages
const gulp = require('gulp'),
      autoprefixer = require('gulp-autoprefixer'),
      concat = require('gulp-concat'),
      cssnano = require('gulp-cssnano'),
      eslint = require('gulp-eslint'),
      header = require('gulp-header'),
      image = require('gulp-image'),
      modernizr = require('gulp-modernizr'),
      rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps'),
      stripDebug = require('gulp-strip-debug'),
      uglify = require('gulp-uglify'),
      del = require('del'),
      merge = require('merge-stream');

// Source folders
const src = {
  src: 'src',
  sass: 'src/sass/**/*.scss',
  img: 'src/img',
  js: 'src/js',
  vendor: 'src/js/vendor'
};

// Destination folders
const dest = {
  css: 'dist/css',
  img: 'dist/img',
  js: 'dist/js'
};

// Banner to be placed on our minified/uglified files
const fileHeader = `/* ${pkg.name} | ${new Date()} */\n`;

console.log(fileHeader);


// Build CSS from SASS with sourcemaps and autoprefix.
gulp.task('css', () => {
  return gulp.src(src.sass)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest.css));
});


// Minify CSS.
gulp.task('minify', ['css'], () => {
  return gulp.src(`${dest.css}/style.css`)
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(cssnano())
    .pipe(header(fileHeader))
    .pipe(gulp.dest(dest.css));
});


// Custom modernizr build
gulp.task('modernizr', () => {
  gulp.src([`${src.src}/**/*.{scss,js}`, `!${src.vendor}/**/*.js`])
    .pipe(modernizr({
      'cache': true,
      'options': [
        'mq'
      ]
    }))
    .pipe(gulp.dest(src.vendor));
});


// Concatenate vendor scripts and copy project code to the dist folder.
gulp.task('js', ['modernizr'], () => {
  const vendorScripts = gulp.src(`${src.vendor}/*.js`)
    .pipe(concat('libs.js'))
    .pipe(gulp.dest(dest.js));

  const appScripts = gulp.src(`${src.js}/project.js`)
    .pipe(gulp.dest(dest.js));

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
  return gulp.src([`${dest.js}/*.js`, `!${dest.js}/**/*.min.js`])
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(header(fileHeader))
    .pipe(gulp.dest(dest.js));
});


// Optimise images and put them in the dist folder.
gulp.task('image', () => {
  return gulp.src(`${src.img}/*`)
    .pipe(image())
    .pipe(gulp.dest(dest.img));
});


// Delete entire 'dist' folder.
gulp.task('clean', () => {
  return del.sync('dist');
});


// Watch for changes to CSS and JS files; compile SASS and lint JS accordingly.
gulp.task('watch', () => {
  gulp.watch(src.sass, ['css']);
  gulp.watch(`${src.js}/**`, ['eslint']);
});


// Do everything.
gulp.task('default', ['minify', 'uglify', 'image']);
