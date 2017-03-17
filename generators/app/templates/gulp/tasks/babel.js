const fs = require('fs');
const gulp = require('gulp');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
<% if (env === 'web') { -%>
const browserslist = require('browserslist');
<% } -%>

var task = function () {
    let babelrc = JSON.parse(fs.readFileSync('.babelrc') || "{}");

<% if (env === 'web') { -%>
    // Add browsers from browserslist
    babelrc.presets.map(preset => {
        const [name, options] = preset;

        if (name === 'env' && options.targets.browsers) {
            options.targets.browsers = browserslist(null, {
                path: process.cwd()
            });
        }

        return preset;
    });
<% } -%>

    return gulp.src(['<%= src.js %>/**/*<%= flavourExt %>', '!node_modules', '!node_modules/**'])
        .pipe(babel(babelrc))
        .pipe(rename(path => {
            // Fix file extension for double ext files (.js.flow)
            path.extname = path.basename.endsWith('.js') ? '' : '.js';
        }))
        .pipe(gulp.dest('<%= dest.js %>'));
};

<% if (tasks.indexOf('eslint') >= 0) { -%>
module.exports = [['eslint'], task];
<% } else { -%>
module.exports = task;
<% } -%>
