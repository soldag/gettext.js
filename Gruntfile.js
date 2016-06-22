module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            all: {
                src: 'index.js',
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
        },
        release: {
            options: {
                commitMessage: 'Release <%= version %>',
                tagName: 'v<%= version %>',
                beforeBump: ['browser']
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-release');

    grunt.registerTask('browser', ['browserify', 'uglify']);
    grunt.registerTask('default', 'browser');
};