module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'javascripts/<%= pkg.name %>.js',
        dest: 'javascripts/<%= pkg.name %>.min.js'
      }
    },
    compass: {
      dist: {
        options: {
          require: 'susy', //Enables susy for layout
          config: 'config.rb'
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Load the Compass.
  grunt.loadNpmTasks('grunt-contrib-compass');
  
  // Default task(s).
  grunt.registerTask('default', ['uglify', 'compass']);

};