const gulp = require('gulp');
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const compress = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');

<% if (bgTasks.indexOf('browsersync') >= 0) { -%>
const sync = require('browser-sync');
<% } -%>

var task = function () {
    const cwd = process.cwd();

    return gulp.src(['<%= src.css %>/**/*.scss', '!<%= src.css %>/**/_*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                '<%= src.css %>',
                'bower_components'
            ]
        }).on('error', sass.logError))
        .pipe(prefix())
        .pipe(compress())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('<%= dest.css %>'))<% if (bgTasks.indexOf('browsersync') < 0) { -%>;<% } %>
        <% if (bgTasks.indexOf('browsersync') >= 0) { -%>.pipe(sync.stream());<% }%>
};

module.exports = task;
