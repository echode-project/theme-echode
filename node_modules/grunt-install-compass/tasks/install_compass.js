/*
 * grunt-install-compass
 * https://github.com/chyingp/grunt-install-compass
 *
 * Copyright (c) 2013 chyingp
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	var path = require('path'),
		os = require('os'),
		exec = require('child_process').exec,
		child;

	grunt.registerMultiTask('install_compass', 'Your task description goes here.', function() {

		console.log('grunt-install-compass started!');

		var command_line = 'gem install --local compass-0.12.2.gem';
		if(os.type()!=='Windows_NT'){
			console.log('os: not Windows_NT!');
			command_line = 'sudo '+command_line;
		}else{
			console.log('os: Windows_NT!');
		}
		console.log('command_line: '+command_line);
		child = exec(command_line, {
				cwd: 'node_modules/grunt-install-compass/tasks/compass'
			},
			function (error, stdout, stderr) {
				console.log('stdout: ' + stdout);
				console.log('stderr: ' + stderr);
				if (error !== null) {
					console.log('exec error: ' + error);
				}
			});

//		var spawn = require('child_process').spawn,
//			ls = spawn('sudo', ['gem', 'install', '--local', 'compass-0.12.2.gem'], {
//				cwd: path.resolve( process.cwd(), 'node_modules/grunt-install-compass/tasks/compass' ),
//				stdio: ['pipe', 'pipe', 'pipe']
//			});
//
//		console.log('current path: '+process.cwd());
//
//		ls.stdout.on('data', function (data) {
//			console.log('stdout: ' + data);
//		});
//
//		ls.stderr.on('data', function (data) {
//			console.log('stderr: ' + data);
//		});
//
//		ls.on('close', function (code) {
//			console.log('child process exited with code ' + code);
//		});
		console.log('grunt-install-compass ended!');

	});

};