const gulp = require('./gulp')([
<% tasks.forEach(task => { -%>
    '<%- task -%>',
<% }); -%>
]);

gulp.task('build', [
<% buildTasks.forEach(task => { -%>
    '<%- task -%>',
<% }); -%>
]);

gulp.task('default', [
    'build',
<% defaultTasks.forEach(task => { -%>
    '<%- task -%>',
<% }); -%>
]);
