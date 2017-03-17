const gulp = require('gulp');
const tslint = require('gulp-tslint');

var task = function () {
    return gulp.src(['<%= src.js %>/**/*.ts', '!node_modules', '!node_modules/**'])
        .pipe(tslint({
            formatter: 'verbose'
        }))
        .pipe(tslint.report());
};

module.exports = task;
