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
      concat: {
        files: ['src/js/{,*/}*.js'],
        tasks: ['concat:dist']
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: 'src/styles/',
        cssDir: 'app/css/',
        relativeAssets: false,
        assetCacheBuster: false,
        outputStyle: 'expanded',
        noLineComments: false,
        require: 'susy'
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
        banner: '(function() {' + grunt.util.linefeed + grunt.util.linefeed,
        footer: grunt.util.linefeed + grunt.util.linefeed + '})();'
      },
      dist: {
        src: ['src/js/models/*.js', 'src/js/collections/*.js', 'src/js/views/*.js', 'src/js/router/*.js', 'src/js/init.js'],
        dest: 'app/scripts/app.js',
      },
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', [
    'concat:dist',
    'compass:dist'
  ]);

};