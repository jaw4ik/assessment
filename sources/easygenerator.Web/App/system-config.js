System.config({
    transpiler: 'babel',
    map: {
        babel: '/Scripts/systemjs/babel/browser',
        text: 'core/plugins/text',
        durandal: 'core/durandal',
        plugins: 'core/durandal/plugins',
        transitions: 'core/durandal/transitions',
        jquery: 'core/jquery',
        knockout: 'core/knockout'
    },
    defaultJSExtensions: true
});