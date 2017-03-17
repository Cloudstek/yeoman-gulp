const path = require('path');
const Generator = require('yeoman-generator');

class GulpNodeGenerator extends Generator {
    constructor(args, opts) {
        super(args, opts);

        this.npmDeps = [
            'gulp',
            'gulp-rename'
        ];

        this.gulpTasks = this.fs.readJSON(path.join(__dirname, 'tasks.json'));
        this.selectedTasks = [];
        this.bgTasks = [];
        this.answers = {};
    }

    /**
     * Write or extend JSON file.
     * @param {string} filepath
     * @param {Object} contents
     * @param {Function|Array.<String>|Array.<Number>} replacer
     * @param {String|Number} space Used to insert white space into the output JSON string for readability purposes.
     * @see https://github.com/sboudrias/mem-fs-editor#writejsonfilepath-contents-replacer--space
     * @return {void}
     */
    _writeJSON(filepath, contents, replacer, space) {
        if (this.fs.exists(filepath)) {
            try {
                // Check if valid JSON
                this.fs.readJSON(filepath);

                // Extend JSON
                this.fs.extendJSON(filepath, contents, replacer, space);
            } catch (err) {
                // Overwrite file with contents
                this.fs.writeJSON(filepath, contents, replacer, space);
            }

            return;
        }

        // Write JSON file
        this.fs.writeJSON(filepath, contents, replacer, space);
    }

    /**
     * Copy multiple template files
     * @return {void}
     */
    _copyTpl(files, vars) {
        if (typeof files === 'string') {
            this.fs.copyTpl(
                this.templatePath(files),
                this.destinationPath(files),
                vars
            );
        } else if (Array.isArray(files)) {
            for (let file of files) {
                this.fs.copyTpl(
                    this.templatePath(file),
                    this.destinationPath(file),
                    vars
                );
            }
        }
    }

    /**
     * Copy gulp files
     * @return {void}
     */
    _copyGulp() {
        let flavour = this.answers.flavour.toLowerCase();
        let flavourExt = '';

        switch (flavour) {
            case 'flowtype':
                flavourExt = '.js.flow';
                break;
            default:
                flavourExt = '.js';
                break;
        }

        // Task template variables
        let tplVars = {
            flavour: flavour,
            flavourExt: flavourExt,
            tasks: this.selectedTasks,
            bgTasks: this.bgTasks,
            env: this.answers.env,
            src: {
                js: this.answers.jsSrc,
                css: this.answers.cssSrc,
                img: this.answers.imageSrc
            },
            dest: {
                js: this.answers.jsDest,
                css: this.answers.cssDest,
                img: this.answers.imageDest
            }
        };

        // Base
        this._copyTpl([
            'gulpfile.js',
            'gulp/index.js',
            'gulp/tasks/watch.js'
        ], tplVars);

        // Tasks
        for (let task of this.selectedTasks.concat(this.bgTasks)) {
            this._copyTpl(`gulp/tasks/${task}.js`, tplVars);
        }
    }

    /**
     * Prompt for answers
     * @async
     */
    prompting() {
        return this.prompt([
            {
                name: 'env',
                message: 'What environment do you wish to gulpify',
                type: 'list',
                choices: [
                    {name: 'NodeJS Application', value: 'node'},
                    {name: 'Website', value: 'web'}
                ],
                store: true
            }
        ]).then(answers => {
            this.answers = answers;

            return this.prompt(require('./prompt')(answers.env))
                .then(answers => {
                    if (answers.confirm === false) {
                        process.exit(0);
                    }

                    if (!answers.srcDir) {
                        answers.srcDir = '.';
                    }

                    if (!answers.outDir) {
                        answers.outDir = '.';
                    }

                    // Store answers
                    this.answers = Object.assign({}, this.answers, answers);
                });
        });
    }

