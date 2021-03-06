  const { src, dest, parallel, series, watch } = require('gulp');

const gulp         = require('gulp');
const sass         = require('gulp-sass');
const plumber      = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const browserSync  = require('browser-sync').create();
const sourceMaps   = require('gulp-sourcemaps');
const imagemin     = require("gulp-imagemin");
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const pngquant     = require('imagemin-pngquant');
const run          = require("run-sequence");
const del          = require("del");
const svgSprite    = require('gulp-svg-sprite');
const svgmin       = require('gulp-svgmin');
const cheerio      = require('gulp-cheerio');
const replace      = require('gulp-replace');
const newer        = require('gulp-newer');



function prepsass(){
  return src('scss/style.scss')
      .pipe(plumber())
      .pipe(sourceMaps.init())
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(sourceMaps.write())
      .pipe(dest('build/css'))
      .pipe(browserSync.stream());
}

function h_tml(){
  return src('*.html')
      .pipe(dest('build'))
      .pipe(browserSync.stream());
}

function js(){
  return src(['js/**/*.js'])
      .pipe(dest('build/js'))
      .pipe(browserSync.stream())
}

function c_ss(){
  return src('css/**/*.css')
      .pipe(dest('build/css'))
      .pipe(browserSync.stream());
}

function serve(){
  browserSync.init({
    server: {baseDir: 'build'},
    notify: false,
    online: true
  })
}

function allimg(){
  return src('images/**/*.{png,jpg}')
      .pipe(newer('build/img'))
      .pipe(imagemin())
      .pipe(dest('build/img'))
      .pipe(browserSync.stream());
}

function images(){
   return src('build/img/**/*.{png,jpg}')
      .pipe(imagemin([
          imagemin.mozjpeg({progressive: true}),
          imageminJpegRecompress({
            loops: 5,
            min: 65,
            max: 70,
            quality: 'medium'
          }),
          imagemin.optipng({optimizationLevel: 3}),
          pngquant({quality: [0.65, 0.7], speed: 5})
          ]))
      .pipe(dest('build/img'));
}

function svg(){
  return src('images/**/*.svg')
      .pipe(svgmin({
        js2svg: {
          pretty: true
        }
      }))
      .pipe(cheerio({
        run: function ($) {
          $('[fill]').removeAttr('fill');
          $('[stroke]').removeAttr('stroke');
          $('[style]').removeAttr('style');
        },
        parserOptions: {xmlMode: true}
      }))
      .pipe(replace('&gt;', '>'))
      // build svg sprite
      .pipe(svgSprite({
        mode: {
          symbol: {
            sprite: "sprite.svg"
          }
        }
      }))
      .pipe(dest('build/img'));
}



function startwatch(){
  watch(['js/**/*.js'], js);
  watch('css/**/*.css',c_ss);
  watch('scss/**/*.scss', prepsass);
  watch('*.html', h_tml);
  watch('images/**/*.{png,jpg}', allimg);
  watch('images/**/*.svg', svg);
}

exports.serve     = serve;
exports.js        = js;
exports.c_ss      = c_ss;
exports.prepsass  = prepsass;
exports.allimg    = allimg;
exports.images    = images;
exports.svg       = svg;
exports.h_tml     = h_tml;
exports.default   = parallel(prepsass, js, serve, startwatch);

//============================================

//gulp.task('svg', function () {
  //return gulp.src('img/**/*.svg')
      /*.pipe(svgmin({
        js2svg: {
          pretty: true
        }
      }))
      .pipe(cheerio({
        run: function ($) {
          $('[fill]').removeAttr('fill');
          $('[stroke]').removeAttr('stroke');
          $('[style]').removeAttr('style');
        },
        parserOptions: {xmlMode: true}
      }))
      .pipe(replace('&gt;', '>'))
      // build svg sprite
      .pipe(svgSprite({
        mode: {
          symbol: {
            sprite: "sprite.svg"
          }
        }
      }))
      .pipe(gulp.dest('build/img'));
});

gulp.task('serve', function () {
  browserSync.init({
    server: "build"
  });*/
 //gulp.watch("img/**/*.{svg}", ["svg"]);
//});

//gulp.task('copy', function () {
 // return gulp.src([
     // 'img/**',
     // 'js/**',
     // 'css/**',
     // '*.html'
 /* ], {
    base: '.'
  })
      .pipe(gulp.dest('build'));

});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('build', function (fn) {
  run(
    'clean',
    'copy',
    'sass',
    'images',
    'svg',
    fn
  );
});*/