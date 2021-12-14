// Определяем константы Gulp
const { src, dest, parallel, series, watch } = require('gulp');

// Подключаем Browsersync
const browserSync = require('browser-sync').create();

// Подключаем gulp-concat
const concat = require('gulp-concat');

// Подключаем gulp-uglify-es
const uglify = require('gulp-uglify-es').default;

// Подключаем модули gulp-scss
const scss = require('gulp-sass')(require('sass'));

// Подключаем Autoprefixer
const autoprefixer = require('gulp-autoprefixer');

// Подключаем модуль gulp-clean-css
const cleancss = require('gulp-clean-css');

// Подключаем sourcemaps
const sourcemaps = require('gulp-sourcemaps');

// Подключаем модуль del
const del = require('del');

//убираем лишнее в css
// const purgecss = require('gulp-purgecss');

/************************/

// Определяем логику работы Browsersync
function browsersync() {
	browserSync.init({ // Инициализация Browsersync
		server: { baseDir: 'src/' }, // Указываем папку сервера
		notify: false, // Отключаем уведомления
		online: true // Режим работы: true или false
	})
}

function scripts() {
	return src([ // Берем файлы из источников
		//'node_modules/jquery/dist/jquery.min.js', // Пример подключения библиотеки
		'src/js/app.js', // Пользовательские скрипты, использующие библиотеку, должны быть подключены в конце
		])
	.pipe(concat('app.min.js')) // Конкатенируем в один файл
	.pipe(uglify()) // Сжимаем JavaScript
	.pipe(dest('src/js/')) // Выгружаем готовый файл в папку назначения
	.pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

function startwatch() {

	// Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
	watch(['src/**/*.js', '!app/**/*.min.js'], scripts);

    // Мониторим файлы препроцессора на изменения
	watch('src/**/scss/**/*', styles);

    // Мониторим файлы HTML на изменения
	watch('src/**/*.html').on('change', browserSync.reload);

}

/* работа со стилями*/
function styles() {
	return src('src/scss/*.scss')
    .pipe(scss())
    .pipe(sourcemaps.init())
	.pipe(concat('snood.min.css')) // Конкатенируем в файл snood.min.css
	.pipe(autoprefixer({overrideBrowserslist: ['last 2 versions', '>5%', 'not IE 11']})) // Создадим префиксы с помощью Autoprefixer
	.pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } )) // Минифицируем стили
    .pipe(sourcemaps.write('.'))
	.pipe(dest('src/css/')) // Выгрузим результат в папку "src/css/"
	.pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

/* очистка стилей от неиспользуемого кода*/
// function purgestyles() {
// 	return src('src/css/*.css')
// 	  .pipe(purgecss({content: ['src/**/*.html']}))
// 	  .pipe(dest('src/css/purge'))
// }

function buildcopy() {
	return src([ // Выбираем нужные файлы
		'src/css/**/*.min.css',
		'src/js/**/*.min.js',
		//'src/images/dest/**/*',
		'src/**/*.html',
		], { base: 'src' }) // Параметр "base" сохраняет структуру проекта при копировании
	.pipe(dest('dist')) // Выгружаем в папку с финальной сборкой
}

function cleandist() {
	return del('dist/**/*', { force: true }) // Удаляем все содержимое папки "dist/"
}

/************************/

// Экспортируем функцию browsersync() как таск browsersync. Значение после знака = это имеющаяся функция.
exports.browsersync = browsersync;

// Экспортируем функцию scripts() в таск scripts
exports.scripts = scripts;

// Экспортируем функцию styles() в таск styles
exports.styles = styles;

// Экспортируем дефолтный таск с нужным набором функций
exports.default = parallel(styles, scripts, browsersync, startwatch);

// Создаем новый таск "build", который последовательно выполняет нужные операции
exports.build = series(cleandist, styles, scripts, buildcopy);
