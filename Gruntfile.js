module.exports = function(grunt) {
  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: [ 'tests/**/*.js' ]
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'scripts/**/*.js',
        'tests/specs/**/*.js'
      ]
    },
    plato: {
      all: {
        files: {
          'platoreport': ['scripts/**/*.js', 'tests/**/*.js'],
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-plato');

  grunt.registerTask('default', [ ]);
  grunt.registerTask('test', [ 'jshint', 'mochaTest' ]);
};
