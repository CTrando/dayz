const gulp = require('gulp');
const babel = require('gulp-babel');

const util = require('gulp-util');
const // https://github.com/gulpjs/gulp-util
    sass = require('gulp-sass');
const // https://www.npmjs.org/package/gulp-sass
    autoprefixer = require('gulp-autoprefixer');
const // https://www.npmjs.org/package/gulp-autoprefixer
    minifycss = require('gulp-minify-css');
const // https://www.npmjs.org/package/gulp-minify-css
    rename = require('gulp-rename');// https://www.npmjs.org/package/gulp-rename


gulp.task('default', () => {
    gulp.src('./src/**')
        .pipe(babel())
        .pipe(gulp.dest('./lib'));
    return gulp.src('./dayz.scss')
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer('last 3 version', 'safari 5', 'ie 8', 'ie 9'))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'));
});
