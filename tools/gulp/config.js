export default {
    less: {
        src: ['./sources/easygenerator.Web/Content/**/*.less'],
        srcPlayer: ['./sources/easygenerator.Player/public/styles/*.less'],
        destPlayer: './sources/easygenerator.Player/public/styles',
        dest: './sources/easygenerator.Web/Content',
        browsers: ['last 1 Chrome version', 'last 1 Firefox version', 'last 1 Explorer version', 'last 1 Safari version']
    },
    app: {
        baseAppPath: './sources/easygenerator.Web',
        systemConfigFilePath: './sources/easygenerator.Web/config.js',
        outputMainBuiltFilePath: './sources/easygenerator.Web/App/main-built.js'
    }
};