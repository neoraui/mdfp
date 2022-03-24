const { src, dest, watch, series } = require('gulp')
const scss = require('gulp-sass')(require('sass'))
const prefixer = require('gulp-autoprefixer')
const cssmin = require('gulp-clean-css')
const terser = require('gulp-terser')
const browsersync = require('browser-sync').create()


function sass() {
    return src('./frontend/src/styles/**/*.scss')
        .pipe(scss())
        .pipe(prefixer('last 2 versions'))
        .pipe(cssmin())
        .pipe(dest('./frontend/dist/styles/'))
}

function sass_forsc() {
    return src('./frontend/src/styles/**/*.scss')
        .pipe(scss())
        .pipe(prefixer('last 2 versions'))
        .pipe(dest('./frontend/sitecore/styles/'))
}

function sass_forsc_min() {
    return src('./frontend/src/styles/**/*.scss')
        .pipe(scss())
        .pipe(prefixer('last 2 versions'))
        .pipe(cssmin())
        .pipe(dest('./frontend/sitecore_min'))
}

function scripts() {
    return src('./frontend/src/scripts/**/*.js')
    .pipe(terser())
    .pipe(dest('./frontend/dist/scripts/'))
}

function scripts_forsc() {
    return src('./frontend/src/scripts/**/*.js')
        .pipe(dest('./frontend/sitecore/scripts/'))
}

function scripts_forsc_min() {
    return src('./frontend/src/scripts/**/*.js')
        .pipe(terser())
        .pipe(dest('./frontend/sitecore_min'))
}

function html_forsc() {
    return src('./index.html')
        .pipe(dest('./frontend/sitecore/'))
}

function browsersyncServe(cb) {
    browsersync.init({ server: { baseDir: '.' }})
    cb()
}

function browsersyncReload(cb) {
    browsersync.reload()
    cb()
}

function watchTask() {
    watch('*.html', browsersyncReload)
    watch([
        './frontend/src/styles/**/*.scss',
        './frontend/src/scripts/**/*.js'], 
        series(
            // styles
            sass,
            sass_forsc,
            sass_forsc_min,
            // scripts
            scripts,
            scripts_forsc,
            scripts_forsc_min,
            // markup
            html_forsc,
            // broswersync
            browsersyncReload
        ))
}

exports.default = series(
    sass, 
    sass_forsc,
    sass_forsc_min,
    scripts,
    scripts_forsc,
    scripts_forsc_min,
    html_forsc,
    browsersyncServe,
    watchTask
);