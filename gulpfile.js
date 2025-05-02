// VARIABLES & PATHS
let preprocessor = "scss", // Preprocessor (sass, scss, less, styl),
  preprocessorOn = false,
  fileswatch = "html,htm", // List of files extensions for watching & hard reload (comma separated)
  imageswatch = "jpg,jpeg,png,webp,svg,gif", // List of images extensions for watching & compression (comma separated)
  fontsswatch = "eot,woff,woff2,ttf", // List of images extensions for watching & compression (comma separated)
  baseDir = "src", // Base directory path without «/» at the end
  buildDir = "build", // Base directory path without «/» at the end
  online = true, // If «false» - Browsersync will work offline without internet connection
  WAIT_TIME = 0; // Время задержки перед обновлением страницы.

let paths = {
  scripts: {
    src: [
      baseDir + "/*.js", // app.js. Always at the end
    ],
    dest: buildDir + "/static",
  },

  styles: {
    src: baseDir + "/*.css",
    dest: buildDir + "/static",
  },

  images: {
    src: baseDir + "/*.{png,jpg,svg}",
    dest: buildDir + "/static/",
  },
  cssOutputName: "main.css",
  jsOutputName: "main.js",
};

// LOGIC

const { src, dest, parallel, series, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const del = require("del");
const wait = require("gulp-wait");

// Dev depend
const fetch = require("node-fetch");
const fs = require("fs");
const { base64encode } = require("nodejs-base64");
const { URLSearchParams } = require("url");
const path = require("path");
const chalk = require("chalk");
const moment = require("moment"); // require
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");

const { SECRET_KEY, SITE } = require("./storeland-uploader-config.json");
const href = `${SITE}/api/v1/site_files/save`;

function checkConfig(cb) {
  if (!SECRET_KEY) {
    cb(new Error(`Не задан ${chalk.red(`SECRET_KEY`)} в файле ` + chalk.red(`storeland-uploader-config.json`)));
  }
  if (!SITE) {
    cb(new Error(`Не задан url адрес cайта в параметре ${chalk.red(`SITE`)} в файле ` + chalk.red(`storeland-uploader-config.json`)));
  }
  cb();
}

function clean() {
  return del("build");
}

function browsersync() {
  browserSync.init({
    notify: false,
    proxy: {
      target: `${SITE}`,
      proxyReq: [
        function (proxyReq) {
          proxyReq.setHeader("x-nodejs-editor-version", "2.01");
        },
      ],
    },
    online,
    injectChanges: true,
    open: "external",
    port: 8088,
  });
}

function html() {
  return src("src/*.htm")
    .pipe(posthtml([include()]))
    .pipe(dest("build/html"));
}

function fonts() {
  return src(["src/*.{woff,woff2}"])
    .pipe(dest("build/static"))
    .pipe(wait(WAIT_TIME))
    .pipe(browserSync.stream());
}

function scripts() {
  return src(["src/*.js"]).pipe(dest("build/static")).pipe(wait(WAIT_TIME)).pipe(browserSync.stream());
}

function styles() {
  return src(["src/*.css"]).pipe(dest("build/static")).pipe(wait(WAIT_TIME)).pipe(browserSync.stream());
}

function images() {
  return src("src/*.{png,jpg,svg}", {
    base: "src",
    encoding: false,
  })
    .pipe(newer(paths.images.dest))
    .pipe(imagemin())
    .pipe(dest(paths.images.dest));
}

function startwatch() {
  if (preprocessorOn) {
    watch(baseDir + "/**/*.scss", { delay: 100 }, styles);
  }
  // Загрузка css файлов
  watch(baseDir + "/*.css").on("change", function (event) {
    uploadFile(event);
    if (!preprocessorOn) {
      styles();
    }
  });
  // Загрузка изображений
  watch(baseDir + "/*.{" + imageswatch + "}")
    .on("add", function (event) {
      uploadFile(event);
    })
    .on("change", function (event) {
      uploadFile(event);
    });
  // Загрузка htm файлов
  watch(baseDir + "/*.{" + fileswatch + "}").on("change", function (event) {
    uploadFile(event);
  });
  // Загрузка js файлов
  watch([baseDir + "/*.js"]).on("change", function (event) {
    uploadFile(event);
  });
  // Загрузка шрифтов
  watch(baseDir + "/*.{" + fontsswatch + "}")
    .on("add", function (event) {
      uploadFile(event);
    })
    .on("change", function (event) {
      uploadFile(event);
    });
}

function uploadFile(event) {
  let file = event;
  let fileName = path.basename(file);
  let fileExt = path.extname(file);

  new Promise((resolve) => {
    fs.readFile(`${file}`, { encoding: "utf8" }, (err, data) => {
      if (err) throw err;
      resolve(base64encode(data));
    });

    if (imageswatch.includes(fileExt.replace(".", ""))) {
      resolve(Buffer.from(fs.readFileSync(file)).toString("base64"));
    }
  })
    .then((encoded) => {
      let params = new URLSearchParams();
      params.append("secret_key", SECRET_KEY);
      params.append("form[file_name]", `${fileName}`);
      params.append("form[file_content]", `${encoded}`);
      params.append("form[do_not_receive_file]", `1`);

      const fetchWithRetry = async (retries = 3) => {
        try {
          const response = await fetch(href, {
            method: "post",
            body: params,
            timeout: 10000, // Увеличиваем таймаут до 10 секунд
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const json = await response.json();

          if (json.status === `ok`) {
            console.log(`[${moment().format("HH:mm:ss")}] Файл ${chalk.red(fileName)} успешно отправлен ✔️`);

            fileExt = fileExt.replace(".", "");
            if (fileswatch.includes(fileExt)) {
              browserSync.reload();
            }
          } else if (json.status === `error`) {
            console.log(`Ошибка отправки ⛔ ${fileName}`);
            console.log(`${json.message}`);
          }
        } catch (error) {
          if (retries > 0) {
            console.log(`Повторная попытка отправки файла ${fileName}...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return fetchWithRetry(retries - 1);
          }
          console.error(`Ошибка при отправке файла ${fileName}:`, error);
        }
      };

      return fetchWithRetry();
    })
    .catch((err) => console.error(err));
}

function downloadFiles(done) {
  const FILES_PATH = "./files";
  let params = new URLSearchParams();
  params.append("secret_key", SECRET_KEY);

  fetch(`${SITE}/api/v1/site_files/get_list`, {
    method: "post",
    body: params,
    timeout: 5000,
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.status === `ok`) {
        console.log(`Загружен список всех файлов ✔️`);

        if (!fs.existsSync(FILES_PATH)) {
          fs.mkdirSync(FILES_PATH);
        }
        const filesArray = json.data.map((item) => {
          return {
            file_id: item["file_id"]["value"],
            file_name: item["file_name"]["value"],
          };
        });
        return filesArray;
      } else if (json.status == `error`) {
        console.log(`Ошибка загрузки ⛔`);
      }
    })
    .then((array) => {
      console.log(`Всего файлов ${array.length}`);
      const arrLength = array.length;
      let count = 1;
      const getFile = (arr) => {
        if (!arr.length) {
          console.log(`Всего скачано файлов ${count} из ${arrLength}`);
          done();
          return;
        }
        const { file_id, file_name } = arr.shift();

        let params = new URLSearchParams();
        params.append("secret_key", SECRET_KEY);

        fetch(`${SITE}/api/v1/site_files/get/${file_id}`, {
          method: "post",
          body: params,
          timeout: 5000,
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.status === `ok`) {
              return json;
            }
          })
          .then((json) => {
            fs.writeFile(`${FILES_PATH}/${json["data"]["file_name"].value}`, json["data"]["file_content"].value, "base64", function (err) {
              if (err) {
                console.log(err);
              }

              console.log(`Скачан файл ${file_name}. Всего ${count} из ${arrLength}`);
              getFile(array);
              count++;
            });
          })
          .catch(console.log);
      };
      getFile(array);
    });
}

exports.browsersync = browsersync;
exports.assets = series(styles, scripts, images);
exports.download = parallel(checkConfig, downloadFiles);
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.build = parallel(checkConfig, html, fonts, styles, scripts, images);
exports.default = parallel(checkConfig, styles, scripts, browsersync, startwatch);
