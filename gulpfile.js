'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('default', function () {
 return gulp.src('src/**/*.js')
   .pipe(babel({
     experimental: true,
     playground: true,
     blacklist: ['regenerator', 'es6.constants', 'es6.templateLiterals']
   }))
  .pipe(gulp.dest('lib'));
});
