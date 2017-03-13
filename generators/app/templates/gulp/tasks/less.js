const gulp = require('gulp');
const path = require('path');
const less = require('gulp-less');
const prefix = require('gulp-autoprefixer');
const compress = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');

<% if (tasks.indexOf('browsersync') >= 0) { -%>
const sync = require('browser-sync');
<% } -%>

var task = function () {
    const cwd = process.cwd();

    return gulp.src(['src/less/**/*.less', '!src/less/**/_*.less'])
        .pipe(less({
            paths: [
                path.join(cwd, 'src', 'less'),
                path.join(cwd, 'bower_components')
            ]
        }))
        .pipe(sourcemaps.init())
        .pipe(prefix())
        .pipe(compress())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('assets/css'))<% if (tasks.indexOf('browsersync') < 0) { -%>;<% } %>
        <% if (tasks.indexOf('browsersync') >= 0) { -%>.pipe(sync.stream());<% }%>
};

module.exports = task;
