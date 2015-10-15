System.config({
    transpiler: 'traceur',
    map: {
        traceur: 'libs/traceur/traceur',
        text: 'libs/text',
        durandal: 'libs/durandal',
        plugins: 'libs/durandal/plugins',
        jquery: 'libs/jquery',
        knockout: 'libs/knockout'
    },
    defaultJSExtensions: true
});