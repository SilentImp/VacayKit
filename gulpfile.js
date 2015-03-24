var gulp = require('gulp')
    , jade = require('gulp-jade')
    , coffee = require('gulp-coffee')
    , stylus = require('gulp-stylus')
    , order = require("gulp-order")
    , autoprefixer = require('gulp-autoprefixer')
    , concatCss = require('gulp-concat-css')
    , ghpages = require('gh-pages')
    , find = require('find')
    , path = require('path')
    , dirs = {
      'source': {
        'jade': './source/jade/**/*.jade'
        , 'list': './source/list/index.jade'
        , 'coffee': './source/coffee/**/*.coffee'
        , 'stylus': './source/stylus/**/*.styl'
        , 'css': './source/css/*.css'
        , 'svg': './source/svg/*.svg'
        , 'images': './source/images/*'
      }
      , 'build': {
        'html': './build/'
        , 'js': './build/js/'
        , 'css': './build/css/'
        , 'images': './build/images/'
        , 'svg': './build/svg/'
      }
    };

gulp.task('list', function () {
  find.file(/\.html$/, dirs.build.html, function (files){
    var names = []
        , file;
    for(var i=0; i<files.length; i++){
      file = files[i];
      if(file.indexOf('index.html')>-1){
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

gulp.task('html', function() {
  gulp.src(dirs.source.jade)
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest(dirs.build.html))
});

gulp.task('js', function() {
  gulp.src(dirs.source.coffee)
    .pipe(coffee({bare: true}))
    .pipe(gulp.dest(dirs.build.js))
});

gulp.task('css', function() {
  gulp.src([dirs.source.stylus, dirs.source.css])
    .pipe(stylus())
    .pipe(order(['reset.css']))
    .pipe(concatCss("styles.css"))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(dirs.build.css))
});

gulp.task('deploy', function () {
  console.log('deploying');
  return gulp.src('production/**')
          .pipe(deploy({
            cacheDir:   'gh-cache',
            remoteUrl:  'git@github.com:SilentImp/VacayKit.git'
          }).on('error', function(){
            console.log('error', arguments);
          }));
});
