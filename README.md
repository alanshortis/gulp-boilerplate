# Gulp Boilerplate

I wouldn't recommend using this gulpfile as is. This is becoming less of a working example and more of a collection of task configurations that can be used in 'proper' gulpfiles in projects.

I will eventually split this into multiple 'recipes'.

### Tasks

`css`
* SASS compilation.
* Soucemaps.
* Autoprefix CSS.

`minify`
* Minify CSS into a new file  with a `.min` suffix.

`modernizr`
* Crawls `scss` and `js` files to make a custom modernizr build.
* Explicity includes `mq` and `setClasses`.

`js`
* Use browserify to bundle JavaScript modules.
* Includes a transform for Handlebars, for HTML templates in JS.

`concat`
* Concatenate a range of javaScript files.
* Copy a 'project' JS file to the dist folder.

`eslint`
* Use ESLint to enforce JavaScript coding standards.

`uglify`
* Remove `console.log` and `alert` debug messages.
* Uglify JavaScript into a new file with a `.min` suffix.

`image`
* Optimize images.

`svgsprite`
* Optimise SVG icons.
* Prefix each symbol's ID with `icon-`.
* Remove `fill` attribute from each `path`.
* Remove `style` tags.
* Create an SVG sprite.

`watch`
* Watch SASS files for changes and run `css`.
* Watch JavaScript files for changes and run `eslint`.

`clean`
* Remove the entire `dist` folder.

`default`
* Run all tasks.


### To do
Bugs and Enhancements can be found under [issues](https://github.com/alanshortis/gulp-boilerplate/issues).
