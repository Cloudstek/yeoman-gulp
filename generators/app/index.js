const path = require('path');
const Generator = require('yeoman-generator');

class GulpAppGenerator extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.npmDeps = [
            'gulp'
        ];

        this.gulpTasks = this.fs.readJSON(path.join(__dirname, 'tasks.json'));

        this.selectedTasks = [];
    }

    _taskSelected(task) {
        return this.selectedTasks.indexOf(task) >= 0;
    }

    _taskSelectedByParent(parent) {
        return this.selectedTasks.slice().filter(task => {
            return this.gulpTasks[task].task && this.gulpTasks[task].task === parent;
        });
    }

    prompting() {
        return this.prompt([
            {
                name: 'tasks',
                message: 'Which gulp tasks should be installed',
                type: 'checkbox',
                store: true,
                choices: Object.keys(this.gulpTasks).map(task => ({
                    name: task,
                    checked: this.gulpTasks[task].default || false
                })),
                validate: answer => {
                    if (answer.length < 1) {
                        return 'You must select at least one Gulp task.';
                    }
                    return true;
                }
            },
            {
                name: 'confirm',
                message: 'Are you sure you want to continue',
                type: 'confirm',
                default: false
            }
        ]).then(answers => {
            if (answers.confirm === false) {
                this.log('Okay, bye!');
                process.exit(0);
            }

            answers.tasks.map(task => {
                // Add NPM dependencies
                if (this.gulpTasks[task].npm) {
                    this.gulpTasks[task].npm.map(dep => {
                        this.npmDeps.push(dep);
                        return dep;
                    });
                }

                // Add task to selected tasks
                this.selectedTasks.push(task);
                return task;
            });
        });
    }

    writing() {
        let buildTasks = this._taskSelectedByParent('build');
        let defaultTasks = this._taskSelectedByParent('default');

        // Tasks
        this.fs.copyTpl(
            this.templatePath('gulp'),
            this.destinationPath('gulp'),
            {
                tasks: this.selectedTasks
            }
        );

        this.fs.copy(
            this.templatePath('browserslist'),
            this.destinationPath('browserlist')
        );

        // Gulpfile
        this.fs.copyTpl(
            this.templatePath('gulpfile.js'),
            this.destinationPath('gulpfile.js'),
            {
                tasks: this.selectedTasks,
                buildTasks: buildTasks,
                defaultTasks: defaultTasks
            }
        );

        // Babel
        if (this._taskSelected('babel') && !this.fs.exists(this.destinationPath('.babelrc'))) {
            this.fs.copy(
                this.templatePath('.babelrc'),
                this.destinationPath('.babelrc')
            );
        }

        // Eslint
        if (this._taskSelected('eslint') && !this.fs.exists(this.destinationPath('.eslintrc'))) {
            this.fs.copy(
                this.templatePath('.eslintrc'),
                this.destinationPath('.eslintrc')
            );

            if (this._taskSelected('babel')) {
                this.npmDeps.push('babel-eslint');
                this.fs.extendJSON(this.destinationPath('.eslintrc'), {
                    parser: 'babel-eslint'
                });
            }
        }
    }

    install() {
        this.npmInstall(this.npmDeps, {'save-dev': true});
    }
}

module.exports = GulpAppGenerator;
