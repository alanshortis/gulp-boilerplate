'use strict';

// Import packages and out package.json so we can use its content.
const gulp = require('gulp'),
      del = require('del'),
      merge = require('merge-stream'),
      notifier = require('node-notifier'),
      plugins = require('gulp-load-plugins')(),
      pkg = require('./package.json'),
      options = require('./gulp-options.json');

// Banner to be placed on our minified/uglified files
const fileHeader = `/* ${pkg.name} | ${new Date()} */\n`;


// Build CSS from SASS with sourcemaps and autoprefix.
gulp.task('css', () => {
  return gulp.src(options.src.sass)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({outputStyle: 'expanded'})
    .on('error', function(err) {
      plugins.sass.logError.call(this, err);
      notifier.notify({
        title: 'Gulp',
        message: 'SASS error - see terminal for details.'
      });
    }))
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(options.dest.css));
});


// Minify CSS.
gulp.task('minify', ['css'], () => {
  return gulp.src(`${options.dest.css}/style.css`)
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(plugins.cssnano())
    .pipe(plugins.header(fileHeader))
    .pipe(gulp.dest(options.dest.css));
});


// Custom modernizr build
gulp.task('modernizr', () => {
  gulp.src([`${options.src.src}/**/*.{scss,js}`, `!${options.src.vendor}/**/*.js`])
    .pipe(plugins.modernizr({
      'cache': true,
      'options': [
        'mq',
        'setClasses'
      ]
    }))
    .pipe(gulp.dest(options.src.vendor));
});


// Concatenate vendor scripts and copy project code to the dist folder.
gulp.task('js', ['modernizr'], () => {
  const vendorScripts = gulp.src(`${options.src.vendor}/*.js`)
    .pipe(plugins.concat('libs.js'))
    .pipe(gulp.dest(options.dest.js));

  const appScripts = gulp.src(`${options.src.js}/project.js`)
    .pipe(gulp.dest(options.dest.js));

  return merge(vendorScripts, appScripts);
});


// Lint our JavaScript, aside from node modules and vendor scripts. Rule are in .eslintrc.
gulp.task('eslint', ['js'], () => {
  return gulp.src(['gulpfile.js', `${options.src.js}/*.js`])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError())
    .on('error', () => {
      notifier.notify({
        title: 'Gulp',
        message: 'Liniting failed - see terminal for details.'
      });
    });
});


// Remove debug stuff (console.log, alert), uglify and save with a .min suffix.
gulp.task('uglify', ['eslint'], () => {
  return gulp.src([`${options.dest.js}/*.js`, `!${options.dest.js}/**/*.min.js`])
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(plugins.stripDebug())
    .pipe(plugins.uglify())
    .pipe(plugins.header(fileHeader))
    .pipe(gulp.dest(options.dest.js));
});


// Optimise images and put them in the dist folder.
gulp.task('images', () => {
  return gulp.src([`${options.src.img}/*`, `!${options.src.img}/icons`])
    .pipe(plugins.image())
    .pipe(gulp.dest(options.dest.img));
});


// Make an SVG sprite.
gulp.task('svgsprite', () => {
  return gulp.src(options.src.icons)
  .pipe(plugins.svgmin())
  .pipe(plugins.cheerio({
    run: function ($) {
      $('[fill]').removeAttr('fill');
      $('style').remove();
    },
    parserOptions: { xmlMode: true }
  }))
  .pipe(plugins.rename({
    prefix: 'icon-'
  }))
  .pipe(plugins.svgstore())
  .pipe(gulp.dest(options.dest.img));
});


// Delete entire 'dist' folder.
gulp.task('clean', () => {
  return del.sync(options.dest.dest);
});


// Watch for changes to CSS and JS files; compile SASS and lint JS accordingly.
gulp.task('watch', () => {
  gulp.watch(options.src.sass, ['css']);
  gulp.watch(`${options.src.js}/**`, ['eslint']);
});


// Do everything.
gulp.task('default', ['minify', 'uglify', 'images', 'svgsprite']);
