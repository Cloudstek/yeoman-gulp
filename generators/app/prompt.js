module.exports = env => {
    return [
        {
            name: 'flavour',
            message: 'What javascript flavour would you like to use',
            type: 'list',
            choices: [
                {name: 'TypeScript', value: 'typescript'},
                {name: 'Flowtype', value: 'flowtype'},
                {name: 'Javascript', value: 'javascript'}
            ],
            default: 0,
            store: true
        },
        {
            name: 'jsSrc',
            message: 'Where are your source files located',
            type: 'input',
            default: () => {
                return env === 'web' ? 'src/js' : 'src';
            },
            filter: input => {
                if (input.endsWith('/')) {
                    return input.substr(0, input.length - 1);
                }
                return input;
            },
            store: true
        },
        {
            name: 'jsDest',
            message: 'Where do you want to store the transpiled files',
            type: 'input',
            default: () => {
                return env === 'web' ? 'assets/js' : 'dist';
            },
            filter: input => {
                if (input.endsWith('/')) {
                    return input.substr(0, input.length - 1);
                }
                return input;
            },
            store: true
        },
        {
            name: 'target',
            message: 'What version of NodeJS do you want to target',
            type: 'list',
            choices: [
                'current',
                {name: '7', value: 7},
                {name: '6', value: 6},
                {name: '5', value: 5},
                {name: '4', value: 4},
                'other'
            ],
            default: 4,
            when: answers => {
                return answers.flavour.toLowerCase() !== 'typescript';
            },
            store: true
        },
        {
            name: 'targetOther',
            message: 'Please specify the NodeJS version you want to target',
            type: 'input',
            filter: input => {
                if (input.toLowerCase() === 'current') {
                    return input.toLowerCase();
                }

                return parseFloat(input);
            },
            validate: input => {
                if (input.toLowerCase() !== 'current' && isNaN(parseFloat(input))) {
                    return false;
                }

                return true;
            },
            when: answers => {
                return answers.target === 'other';
            },
            store: true
        },
        {
            name: 'eslint',
            message: 'Use ESLint to lint your files',
            type: 'confirm',
            default: true,
            when: answers => {
                let flavour = answers.flavour.toLowerCase();

                return flavour === 'flowtype' || flavour === 'javascript';
            },
            store: true
        },
        {
            name: 'tslint',
            message: 'Use TSLint to lint your files',
            type: 'confirm',
            default: true,
            when: answers => {
                let flavour = answers.flavour.toLowerCase();

                return flavour === 'typescript';
            },
            store: true
        },
        {
            name: 'cssFlavour',
            message: 'Which CSS pre-processor would you like to use',
            type: 'list',
            choices: [
                {name: 'LESS', value: 'less'},
                {name: 'SASS / SCSS', value: 'sass'},
                {name: 'CSS', value: 'css'}
            ],
            default: 0,
            when: () => {
                return env === 'web';
            },
            store: true
        },
        {
            name: 'cssSrc',
            message: 'Where are your stylesheets located',
            type: 'input',
            default: answers => {
                return 'src/' + answers.cssFlavour;
            },
            filter: input => {
                if (input.endsWith('/')) {
                    return input.substr(0, input.length - 1);
                }
                return input;
            },
            when: answers => {
                return env === 'web' && answers.cssFlavour !== 'css';
            },
            store: true
        },
        {
            name: 'cssDest',
            message: 'Where do you want to store the processed stylesheets',
            type: 'input',
            default: 'assets/css',
            filter: input => {
                if (input.endsWith('/')) {
                    return input.substr(0, input.length - 1);
                }
                return input;
            },
            when: answers => {
                return env === 'web' && answers.cssFlavour !== 'css';
            },
            store: true
        },
        {
            name: 'imagemin',
            message: 'Minify images with imagemin',
            type: 'confirm',
            default: true,
            when: () => {
                return env === 'web';
            },
            store: true
        },
        {
            name: 'imageSrc',
            message: 'Where are your source images located',
            type: 'input',
            default: 'src/images',
            filter: input => {
                if (input.endsWith('/')) {
                    return input.substr(0, input.length - 1);
                }
                return input;
            },
            when: answers => {
                return answers.imagemin === true;
            },
            store: true
        },
        {
            name: 'imageDest',
            message: 'Where do you want to store the minified images',
            type: 'input',
            default: 'assets/images',
            filter: input => {
                if (input.endsWith('/')) {
                    return input.substr(0, input.length - 1);
                }
                return input;
            },
            when: answers => {
                return answers.imagemin === true;
            },
            store: true
        },
        {
            name: 'browsersync',
            message: 'Include BrowserSync task',
            type: 'confirm',
            default: true,
            when: () => {
                return env === 'web';
            },
            store: true
        },
        {
            name: 'confirm',
            message: 'Are you sure you want to continue',
            type: 'confirm',
            default: false
        }
    ];
};
