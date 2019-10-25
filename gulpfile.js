const gulp = require('gulp');
const babel = require('gulp-babel');
const shell = require('shelljs');

gulp.task('babel', function() {
  return gulp
    .src('build/dist/**/*.js', {base: 'build/dist/'})
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
        plugins: [
          '@babel/plugin-proposal-export-default-from',
          '@babel/plugin-proposal-export-namespace-from',
          '@babel/plugin-transform-arrow-functions'
        ]
      })
    )
    .pipe(gulp.dest('package/lib/'));
});

gulp.task('build', (done) => {
  shell.exec('gulp babel');
  done();
});
