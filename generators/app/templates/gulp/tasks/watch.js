var gulp = require('gulp');

var task = function (done) {
    gulp.watch(['<%= src.js %>/**/*<%= flavour === "typescript" ? ".ts" : flavourExt %>', '!node_modules', '!node_modules/**'], ['babel']);
    <% if (tasks.indexOf('less') >= 0) { -%>
    gulp.watch(['<%= src.css %>/**/*.less', '!<%= src.css %>/**/_*.less'], ['less']);
    <% } else if (tasks.indexOf('sass') >= 0) { -%>
    gulp.watch(['<%= src.css %>/**/*.scss', '!<%= src.css %>/**/_*.scss'], ['sass']);
    <% } else if (tasks.indexOf('css') >= 0) { -%>
    gulp.watch(['<%= src.css %>/**/*.css', '!<%= src.css %>/**/_*.css'], ['css']);
    <% } -%>
};

module.exports = [['build'], task];
