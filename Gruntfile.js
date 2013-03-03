module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    shell: {
      precompile: {
        command: 'rake regenerate_javascript',
        options: {
          stdout: true
        }
      },
      server: {
        command: "thin start -p 4567 -R test/javascript/config.ru -d; sleep 5;"
      }
    },
    jshint: {
      //all: ['Gruntfile.js', 'vendor/assets/javascripts/rails.validations.js', 'test/javascript/public/test/**/*.js']
      all: ['Gruntfile.js', 'test/javascript/public/test/**/*.js']
    },
    qunit: {
      all: {
        options: {
          urls: ['http://localhost:4567/']
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-shell');

  //grunt.registerTask('default', ['shell:precompile','jshint','shell:server','qunit']);
  grunt.registerTask('default', ['shell:precompile','shell:server','qunit']);
  grunt.event.on('qunit.done', function(){grunt.util.spawn({cmd: "thin", args: ["stop"]});});

};