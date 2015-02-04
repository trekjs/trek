'use strict';

var gulp = require('gulp');
var to5 = require('gulp-6to5');

gulp.task('default', function () {
 return gulp.src('src/**/*.js')
   .pipe(to5({
     experimental: true,
     playground: true,
     blacklist: ['regenerator', 'es6.templateLiterals']
   }))
  .pipe(gulp.dest('lib'));
});