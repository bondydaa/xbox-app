module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      compass: {
        files: ['src/styles/*.scss'],
        tasks: ['compass:dist']
      },
      assemble: {
        files: ['src/{,*/}*.hbs'],
        tasks: ['assemble:dist']
      },
      concat: {
        files: ['src/scripts/*.js'],
        tasks: ['concat:dist']
      }
    },

    assemble: {
      options: {
        partials: ['src/_includes/*.hbs'],
        layoutdir: 'src/_layouts/',
        layout: ['default.hbs'],
        data: ['src/_data/**/*.{json,yml}'],
        postprocess: require('pretty')
      },
      dist: {
        expand: true,
        cwd: 'src/',
        src: ['*.hbs'],
        dest: 'app'
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: 'src/styles/',
        cssDir: 'app/css',
        relativeAssets: false,
        assetCacheBuster: false,
        outputStyle: 'expanded',
        noLineComments: false
      },
      dist: {
        options: {
          noLineComments: true
        }
      }
    },

    concat: {
      options: {
        separator: grunt.util.linefeed + grunt.util.linefeed,
        banner: '(function () {' + grunt.util.linefeed + grunt.util.linefeed,
        footer: grunt.util.linefeed + grunt.util.linefeed + '})();'
      },
      dist: {
        src: 'src/scripts/*.js',
        dest: 'app/scripts/app.js',
      },
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', [
    'assemble:dist',
    'compass:dist'
  ]);

};