var gulp = require('gulp'),                      // Gulp JS
    concat = require('gulp-concat'),             // Concat filse
    imagemin = require('gulp-imagemin'),         // Minify images
    uglify = require('gulp-uglify'),             // Minify JS
    include = require('gulp-include'),           // HTML Templates
    csso = require('gulp-csso'),                 // Minify CSS
    autoprefixer = require('gulp-autoprefixer'), // Gulp autoprefixer
    copy2 = require('gulp-copy2'),               // Copy files
	sass = require("gulp-sass"),                 // Sass compiler
    rename = require("gulp-rename"),             // Rename files
	fileinclude = require('gulp-file-include'), // File Include
	sourcemaps = require("gulp-sourcemaps"),     // Add sourcemaps
	del = require("del"),                        // Clean folder

	browserSync = require('browser-sync').create(); // Browser reload on changes

/*---------------------------------------------------------------------------------*/
/*----------------------------------- COPY ----------------------------------------*/
/*---------------------------------------------------------------------------------*/
gulp.task('copy', function () {
    var paths = [
        {src: 'bower_components/jquery/dist/jquery.min.js', dest: 'dist/js/'},
        {src: 'bower_components/bootstrap/dist/js/bootstrap.min.js', dest: 'dist/js/'},
        {src: 'bower_components/bootstrap/dist/fonts/*.*', dest: 'dist/fonts/'},
        {src: 'src/fonts/**/*.*', dest: 'dist/fonts/'},
		{src: 'src/*.ico', dest: 'dist/'}
		//{src: '
	    // bower_components/fontawesome/fonts/*.*', dest: 'dist/fonts/'}
    ];
    return copy2(paths);
});
/*---------------------------------------------------------------------------------*/
/*--------------------------------- CONCAT JS -------------------------------------*/
/*---------------------------------------------------------------------------------*/
gulp.task('concatJs', function() {
    return gulp.src([   //'bower_components/owl-carousel2/dist/owl.carousel.min.js',
                        //'bower_components/jquery-circle-progress/dist/circle-progress.min.js',
                        //'src/libs/appear-js/jquery.appear.js',
                        //'bower_components/slick-carousel/slick/slick.min.js',
					    //'bower_components/jquery.easing/js/jquery.easing.min.js',
					    //'bower_components/parallax.js/parallax.min.js',
					    //'bower_components/wow/dist/wow.min.js',
					    //'bower_components/jQuery-Mask-Plugin/dist/jquery.mask.min.js',
					    //'bower_components/fotorama/fotorama.js',
					    //'bower_components/isotope/dist/isotope.pkgd.min.js',
					    //'bower_components/fancybox/source/jquery.fancybox.js',
					    //'bower_components/fancybox/source/jquery.fancybox.pack.js'
					    //
    ])
        .pipe(concat('plugins.js'))
        .pipe(gulp.dest('src/js/'));
});
/*---------------------------------------------------------------------------------*/
/*-------------------------------- COMPRESS JS ------------------------------------*/
/*---------------------------------------------------------------------------------*/
gulp.task('compressJs', function() {
    gulp.src('src/js/*.*')
        .pipe(uglify())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest('dist/js/'));
});
/*---------------------------------------------------------------------------------*/
/*------------------------------ COMPRESS IMAGES ----------------------------------*/
/*---------------------------------------------------------------------------------*/
gulp.task('compressImages', function(){
	gulp.src('src/img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'))
});
/*---------------------------------------------------------------------------------*/
/*----------------------------- CSS PREPROCESSORS ---------------------------------*/
/*---------------------------------------------------------------------------------*/
gulp.task('cssPreprocessor', function() {
    return gulp.src(['src/scss/bootstrap.scss',
					 'src/scss/style.scss',
					 'src/scss/plugins.scss'])
	    .pipe(sourcemaps.init())
	    .pipe(sass())
        .pipe(autoprefixer({browsers: ['last 15 versions']}))
		.pipe(csso())
		.pipe(rename({suffix: ".min"}))
	    .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css'))
	    .pipe(browserSync.reload ({
		    stream: true
	    }))
});

/*---------------------------------------------------------------------------------*/
/*------------------------------- HTML INCLUDES RELOAD ----------------------------*/
/*---------------------------------------------------------------------------------*/
gulp.task("includes", function() {
    gulp.src('src/*.html')
        .pipe(include())
        .pipe(gulp.dest("dist/"))
	    .pipe(browserSync.reload({
	    	stream:true
	    }));
});

/*---------------------------------------------------------------------------------*/
/*------------------------------- FILE INCLUDES -----------------------------------*/
/*---------------------------------------------------------------------------------*/
gulp.task('fileinclude', function() {
	gulp.src(['src/*.html', 'src/**/*.html'])
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.reload ({
			stream: true
		}));
});

/*---------------------------------------------------------------------------------*/
/*------------------------------- SERVER RELOAD -----------------------------------*/
/*---------------------------------------------------------------------------------*/
gulp.task("browserSync", function () {
	browserSync.init({
		server: {
			baseDir: "dist/"
		}
	})
});

/*---------------------------------------------------------------------------------*/
/*------------------------------- CLEAN DIST FOLDER -------------------------------*/
/*---------------------------------------------------------------------------------*/
gulp.task("clean:dist", function () {
	return del.sync(['dist/**/*']);
});

/*---------------------------------------------------------------------------------*/
/*---------------------------------- DEFAULT --------------------------------------*/
/*---------------------------------------------------------------------------------*/
gulp.task("watch",['browserSync', 'includes', 'fileinclude','copy', 'concatJs', 'compressJs', 'cssPreprocessor'], function(){
	gulp.watch("src/scss/**/*.scss", ["cssPreprocessor"]);
	gulp.watch("src/**/*.html", browserSync.reload);
	gulp.watch("src/js/*.js", ["compressJs"]);
	gulp.watch("src/**/*.html", ["fileinclude"]);

});

gulp.task("mainTask", function () {
	gulp.run('cssPreprocessor', 'fileinclude', 'browserSync', 'watch');
});

gulp.task('default', function(){
	gulp.run('browserSync','copy', 'concatJs', 'compressJs', 'compressImages', 'cssPreprocessor', 'includes',  'fileinclude');

	// Watch
});
