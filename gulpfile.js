const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require("cssnano");
const autoprefixer = require("autoprefixer");
const concat = require("gulp-concat");
const njk = require('gulp-render-nunjucks');
const postcss = require("gulp-postcss");
const replace = require("gulp-replace");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const clean = require("gulp-clean");
const sequence = require("gulp-sequence");


gulp.task('sassTask', function () {
    return gulp.src('./src/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(concat('styles.css'))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css/'));
})

gulp.task('nunjucksTask', function () {
    return gulp.src(['./src/**/*.+(njk)'])
        .pipe(njk.render())
        .pipe(rename({
            extname: '.html'
        }))
        .pipe(gulp.dest('./dist'));
})

const btstring = new Date().getTime();
gulp.task('cacheTask', function () {
    return gulp.src('./dist/index.html')
        .pipe(replace(/bt=\d+/g, 'bt' + btstring))
        .pipe(gulp.dest('./dist'));
})


gulp.task('renameTask', function () {
    return (gulp.src('./dist/masterpage.html'))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./dist'))
})

gulp.task('cleanTask', function () {
    return (gulp.src('./dist/index.html', {
            read: false
        }))
        .pipe(clean());
})

gulp.task('run', sequence('nunjucksTask', 'renameTask', ['cleanTask', 'sassTask', 'chacheTask']));