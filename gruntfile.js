module.exports = function(grunt) {
	
	grunt.initConfig({
		browserify: {
			default: {
				src: 'browser.js',
				dest: 'compiled.js'
			}
		},
		uglify: {
			default: {
				src: 'compiled.js',
				dest: 'compiled.js'
			}
		}
	})

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('default', ['browserify', 'uglify']);
}