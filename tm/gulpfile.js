var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    header = require('gulp-header');

gulp.task('default', function() {
  var concated = gulp.src([
    './src/default-settings/default-settings.js',
    './src/common-functions/common.js',
    './src/base-objects/i-object.js',
    './src/base-objects/i-loop-object_interval.js',
    './src/base-objects/i-loop-object.js',
    './src/base-objects/i-program.js',
    './src/managers/screen-manager/screen-manager_char.js',
    './src/managers/screen-manager/screen-manager.js',
    './src/managers/input-manager/input-manager_keyboard.js',
    './src/managers/input-manager/input-manager.js',
    './src/managers/debug-manager/debug-manager.js'
  ])
  .pipe(concat('text-game-maker-1.0.0.js'))
  .pipe(header(headerText))
  .pipe(gulp.dest('./dist'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify({
    compress: { drop_console: true }
  }))
  .pipe(header(headerText))
  .pipe(gulp.dest('./dist'));
});

var headerText = `/********************************************************/
/*                                                      */
/* Text Game Maker                                      */
/*                                                      */
/* https://github.com/a-mean-blogger/text-game-maker-js */
/*                                                      */
/********************************************************/

`;
