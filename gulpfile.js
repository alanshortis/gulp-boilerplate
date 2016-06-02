'use strict';

// Import packages and out package.json so we can use its content.
const gulp = require('gulp'),
      autoprefixer = require('gulp-autoprefixer'),
      cheerio = require('gulp-cheerio'),
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
      svgmin = require('gulp-svgmin'),
      svgstore = require('gulp-svgstore'),
      uglify = require('gulp-uglify'),
      browserify = require('browserify'),
      buffer = require('vinyl-buffer'),
      del = require('del'),
      hbsfy = require('hbsfy'),
      merge = require('merge-stream'),
      notifier = require('node-notifier'),
      source = require('vinyl-source-stream'),
      pkg = require('./package.json');

// Banner to be placed on our minified/uglified files
const fileHeader = `/* ${pkg.name} | ${new Date()} */\n`;


// Build CSS from SASS with sourcemaps and autoprefix.
gulp.task('css', () => {
  return gulp.src(pkg.folders.src.sass)
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'})
    .on('error', function(err) {
      sass.logError.call(this, err);
      notifier.notify({
        title: 'Gulp',
        message: 'SASS error - see terminal for details.'
      });
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(pkg.folders.dest.css));
});


// Minify CSS.
gulp.task('minify', ['css'], () => {
  return gulp.src(`${pkg.folders.dest.css}/style.css`)
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(cssnano())
    .pipe(header(fileHeader))
    .pipe(gulp.dest(pkg.folders.dest.css));
});


// Custom modernizr build
gulp.task('modernizr', () => {
  gulp.src([`${pkg.folders.src.src}/**/*.{scss,js}`, `!${pkg.folders.src.vendor}/**/*.js`])
    .pipe(modernizr({
      'cache': true,
      'options': [
        'mq',
        'setClasses'
      ]
    }))
    .pipe(gulp.dest(pkg.folders.src.vendor));
});


// Browserify, with a transform for handlebars
gulp.task('js', ['eslint'], () => {
  return browserify({entries: `${pkg.folders.src.js}/app.js`, extensions: ['.hbs', '.js'], debug: true, transform: [hbsfy]})
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(`${pkg.folders.dest.js}/`));
});


// Concatenate vendor scripts and copy project code to the dist folder.
// Browserify should be used over this, but I'll leave this in anyway.
gulp.task('js', ['modernizr'], () => {
  const vendorScripts = gulp.src(`${pkg.folders.src.vendor}/*.js`)
    .pipe(concat('libs.js'))
    .pipe(gulp.dest(pkg.folders.dest.js));

  const appScripts = gulp.src(`${pkg.folders.src.js}/project.js`)
    .pipe(gulp.dest(pkg.folders.dest.js));

  return merge(vendorScripts, appScripts);
});


// Lint our JavaScript, aside from node modules and vendor scripts. Rule are in .eslintrc.
gulp.task('eslint', ['js'], () => {
  return gulp.src(['gulpfile.js', `${pkg.folders.src.js}/*.js`])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on('error', () => {
      notifier.notify({
        title: 'Gulp',
        message: 'Liniting failed - see terminal for details.'
      });
    });
});


// Remove debug stuff (console.log, alert), uglify and save with a .min suffix.
gulp.task('uglify', ['eslint'], () => {
  return gulp.src([`${pkg.folders.dest.js}/*.js`, `!${pkg.folders.dest.js}/**/*.min.js`])
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(header(fileHeader))
    .pipe(gulp.dest(pkg.folders.dest.js));
});


// Optimise images and put them in the dist folder.
gulp.task('images', () => {
  return gulp.src([`${pkg.folders.src.img}/*`, `!${pkg.folders.src.img}/icons`])
    .pipe(image())
    .pipe(gulp.dest(pkg.folders.dest.img));
});


// Make an SVG sprite.
gulp.task('svgsprite', () => {
  return gulp.src(pkg.folders.src.icons)
  .pipe(svgmin())
  .pipe(cheerio({
    run: function ($) {
      $('[fill]').removeAttr('fill');
      $('style').remove();
    },
    parserOptions: { xmlMode: true }
  }))
  .pipe(rename({
    prefix: 'icon-'
  }))
  .pipe(svgstore())
  .pipe(gulp.dest(pkg.folders.dest.img));
});


// Delete entire 'dist' folder.
gulp.task('clean', () => {
  return del.sync(pkg.folders.dest.dest);
});


// Watch for changes to CSS and JS files; compile SASS and lint JS accordingly.
gulp.task('watch', () => {
  gulp.watch(pkg.folders.src.sass, ['css']);
  gulp.watch(`${pkg.folders.src.js}/**`, ['js']);
});


// Do everything.
gulp.task('default', ['minify', 'js', 'uglify', 'images', 'svgsprite']);
