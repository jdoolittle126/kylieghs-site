const browserSync = require('browser-sync');
const nodemon = require('gulp-nodemon');
const { watch, series, src, dest, task } = require("gulp");
const postcss = require('gulp-postcss');
const nested  = require('postcss-nested');
const postimport = require('postcss-import');
const tailwindcss = require('tailwindcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

/*
    My gulp task(s) for automatically refreshing the browser
    when any views are changed, and restarting the server
    when serverside code is changed.
 */

const paths = {
    css: "./public/css/style.css",
    config: "./tailwind.config.js",
    dist: "./public/"
};

function processCSS() {
    console.log("Processing css...")
    return src(paths.css)
        .pipe(postcss([
            postimport(),
            tailwindcss('./tailwind.config.js'),
            nested( {
                bubble: ['screen']
            }),
            autoprefixer(),
            cssnano(),
        ], {syntax: require('postcss-scss')}))
        .pipe(dest(paths.dist))
}

task('nodemon', (callBack) => {
    let running = false;
    return nodemon({
        script: 'index.js',
        ignore: [
            'gulpfile.js',
            'node_modules/'
        ]
    }).on('start', () => {
        if (!running) {
            running = true;
            callBack();
        }
    });
});

task('browser-sync', series('nodemon', () => {
    browserSync.init({
        proxy: "http://localhost:3000",
        files: ['views/**/*', '/public/css/*.css', '/public/js/*.js'],
        port: 5000,
        notify: true,
        tunnel: true
    });
}));


watch(
    ['tailwind.config.js','/public/css/*.css','views/**/*'],
    series(processCSS)
);

task('default', series('browser-sync', () => {}));


