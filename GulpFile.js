// Sass configuration

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
  gulp.src('./Scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./Css/', function(f) {
            return f.base;
        }));
});

gulp.task('default', ['sass'], function () {
  gulp.watch('./Scss/**/*.scss', ['sass']);
});