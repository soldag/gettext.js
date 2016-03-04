module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            all: {
                src: 'src/Translator.js',
                dest: 'dist/gettext.js'
            },
            options: {
                browserifyOptions: {
                    standalone: 'src/Translator'
                }
            }
        },
        uglify: {
            build: {
                src: 'dist/gettext.js',
                dest: 'dist/gettext.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['browserify', 'uglify']);
};