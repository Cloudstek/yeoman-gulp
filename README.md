# Generator Gulp

> Modular gulpfile generator for Yeoman

## Installation

Install the yeoman gulp generator with the following command:

```bash
npm install -g cloudstek/yeoman-gulp
```

**Make sure it's installed globally or yeoman won't find it!**

### Directory structure

```
├── gulp/
│   ├── index.js
│   ├── tasks/
│   │   ├── ...
├── gulpfile.js
```

## Usage

Simply run the generator and follow the steps:

```bash
yo gulp 
```

And then run gulp if you wish:

```bash
gulp
# or to build without watching
gulp build
```