module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            all: {
                src: 'src/entry-point.js',
                dest: 'dist/j29n.js'
            },
            options: {
                browserifyOptions: {
                    standalone: 'j29n'
                }
            }
        },
        uglify: {
            build: {
                src: 'dist/j29n.js',
                dest: 'dist/j29n.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['browserify', 'uglify']);
};