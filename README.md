# Gulp Boilerplate

Boilerplate for gulp tasks. In progress.

### Tasks

`css`
* SASS compilation.
* Soucemaps.
* Autoprefix CSS.

`minify`
* Minify CSS into a new file  with a `.min` suffix.

`modernizr`
* Crawls `scss` and `js` files to make a custom modernizr build. Explicitly includes `mq`.

`js`
* Concatenate a range of javaScript files.
* Copy a 'project' JS file to the dist folder.

`eslint`
* Use ESLint to enforce JavaScript coding standards.

`uglify`
* Remove `console.log` and `alert` debug messages.
* Uglify JavaScript into a new file with a `.min` suffix.

`image`
* Optimize images.

`watch`
* Watch SASS files for changes and run `css`.
* Watch JavaScript files for changes and run `eslint`.

`clean`
* Remove the entire `dist` folder.

`default`
* Run all tasks.
