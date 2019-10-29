const gulp = require('gulp');
const babel = require('gulp-babel');
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.resolve(__dirname, './package.json'));
let packageJson = JSON.parse(content);

gulp.task('build-babel', function() {
  return gulp
    .src('build/dist/**/*.js', {base: 'build/dist/'})
    .pipe(
      babel({
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: [
          '@babel/plugin-proposal-export-default-from',
          '@babel/plugin-proposal-export-namespace-from',
          '@babel/plugin-transform-arrow-functions'
        ]
      })
    )
    .pipe(gulp.dest('package/lib/'));
});
gulp.task('copy-index', function() {
  return gulp.src(['./*.js', './*.ts']).pipe(gulp.dest('package/'));
});

gulp.task('copy-builder', function() {
  return gulp.src(['builder/**/*'], {base: '.'}).pipe(gulp.dest('package/'));
});

gulp.task('copy-style', function() {
  return gulp
    .src(['src/style/**/*'], {base: 'src/'})
    .pipe(gulp.dest('package/src/'));
});

gulp.task('copy-es', function() {
  return gulp
    .src(['./build/dist/**/*.js', './build/dist/**/*.ts'])
    .pipe(gulp.dest('package/src/'));
});

gulp.task('copy-readme', function() {
  return gulp.src(['./README.md', './LICENSE']).pipe(gulp.dest('package/'));
});

gulp.task('copy-package', function(done) {
  delete packageJson.scripts;
  packageJson.engines = {
    node: '>=8'
  };
  fs.writeFileSync(
    path.resolve(__dirname, './package/package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  done();
});

gulp.task('build', (done) => {
  shell.exec('gulp build-babel');
  shell.exec('gulp copy-es');
  shell.exec('gulp copy-index');
  shell.exec('gulp copy-style');
  shell.exec('gulp copy-builder');
  shell.exec('gulp copy-readme');
  shell.exec('gulp copy-package');
  done();
});
