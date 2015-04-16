var gulp = require('gulp')
    , jade = require('gulp-jade')
    , coffee = require('gulp-coffee')
    , stylus = require('gulp-stylus')
    , imagemin = require('gulp-imagemin')
    , del = require('del')
    , pngquant = require('imagemin-pngquant')
    , svgo = require('imagemin-svgo')
    , order = require("gulp-order")
    , autoprefixer = require('gulp-autoprefixer')
    , concat = require('gulp-concat')
    , deploy = require('gulp-gh-pages')
    , find = require('find')
    , path = require('path')
    , iconfont = require('gulp-iconfont')
    , gulpif = require('gulp-if')
    , dirs = {
      'source': {
        'jade': './source/jade/**/*.jade'
        , 'list': './source/list/index.jade'
        , 'copy': './source/copy/**/*'
        , 'coffee': './source/coffee/**/*.coffee'
        , 'js': './source/js/**/*.js'
        , 'stylus': './source/stylus/**/*.styl'
        , 'css': './source/css/*.css'
        , 'svg': './source/svg/**/*.svg'
        , 'images': './source/images/**/*'
        , 'fonts': './source/fonts/*'
        , 'svg4font': './source/svg4font/*.svg'
        , 'svg4font_source': './source/svg4font-source/*.svg'
        , 'svg4font_tmp': './source/svg4font/'
      }
      , 'build': {
        'html': './build/'
        , 'js': './build/js/'
        , 'css': './build/css/'
        , 'images': './build/images/'
        , 'svg': './build/svg/'
        , 'fonts': './build/fonts/'
      }
    };

gulp.task('list', function () {
  gulp.src(dirs.source.copy).pipe(gulp.dest(dirs.build.html));
  find.file(/\.html$/, dirs.build.html, function (files){
    var names = []
        , file;
    for(var i=0; i<files.length; i++){
      file = files[i];
      if(file.indexOf('index.html')>-1 || (file.match(/\//g) || []).length>1){
        continue;
      }
      names.push(path.basename(file))
    }
    gulp.src(dirs.source.list)
      .pipe(jade({
        pretty: true
        , locals: {'pages': names}
        }))
      .pipe(gulp.dest(dirs.build.html));
  });
});

gulp.task('images', function () {
  return gulp.src(dirs.source.images)
          .pipe(gulpif(/[.](png|jpeg|jpg|svg)$/, imagemin({
              progressive: true,
              svgoPlugins: [{removeViewBox: false}],
              use: [pngquant()]
            })
          ))
          .pipe(gulp.dest(dirs.build.images));
});

gulp.task('svg', function () {
  return gulp.src(dirs.source.svg)
          .pipe(imagemin({
              progressive: true,
              svgoPlugins: [{removeViewBox: false}],
              use: [pngquant()]
            }))
          .pipe(gulp.dest(dirs.build.svg));
});

gulp.task('copyfonts', function() {
  del.sync([dirs.source.svg4font]);
  return gulp.src(dirs.source.svg4font_source).pipe(gulp.dest(dirs.source.svg4font_tmp));
});

gulp.task('iconfont', ['copyfonts'], function(){
  gulp.src(dirs.source.svg4font)
    .pipe(iconfont({
      fontName: 'icon',
      appendCodepoints: true
    }))
    .on('codepoints', function(codepoints) {
      console.log(codepoints);
    })
    .pipe(gulp.dest(dirs.build.fonts));
});

gulp.task('fonts', function() {
  return gulp.src(dirs.source.fonts)
    .pipe(gulp.dest(dirs.build.fonts));
});

gulp.task('html', function() {
  return gulp.src(dirs.source.jade)
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest(dirs.build.html));
});

gulp.task('js', function() {
  return gulp.src([dirs.source.coffee, dirs.source.js])
    .pipe(gulpif(/[.]coffee$/, coffee({bare: true})))
    .pipe(order(['currency/currency.js']))
    .pipe(concat("scripts.js"))
    .pipe(gulp.dest(dirs.build.js));
});

gulp.task('css', function() {
  return gulp.src([dirs.source.stylus, dirs.source.css])
    .pipe(stylus())
    .pipe(order(['fonts.css', 'reset.css']))
    .pipe(concat("styles.css"))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(dirs.build.css));
});

gulp.task('deploy', function () {
  console.log('deploying');
  return gulp.src('build/**')
          .pipe(deploy({
            cacheDir:   'gh-cache',
            remoteUrl:  'git@github.com:SilentImp/VacayKit.git'
          }).on('error', function(){
            console.log('error', arguments);
          }));
});


gulp.task('watch', function () {
  gulp.watch([dirs.source.stylus, dirs.source.css], ['css']);
  gulp.watch(dirs.source.jade, ['html']);
  gulp.watch(dirs.source.coffee, ['js']);
});

gulp.task('default', ['html', 'css', 'js', 'list', 'images', 'svg']);
