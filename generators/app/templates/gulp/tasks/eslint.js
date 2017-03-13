const gulp = require('gulp');
const eslint = require('gulp-eslint');

var task = function () {
    return gulp.src(['src/js/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format('node_modules/eslint-formatter-pretty'))
        .pipe(eslint.failAfterError());
};

module.exports = task;
