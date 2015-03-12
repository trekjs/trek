'use strict';

var fs = require('fs');
var gulp = require('gulp');
var babel = require('gulp-babel');
var rc = JSON.parse(fs.readFileSync('.babelrc', 'utf8'));

gulp.task('default', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel(rc))
    .pipe(gulp.dest('lib'));
});