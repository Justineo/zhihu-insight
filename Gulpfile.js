var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var del = require('del');
var exec = require('child_process').exec;
var replace = require('gulp-replace');
var concat = require('gulp-concat');
var pack = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf8' }));
var version = pack.version;

gulp.task('cp', function () {
  return gulp.src(['./src/insight.js', './assets/logo.png'])
    .pipe(gulp.dest('./extensions/chrome'))
    .pipe(gulp.dest('./extensions/firefox/data'));
});

gulp.task('userscript', function () {
  return gulp.src([
      './userscript/src/metadata.js',
      './src/insight.js'
    ])
    .pipe(concat('zhihu-insight.user.js'))
    .pipe(replace('{{version}}', version))
    .pipe(gulp.dest('./userscript/dist'));
});

gulp.task('chrome:zip', ['cp'], function (cb) {
  var manifestPath = './extensions/chrome/manifest.json';
  var manifest = JSON.parse(fs.readFileSync(manifestPath, { encoding: 'utf8' }));
  manifest.version = version;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, '  '));
  exec(
    'find . -path \'*/.*\' -prune -o -type f -print | zip ../packed/zhihu-insight.zip -@',
    { cwd: 'extensions/chrome' },
    function (error, stdout, stderr) {
      if (error) {
        return cb(error);
      } else {
        cb();
      }
    }
  );
});

gulp.task('firefox:xpi', ['cp'], function (cb) {
  var fxPackPath = './extensions/firefox/package.json';
  var fxPack = JSON.parse(fs.readFileSync(fxPackPath, { encoding: 'utf8' }));
  fxPack.version = version;
  fs.writeFileSync(fxPackPath, JSON.stringify(fxPack, null, '  '));
  exec('jpm xpi', {
    cwd: 'extensions/firefox'
  }, function (error, stdout, stderr) {
    if (error) {
      return cb(error);
    } else {
      fs.renameSync('./extensions/firefox/@' + pack.name + '-' + version + '.xpi', './extensions/packed/' + pack.name + '.xpi');
      cb();
    }
  });
});

gulp.task('opera:nex', ['chrome:zip'], function (cb) {
  exec(''
    + '"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"'
    + ' --pack-extension=' + path.join(__dirname, 'extensions/chrome')
    + ' --pack-extension-key=' + path.join(process.env.HOME, '.ssh/chrome.pem'),
    function (error, stdout, stderr) {
      if (error) {
        return cb(error);
      } else {
        fs.renameSync('./extensions/chrome.crx', './extensions/packed/zhihu-insight.nex');
        cb();
      }
    }
  );
});

gulp.task('extensions', ['chrome:zip', 'firefox:xpi', 'opera:nex']);
gulp.task('default', ['extensions', 'userscript']);
