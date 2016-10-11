var gulp            = require('gulp');
var gutil           = require('gulp-util');
var concat          = require('gulp-concat');
var uglify          = require('gulp-uglify');
var less            = require('gulp-less');
var sourceMaps      = require('gulp-sourcemaps');
var imagemin        = require('gulp-imagemin');
var cleanCSS        = require('gulp-clean-css');
var browserSync     = require('browser-sync');
var autoprefixer    = require('gulp-autoprefixer');
var gulpSequence    = require('gulp-sequence').use(gulp);
var shell           = require('gulp-shell');
var plumber         = require('gulp-plumber');

var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

// BrowserSync Configuration
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: "./"
        },
        options: {
            reloadDelay: 250
        },
        notify: false
    });
});

//Keeping an eye on all HTML files
gulp.task('html', function() {
    //watch any and all HTML files and refresh when something changes
    return gulp.src('*.html')
        .pipe(plumber())
        .pipe(browserSync.reload({stream: true}))
        //catch errors
        .on('error', gutil.log);
});

// Compile Less
gulp.task('styles', function(){

    //Loads the initializer master LESS file, which will just be a file that imports everything
    return gulp.src('styles/less/init.less')
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber({
          errorHandler: function (err) {
            console.log(err);
            this.emit('end');
          }
        }))
        //get sourceMaps ready
        .pipe(sourceMaps.init())
        //include LESS and list every "include" folder
        .pipe(less({
              errLogToConsole: true,
              includePaths: [
                  'styles/less/'
              ]
        }))
        .pipe(autoprefixer({
           browsers: autoPrefixBrowserList,
           cascade:  true
        }))
        //catch errors
        .on('error', gutil.log)
        //the final filename of our combined css file
        .pipe(concat('styles.css'))
        //get our sources via sourceMaps
        .pipe(sourceMaps.write("../styles/"))
        //where to save our final, compressed css file
        .pipe(gulp.dest('styles'))
        //notify browserSync to refresh
        .pipe(browserSync.reload({stream: true}));
});


// Default Task
gulp.task('default', ['browserSync','styles'], function(){
	gulp.watch('styles/less/**/*.less', ['styles']);
    gulp.watch('*.html', ['html']);
});