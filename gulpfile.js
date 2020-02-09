const gulp = require('gulp');
const {src, dest, series} = gulp;
const touch = require('gulp-touch-fd');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const exec = require('child_process').exec;

const theme = 'dawn';
const current = '0.9.0';
const next = '1.0.0';
const root = '/Users/sodbileg/Developer/ghost-themes';
const final = '/Users/sodbileg/Dropbox/IVEEL/Dawn';

function css() {
  return src('assets/less/screen.less')
    .pipe(less())
    .pipe(autoprefixer({
      overrideBrowserslist: ['>0.25%'],
      cascade: false,
    }))
    .pipe(dest('assets/css'))
    .pipe(touch());
}

function js() {
  return src([
    'assets/js/vendor/*',
    'assets/js/main.js'])
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(dest('assets/js'))
    .pipe(touch());
}

function watch() {
  gulp.watch('assets/less/**/*', css);
  gulp.watch('assets/js/main.js', js);
}

function deploy(done) {
  exec('rsync -avz --delete --rsync-path="sudo rsync" --exclude "partials/customize" --exclude "node_modules" --exclude "gulpfile.js" --exclude "package-lock.json" --exclude ".git" --exclude ".gitignore" --exclude ".DS_Store" ' + root + '/content/themes/' + theme + '/ aws:/home/ubuntu/ghost-themes/' + theme + '/content/themes/' + theme + '/', function (err, stdout, stderr) {
    console.log(stdout);
  });
  done();
}

function prepare(done) {
  exec(
    'rsync -avz --delete --exclude "assets/js/vendor" --exclude "assets/js/main.js" --exclude "assets/less" --exclude ".git" --exclude ".gitignore" --exclude "node_modules" --exclude "gulpfile.js" --exclude "package-lock.json" ' + root + '/content/themes/' + theme + '/ ' + final + '/' + theme + '/ && ' +
    'cd ' + final + ' && ' +
    'zip -r -X ' + theme + '.zip ' + theme + ' -x "*.DS_Store" -x "*.gitignore" -x "*.travis.yml" -x "*.tx" -x "*.git" -x "*.svn" && ' +
    'cp ' + theme + '.zip ' + theme + '-*/upload && ' +
    'cp -r ' + theme + '-' + current + ' ' + theme + '-' + next + ' && ' +
    'zip -r -X ' + theme + '-' + next + '.zip ' + theme + '-' + next + ' -x "*.DS_Store" -x "*.gitignore" -x "*.travis.yml" -x "*.tx" -x "*.git" -x "*.svn" && ' +
    'rm ' + theme + '.zip ' + '&& rm -r ' + theme + '&& rm -r ' + theme + '-' + current
  );
  done();
}

exports.default = series(css, js, watch);
exports.deploy = deploy;
exports.prepare = prepare;