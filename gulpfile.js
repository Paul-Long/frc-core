const gulp = require('gulp');
const babel = require('gulp-babel');
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.resolve(__dirname, './package.json'));
let packageJson = JSON.parse(content);
gulp.task('babel', function() {
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
gulp.task('files', function() {
  gulp.src(['./*.js', './*.ts']).pipe(gulp.dest('package/'));
});

gulp.task('es', function() {
  gulp
    .src(['./build/dist/**/*.js', './build/dist/**/*.ts'])
    .pipe(gulp.dest('package/src/'));
});

gulp.task('readme', function() {
  return gulp.src(['./README.md', './LICENSE']).pipe(gulp.dest('package/'));
});

gulp.task('package', function() {
  delete packageJson.scripts;
  packageJson.engines = {
    node: '>=8'
  };
  fs.writeFileSync(
    path.resolve(__dirname, './package/package.json'),
    JSON.stringify(packageJson, null, 2)
  );
});

gulp.task('build', (done) => {
  shell.exec('gulp babel');
  shell.exec('gulp es');
  shell.exec('gulp files');
  shell.exec('gulp readme');
  shell.exec('gulp package');
  done();
});
