/**
 * Copy all other static assets (fonts, sound files ...) to the assets folder
 */
var gulp = require('gulp'),
    merge = require('merge-stream');

var task = function() {

    // Fonts
    var fontAssets = gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('assets/fonts'));

    // return merge(fontAssets, ...);
    return fontAssets;
};

module.exports = task;
