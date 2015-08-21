module.exports = function (grunt) {
    grunt.initConfig({
        jasmine: {
            easygenerator: {
                options: {
                    template: 'specs.html'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.file.setBase('sources/easygenerator.Web/App')

    grunt.registerTask('default', 'jasmine');
}