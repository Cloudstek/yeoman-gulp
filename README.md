# Generator Gulp

> Modular gulpfile generator for Yeoman

## Installation

Install the yeoman gulp generator with the following command:

```bash
npm install -g cloudstek/yeoman-gulp
```

**Make sure it's installed globally or yeoman won't find it!**

### Directory structure

```
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   ├── fonts/
│   ├── ...
├── gulp/
│   ├── index.js
│   ├── tasks/
│   │   ├── assets.js
│   │   ├── babel.js
│   │   ├── browsersync.js
│   │   ├── clean.js
│   │   ├── eslint.js
│   │   ├── images.js
│   │   ├── less.js
│   │   ├── watch.js
├── src/
│   ├── js/
│   ├── less/
│   ├── images/
│   ├── fonts/
│   ├── ...
├── gulpfile.js
```

## Usage

Simply run the generator and follow the steps:

```bash
yo gulp 
```

And then run gulp if you wish:

```bash
gulp
# or to build without watching
gulp build
```

## Tasks

### Assets

Copies all static assets to the assets folder. No processing is done on these files. You might want to adjust this file to include the static assets that are specific to your project.

### Babel

Process all javascript files in `src/js` with [Babel](https://babeljs.io). Please use the `.babelrc` file to configure Babel instead of adding options in the gulp task file.

### Browsersync

> Time-saving synchronised browser testing.

See the [Browsersync](https://browsersync.io) website for more info.

### Clean

Wipe the `assets` folder.

### ESLint

Lint all javascript files in `src/js` with [ESLint](http://eslint.org). When the `babel` task is also selected, ESLint will be configured to use Babel as parser.

### Images

Minimizes all images in `src/images` using [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin).

### Less

Process all less files in `src/less` with [gulp-less](https://www.npmjs.com/package/gulp-less).

### Watch

Watch for changes and fire the right tasks when stuff happens.

## Writing new tasks

### Write your task

Create a new file in `generators/app/templates/gulp/tasks` and write your gulp task in there. Check out the existing tasks for examples.

To have your task depend upon other gulp tasks you can use the following syntax when exporting:

```javascript
var mytask = function() {
  // return gulp.src() ...
};

module.exports = [['task1', 'task2'], mytask];
```

If you depend on external tasks (say less) then check if they have been enabled first by using the [EJS](http://ejs.co) template language in your task script. The `tasks` variable contains an array of all enabled tasks. For example:

```javascript
<% if (tasks.indexOf('less') >= 0) { -%>
	// Less task has been enabled, depend upon it.
	module.exports = [['less'], task];
<% } else { -%>
    // Less task has not been enabled, carry on.
	module.exports = task;
<% } -%>
```

### Register your task

To have your task come up as a choice, add it to `generators/app/tasks.json`.

```json
"taskname": {
  "default": true,  // Checked by default
  "task": "build",  // Include task in the build or default task in gulpfile.js
  "npm": [          // NPM dependencies
    "merge-stream"
  ]
}
```

#### Properties

##### default

Type: `boolean`

Check this task by default

##### task

Type: `string`

Values:  `default` `build` `null`

Include the task in the specified "main" task in gulpfile.js. The build task should only include ending tasks, not tasks like watch. The default task is the default task for development and includes the build task as well as other long-running tasks like watch.

##### npm

Type: `Array`

List of NPM packages the task depends upon. The packages will automatically be saved as devDependencies and installed when `yo gulp` is run.