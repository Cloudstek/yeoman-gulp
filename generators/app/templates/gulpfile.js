const gulp = require('./gulp')([
<% tasks.concat(bgTasks).forEach(task => { -%>
    '<%- task -%>',
<% }); -%>
    'watch'
]);

gulp.task('build', [
<% tasks.forEach(task => { -%>
    '<%- task -%>',
<% }); -%>
]);

gulp.task('default', [
<% bgTasks.forEach(task => { -%>
    '<%- task -%>',
<% }); -%>
    'build'
]);