    /**
     * Writing
     * @return {void}
     */
    writing() {
        // Typescript
        if (this.answers.flavour === 'typescript') {
            this.selectedTasks.push('typescript');

            this.fs.copy(
                this.templatePath('tsconfig.json'),
                this.destinationPath('tsconfig.json')
            );

            // TSLint
            if (this.answers.tslint === true) {
                this.selectedTasks.push('tslint');

                this.fs.copy(
                    this.templatePath('tslint.json'),
                    this.destinationPath('tslint.json')
                );
            }
        }

        // Flowtype
        if (this.answers.flavour === 'flowtype') {
            this.npmDeps.push('flow-bin');

            this.fs.copy(
                this.templatePath('.flowconfig'),
                this.destinationPath('.flowconfig')
            );
        }

        // Babel
        if (this.answers.flavour !== 'typescript') {
            this.selectedTasks.push('babel');

            // Babel config
            let babelrc = this.fs.readJSON(this.templatePath('.babelrc'));
            babelrc.presets = babelrc.presets || [];

            // NodeJS target
            let nodeTarget = this.answers.target;
            if (this.answers.target === 'other') {
                nodeTarget = this.answers.targetOther;
            }

            // Flowtype
            if (this.answers.flavour === 'flowtype') {
                this.npmDeps.push('babel-preset-flow');
                babelrc.presets.push('flow');
            }

            // Babel Env
            if (this.answers.env === 'node') {
                babelrc.presets.push(
                    ['env', {
                        targets: {
                            node: nodeTarget
                        }
                    }]
                );
            } else if (this.answers.env === 'web') {
                babelrc.presets.push(
                    ['env', {
                        targets: {
                            browsers: []
                        }
                    }]
                );
            }

            // Write Babel config
            this._writeJSON(this.destinationPath('.babelrc'), babelrc);
        }

        // ESLint
        if (this.answers.eslint === true) {
            this.selectedTasks.push('eslint');

            // ESLint config
            let eslintrc = this.fs.readJSON(this.templatePath('.eslintrc'));

            eslintrc.env = eslintrc.env || {};
            eslintrc.plugins = eslintrc.plugins || [];
            eslintrc.rules = eslintrc.rules || {};

            // ESLint Flowtype
            if (this.answers.flavour === 'flowtype') {
                this.npmDeps.push('eslint-plugin-flowtype-errors');

                // Plugins
                eslintrc.plugins.push('flowtype-errors');

                // Rules
                eslintrc.rules['flowtype-errors/show-errors'] = 2;
            }

            // ESLint Env
            if (this.answers.env === 'node') {
                eslintrc.env.node = true;
                eslintrc.env.browser = false;
            } else if (this.answers.env === 'web') {
                eslintrc.env.node = false;
                eslintrc.env.browser = true;
            }

            // Babel ESLint
            if (this.selectedTasks.indexOf('babel') >= 0) {
                this.npmDeps.push('babel-eslint');
            }

            // Write ESLint config
            this._writeJSON(this.destinationPath('.eslintrc'), eslintrc);
        }

        // Imagemin
        if (this.answers.imagemin === true) {
            this.selectedTasks.push('images');
        }

        // BrowserSync
        if (this.answers.browsersync === true) {
            this.bgTasks.push('browsersync');
        }

        // CSS / LESS / SASS
        if (this.answers.cssFlavour) {
            this.selectedTasks.push(this.answers.cssFlavour);
        }

        // Browserslist
        if (this.answers.env === 'web') {
            this.fs.copy(
                this.templatePath('browserslist'),
                this.destinationPath('browserslist')
            );
        }

        // Watch
        this.bgTasks.push('watch');

        // Copy gulp files
        this._copyGulp();
    }

    /**
     * Install
     * @return {void}
     */
    install() {
        // Add NPM deps for selected tasks
        for (let task of this.selectedTasks.concat(this.bgTasks)) {
            if (this.gulpTasks[task].npm && Array.isArray(this.gulpTasks[task].npm)) {
                this.npmDeps.push(...this.gulpTasks[task].npm);
            }

            // Web specific deps
            if (this.answers.env === 'web' && this.gulpTasks[task].web && Array.isArray(this.gulpTasks[task].web)) {
                this.npmDeps.push(...this.gulpTasks[task].web);
            }

            // NodeJS specific deps
            if (this.answers.env === 'node' && this.gulpTasks[task].node && Array.isArray(this.gulpTasks[task].node)) {
                this.npmDeps.push(...this.gulpTasks[task].node);
            }
        }

        // NPM
        this.npmInstall(this.npmDeps, {'save-dev': true});
    }
}

module.exports = GulpNodeGenerator;
