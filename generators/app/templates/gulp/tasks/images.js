var gulp = require('gulp'),
    compress = require('gulp-imagemin');

var task = function() {
    return gulp.src('src/images/**/*')
        .pipe(compress())
        .pipe(gulp.dest('assets/images'));
};

module.exports = task;
