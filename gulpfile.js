var gulp = require('gulp'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
bower = require('gulp-bower');

var files = [
    'src/utils/module-open.js',
    'src/Translator.js',
    'src/parsers/Parsers.js',
    'src/parsers/Parsers.Base.js',
    'src/parsers/Parsers.MoParser.js',
    'src/parsers/Parsers.PoParser.js',
    'src/providers/Providers.js',
    'src/providers/Providers.Base.js',
    'src/providers/Providers.String.js',
    'src/providers/Providers.Ajax.js',
    'src/providers/Providers.Link.js',
    'src/translations/Translation.js',
    'src/translations/TranslationCollection.js',
    'src/translations/DomainCollection.js',
    'bower_components/sprintf.js/src/sprintf.js',
    'bower_components/jdataview/dist/browser/jdataview.js',
    'src/utils/module-close.js'
];

gulp.task('build', function() {
    bower();
    gulp.src(files, {'base': 'src'})
        .pipe(concat('gettext.js'))
        .pipe(gulp.dest('./dist'));
    gulp.src('dist/gettext.js')
        .pipe(uglify())
        .pipe(concat('gettext.min.js'))
        .pipe(gulp.dest('./dist'));
});
gulp.task('default', ['build']);