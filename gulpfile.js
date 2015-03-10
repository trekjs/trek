'use strict';

const fs = require('fs');
const gulp = require('gulp');
const babel = require('gulp-babel');
const rc = JSON.parse(fs.readFileSync('.babelrc', 'utf8'));

gulp.task('default', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel(rc))
    .pipe(gulp.dest('lib'));
});