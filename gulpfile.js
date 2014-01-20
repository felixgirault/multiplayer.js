var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var coffee = require( 'gulp-coffee' );
var define = require( 'gulp-wrap-define' );
var concat = require( 'gulp-concat' );
var rename = require( 'gulp-rename' );
var uglify = require( 'gulp-uglify' );



/**
 *
 */

var build = function( name, stream ) {
	return stream
		.pipe( concat( name + '.js' ))
		.pipe( gulp.dest( './dist/' ))
		.pipe( rename( name + '.min.js' ))
		.pipe( uglify( ))
		.pipe( gulp.dest( './dist' ));
}



/**
 *
 */

gulp.task( 'watch', function( ) {
	gulp.watch([ './lib/*.coffee', './lib/**/*.coffee' ], function( ) {
		gulp.run( 'default' );
	});
});

gulp.task( 'default', function( ) {
	build( 'vendors', gulp.src([
		'./vendors/commonjs-require-definition/require.js',
		'./vendors/q/q.js',
		'./vendors/swfobject-umd/swfobject/src/swfobject.js'
	]));

	build( 'multiplayer', gulp.src([ './lib/*.coffee', './lib/**/*.coffee' ])
		.pipe( coffee({
			bare: true
		}))
		.on( 'error', gutil.log )
		.pipe( define({
			root: './lib',
			define: 'require.register'
		}))
	);

	build( 'multiplayer.full', gulp.src([
		'./dist/vendors.js',
		'./dist/multiplayer.js'
	]));
});

