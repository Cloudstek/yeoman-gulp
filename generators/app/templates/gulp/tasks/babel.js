const fs = require('fs');
const gulp = require('gulp');
const babel = require('gulp-babel');
const browserslist = require('browserslist');

var task = function () {
    let babelrc = JSON.parse(fs.readFileSync('.babelrc') || "{}");

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

    return gulp.src(['src/js/**/*.js'])
        .pipe(babel(babelrc))
        .pipe(gulp.dest('assets/js'));
};

<% if (tasks.indexOf('eslint') >= 0) { -%>
module.exports = [['eslint'], task];
<% } else { -%>
module.exports = task;
<% } -%>
