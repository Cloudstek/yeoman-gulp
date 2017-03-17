const gulp = require('gulp');
const ts = require('gulp-typescript');
const rename = require('gulp-rename');

var task = function () {
    let tsProject = ts.createProject('tsconfig.json');
    return gulp.src(['<%= src.js %>/**/*.ts', '!node_modules', '!node_modules/**'])
        .pipe(tsProject())
        .pipe(gulp.dest('<%= dest.js %>'));
};

<% if (tasks.indexOf('tslint') >= 0) { -%>
module.exports = [['tslint'], task];
<% } else { -%>
module.exports = task;
<% } -%>
