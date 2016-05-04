/*
 * grunt-install-compass
 * https://github.com/chyingp/grunt-install-compass
 *
 * Copyright (c) 2013 chyingp
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Configuration to be run (and then tested).
    install_compass: {

    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['install_compass']);
};
