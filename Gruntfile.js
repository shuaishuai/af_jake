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
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', [ ]);
  grunt.registerTask('test', [ 'jshint', 'mochaTest' ]);
};
