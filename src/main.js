console.time("start time");

/**
 * Плавно поднимает элемент вверх
 * @param {Element} element - Элемент, который нужно поднять
 * @param {number} duration - Длительность анимации в миллисекундах (по умолчанию 600)
 */
function SlideUp(element, duration = 600) {
  if (!element) return;
  element.style.transitionProperty = 'height, margin, padding';
  element.style.transitionDuration = duration + 'ms';
  element.style.boxSizing = 'border-box';
  element.style.height = element.offsetHeight + 'px';
  element.offsetHeight; // reflow
  element.style.overflow = 'hidden';
  element.style.height = 0;
  element.style.paddingTop = 0;
  element.style.paddingBottom = 0;
  element.style.marginTop = 0;
  element.style.marginBottom = 0;

  window.setTimeout(function () {
    element.style.display = 'none';
    element.style.removeProperty('height');
    element.style.removeProperty('padding-top');
    element.style.removeProperty('padding-bottom');
    element.style.removeProperty('margin-top');
    element.style.removeProperty('margin-bottom');
    element.style.removeProperty('overflow');
    element.style.removeProperty('transition-duration');
    element.style.removeProperty('transition-property');
    element.style.removeProperty('box-sizing');
  }, duration);
}

/**
 * Плавно опускает элемент вниз
 * @param {Element} element - Элемент, который нужно опустить
 * @param {number} duration - Длительность анимации в миллисекундах (по умолчанию 600)
 */
function SlideDown(element, duration = 600) {
  if (!element) return;
  element.style.removeProperty('display');
  let display = window.getComputedStyle(element).display;
  if (display === 'none') display = 'block';
  element.style.display = display;
  let height = element.scrollHeight;
  element.style.overflow = 'hidden';
  element.style.height = 0;
  element.style.paddingTop = 0;
  element.style.paddingBottom = 0;
  element.style.marginTop = 0;
  element.style.marginBottom = 0;
  element.offsetHeight; // reflow
  element.style.transitionProperty = 'height, margin, padding';
  element.style.transitionDuration = duration + 'ms';
  element.style.boxSizing = 'border-box';
  element.style.height = height + 'px';
  element.style.removeProperty('padding-top');
  element.style.removeProperty('padding-bottom');
  element.style.removeProperty('margin-top');
  element.style.removeProperty('margin-bottom');
  window.setTimeout(function () {
    element.style.removeProperty('height');
    element.style.removeProperty('overflow');
    element.style.removeProperty('transition-duration');
    element.style.removeProperty('transition-property');
    element.style.removeProperty('box-sizing');
  }, duration);
}

/**
 * Функция Добавления пробела между разрядами.
 * Используется в функциях: StickerSales, handleQuantityProductView, CartMinSum, handleDeliveryPrice
 * @param {string} str - Строка, которую нужно преобразовать
 * @returns {string} - Преобразованная строка
 */
function getMoneyFormat(str) {
  return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");
}

/**
 * Функция определения ширины экрана пользователя.
 * Используется в функциях: Mainnav
 * @returns {number} - Ширина экрана пользователя
 */
function getClientWidth() {
  // TODO Разобрать функцию
  return document.compatMode == "CSS1Compat" && !window.opera ? document.documentElement.clientWidth : document.body.clientWidth;
}

/**
 * Форматирует дату из формата YYYY-MM-DD в формат "DD месяц"
 * @param {string} dateString - Дата в формате YYYY-MM-DD
 * @returns {string} Отформатированная дата в формате "DD месяц"
 */
function getDateMonthsName(dateString) {
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];

  return `${day} ${month}`;
}

/**
 * Функция формирования ссылки с атрибутом only_body.
 * Используется в функциях: CartClear, CartRemove, handleAddtoModClick
 * @param {string} url - Ссылка
 * @returns {string} - Ссылка с атрибутом only_body
 */
function getUrlBody(url) {
  return url + (url.indexOf("?") ? "&" : "?") + "only_body=1";
}

/**
 * Функция получения HTML страницы по ссылке.
 * Используется в функциях: CartClear, CartRemove, handleAddtoModClick, handleCartRemoveItem, handleCartClear, handleCartOrderClose
 */
async function getHtmlFromUrl(url) {
  return await fetch(url)
    // Получаем ответ
    .then((response) => response.text())
    // Преобразуем в html
    .then((text) => {
      const parser = new DOMParser();
      const html = parser.parseFromString(text, "text/html");
      return html;
    })
    // Если получили ошибку
    .catch((error) => console.error(error));
}

/**
 * Функция Отправления запроса и получения HTML страницы по ссылке.
 * Используется в функциях: handleAddtoCartClick, AddtoOrder, handleAddtoOrderClick, handleCartQtyInput, handleCartOrderStart,
 * handleCouponSubmit, Autorization
 */
async function getHtmlFromPost(url, form) {
  return await fetch(url, {
    method: "POST",
    body: form,
  })
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const html = parser.parseFromString(data, "text/html");
      return html;
    })
    .catch((error) => console.error(error));
}

/**
 * Функция Отправления запроса и получения JSON по ссылке.
 * Используется в функциях:
 */
async function getJsonFromPost(url, form) {
  return await fetch(url, {
    method: "POST",
    body: form,
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  // .catch((error) => console.error(error));
}

/**
 * Функция Изменения текста в слотах
 * Используется в функциях: VisibleItems
 */
function SlotText(element) {
  const slot = element.querySelector("[slot]");
  if (!slot) return false;
  const hideText = slot.getAttribute("slot");
  const showText = slot.textContent.trim();
  // Обновляем данные
  slot.textContent = hideText;
  slot.setAttribute("slot", showText);
}

/**
 * Функция определния области нажания на контент
 * Используется в функциях: Mainnav, Opener, на всех страницах.
 * Использует функции:
 */
function OverlayCloser(event, selector, handler) {
  const content = document.querySelector(selector);
  if (event.target.closest(selector) !== content) {
    content.classList.remove("is-opened");
    document.body.removeEventListener("click", handler);
    if (selector !== "[data-search]") {
      document.querySelector(".search__reset").click();
    }
  } else {
    content.classList.add("is-opened");
  }
}

/**
 * Функция закрытия контента вне области нажатия
 * Используется в функциях: Mainnav, Opener, на всех страницах.
 * Использует функции:
 */
function OverlayOpener(content, handler) {
  content.classList.toggle("is-opened");
  if (content.classList.contains("is-opened")) {
    document.body.addEventListener("click", handler);
  } else {
    document.body.removeEventListener("click", handler);
  }
}

/**
 * Уведомления.
 * Используется в функциях: handleAddtoPost, handleAddtoCartUpdate, handleValueMax
 */
function СreateNoty(type, content) {
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    showCloseButton: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: type,
    html: `<div class="noty__block">
      <p class="noty__goods">${parseNotyMessage(content).goods}</p>
      <p class="noty__message">${parseNotyMessage(content).message}</p>
    </div>`,
  });
}

function СreateNotyCookies() {
  let isCookies = localStorage.getItem("cookiesAccept");
  if (isCookies) return;
  const body = document.querySelector("body");
  const contentHtml = `<div class="container">
      <b>Cookies</b>
      <p>Этот сайт использует cookie-файлы и другие технологии, чтобы помочь Вам в навигации, а также для предоставления лучшего пользовательского опыта и анализа использования наших продуктов и услуг.</p>
      <button class="button-primary" type="button">Принять все</button>
      <button class="button-secondary" type="button">Отклонить</button>
    </div>`;
  const content = document.createElement("div");
  content.classList.add("cookies");
  content.innerHTML = contentHtml;
  body.append(content);
  content.querySelector(".button-primary").addEventListener("click", () => {
    localStorage.setItem("cookiesAccept", "true");
    content.remove();
  });
  content.querySelector(".button-secondary").addEventListener("click", () => {
    localStorage.setItem("cookiesAccept", "false");
    content.remove();
  });
}
СreateNotyCookies()

function parseNotyMessage(str) {
  // Регулярное выражение для поиска названия товара в кавычках «...»
  const regex = /&laquo;([^&]+)&raquo;/;
  const match = str.match(regex);

  // Если совпадение найдено
  if (match) {
    const goods = match[1]; // Название товара (первая группа захвата)
    const message = str
      .replace(regex, '') // Удаляем часть с кавычками из сообщения
      .replace(/^Товар\s*/i, '') // Удаляем слово "Товар" в начале, если есть
      .replace(/\s+/g, ' ') // Заменяем множественные пробелы на один
      .trim(); // Удаляем пробелы в начале и конце

    return { goods, message };
  }

  // Если кавычек нет, вернем исходную строку как message
  return { goods: '', message: str };
}

/**
 * Функция отображения и обработки диалоговых окон на странице.
 * Используется в функциях: handleAddtoModOpen, handleCartRemoveItem, на всех страницах.
 */
function Dialogs(doc = document) {
  const dialogs = doc.querySelectorAll("[data-dialog]");
  if (dialogs.length === 0) {
    console.info("[INFO]: 'Модальные окна' не найдены на странице", dialogs);
    return;
  }

  dialogs.forEach((dialog) => {
    const dialogName = dialog.getAttribute("data-dialog");
    const dialogContent = document.querySelector(dialogName);
    if (!dialogContent) {
      console.info("[INFO]: 'Модальное окно' не найдено", dialogContent);
      return;
    }

    dialog.addEventListener("click", (event) => {
      event.preventDefault();
      dialogContent.showModal();
      document.body.classList.add("is-bodylock");
      dialog.classList.add("is-active");
    });
    dialogContent.addEventListener("close", () => {
      document.body.classList.remove("is-bodylock");
      dialog.classList.remove("is-active");
    });
    dialogContent.addEventListener("click", (event) => {
      const dialogTarget = event.currentTarget;
      const isClickedOnBackDrop = event.target === dialogTarget;
      if (isClickedOnBackDrop) {
        dialogTarget.close();
      }
    });

    const dialogCloser = DialogsCloser(dialogContent);
    if (dialogCloser) {
      dialogCloser.addEventListener("click", () => {
        dialogContent.close();
      });
    }
  });
}

/**
 * Обработать диалоговое окно.
 * Используется в функциях: handleAddtoModOpen, handleAddtoOrderOpen
 */
function DialogsHandler(dialog, dialogClose, show = false) {
  if (show) {
    dialog.show();
  } else {
    dialog?.showModal();
  }
  document.body.classList.add("is-bodylock");

  dialog.addEventListener("close", () => {
    document.body.classList.remove("is-bodylock");
    dialog.remove();
  });

  dialog.addEventListener("click", (event) => {
    const dialogTarget = event.currentTarget;
    const isClickedOnBackDrop = event.target === dialogTarget;
    if (isClickedOnBackDrop) {
      dialogTarget.close();
      dialog.remove();
    }
  });

  dialogClose.addEventListener("click", () => {
    dialog.close();
    dialog.remove();
  });
}

/**
 * Создать диалоговое окно.
 * Используется в функциях: handleAddtoModOpen, handleAddtoOrderOpen
 */
function DialogsCreate(id, label, content) {
  const dialog = document.createElement("dialog");
  dialog.setAttribute("id", id);
  dialog.setAttribute("aria-label", label);
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("role", "dialog");
  dialog.append(content);
  document.body.append(dialog);
  return dialog;
}

/**
 * Создать кнопку закрыть диалоговое окно.
 * Используется в функциях: Dialogs, handleAddtoModOpen, handleAddtoOrderOpen
 */
function DialogsCloser(dialog) {
  if (dialog.querySelector(".dialog__close")) return;
  const button = document.createElement("button");
  button.setAttribute("type", "button");
  button.classList.add("dialog__close", "button-icon");
  button.setAttribute("aria-label", "Закрыть модальное окно");
  button.setAttribute("data-dialog-close", "");
  button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="18" height="18" aria-hidden="true"><path d="m568.571 512.003 443.715-443.715c15.622-15.622 15.622-40.95 0-56.57s-40.954-15.622-56.57 0L511.999 455.433 68.286 11.718c-15.622-15.622-40.95-15.622-56.57 0s-15.622 40.95 0 56.57l443.713 443.713L11.716 955.716c-15.622 15.622-15.622 40.949 0 56.57a39.925 39.925 0 0 0 12.974 8.681 39.939 39.939 0 0 0 15.312 3.032 39.939 39.939 0 0 0 15.312-3.032 39.94 39.94 0 0 0 12.974-8.681l443.711-443.713 443.711 443.713c7.811 7.811 18.051 11.713 28.285 11.713 10.24 0 20.474-3.903 28.291-11.713 15.622-15.622 15.622-40.949 0-56.57L568.571 512.003z"/></svg>`;
  dialog.append(button);
  return button;
}

/**
 * Функция показать пароль.
 * Используется в функциях: handleAddtoOrderOpen, handleCartOrder, handleCartOrderStart, на всех страницах.
 * Использует функции: ValidateRequired
 */
function Passwords() {
  const passwords = document.querySelectorAll(".password");
  if (passwords.length === 0) return;

  passwords.forEach((password) => {
    const button = password.querySelector("button");
    const input = password.querySelector("input");
    button.addEventListener("click", () => {
      // Если не ввели пароль
      if (input.value.length < 1) return;
      // Изменяем тип input поля с password на text
      const isPass = input.type === "password";
      input.type = isPass ? "text" : "password";
      // Добавляем активный класс
      button.setAttribute("aria-pressed", isPass);
    });

    // Действие при вводе в поле пароля
    input.addEventListener("keyup", function (event) {
      capslockHandler(event);
    });
  });

  // Показать ошибку.
  function capslockHandler(event) {
    const status = event.getModifierState && event.getModifierState("CapsLock");
    const caps = event.target.closest("form").querySelector(".capslock");
    status ? caps.removeAttribute("hidden") : caps.setAttribute("hidden", "");
    return status;
  }

  // Зарегистрироваться
  const register = document.getElementById("want_register");
  if (!register) return;

  register.addEventListener("change", (event) => {
    const form = event.target.closest("form");
    const input = form.querySelector(".password__input");
    const email = form.querySelector("input[type='email']");
    const capslock = form.querySelector(".capslock");
    if (event.currentTarget.checked) {
      event.currentTarget.checked = true;
      input.parentElement.removeAttribute("hidden");
      email.setAttribute("required", "");
      input.setAttribute("required", "");
    } else {
      event.currentTarget.checked = false;
      input.parentElement.setAttribute("hidden", "");
      capslock.removeAttribute("hidden");
      email.removeAttribute("required");
      email.classList.remove("is-error");
      input.removeAttribute("required");
      input.classList.remove("is-error");
    }
    if (capslockHandler(event)) {
      capslock.removeAttribute("hidden");
    } else {
      capslock.setAttribute("hidden", "");
    }
    ValidateRequired(form);
  });
}


/**
 * Функция для создания SVG иконки
 * Используется в функциях: на всех страницах.
 * Использует функции: 
 */
function createSvgIcon(pathData, width = 12, height = 12) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 240 240");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("aria-hidden", "true");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathData);
  svg.appendChild(path);

  return svg;
}

/**
 * Функция переноса пунктов меню.
 * Используется в функциях: на всех страницах.
 * Использует функции: getClientWidth
 */
function Mainnav(selector = document) {
  const mainnav = selector.querySelector("[data-mainnav]");
  const mainnavList = mainnav.querySelector("[data-mainnav-list]");
  const mainnavDropdown = mainnav.querySelector("[data-mainnav-dropdown]");
  const mainnavItems = mainnav.querySelectorAll("[data-mainnav-item]");
  const mainnavMore = mainnav.querySelector("[data-mainnav-more]");

  function handleMainnavItems() {
    if (getClientWidth() < 1024) return;
    let mainnavItemsWidth = mainnavMore.clientWidth;
    mainnavItems.forEach((item) => {
      mainnavItemsWidth += item.clientWidth;
      if (mainnavItemsWidth > mainnavList.clientWidth) {
        mainnavDropdown.append(item);
      } else {
        mainnavList.append(item);
      }
    });
  }

  handleMainnavItems();
  window.addEventListener("resize", handleMainnavItems);

  if (mainnavDropdown.hasChildNodes()) {
    mainnavMore.removeAttribute("hidden");
  } else {
    mainnavMore.setAttribute("hidden", "");
  }

  mainnavMore.addEventListener("click", (event) => {
    event.preventDefault();
    mainnavMore.classList.toggle("is-active");
    OverlayOpener(mainnav, handleOpened);
  });

  function handleOpened(event) {
    OverlayCloser(event, "[data-mainnav]", handleOpened);
  }
}

/**
 * Функция добавления в Избранное/Сравнение.
 * Используется в функциях: handleAddtoModOpen, на всех страницах.
 */
function Addto(doc = document) {
  const compareButtons = doc.querySelectorAll(".add-compare");
  const favoritesButtons = doc.querySelectorAll(".add-favorites");
  if (compareButtons.length === 0 && favoritesButtons.length === 0) return;

  compareButtons.forEach((button) => {
    button.addEventListener("click", handleAddtoClick);
  });

  favoritesButtons.forEach((button) => {
    button.addEventListener("click", handleAddtoClick);
  });


  handleAddtoDelete(".compare");
  handleAddtoDelete(".favorites");
  handleAddtoClear(".compare");
  handleAddtoClear(".favorites");

  // Обработка клика
  function handleAddtoClick(event) {
    event.preventDefault();
    const currentTarget = event.currentTarget;
    const goods_href = currentTarget.getAttribute("href");
    const goods_form = currentTarget.closest("form");
    const goods_id = goods_form.querySelector("[name='form[goods_id]']").value;
    const goods_mod_id = goods_form.querySelector("[name='form[goods_mod_id]']").value;
    const goods_url = goods_form.querySelector("[name='form[goods_url]']").value;
    const goods_image = goods_form.querySelector("[name='form[goods_image]']").value;
    const goods_name = goods_form.querySelector("[itemprop='name']").textContent;
    const goods_price_old = goods_form.querySelector(".price__old").getAttribute("data-price");
    const goods_price_now = goods_form.querySelector(".price__now").getAttribute("data-price");
    const goods_compare_url = goods_form.querySelector(".add-compare").getAttribute("href");
    const goods_favorites_url = goods_form.querySelector(".add-favorites").getAttribute("href");
    const formData = new FormData();
    formData.append("ajax_q", "1");

    // Удаляет элемент с заданным data-id из коллекции элементов.
    // Возвращает true, если элемент был найден и удалён, иначе false.
    function RemoveElementById(items, id) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].getAttribute("data-id") == id) {
          items[i].remove();
          return true;
        }
      }
      return false;
    }

    // Отправка запроса
    getJsonFromPost(goods_href, formData)
      .then((data) => {
        if (data.status === "ok") {
          СreateNoty("success", data.message);
          if (currentTarget.classList.contains("add-compare")) {
            handleAddtoCartLink(currentTarget, "compare", "сравнения");
            handleAddtoCount(data.compare_goods_count, ".compare");
            const addtoItems = document.querySelector(".compare .addto__items");
            const addtoItem = document.querySelectorAll(".compare .addto__item");
            let isRemoved = RemoveElementById(addtoItem, goods_id);
            if (!isRemoved) {
              addtoItems.insertAdjacentHTML('afterbegin', createAddtoItem(goods_id, goods_mod_id, goods_image, goods_name, goods_price_old, goods_price_now, goods_url, `/compare/delete`));
              // Получаем только что добавленный элемент
              const newItem = addtoItems.firstElementChild;
              handleAddtoDelete(".compare", newItem);
            }
          } else {
            handleAddtoCartLink(currentTarget, "favorites", "избранного");
            handleAddtoCount(data.favorites_goods_count, ".favorites");
            const addtoItems = document.querySelector(".favorites .addto__items");
            const addtoItem = document.querySelectorAll(".favorites .addto__item");
            let isRemoved = RemoveElementById(addtoItem, goods_id);
            if (!isRemoved) {
              addtoItems.insertAdjacentHTML('afterbegin', createAddtoItem(goods_id, goods_mod_id, goods_image, goods_name, goods_price_old, goods_price_now, goods_url, `/favorites/delete`));
              // Получаем только что добавленный элемент
              const newItem = addtoItems.firstElementChild;
              handleAddtoDelete(".favorites", newItem);
            }
          }
        } else {
          СreateNoty("error", data.message);
        }
      })
      .catch((error) => console.error(error));
  }

  // Обновление количества
  function handleAddtoCount(count, selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      const data = element.querySelector("data");
      count === 0 ? element.classList.add("is-empty") : element.classList.remove("is-empty");
      if (data) {
        data.value = count;
        data.innerHTML = count;
      }
    });
  }

  // Обновление ссылки
  function handleAddtoCartLink(currentTarget, type, label) {
    const form = currentTarget.closest("form");
    const name = form.querySelector("[itemprop='name']").textContent;
    const id = form.querySelector("[name='form[goods_id]']").value;
    const modId = form.querySelector("[name='form[goods_mod_id]']").value;
    const urlAdd = `/${type}/add?id=${modId}`;
    const urlDelete = `/${type}/delete?id=${modId}`;
    const titleAdd = `Добавить «${name}» в список ${label} с другими товарами`;
    const titleDelete = `Убрать «${name}» из списка ${label} с другими товарами`;
    const addType = `.add-${type}`;
    if (currentTarget.classList.contains("is-added")) {
      handleAddtoCartLinkAdd(currentTarget, urlAdd, titleAdd);
      document.querySelectorAll(addType).forEach((element) => {
        const isEqualId = element.closest("form").querySelector("[name='form[goods_id]']").value === id;
        if (isEqualId) {
          handleAddtoCartLinkAdd(element, urlAdd, titleAdd);
        }
      });
    } else {
      handleAddtoCartLinkDelete(currentTarget, urlDelete, titleDelete);
      document.querySelectorAll(addType).forEach((element) => {
        const isEqualId = element.closest("form").querySelector("[name='form[goods_id]']").value === id;
        if (isEqualId) {
          handleAddtoCartLinkDelete(element, urlDelete, titleDelete);
        }
      });
    }
  }

  // Обновление ссылки добавления
  function handleAddtoCartLinkAdd(element, href, title) {
    element.classList.remove("is-added");
    element.setAttribute("href", href);
    element.setAttribute("title", title);
  }

  // Обновление ссылки удаления
  function handleAddtoCartLinkDelete(element, href, title) {
    element.classList.add("is-added");
    element.setAttribute("href", href);
    element.setAttribute("title", title);
  }

  // Обновление ссылки удаления
  function handleAddtoDelete(selector, context = document) {
    const removeButtons = context.querySelectorAll(selector + ' .addto__remove');
    removeButtons.forEach(button => {
      // Чтобы не навешивать повторно, проверим наличие обработчика через свойство
      if (!button._hasDeleteHandler) {
        addDeleteHandler(button, selector);
        button._hasDeleteHandler = true;
      }
    });
  }

  // Добавление обработчика удаления для одной кнопки
  function addDeleteHandler(button, selector) {
    button.addEventListener('click', handleButtonAddtoDelete);

    async function handleButtonAddtoDelete(event) {
      event.preventDefault();
      if (!confirm("Вы точно хотите удалить товар?")) return;
      const formData = new FormData();
      formData.append("ajax_q", "1");
      const counts = document.querySelectorAll(selector + " .addto__count");
      const url = event.currentTarget.getAttribute("href");
      const item = event.currentTarget.closest(".addto__item");
      const modId = item.getAttribute("data-mod-id");
      const newCount = parseInt(counts[0].value) - 1;
      try {
        const data = await getJsonFromPost(url, formData);
        if (data.status !== "ok") {
          console.error("[ERROR]: Error data.status", data.status);
          return;
        }
        item.remove();
        if (data.compare_goods_count) {
          CountUppdate(counts, data.compare_goods_count);
        } else if (data.favorites_goods_count) {
          CountUppdate(counts, data.favorites_goods_count);
        }
        if (newCount === 0) {
          document.querySelectorAll(selector).forEach(container => {
            container.classList.add("is-empty");
          });
        }
        handleAddtoLink(selector, data.message, modId);
      } catch (error) {
        console.error("[ERROR]: Error при удалении товара", error);
      }
    }
  }

  // Очистка избранного и сравнения
  function handleAddtoClear(selector) {
    const button = document.querySelector(selector + " .addto__clear");
    if (!button) return;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const url = getUrlBody(button.getAttribute("href"));
      if (confirm("Вы точно хотите очистить список?")) {
        getHtmlFromUrl(url).then((data) => {
          document.querySelectorAll(selector).forEach((element) => element.classList.add("is-empty"));
          document.querySelectorAll(selector + " .addto__item").forEach((element) => {
            const title = element.querySelector(".addto__remove").getAttribute("title");
            handleAddtoLink(selector, title, element.getAttribute('data-mod-id'));
            element.remove()
          });
        });
      }
    });
  }

  // Обновление ссылки
  function handleAddtoLink(selector, title, modId) {
    const type = selector.slice(1);
    const elements = document.querySelectorAll(".add-" + type);
    const urlAdd = `/${type}/add?id=${modId}`;
    elements.forEach(element => {
      const item = element.closest("[data-id]");
      const itemMod = item.querySelector("[name='form[goods_mod_id]']");
      const itemModId = itemMod.value;

      if (itemModId == modId) {
        handleAddtoCartLinkAdd(element, urlAdd, title)
      }
    });
  };

  // Создание старой цены
  function createPriceOld(priceOld) {
    if (priceOld === '0' || !priceOld) return '';
    return `<s class="price__old" data-price="${priceOld}">
      <span title="${priceOld} российских рублей">
        <span class="num">${getMoneyFormat(priceOld)}</span>
        <span>р.</span>
      </span>
    </s>`
  }

  // Создание новой цены
  function createPriceNow(priceNow) {
    return `<b class="price__now" data-price="${priceNow}">
      <span title="${priceNow} российских рублей">
        <span class="num">${getMoneyFormat(priceNow)}</span>
        <span>р.</span>
      </span>
    </b>`
  }

  // Создание элемента списка
  function createAddtoItem(goodsID, goodsModID, goodsImage, goodsName, goodsPriceOld, goodsPriceNow, goodsURL, delUrl) {
    const CURRENCY_CHAR_CODE = 'RUB';
    return `
      <div class="addto__item" data-id="${goodsID}" data-mod-id="${goodsModID}">
        <div class="addto__image">
          <img src="${goodsImage}" alt="${goodsName}" loading="lazy" />
        </div>

        <div class="addto__content">
          <a class="addto__name" href="${goodsURL}" title="Перейти на страницу товара">${goodsName}</a>
          <div class="addto__price ${CURRENCY_CHAR_CODE}">
            ${createPriceOld(goodsPriceOld)}
            ${createPriceNow(goodsPriceNow)}
          </div>
        </div>

        <a class="addto__remove button-icon" href="${delUrl}?id=${goodsModID}" title="Удалить позицию ${goodsName}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="24" height="24" aria-hidden="true">
            <path d="M256 810.667c0 46.933 38.4 85.333 85.333 85.333h341.333c46.933 0 85.333-38.4 85.333-85.333v-512h-512v512zM341.333 384h341.333v426.667h-341.333v-426.667zM661.333 170.667l-42.667-42.667h-213.333l-42.667 42.667h-149.333v85.333h597.333v-85.333h-149.333z"></path>
          </svg>
        </a>
      </div>
    `
  }
}

/**
 * Функция добавления товара в Корзину.
 * Используется в функциях: handleAddtoModOpen, на всех страницах.
 * Использует функции: CartRemove, CartClear, CountUppdate, CartDiscountUppdate, СreateNoty
 */
function AddtoCart(doc = document) {
  const buttons = doc.querySelectorAll(".add-cart");
  if (buttons.length === 0) return;

  buttons.forEach((button) => {
    button.addEventListener("click", handleAddtoCartClick);
  });

  function handleAddtoCartClick(event) {
    event.preventDefault();
    const currentTarget = event.currentTarget;
    const form = currentTarget.closest("form");
    const url = form.getAttribute("action");
    const goodsID = form.querySelector("[name='form[goods_mod_id]']").value;
    const formData = new FormData(form);
    formData.append("ajax_q", "1");
    // Отправка запроса
    getHtmlFromPost(url, formData).then((data) => {
      handleAddtoCartUpdate(data);
      // Запуск дополнительных функций
      CartRemove();
      CartClear();
    });
    event.currentTarget.parentElement.classList.add("is-added");

    document.querySelectorAll(".add-cart").forEach((button) => {
      handleAddtoCartAdded(button, goodsID);
    });
    document.querySelectorAll(".add-mod").forEach((button) => {
      handleAddtoCartAdded(button, goodsID);
    });

    function handleAddtoCartAdded(button, goodsID) {
      const form = button.closest("form");
      const buttonID = form.querySelector("[name='form[goods_mod_id]']").value;
      if (buttonID === goodsID) {
        button.classList.add("is-added");
        const slot = button.querySelector("[slot]");
        if (slot) {
          slot.innerHTML = "В корзине";
        }
      }
    }
  }

  // Обновление корзины
  function handleAddtoCartUpdate(data) {
    const cartAddto = document.querySelector(".addto__cart");
    const cartAddtoData = data.querySelector("#newCartData");
    const cartSumDiscounts = document.querySelectorAll(".cart-sum-discount");
    const cartSumDiscountData = data.querySelector("#newCartSumDiscount");
    const cartCounts = document.querySelectorAll(".cart-count");
    const cartCountDataValue = data.querySelector("#newCartCount").textContent;
    const addtoDiscounts = document.querySelectorAll(".addto__discount");
    const cartDiscountData = data.querySelector(".cartTotal__discount");
    // Обновление данных
    cartAddto.innerHTML = cartAddtoData.innerHTML;
    CountUppdate(cartCounts, cartCountDataValue);
    CartEmptyUpdate(cartCountDataValue);
    CartDiscountUppdate(cartSumDiscounts, cartSumDiscountData);
    if (cartDiscountData && addtoDiscounts.length > 0) {
      CartDiscountUppdate(addtoDiscounts, cartDiscountData);
      addtoDiscounts.forEach(item => {
        cartDiscountData ? item.classList.remove('is-hide') : item.classList.add('is-hide');
      });
    }
    // Сообщение с уведомлением действия
    const notice = data.querySelector(".cartItems__modal > p");
    const type = notice?.getAttribute("class").slice(15);
    СreateNoty(type, notice.innerHTML);
  }
}

/**
 * Функция добавления модификации в Корзину.
 * Используется в функциях: на всех страницах с товарами.
 * Использует функции: getHtmlFromUrl, Fancybox, Addto, AddtoCart, AddtoNotify, AddtoOrder, Goods, Dialogs
 */
function AddtoMod(doc = document) {
  const buttons = doc.querySelectorAll(".add-mod");
  if (buttons.length === 0) return;

  buttons.forEach((button) => {
    button.addEventListener("click", handleAddtoModClick);
  });

  function handleAddtoModClick(event) {
    event.preventDefault();
    const currentTarget = event.currentTarget;
    const url = getUrlBody(currentTarget.getAttribute("href"));
    getHtmlFromUrl(url).then((data) => {
      handleAddtoModOpen(data);
    });
  }

  function handleAddtoModOpen(data) {
    const content = data.querySelector(".productView");
    new Fancybox(
      [
        {
          src: content,
          type: "html",
        },
      ],
      {
        mainClass: "productViewMod",
        hideScrollbar: false,
        on: {
          done: () => {
            Addto(content);
            AddtoCart(content);
            AddtoNotify(content);
            AddtoOrder(content);
            Goods(content);
            Dialogs(content);
            content.querySelector(".productView__add").focus();
          },
        },
      },
    );
  }
}

/**
 * Функция Быстрый заказ.
 * Используется в функциях: handleAddtoModOpen, на всех страницах с товарами.
 * Использует функции: getHtmlFromPost, handleAddtoOrderOpen, handleAddtoOrderUpdate, CartRemove, CartClear,
 * Использует функции: Fancybox, Orderfast, Passwords, OrderCoupons, CartMinSum, ValidateRequired, CountUppdate, CartDiscountUppdate
 */
function AddtoOrder(doc = document) {
  const buttons = doc.querySelectorAll(".add-order");
  if (buttons.length === 0) return;

  buttons.forEach((button) => {
    button.addEventListener("click", handleAddtoOrderClick);
  });

  function handleAddtoOrderClick(event) {
    event.preventDefault();
    const currentTarget = event.currentTarget;
    const form = currentTarget.closest("form");
    const url = form.getAttribute("action");
    const formData = new FormData(form);
    formData.append("ajax_q", "1");
    formData.append("fast_order", "1");

    getHtmlFromPost(url, formData).then((data) => {
      handleAddtoOrderOpen(data);
      handleAddtoOrderUpdate(data);
      CartRemove();
      CartClear();
    });
    event.currentTarget.parentElement.classList.add("has-in-cart");
  }

  function handleAddtoOrderOpen(data) {
    const content = data.querySelector(".page-orderfast");
    const dialog = DialogsCreate("productViewMod", "Карточка товара", content);
    const dialogClose = DialogsCloser(dialog);
    // Запуск функций
    DialogsHandler(dialog, dialogClose);
    Dialogs(content);
    Orderfast();
    Passwords();
    OrderCoupons();
    CartMinSum();
    $(".form__phone").mask("+7 (999) 999-9999");
    const form = document.querySelector(".orderfast__form");
    ValidateRequired(form);
    new AirDatepicker("#order_delivery_convenient_date", {
      autoClose: true,
      onSelect: function ({ datepicker }) {
        ValidateInput(datepicker.$el);
      },
    });
  }

  function handleAddtoOrderUpdate(data) {
    const cartAddto = document.querySelector(".addto__cart");
    const cartAddtoData = data.querySelector("#newCartData");
    const cartSumDiscounts = document.querySelectorAll(".cart-sum-discount");
    const cartSumDiscountData = data.querySelector("#newCartSumDiscount");
    const cartCounts = document.querySelectorAll(".cart-count");
    const cartCountDataValue = data.querySelector("#newCartCount").textContent;
    const addtoDiscounts = document.querySelectorAll(".addto__discount");
    const cartDiscountData = data.querySelector(".cartTotal__discount");
    // Обновление данных
    cartAddto.innerHTML = cartAddtoData.innerHTML;
    CountUppdate(cartCounts, cartCountDataValue);
    CartEmptyUpdate(cartCountDataValue);
    CartDiscountUppdate(cartSumDiscounts, cartSumDiscountData);
    if (cartDiscountData && addtoDiscounts.length > 0) {
      CartDiscountUppdate(addtoDiscounts, cartDiscountData);
      addtoDiscounts.forEach(item => {
        cartDiscountData ? item.classList.remove('is-hide') : item.classList.add('is-hide');
      });
    }
  }
}

/**
 * Функция Уведомления.
 * Используется в функциях: handleAddtoModOpen, на всех страницах с товарами.
 */
function AddtoNotify(doc = document) {
  const buttons = doc.querySelectorAll(".add-notify");
  if (buttons.length === 0) return;

  buttons.forEach((button) => {
    button.addEventListener("click", handleAddtoNotifyClick);
  });

  function handleAddtoNotifyClick(event) {
    const currentTarget = event.currentTarget;
    const goodsForm = currentTarget.closest("form");
    const goodsModId = goodsForm.querySelector("[name='form[goods_mod_id]']");
    const dialog = document.querySelector("#dialogNotify");
    const dialogModId = dialog.querySelector("[name='form[goods_mod_id]']");
    dialogModId.value = goodsModId.value;
  }
}

/**
 * Стикер разницы в цене.
 * Используется в функциях: Products, Goods
 * Использует функции: getMoneyFormat
 */
function StickerSales(selector, type = "percent") {
  const sticker = selector.querySelector(".sticker--sales");
  if (!sticker) return;
  const priceNow = selector.querySelector(".price__now");
  const priceOld = selector.querySelector(".price__old");
  if (!priceOld) {
    sticker.style.display = "none";
    return;
  }
  if (type === "percent") {
    const diffPercent = (((priceOld.getAttribute("data-price") - priceNow.getAttribute("data-price")) / priceOld.getAttribute("data-price")) * 100).toFixed();
    sticker.innerHTML = `–${diffPercent}%`;
  } else {
    const diff = (priceOld.getAttribute("data-price") - priceNow.getAttribute("data-price")).toFixed();
    sticker.innerHTML = `<span class="RUB"><span class="num">-${getMoneyFormat(diff)}</span></span>`;
  }
}

/**
 * Фильтры.
 * Используется в функциях: на странице Товары(каталог).
 * Использует функции: Jquery ui slider
 */
function Filters() {
  // Выбора фильтра
  const filters = document.querySelector(".filters");
  if (!filters) return;
  const filterLists = filters.querySelectorAll(".filter__list");
  if (filterLists.length !== 0) {
    let filtersChecked = 0;
    filterLists.forEach((list) => {
      let filterChecked = 0;
      list.querySelectorAll("input[type=checkbox]").forEach((input) => {
        input.addEventListener("click", (event) => {
          event.target.form.submit();
        });

        if (input.checked) {
          filterChecked++;
          filtersChecked++;
        }

        const filterOpenerCount = document.querySelector(".filters__open b");
        if (filterOpenerCount) {
          filterOpenerCount.innerHTML = filtersChecked > 0 ? filtersChecked : "";
        }
      });

      const filterListCount = list.querySelector(".filter__title b");
      if (filterListCount) {
        filterListCount.innerHTML = filterChecked > 0 ? filterChecked : "";
      }
    });
  }

  // Открытие фильтров
  SidebarOpener(".filters", ".filters__open");

  // Фильтр цены
  function filterPrice() {
    const priceFilterMinAvailable = parseInt($('[name="form[filter][available_price][min]"]').val()), // Минимальное значение цены для фильтра
      priceFilterMaxAvailable = parseInt($('[name="form[filter][available_price][max]"]').val()), // Максимальное значение цены для фильтра
      priceSliderBlock = $("#goods-filter-price-slider"), // Максимальное значение цены для фильтра
      priceInputMin = $("#filter-price-min"), // Поле ввода текущего значения цены "От"
      priceInputMax = $("#filter-price-max"), // Поле ввода текущего значения цены 'До'
      priceSubmitButtonBlock = $(".filters-price__buttons"); // Блок с кнопкой, которую есть смысл нажимать только тогда, когда изменялся диапазон цен.

    // Слайдер, который используется для удобства выбора цены
    console.log('priceSliderBlock', priceSliderBlock)
    if (priceSliderBlock) {
      priceSliderBlock.slider({
        range: true,
        min: priceFilterMinAvailable,
        max: priceFilterMaxAvailable,
        values: [parseInt($("#filter-price-min").val()), parseInt($("#filter-price-max").val())],
        slide: function (event, ui) {
          priceInputMin.val(ui.values[0]);
          priceInputMax.val(ui.values[1]);
          priceSubmitButtonBlock.css("display", "flex");
        },
      });
    }

    // При изменении минимального значения цены
    priceInputMin.keyup(function () {
      let newVal = parseInt($(this).val());
      if (newVal < priceFilterMinAvailable) {
        newVal = priceFilterMinAvailable;
      }
      priceSliderBlock.slider("values", 0, newVal);
      priceSubmitButtonBlock.css("display", "flex");
    });

    // При изменении максимального значения цены
    priceInputMax.keyup(function () {
      let newVal = parseInt($(this).val());
      if (newVal > priceFilterMaxAvailable) {
        newVal = priceFilterMaxAvailable;
      }
      priceSliderBlock.slider("values", 1, newVal);
      priceSubmitButtonBlock.css("display", "flex");
    });

    // Активный фильтр цены
    if (priceInputMin.val() > priceFilterMinAvailable || priceInputMax.val() < priceFilterMaxAvailable) {
      $(".filters-price").addClass("has-filters");
      $(".toolbar").addClass("has-filters");
    } else {
      $(".filters-price").removeClass("has-filters");
      $(".toolbar").removeClass("has-filters");
    }
  }
  filterPrice();

  // Фильтр сворачиваний
  function filterCollapse() {
    const filterCollapse = document.querySelectorAll(".filter__list");
    if (filterCollapse.length === 0) return;

    filterCollapse.forEach((filter) => {
      const filterTitle = filter.querySelector(".filter__title");

      // Фильтр цены не сворачивается
      if (filter.classList.contains("filters-price")) return;

      filterTitle?.addEventListener("click", () => {
        filterTitle.parentElement.classList.toggle("has-filters");
      });
    });
  }
  filterCollapse();

  // Фильтр в наличии
  function filterRest() {
    const button = document.querySelector(".filters-rest__open");
    if (!button) return;
    const form = document.querySelector(".filters__form");
    if (!form) return;

    button.addEventListener("click", (event) => {
      event.preventDefault();
      const url = form.getAttribute("action");
      const formData = new FormData(form);
      if (button.classList.contains("is-active")) {
        button.classList.remove("is-active");
        formData.set("form[filter_only_with_rest]", "0");
      } else {
        button.classList.add("is-active");
        formData.set("form[filter_only_with_rest]", "1");
      }
      updateProductsContainer(url, formData);
    });

    function updateProductsContainer(url, formData) {
      getHtmlFromPost(url, formData)
        .then((data) => {
          // Обработать ответ (например, обновить интерфейс)
          const container = document.querySelector(".products__container");
          const containerData = data.querySelector(".products__container");
          container.innerHTML = containerData.innerHTML;
          Filters();
        })
        .catch((error) => {
          console.error("Ошибка:", error);
        });
    }
  }
  filterRest();
}

/**
 * Тулбар.
 * Используется в функциях: на странице Товары(каталог), Поиск, Акции.
 */
function Toolbar() {
  const toolbar = document.querySelector(".toolbar");
  if (!toolbar) return;
  const toolbarSelects = toolbar.querySelectorAll(".toolbar__selects");

  toolbarSelects.forEach((select) => {
    select.addEventListener("change", handleToolbarSelectChange);
  });

  function handleToolbarSelectChange(event) {
    event.target.closest("form").submit();
  }
}

/**
 * Товары.
 * Используется в функциях: на страницах с "Товарами"
 * Использует функции: StickerSales
 */
function Products() {
  const products = document.querySelectorAll(".product__item");
  if (products.length === 0) return;
  products.forEach((product) => {
    // Запуск функции стикера цены.
    StickerSales(product);
    Attrs(product);
    Quantity(product);
    formatDate(product);
  });

  // Показать/скрыть характеристики товара
  function Attrs(product) {
    const button = product.querySelector(".product__attr-button");
    const content = product.querySelector(".product__attr");

    if (button && content) {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        button.classList.toggle("is-active");
        content.classList.toggle("is-active");
        SlotText(event.currentTarget);
      });
    }
  }

  // Форматирование даты
  function formatDate(product) {
    const dateTime = product.querySelector(".product__date time");
    if (dateTime) {
      dateTime.innerHTML = getDateMonthsName(dateTime.getAttribute("datetime"));
    }
  }

  
}

/**
 * Страница "Товар".
 * Используется в функциях: на странице "Товар".
 * Использует функции: Fancybox, Swiper
 */
function Goods(doc) {
  const productViewBlock = doc || document.querySelector(".productView");
  if (!productViewBlock) return;

  const productViewSlugs = productViewBlock.querySelectorAll(".modifications-slugs");
  const productViewItems = productViewBlock.querySelectorAll(".modifications-values__item");
  const productViewButtons = productViewBlock.querySelectorAll(".modifications-values__button");
  const productViewSelects = productViewBlock.querySelectorAll(".modifications-props__select");

  productViewButtons.forEach((button) => {
    button.addEventListener("click", (event, index) => {
      event.currentTarget.parentElement.querySelectorAll("button").forEach((item) => item.classList.remove("is-active"));
      event.currentTarget.classList.add("is-active");
      handleDisabledButtons(index);
      // Обновляем данные модификации
      const checkedArray = Array.from(productViewButtons)
        .filter((button) => button.classList.contains("is-active"))
        .map((button) => button.getAttribute("data-id"));
      handleSlugsActived(checkedArray);
    });
  });

  function handleDisabledButtons(flag) {
    // Проверяем в каждом соседнем поле выбора модификаций, возможно ли подобрать модификацию для указанных свойств
    productViewItems.forEach((items, index) => {
      // Если мы сравниваем значения свойства не с самим собой, а с другим списком значений свойств
      if (index != flag) {
        // Проходим по всем значениям текущего свойства модификации товара
        items.querySelectorAll("button").forEach((button) => {
          // Записываем временный массив свойств, которые будем использовать для проверки существования модификации
          const checkProperties = new Array();
          productViewItems.forEach((item, i) => (checkProperties[i] = item.querySelector("button.is-active").getAttribute("data-id")));
          // Пытаемся найти модификацию соответствующую выбранным значениям свойств
          checkProperties[index] = button.getAttribute("data-id");
          // Собираем хэш определяющий модификацию по свойствам
          const slug = checkProperties.sort((a, b) => a - b).join("_");
          // Ищем модификацию по всем выбранным значениям свойств товара. Если модификации нет в возможном выборе, отмечаем потенциальное значение выбора как не доступное для выбора, т.к. такой модификации нет.
          const isActiveSlug = document.querySelector('[data-slugs="' + slug + '"]');
          if (isActiveSlug) {
            button.removeAttribute("disabled");
          } else {
            button.setAttribute("disabled", "disabled");
          }
        });
      }
    });
  }
  handleDisabledButtons(0);
  handleDisabledButtons(1);

  productViewSelects.forEach((select) => {
    select.addEventListener("change", (event, index) => {
      handleDisabledSelects(index);
      // Обновляем данные модификации
      const checkedArray = Array.from(productViewSelects).map((select) => select.value);
      handleSlugsActived(checkedArray);
    });
  });

  function handleDisabledSelects(flag) {
    // Проверяем в каждом соседнем поле выбора модификаций, возможно ли подобрать модификацию для указанных свойств
    productViewSelects.forEach((selects, index) => {
      // Если мы сравниваем значения свойства не с самим собой, а с другим списком значений свойств
      if (index != flag) {
        // Проходим по всем значениям текущего свойства модификации товара
        selects.querySelectorAll("option").forEach((option) => {
          // Записываем временный массив свойств, которые будем использовать для проверки существования модификации
          const checkProperties = new Array();
          productViewSelects.forEach((select, i) => (checkProperties[i] = select.value));
          // Пытаемся найти модификацию соответствующую выбранным значениям свойств
          checkProperties[index] = option.value;
          // Собираем хэш определяющий модификацию по свойствам
          const slug = checkProperties.sort((a, b) => a - b).join("_");
          // Ищем модификацию по всем выбранным значениям свойств товара. Если модификации нет в возможном выборе, отмечаем потенциальное значение выбора как не доступное для выбора, т.к. такой модификации нет.
          const isActiveSlug = document.querySelector('[data-slugs="' + slug + '"]');
          if (isActiveSlug) {
            option.removeAttribute("disabled");
          } else {
            option.setAttribute("disabled", "disabled");
          }
        });
      }
    });
  }
  handleDisabledSelects(0);
  handleDisabledSelects(1);

  function handleSlugsActived(checked) {
    const slug = checked.sort((a, b) => a - b).join("_");
    const slugActived = productViewBlock.querySelector('.modifications-slugs[data-slugs="' + slug + '"]');
    productViewSlugs.forEach((slug) => slug.classList.remove("is-active"));
    slugActived.classList.add("is-active");
    handleModUpdate(slugActived);
  }

  // Обновление модификации
  function handleModUpdate(modificationBlock) {
    // Переменные выбранной модификации
    const modificationId = modificationBlock.querySelector('[name="slug[mod_id]"]').value;
    const modificationPriceNow = parseInt(modificationBlock.querySelector('[name="slug[mod_price_now]"]').value);
    const modificationPriceNowFormated = modificationBlock.querySelector(".price_now_formated").innerHTML;
    const modificationPriceOld = parseInt(modificationBlock.querySelector('[name="slug[mod_price_old]"]').value);
    const modificationPriceOldFormated = modificationBlock.querySelector(".price_old_formated").innerHTML;
    const modificationRestValue = parseInt(modificationBlock.querySelector('[name="slug[mod_rest_value]"]').value);
    const modificationMeasure = modificationBlock.querySelector('[name="slug[mod_measure_name]"]').value;
    const modificationArtNumber = modificationBlock.querySelector('[name="slug[mod_sku]"]').value;
    const modificationDescription = modificationBlock.querySelector(".description").innerHTML;
    const modificationModImageId = parseInt(modificationBlock.querySelector('[name="slug[mod_image_id]"]').value);
    // Переменные отображаемой модификации
    const goodsModView = productViewBlock;
    const goodsModId = goodsModView.querySelector("[name='form[goods_mod_id]']");
    const goodsPriceBlock = goodsModView.querySelector(".productView__price");
    const goodsPriceNow = goodsPriceBlock.querySelector(".price__now");
    const goodsPriceOld = goodsPriceBlock.querySelector(".price__old");
    const goodsModRestBlock = goodsModView.querySelector(".productView__available");
    const goodsQty = goodsModView.querySelector(".productView__qty");
    const goodsQtyInput = goodsQty.querySelector(".qty__input");
    const goodsArtNumberBlock = goodsModView.querySelector(".productView__articles");
    const goodsModDescription = goodsModView.querySelector(".modifications__description");

    // Цена товара
    goodsPriceNow.setAttribute("data-price", modificationPriceNow);
    goodsPriceNow.innerHTML = modificationPriceNowFormated;

    // Старая цена товара
    if (modificationPriceOld > modificationPriceNow) {
      if (goodsPriceOld === null) {
        const priceOld = document.createElement("s");
        priceOld.className = "price__old";
        priceOld.setAttribute("data-price", modificationPriceOld);
        priceOld.innerHTML = modificationPriceOldFormated;
        priceOld.style.display = "";
        goodsPriceBlock.append(priceOld);
      } else {
        goodsPriceOld.setAttribute("data-price", modificationPriceOld);
        goodsPriceOld.innerHTML = modificationPriceOldFormated;
        goodsPriceOld.style.display = "";
      }
    } else {
      if (goodsPriceOld) {
        goodsPriceOld.style.display = "none";
        goodsPriceOld.innerHTML = "";
      }
    }

    // Наличие
    goodsModView.setAttribute("data-rest-value", modificationRestValue);
    goodsModRestBlock.setAttribute("data-value", modificationRestValue);
    goodsModRestBlock.querySelector("b").innerHTML = modificationRestValue + " " + modificationMeasure;

    goodsQtyInput.value = 1;
    if (modificationRestValue > 0 && modificationRestValue < 10) {
      // Мало в наличии
      goodsModRestBlock.classList.remove("rest--zero", "rest--alot");
      goodsModRestBlock.classList.add("rest--few");
    } else if (modificationRestValue > 9) {
      // Много в наличии
      goodsModRestBlock.classList.remove("rest--zero", "rest--few");
      goodsModRestBlock.classList.add("rest--alot");
    } else {
      // Нет в наличии
      goodsModRestBlock.classList.remove("rest--few", "rest--alot");
      goodsModRestBlock.classList.add("rest--zero");
      goodsModRestBlock.querySelector("b").innerHTML = "Нет";
      goodsQtyInput.value = 1;
      goodsQtyInput.setAttribute("max", 1);
    }

    // Если включено в настройках 'Отключить возможность класть в корзину больше товара, чем есть в наличии'
    if (goodsQty.querySelector(".qty").classList.contains("has-max")) {
      goodsQtyInput.max = modificationRestValue;
    } else {
      goodsQtyInput.max = 99999;
    }

    // Покажем артикул модификации товара, если он указан
    if (modificationArtNumber) {
      goodsArtNumberBlock.removeAttribute("hidden");
      goodsArtNumberBlock.parentElement.removeAttribute("hidden");
      goodsArtNumberBlock.parentElement.classList.remove("is-hide");
      goodsArtNumberBlock.querySelector("[itemprop=sku]").innerHTML = modificationArtNumber;
    } else {
      if (goodsArtNumberBlock) {
        goodsArtNumberBlock.setAttribute("hidden", "");
        goodsArtNumberBlock.parentElement.setAttribute("hidden", "");
        goodsArtNumberBlock.parentElement.classList.add("is-hide");
        goodsArtNumberBlock.querySelector("b").innerHTML = "";
        if (document.querySelector(".productView__sticker")) {
          goodsArtNumberBlock.parentElement.classList.remove("is-hide");
          if (document.querySelector(".productView.fancybox__content")) {
            goodsArtNumberBlock.parentElement.classList.add("is-hide");
          }
        }
      }
    }

    // Описание модификации товара. Покажем если оно есть, спрячем если его у модификации нет
    if (modificationDescription) {
      goodsModDescription.classList.remove("is-hide");
      goodsModDescription.innerHTML = modificationDescription;
    } else {
      goodsModDescription.classList.add("is-hide");
      goodsModDescription.innerHTML = "";
    }

    // Идентификатор товарной модификации
    goodsModId.value = modificationId;
    goodsQtyInput.setAttribute("name", "form[goods_mod_id][" + modificationId + "]");

    // Обновляем изображние модификации товара, если оно указано
    handleModImage(modificationModImageId, goodsModView);
  }

  // Меняет главное изображение товара на изображение с идентификатором
  function handleModImage(goodsModImageId, block) {
    if (!block || !goodsModImageId) return;
    // Если не указан идентификатор модификации товара, значит ничего менять не нужно.
    if (!goodsModImageId) return;
    if (block.classList.contains("fancybox__content")) return;
    // Блок с изображением выбранной модификации товара
    const goodsModImageBlock = block.querySelector('.thumblist [data-id="' + goodsModImageId + '"');
    if (!goodsModImageBlock) return;
    // Изображение модификации товара, на которое нужно будет изменить главное изображение товара.
    const mediumImageUrl = goodsModImageBlock.getAttribute("href");
    // Блок, в котором находится главное изображение товара
    const mainImageBlock = block.querySelector(".productView__image");
    // Главное изображение, в которое будем вставлять новое изображение
    const mainImage = mainImageBlock.querySelector("img");
    // Если изображение модификации товара найдено - изменяем главное изображение
    mainImage.setAttribute("src", mediumImageUrl);
    mainImage.parentElement.setAttribute("data-src", mediumImageUrl);
    // Изменяем идентификатор главного изображения
    mainImageBlock.setAttribute("data-id", goodsModImageId);
    block.querySelectorAll(".thumblist__item").forEach((item) => item.classList.remove("is-active"));
    goodsModImageBlock.classList.add("is-active");
    swiper.slideTo(goodsModImageBlock.getAttribute("data-swiper-slide-index"));
  }

  // Функции Дополнительных изображений.
  function Thumbs() {
    const thumblist = document.querySelector(".thumblist");
    if (!thumblist) return;

    // Слайдер дополнительных изображений
    const swiper = new Swiper(".thumblist .swiper", {
      direction: 'vertical',
      loop: true,
      slidesPerView: 4,
      spaceBetween: 8,
      watchSlidesProgress: true,
      navigation: {
        nextEl: ".thumblist .swiper-button-next",
        prevEl: ".thumblist .swiper-button-prev",
      },
    });

    // const thumbsImages = thumblist.querySelectorAll(".thumblist__image");
    // thumbsImages.forEach((image) => {
    //   image.addEventListener("click", handleThumbsImage);
    // });

    /* Функция Отображения дополнительного изображения на месте основного. */
    // function handleThumbsImage(event) {
    //   event.preventDefault();
    //   const target = event.currentTarget;
    //   const href = target.getAttribute("href");
    //   const mainImage = document.querySelector(".productView__image");
    //   const mainImageImg = mainImage.querySelector("img");
    //   // const mainImageSource = mainImage.querySelector("source");
    //   mainImage.setAttribute("data-src", href);
    //   mainImageImg.setAttribute("src", href);
    //   // mainImageSource.setAttribute("srcset", href);
    //   thumbsImages.forEach((image) => image.parentElement.classList.remove("is-active"));
    //   target.parentElement.classList.add("is-active");
    // }
  }

  // Запуск функции стикера цены.
  StickerSales(productViewBlock);
  // Запуск функции Количества.
  Quantity(productViewBlock);
  // Запуск функции Дополнительных изображений.
  Thumbs();
  // Запуск Функции Галереи изображений.
  Fancybox.bind('[data-fancybox="gallery"]');
  // Запуск функции форматирования даты.
  const campaignDate = productViewBlock.querySelector(".productView__campaign time");
  if (campaignDate) {
    campaignDate.innerHTML = getDateMonthsName(campaignDate.getAttribute("datetime"));
  }
}


/**
 * Товар. Отзывы.
 * Используется в функциях: на странице "Товар".
 */
function Opinions() {
  const container = document.querySelector(".productView__opinion");
  if (!container) return;

  const opinions = container.querySelectorAll(".opinion__item");
  // const opinionsLength = opinions.length;

  // Добавить отзыв
  const opinionAdd = container.querySelector(".opinion__score-button");
  opinionAdd?.addEventListener("click", () => {
    setTimeout(() => {
      document.getElementById("goods_opinion_name").focus();
    }, 100);
  });

  // Хороший/Плохой отзыв
  let countGood = 0;
  let countBad = 0;
  opinions.forEach((opinion) => {
    const generally = opinion.getAttribute("data-generally");
    if (generally === "good") {
      countGood += 1;
    } else if (generally === "bad") {
      countBad += 1;
    }
    handleOpinionAvatarName(opinion);
  });

  // Добавления первой буквы Имени или Заголовка в Аватар
  function handleOpinionAvatarName(opinion) {
    const avatar = opinion.querySelector(".opinion__block-avatar");
    const name = opinion.querySelector(".opinion__name");
    if (avatar) {
      avatar.innerText = name.innerText.charAt(0);
    }
  }

  // Рейтинг при добавлении отзыва
  function initRating(container) {
    const stars = container.querySelectorAll(".opinion__rating label");
    let starsActive;

    stars.forEach((element, index) => {
      element.addEventListener("mouseover", () => {
        starsActive = Array.prototype.slice.call(stars, 0, index + 1);
        starsActive.forEach((star) => {
          star.classList.add("is-active");
        });
      });

      element.addEventListener("mouseout", () => {
        stars.forEach((star) => {
          star.classList.remove("is-active");
        });
      });

      element.addEventListener("click", () => {
        stars.forEach((star) => {
          star.classList.remove("is-select");
        });
        starsActive.forEach((star) => {
          star.classList.add("is-select");
        });
        starsSelect = starsActive;
      });
    });
  }
  initRating(container);

  // Капча
  function initCaptcha() {
    const captcha = document.querySelector(".captcha");
    if (!captcha) return false;
    const captchaButton = captcha.querySelector(".captcha__refresh");
    const captchaImage = captcha.querySelector(".captcha__image");

    // Действие при клике
    captchaButton.addEventListener("click", handleCaptchaClick);

    // Функции при клике
    function handleCaptchaClick(event) {
      event.preventDefault();
      handleCaptchaRefresh(event.target, 1, 1);
      captchaImage.setAttribute("src", captchaImage.getAttribute("src") + "&rand" + Math.random(0, 10000));
    }

    // Крутит изображение при обновлении картинки защиты от роботов
    function handleCaptchaRefresh(img, num, cnt) {
      if (cnt > 13) return false;
      img.setAttribute("src", img.getAttribute("rel") + "icon/refresh/" + num + ".gif");
      num = num == 6 ? 0 : num;
    }
  }
  initCaptcha();

  // // Рекомендуемый %
  // const scoreTotal = container.querySelector(".opinion__score-total");
  // if (scoreTotal) {
  //   const scoreTotalNumber = scoreTotal.querySelector("b");
  //   const scoreTotalPercent = parseInt((countGood / opinionsLength) * 100) + "%";
  //   scoreTotalNumber.innerHTML = scoreTotalPercent;
  // }

  // // Общий  Счётчик рейтинга для отзывов jQuery. Переписать на JS и проверить работу
  // for (let i = 1; i < 6; i++) {
  //   const opinionsRating = $(".opinion__item[data-rating=" + i + "]").length;
  //   const percent = parseInt(100 / (opinionsLength / opinionsRating));
  //   $(".opinion__grade[data-number=" + i + "] .opinion__grade-number").text(opinionsRating);
  //   $(".opinion__grade[data-number=" + i + "] progress").val(percent);
  // }

  // // Показать/скрыть все отзывы
  // const opinionButton = container.querySelector(".opinion__button");
  // if (opinionButton) {
  //   opinionButton.style.display = opinionsLength > 3 ? "" : "none";
  //   opinionButton.addEventListener("click", (event) => {
  //     const items = container.querySelector(".opinion__items");
  //     items.classList.toggle("opinion__items--show");
  //     const target = event.currentTarget;
  //     target.classList.toggle("is-active");
  //     if (target.classList.contains("is-active")) {
  //       target.innerHTML = "Скрыть отзывы";
  //     } else {
  //       target.innerHTML = "Показать все отзывы";
  //       container.scrollIntoView();
  //     }
  //   });
  // }
}

/**
 * Количество
 * Используется в функциях: handleCartInit, Goodsб на странице "Товар", "Корзина"
 * Использует функции: СreateNoty
 */
function Quantity(doc = document) {
  const qtys = doc.querySelector(".qty");
  if (!qtys) return;
  const minus = qtys.querySelector(".qty__select--minus");
  const plus = qtys.querySelector(".qty__select--plus");
  const input = qtys.querySelector(".qty__input");

  minus.addEventListener("click", () => {
    const val = parseInt(input.value) - 1;
    handleValueInput(val, input);
  });

  plus.addEventListener("click", () => {
    const val = parseInt(input.value) + 1;
    handleValueInput(val, input);
  });

  input.addEventListener("input", (event) => {
    const val = parseInt(input.value);
    handleValueMin(val, input);
    handleValueMax(val, input);

    if (event.target.closest(".productView")) {
      handleQuantityProductView(val, input);
    }
  });

  function handleValueInput(val, input) {
    input.value = val;
    input.setAttribute("value", val);
    input.dispatchEvent(new Event("input"));
  }

  function handleValueMin(val, input) {
    if (val < 1) {
      input.value = 1;
      input.setAttribute("value", 1);
    }
  }

  function handleValueMax(val, input) {
    const max = input.max || 99999;
    if (val > max) {
      input.value = max;
      input.setAttribute("value", max);
      // Сообщение пользователю
      СreateNoty("error", "Вы пытаетесь положить в корзину товар которого недостаточно в наличии");
    }
  }

  function handleQuantityProductView(val, input) {
    const max = input.max || 99999;
    if (val < 1) val = 1;
    if (val > max) val = max;
    const productView = input.closest(".productView");
    const priceNow = productView.querySelector(".price__now");
    const priceNowValue = priceNow.getAttribute("data-price") * val;
    priceNow.querySelector(".num").innerHTML = getMoneyFormat(priceNowValue);
    const priceOld = productView.querySelector(".price__old");
    const priceOldValue = parseInt(priceOld.getAttribute("data-price")) * val;
    if (priceOldValue > 0) {
      priceOld.querySelector(".num").innerHTML = getMoneyFormat(priceOldValue);
    }
  }
}

/**
 * Страница: Сравнение товаров
 */
function Compare() {
  const compareTable = document.querySelector(".compare__table");
  if (!compareTable) return;

  const swiper = new Swiper(".compare__line", {
    loop: false,
    allowTouchMove: false,
    autoplay: false,
    autoHeight: true,
    draggable: false,
    freeMode: false,
    grabCursor: false,
    simulateTouch: false,
    slidesPerView: 4,
    spaceBetween: 16,
    watchSlidesProgress: true,
    lazy: {
      enabled: false,
      loadPrevNext: true,
      loadOnTransitionStart: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      enabled: true,
      el: ".compare__nav .swiper-pagination",
      clickable: true,
      type: "bullets",
      dynamicBullets: true,
    },
    breakpoints: {
      0: {
        slidesPerView: "1",
      },
      320: {
        slidesPerView: "2",
      },
      480: {
        slidesPerView: "2",
      },
      640: {
        slidesPerView: "3",
      },
      768: {
        slidesPerView: "3",
      },
      1024: {
        slidesPerView: "4",
      },
      1200: {
        slidesPerView: "4",
      },
    },
  });

  const switcher = compareTable.querySelector(".compare__switcher");
  const switcherInput = switcher.querySelector("input");
  const compareLines = compareTable.querySelectorAll(".compare__line");
  const compareInputs = compareTable.querySelectorAll(".compare__input");
  const compareButtonShow = compareTable.querySelector(".compare__button-show");
  const compareButtonHide = compareTable.querySelector(".compare__button-hide");
  switcherInput.addEventListener("change", handleSwitcherInput);
  compareInputs.forEach((element) => element.addEventListener("change", handleCompareInput));
  compareButtonShow.addEventListener("click", handleCompareButtonShow);
  compareButtonHide.addEventListener("click", handleCompareButtonHide);

  function handleSwitcherInput(event) {
    if (event.currentTarget.checked) {
      compareButtonShow.classList.remove("is-hide");
      compareLines.forEach((element) => (element.style.display = element.matches(".is-same") ? "none" : ""));
    } else {
      compareButtonShow.classList.add("is-hide");
      compareLines.forEach((element) => (element.style.display = ""));
    }
  }

  function handleCompareInput() {
    compareButtonHide.classList.remove("is-hide");
  }

  function handleCompareButtonShow(event) {
    event.currentTarget.classList.add("is-hide");
    switcherInput.checked = false;
    compareLines.forEach((element) => (element.style.display = ""));
  }

  function handleCompareButtonHide() {
    compareButtonShow.classList.remove("is-hide");
    compareLines.forEach((element) => {
      const сhecked = element.querySelector(".compare__input:checked");
      if (сhecked) element.style.display = "none";
    });
  }
}

/**
 * Страница: Корзина
 * Используется в функциях: на странице "Корзина"
 * Использует функции: CartMinSum, Dialogs, getHtmlFromUrl, getHtmlFromPost
 * Использует функции: Orderfast, Passwords, OrderCoupons, ValidateRequired
 */
function Cart() {
  function handleCartInit() {
    const container = document.querySelector(".page-cart");
    const cartInner = container.querySelector(".cartInner");
    if (!cartInner) return;
    const cartRemoves = cartInner.querySelectorAll("[data-action=removeCartItem]");
    const cartClear = cartInner.querySelector("[data-action=clearCart]");
    const cartItem = cartInner.querySelectorAll(".cartTable__item");
    const cartQtyInputs = cartInner.querySelectorAll(".qty__input");

    cartRemoves.forEach((remove) => remove.addEventListener("click", handleCartRemoveItem));
    cartClear.addEventListener("click", handleCartClear);
    cartItem.forEach((item) => Quantity(item));
    cartQtyInputs.forEach((input) => input.addEventListener("input", handleCartQtyInput));
    CartMinSum();
    handleCartOrder();
  }
  handleCartInit();

  // Удаление товара из корзины
  function handleCartRemoveItem(event) {
    event.preventDefault();
    const yep = confirm("Вы точно хотите удалить товар из корзины?");
    if (yep === false) return;
    // event.currentTarget.closest(".cartTable__item").style.display = "none";
    const url = event.currentTarget.getAttribute("href");
    getHtmlFromUrl(url).then((html) => {
      document.querySelector(".page-cart").innerHTML = html.querySelector(".page-cart").innerHTML;
      handleCartInit();
      Dialogs();
    });
  }

  // Очистка товаров из корзины
  function handleCartClear(event) {
    event.preventDefault();
    const yep = confirm("Вы точно хотите очистить корзину?");
    if (yep === false) return;
    const url = event.currentTarget.getAttribute("href");
    getHtmlFromUrl(url).then((data) => {
      document.querySelector(".page-cart").innerHTML = data.querySelector(".page-cart").innerHTML;
    });
  }

  // Изменение количества в корзине
  function handleCartQtyInput(event) {
    event.preventDefault();
    const currentTarget = event.currentTarget;
    const cartForm = currentTarget.closest("form");
    const cartFormUrl = cartForm.getAttribute("action");
    const cartFormData = new FormData(cartForm);
    cartFormData.append("ajax_q", "1");
    // Отправка запроса
    getHtmlFromPost(cartFormUrl, cartFormData).then((data) => {
      const cartItem = currentTarget.closest(".cartTable__item");
      const cartItemModId = cartItem.getAttribute("data-mod-id");
      const cartItemPrice = cartItem.querySelector(".cartTable__price");
      const cartTotal = document.querySelector(".cartTotal__items");
      // const cartHeader = document.querySelector(".cartTable__header");
      const dataItemPrice = data.querySelector('.cartTable__item[data-mod-id="' + cartItemModId + '"] .cartTable__price');
      const dataCartTotal = data.querySelector(".cartTotal__items");
      // const dataCartHeader = data.querySelector(".cartTable__header");
      const cartTotalMin = document.querySelector(".cartTotal__min");
      const dataCartTotalMin = data.querySelector(".cartTotal__min");
      cartTotal.innerHTML = dataCartTotal.innerHTML;
      cartItemPrice.innerHTML = dataItemPrice.innerHTML;
      // cartHeader.innerHTML = dataCartHeader.innerHTML;
      cartTotalMin.innerHTML = dataCartTotalMin.innerHTML;
      CartMinSum();
      handleCartOrder();
    });
  }

  //
  function handleCartOrder() {
    const container = document.querySelector(".page-cart");
    if (!container) return;
    const cartButtonStart = container.querySelector("[data-action=startOrder]");
    const cartButtonClose = container.querySelector("[data-action=closeOrder]");
    const cartButtonComplete = container.querySelector("[data-action=completeOrder]");
    const contrainerAjax = container.querySelector(".cartTable__ajax");
    const contraineCouponInput = container.querySelector(".coupon__input");

    cartButtonStart?.addEventListener("click", handleCartOrderStart);
    cartButtonClose?.addEventListener("click", handleCartOrderClose);
    cartButtonComplete?.addEventListener("click", handleCartOrderComplete);

    function handleCartOrderStart(event) {
      event.preventDefault();
      container.classList.add("is-loading");
      const url = "/cart/add";
      const formData = new FormData();
      formData.append("ajax_q", "1");
      formData.append("fast_order", "1");
      formData.append("form[coupon_code]", contraineCouponInput?.value || "");
      container.classList.add("is-started");
      getHtmlFromPost(url, formData).then((data) => {
        contrainerAjax.innerHTML = data.querySelector(".page-orderfast").innerHTML;
        scrollTop(contrainerAjax.offsetTop);
        Orderfast();
        Passwords();
        OrderCoupons();
        $(".form__phone").mask("+7 (999) 999-9999");
        container.classList.remove("is-loading");
        contrainerAjax.removeAttribute("hidden");
        const checkbox = document.querySelector("#form_policy_orderfast");
        checkbox?.removeAttribute("required");
        // Заполняем все поля промокода для синхронизации
        const couponInputs = document.querySelectorAll(".coupon__input");
        if (couponInputs.length > 0) {
          couponInputs.forEach((input) => {
            input.value = contraineCouponInput?.value || "";
            input.dispatchEvent(new Event("input"));
          });
        }
        new AirDatepicker("#order_delivery_convenient_date", {
          autoClose: true,
          onSelect: function ({ datepicker }) {
            ValidateInput(datepicker.$el);
          },
        });
      });
    }

    function handleCartOrderClose() {
      contrainerAjax.setAttribute("hidden", "");
      container.classList.remove("is-started");
      const url = "/cart/add";
      getHtmlFromUrl(url).then((data) => {
        const cartTotalItems = document.querySelector(".cartTotal__items");
        const dataCartTotalItems = data.querySelector(".cartTotal__items");
        cartTotalItems.innerHTML = dataCartTotalItems.innerHTML;
        document.querySelector(".orderfast__container").remove();
        CartMinSum();
      });
    }

    function handleCartOrderComplete() {
      const form = container.querySelector(".orderfast__form");
      ValidateRequired(form);
    }
  }
}

/**
 * Функция вычисления остатка до минимальной суммы заказа
 * Используется в функциях: handleCartInit, handleCartQtyInput, handleCartOrderClose, handleAddtoOrderOpen
 * Использует функции: getMoneyFormat
 */
function CartMinSum() {
  const cartMins = document.querySelectorAll(".cartTotal__min");
  const cartButtonStart = document.querySelector("[data-action=startOrder]");

  if (cartMins.length === 0) {
    cartButtonStart.removeAttribute("disabled");
    cartButtonStart.classList.remove("button-disabled");
  }

  cartMins.forEach((cartMin) => {
    const price = cartMin.querySelector("data");
    const minPrice = parseInt(price.value);
    const totalSum = parseInt(price.getAttribute("data-total"));
    if (minPrice > totalSum) {
      const diff = minPrice - totalSum;
      price.querySelector(".num").innerHTML = getMoneyFormat(diff);
      cartButtonStart.setAttribute("disabled", "");
      cartButtonStart.classList.add("button-disabled");
      cartMin.classList.remove("is-hide");
      cartMin.parentElement.classList.add("is-min");
    } else {
      cartButtonStart.removeAttribute("disabled");
      cartButtonStart.classList.remove("button-disabled");
      cartMin.classList.add("is-hide");
      cartMin.parentElement.classList.remove("is-min");
    }
  });
}

/**
 * Функция очистить товары в корзине.
 * Используется в функциях: handleAddtoCartClick, handleAddtoOrderClick, handleCartClear, на всех страницах.
 * Использует функции: getUrlBody, getHtmlFromUrl
 */
function CartClear() {
  const button = document.querySelector(".cart .addto__clear");
  if (!button) return;

  button.addEventListener("click", (event) => {
    event.preventDefault();
    const url = getUrlBody(button.getAttribute("href"));
    if (confirm("Вы точно хотите очистить корзину?")) {
      getHtmlFromUrl(url).then((data) => {
        document.querySelectorAll(".cart").forEach((element) => element.classList.add("is-empty"));
        document.querySelectorAll(".cart .addto__item").forEach((element) => element.remove());
        document.querySelectorAll(".cart-count").forEach((element) => element.innerHTML = "0");
        const productViewCart = document.querySelector(".productView__cart");
        if (productViewCart) {
          productViewCart.classList.remove("has-in-cart");
        }
      });
    }
  });
}

/**
 * Функция удаления товара из корзины.
 * Используется в функциях: handleAddtoCartClick, handleAddtoOrderClick, на всех страницах.
 * Использует функции: getUrlBody, getHtmlFromUrl, CountUppdate, CartCountendUppdate, CartDiscountUppdate
 */
function CartRemove() {
  const buttons = document.querySelectorAll(".cart .addto__remove");
  if (buttons.length === 0) return;

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      if (confirm("Вы точно хотите удалить товар из корзины?")) {
        const cartCounts = document.querySelectorAll(".cart-count");
        const cartCountends = document.querySelectorAll(".cart-countend");
        const cartSumDiscounts = document.querySelectorAll(".cart-sum-discount");
        const addtoDiscounts = document.querySelectorAll(".addto__discount");
        const url = getUrlBody(button.getAttribute("href"));
        const form = button.closest(".addto__item");
        const modId = form.getAttribute("data-mod-id");
        const id = form.getAttribute("data-id");
        const qty = button.getAttribute("data-qty");
        const oldCount = cartCounts[0].value;
        const newCount = parseInt(oldCount) - parseInt(qty);
        getHtmlFromUrl(url).then((data) => {
          if (newCount > 0) {
            const cartItems = document.querySelectorAll(".cart .addto__item");
            cartItems.forEach((element) => {
              if (element.getAttribute("data-mod-id") === modId) {
                element.remove();
              }
            });

            // Обновление ссылки добавления в корзину на странице товара
            const products = document.querySelectorAll(".product__item");
            if (products) {
              products.forEach((product) => {
                if (product.getAttribute("data-id") === id) {
                  const slot = product.querySelector(".product__cart [slot]");
                  if (slot) {
                    slot.innerHTML = "В корзину";
                    slot.parentElement.classList.remove("is-added");
                  }
                }
              });
            }
          }
          const productView = document.querySelector(".productView");
          if (productView && productView.getAttribute("data-mod-id") === modId) {
            productView.querySelector(".productView__cart").classList.remove("has-in-cart");
          }
          CountUppdate(cartCounts, newCount);
          CartEmptyUpdate(newCount);
          CartCountendUppdate(cartCountends, data.querySelector(".cart-countend"));
          CartDiscountUppdate(cartSumDiscounts, data.querySelector(".cart-sum-discount"));
          if (data.querySelector(".cartTotal__discount")) {
            CartDiscountUppdate(addtoDiscounts, data.querySelector(".cartTotal__discount"));
          }
        });
      }
    });
  });
}

/*
 * Функция обновления счетчика в корзине
 * Используется в функциях: CartRemove, handleAddtoCartUpdate, handleAddtoOrderUpdate
 * Использует функции: CartEmptyUpdate
 */
function CountUppdate(elements, count) {
  if (elements.length === 0) return;
  elements.forEach((element) => {
    element.value = count;
    element.innerHTML = count;
  });
}

/*
 * Функция определения добавленных товаров в корзине.
 * Используется в функциях: CountUppdate
 */
function CartEmptyUpdate(count) {
  const carts = document.querySelectorAll(".cart");
  if (carts.length === 0) return;
  carts.forEach((element) => {
    count > 0 ? element.classList.remove("is-empty") : element.classList.add("is-empty");
  });
}

/*
 * Функция обновления счетчика кол-ва с окончанием в корзине.
 * Используется в функциях: CartRemove
 */
function CartCountendUppdate(elements, selector) {
  if (elements.length === 0) return;
  elements.forEach((element) => {
    element.value = selector ? selector.value : 0;
    element.innerHTML = selector ? selector.innerHTML : "0 товаров";
  });
}

/**
 * Функция обновления цены в корзине.
 * Используется в функциях: CartRemove, handleAddtoCartUpdate, handleAddtoOrderUpdate
 */
function CartDiscountUppdate(elements, selector) {
  if (elements.length === 0) return;
  elements.forEach((element) => {
    element.value = selector ? selector.value : 0;
    element.innerHTML = selector ? selector.innerHTML : "";
  });
}

/**
 * Оформление быстрого заказа
 * Используется в функциях: handleAddtoOrderOpen, handleCartOrderStart
 */
function Orderfast(doc = document) {
  const container = doc.querySelector(".orderfast__container");
  // console.log("[DEBUG]: container", container);
  if (!container) return;
  // const form = container.querySelector("form");
  const deliverySelect = container.querySelector(".order-delivery__select");
  const deliveryZones = container.querySelectorAll(".order-delivery-zone__selects");
  const deliveryZoneSelects = container.querySelectorAll(".order-delivery-zone__select");
  const deliveryZoneSelected = container.querySelector(".order-delivery-zone__selects:not(.is-hide) .order-delivery-zone__select");
  const deliveryPrices = container.querySelectorAll(".order-delivery__total b");
  const deliveryDescs = container.querySelectorAll(".order-delivery__description");
  const deliveryZoneRules = container.querySelectorAll(".order-delivery__rules");
  const paymentSelects = container.querySelectorAll(".order-payments__selects");
  let paymentSelected = container.querySelector(".order-payments__selects:not(.is-hide) select");
  const paymentDescs = container.querySelectorAll(".order-payments__desc");

  // Запуск функций при загрузке страницы
  handleVisibility(deliveryZones, deliverySelect.value);
  handleVisibility(deliveryDescs, deliverySelect.value);
  handleFormDeliveryZoneId(deliveryZoneSelected);
  handleVisibility(paymentSelects, deliverySelect.value);
  handleVisibility(paymentDescs, paymentSelected.value);
  handleFormPaymentId(paymentSelected);

  // Способы доставки
  deliverySelect.addEventListener("change", (event) => {
    const select = event.target;
    console.log("[DEBUG]: select1", select);
    console.log("[DEBUG]: paymentSelects1", paymentSelects);
    handleVisibility(deliveryZones, select.value);
    handleVisibility(deliveryDescs, select.value);
    handleDeliveryPrice(deliveryPrices, select[select.selectedIndex].getAttribute("data-price"));
    deliveryZoneSelects.forEach((selects) => handleDeliveryZone(selects));
    handleVisibility(paymentSelects, deliverySelect.value);
    // handleVisibility(paymentSelected, deliverySelect.value);
    paymentSelected = container.querySelector(".order-payments__selects:not(.is-hide) select");
    handleVisibility(paymentDescs, paymentSelected.value);
    const deliveryZoneSelected = document.querySelector(".order-delivery-zone__selects:not(.is-hide) .order-delivery-zone__select");
    handleFormDeliveryZoneId(deliveryZoneSelected);
  });

  // Зоны доставки
  deliveryZoneSelects.forEach((selects) => {
    handleDeliveryZone(selects);
    selects.addEventListener("change", (event) => {
      const select = event.target;
      console.log("[DEBUG]: select2", select);
      handleDeliveryPrice(deliveryPrices, select[select.selectedIndex].getAttribute("data-price"));
      handleVisibility(deliveryZoneRules, select.value);
      handleFormDeliveryZoneId(select);
    });
  });

  // Способы оплаты
  paymentSelects.forEach((selects) => {
    selects.addEventListener("change", (event) => {
      handleFormPaymentId(event.target);
      handleVisibility(paymentDescs, event.target.value);
    });
  });

  function handleDeliveryZone(selects) {
    if (!selects.parentElement.classList.contains("is-hide")) {
      handleDeliveryPrice(deliveryPrices, selects.options[selects.selectedIndex].getAttribute("data-price"));
      handleVisibility(deliveryZoneRules, selects.value);
    }
  }

  function handleDeliveryPrice(elements, value) {
    // console.log("[DEBUG]: element", elements);
    // console.log("[DEBUG]: value", value);
    const price = document.createElement("span");
    price.classList.add("num");
    price.append(getMoneyFormat(value));
    elements.forEach((element) => (element.innerHTML = price.outerHTML));

    // обновления цены доставки
    const cartDeliverys = document.querySelectorAll(".cart-delivery");
    cartDeliverys.forEach((delivery) => {
      delivery.innerHTML = price.outerHTML;
      delivery.value = value;
    });

    // обновления итоговой цены
    const cartTotals = document.querySelectorAll(".cart-total");
    const priceTotal = parseInt(cartTotals[0].value) + parseInt(cartDeliverys[0].value);
    cartTotals.forEach((total) => {
      total.querySelector(".num").innerHTML = getMoneyFormat(priceTotal);
    });
  }

  function handleFormDeliveryZoneId(selected) {
    // console.log("[DEBUG]: selected", selected);
    document.querySelector("[name='form[delivery][zone_id]']").value = selected ? selected.value : "";
  }

  function handleFormPaymentId(selected) {
    document.querySelector("[name='form[payment][id]']").value = selected.value;
  }

  function handleVisibility(elements, value) {
    // console.log("[DEBUG]: elements0", elements);
    // console.log("[DEBUG]: value0", value);
    if (elements.length === 0) return;
    elements.forEach((element) => {
      if (element.getAttribute("data-id") === value) {
        element.classList.remove("is-hide");
      } else {
        element.classList.add("is-hide");
      }
    });
  }
}

/**
 * Купоны
 * Используется в функциях: handleCartOrderStart
 * Использует функции: getHtmlFromPost
 */
function OrderCoupons() {
  const coupons = document.querySelectorAll(".coupon__order");
  if (coupons.length === 0) return;
  coupons.forEach((coupon) => {
    const couponInput = coupon.querySelector(".coupon__input");
    const couponReset = coupon.querySelector(".coupon__reset");
    const couponSubmit = coupon.querySelector(".coupon__button");

    couponSubmit.addEventListener("click", handleCouponSubmit);
    couponInput.addEventListener("input", handleCouponChange);
    couponReset.addEventListener("click", handleCouponReset);

    function handleCouponSubmit() {
      const value = couponInput.value;
      const url = "/order/stage/confirm";
      const formData = new FormData();
      const deliveryZoneId = document.querySelector(".order-delivery-zone__radio:checked");
      const deliveryId = document.querySelector(".order-delivery__radio:checked");
      formData.append("ajax_q", "1");
      formData.append("only_body", "1");
      formData.append("form[coupon_code]", value);
      if (deliveryId) {
        formData.append("form[delivery][id]", deliveryId.value);
      }
      if (deliveryZoneId) {
        formData.append("form[delivery][zone_id]", deliveryZoneId.value);
      }

      getHtmlFromPost(url, formData).then((data) => {
        handleCouponUpdate(data, coupon);
      });
    }

    function handleCouponChange(event) {
      event.target.setAttribute("value", event.target.value);
      document.querySelectorAll(".coupon__input").forEach((input) => input.setAttribute("value", event.target.value));
      handleCouponVisibility(coupon, event.target.value, "is-reset");
    }

    function handleCouponReset() {
      const cartSum = document.querySelector(".cart-sum-discount");
      const cartTotals = document.querySelectorAll(".cart-total");
      const cartCoupons = document.querySelectorAll(".coupon__input");
      couponInput.value = "";
      handleCouponSubmit();
      cartCoupons.forEach((input) => {
        input.setAttribute("value", "");
        input.classList.remove("is-reset", "is-error", "is-success");
      });
      coupon.classList.remove("is-reset", "is-error", "is-success");
      cartTotals.forEach((total) => {
        total.innerHTML = cartSum.innerHTML;
        total.value = cartSum.value;
      });
    }
  });
    
  function handleCouponUpdate(data, coupon) {
    const cartDiscounts = document.querySelectorAll(".cartTotal__discount");
    const cartCoupons = document.querySelectorAll(".cartTotal__coupons");
    const cartTotals = document.querySelectorAll(".cartTotal__total");
    const discountPrice = data.querySelector(".order-total__price");
    const cartTotalPriceSum = Math.floor(discountPrice.getAttribute("data-price"));
    const cartTotalPriceSumDelivery = Math.floor(discountPrice.getAttribute("data-price-delivery"));
    console.log('cartTotalPriceSumDelivery', cartTotalPriceSumDelivery);
    cartTotals.forEach((total) => {
      console.log('total', total);
      total.querySelector(".cart-total .num").innerHTML = getMoneyFormat(cartTotalPriceSumDelivery);
      total.querySelector(".cart-total").value = cartTotalPriceSumDelivery;
      total.querySelector(".cart-sum-discount").value = cartTotalPriceSumDelivery;
      total.querySelector(".cart-sum-discount .num").innerHTML = getMoneyFormat(cartTotalPriceSumDelivery);
      
    });

    const discount = data.querySelector(".order-discount");
    const input = coupon.querySelector(".coupon__input");

    if (discount) {
      const discountName = discount.querySelector(".order-discount__label");
      const discountValue = discount.querySelector(".order-discount__value");
      cartCoupons.forEach((coupons) => {
        coupons.querySelector(".cartTotal__label").innerHTML = discountName.innerHTML;
        coupons.querySelector(".cartTotal__price").innerHTML = discountValue.innerHTML;
        coupons.style.display = "";
      });
      input.classList.remove("is-error");
      input.classList.add("is-success");
      cartDiscounts?.forEach((discount) => (discount.style.display = "none"));
    } else {
      cartCoupons.forEach((coupons) => (coupons.style.display = "none"));
      cartDiscounts?.forEach((discount) => (discount.style.display = "none"));
      input.classList.remove("is-success");
      handleCouponVisibility(input, input.value, "is-error");
    }
  }

  function handleCouponVisibility(coupon, value, className) {
    if (value === "") {
      coupon.classList.remove(className);
    } else {
      coupon.classList.add(className);
    }
  }
}

/**
 * Валидация форм
 * Используется в функциях: Passwords, handleAddtoOrderOpen, handleCartOrderStart
 *  * @param {HTMLElement|Document} doc - Родительский элемент для поиска обязательных полей
 *  */
function ValidateRequired(doc = document) {
  const requireds = doc.querySelectorAll("[required]");
  requireds.forEach((item) => {
    item.addEventListener("input", () => {
      ValidateInput(item);
    });
    ValidateInput(item);
  });
}

/**
 * Валидация поля
 * Используется в функциях: ValidateRequired, handleAddtoOrderOpen, handleCartOrderStart
 */
function ValidateInput(item) {
  if (item.value === "") {
    item.classList.add("is-error");
  } else {
    item.classList.remove("is-error");
  }
}

/**
 * Открытие элементов Поиск,
 * Используется в функциях: Search
 * Использует функции: search__reset
 */
function Opener() {
  // Открытие блоков в подвале
  const footerTitles = document.querySelectorAll("[data-footer-title]");
  if (footerTitles.length > 0) {
    footerTitles.forEach((title) => {
      title.addEventListener("click", (event) => {
        event.preventDefault();
        title.parentElement.classList.toggle("is-opened");
      });
    });
  }

  // Открытие мобильного поиска
  const search = document.querySelector("[data-search-mobile-button]");
  const reset = document.querySelector("[data-search-reset]");
  if (search) {
    search.addEventListener("click", (event) => {
      event.preventDefault();
      const parent = event.currentTarget.parentElement;
      if (parent.classList.contains("is-opened")) {
        reset.click();
      } else {
        setTimeout(() => {
          parent.querySelector("[data-search-input]").focus();
        }, 100);
      }
      // Открытие мобильного поиска
      OverlayOpener(parent, handleSearchOpened);
    });
    // Закрытие мобильного поиска
    function handleSearchOpened(event) {
      OverlayCloser(event, "[data-search]", handleSearchOpened);
    }
  }

  // Открытие мобильного каталога
  const catalogButton = document.querySelector("[data-mobile-catalog-button]");
  if (catalogButton) {
    catalogButton.addEventListener("click", (event) => {
      event.preventDefault();
      const parentTarget = event.currentTarget.closest('[data-mobile-catalog]');
      if(getClientWidth() > 1024) {
        OverlayOpener(parentTarget, handleCatalogOpened);
      } else {
        document.querySelector('#addtoMenu').removeAttribute('hidden');
        document.body.classList.add('is-bodylock');
      }
    });
    // Закрытие мобильного каталога
    function handleCatalogOpened(event) {
      OverlayCloser(event, "[data-mobile-catalog]", handleCatalogOpened);
    }
  }

  // const mobileMenu = document.querySelector("[data-mobile-menu=open]");
  // const mobileContent = document.querySelector("[data-mobile-menu=content]");
  // const mobileСlose = document.querySelector("[data-mobile-menu=close]");
  // if (mobileMenu) {
  //   mobileMenu.addEventListener("click", (event) => {
  //     event.preventDefault();
  //     event.currentTarget.classList.toggle("is-opened");
  //     console.log('mobileContent', mobileContent);
  //     if (mobileContent.classList.contains("is-opened")) {
  //       mobileContent.setAttribute("hidden", "");
  //       document.body.classList.remove("is-bodylock");
  //     } else {
  //       mobileContent.removeAttribute("hidden");
  //       document.body.classList.add("is-bodylock");
  //     }
  //     mobileContent.classList.toggle("is-opened");
  //   });
  //   mobileСlose.addEventListener("click", () => {
  //     mobileMenu.classList.remove("is-opened");
  //     mobileContent.classList.remove("is-opened");
  //     mobileContent.setAttribute("hidden", "");
  //     document.body.classList.remove("is-bodylock");
  //   });
  // }

  // Открытие каталога с сохранением вложенности
  const catalogOpens = document.querySelectorAll("[data-catalog-parent-button]");
  if (catalogOpens.length > 0) {
    catalogOpens.forEach((catalogOpen) => {
      catalogOpen.addEventListener("click", (event) => {
        event.preventDefault();
        const open = event.currentTarget;
        const parent = open.closest(".is-parent");
        const sub = open.parentElement.nextElementSibling;
        if (parent.classList.contains("is-opened")) {
          SlideUp(sub, 600);
          parent.classList.remove("is-opened");
          open.classList.remove("is-opened");
        } else {
          SlideDown(sub, 600);
          parent.classList.add("is-opened");
          open.classList.add("is-opened");
        }
      });
    });
  }

  const mobileNavLinks = document.querySelectorAll("[data-mobile-open]");
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const element = event.currentTarget.getAttribute("data-mobile-open");
      console.log('element', element);
      const sidebar = document.querySelectorAll(".sidebar");
      sidebar.forEach(item => {
        item.setAttribute("hidden", "hidden");
      });
      if (element === "compare") {
        document.querySelector("#addtoCompare").removeAttribute("hidden");
      } else if (element === "favorites") {
        document.querySelector("#addtoFavorites").removeAttribute("hidden");
      } else if (element === "cart") {
        document.querySelector("#addtoCart").removeAttribute("hidden");
      } else if (element === "menu") {
        document.querySelector("#addtoMenu").removeAttribute("hidden");
      }
    });
  });

  const headerButton = document.querySelector(".header__menu-button");
  if (headerButton) {
    headerButton.addEventListener("click", (event) => {
      event.preventDefault();
      document.querySelector(".mobile-nav__link.menu").click();
    });
  }

  SidebarOpener("#addtoCart", ".addto__link.cart");
  SidebarOpener("#addtoCompare", ".addto__link.compare");
  SidebarOpener("#addtoFavorites", ".addto__link.favorites");
  SidebarOpener("#addtoMenu", ".mobile-nav__link.menu");
}

/**
 * Функция открытия сайдбара
 */
function SidebarOpener(selector, opener) {
  const content = document.querySelector(selector);
  if (!content) return;
  const button = document.querySelector(opener);
  const header = content.querySelector(".sidebar__header");

  button?.addEventListener("click", handleOpen);
  header?.addEventListener("click", handleClosed);
  content.addEventListener("click", handleCloseOutside);

  function handleCloseOutside(event) {
    const target = event.currentTarget;
    const isClickedOutside = event.target === target;
    if (isClickedOutside) {
      handleClosed();
    }
  }

  function handleOpen(event) {
    event.preventDefault();
    console.log('button', button)
    if (button.classList.contains("is-active")) {
      handleClosed();
    } else {
      handleOpened();
    }
  }

  function handleOpened() {
    // button.classList.add("is-active");
    content.removeAttribute("hidden");
    document.body.classList.add("is-bodylock");
  }

  function handleClosed() {
    // button.classList.remove("is-active");
    content.setAttribute("hidden", "");
    document.body.classList.remove("is-bodylock");
  }
}

/**
 * Функция Показать все/Скрыть.
 */
function VisibleItems(selector) {
  // Находим основной блок
  const block = document.querySelector(selector);
  if (!block) return;
  
  // Находим кнопку переключения видимости
  const button = block.querySelector("[data-visible-button]");
  if (!button) return;
  
  // Получаем все элементы, которые могут быть скрыты/показаны
  const items = block.querySelectorAll("[data-visible-item]");
  
  // Фильтруем только видимые элементы (имеющие размеры)
  const visibleItems = Array.from(items).filter(
    item => !!(item.offsetWidth || item.offsetHeight || item.getClientRects().length)
  );
  
  // Управляем отображением кнопки - показываем только если есть скрытые элементы
  const hasHiddenItems = items.length > visibleItems.length;
  button.parentElement.style.display = hasHiddenItems ? "block" : "none";

  // Обработчик клика по кнопке
  button.addEventListener("click", (event) => {
    event.preventDefault();
    
    // Меняем текст кнопки используя слоты
    SlotText(event.currentTarget);
    
    // Переключаем активное состояние для кнопки и блока
    event.currentTarget.classList.toggle("is-active");
    block.classList.toggle("is-active");
    
    // Прокручиваем к нужной позиции с задержкой
    setTimeout(() => {
      // Если кнопка активна - остаемся на месте, иначе прокручиваем к блоку
      scrollTop(button.classList.contains("is-active") ? true : block.offsetTop);
    }, 100);
  });
}

/**
 * Плавно прокручивает страницу к указанной позиции
 * @param {number|boolean} offsetTop - Расстояние от верха страницы в пикселях
 * @returns {boolean} - Возвращает false если offsetTop === true, иначе undefined
 * @throws {Error} - Если offsetTop не является числом или boolean
 * 
 * @example
 * // Прокрутка к началу страницы
 * scrollTop(0);
 * 
 * // Прокрутка к элементу с отступом 100px от верха
 * scrollTop(100);
 * 
 * // Отмена прокрутки
 * scrollTop(true);
 */
function scrollTop(offsetTop) {
  // Проверяем тип входного параметра
  if (typeof offsetTop !== 'number' && typeof offsetTop !== 'boolean') {
    throw new Error('offsetTop должен быть числом или boolean');
  }

  // Если offsetTop === true, отменяем прокрутку
  if (offsetTop === true) {
    return false;
  }

  // Проверяем, что offsetTop не отрицательное число
  if (offsetTop < 0) {
    offsetTop = 0;
  }

  // Плавно прокручиваем страницу
  window.scrollTo({
    top: offsetTop,
    left: 0,
    behavior: "smooth"
  });
}

/**
 * Слайдер Обычный на главной.
 * Используется в функциях: на главной странице
 * Использует функции: Swiper
 */
function swiperBanners(selector) {
  const slider = document.querySelector(selector);
  if (!slider) return;
  const swiper = new Swiper(selector + " .swiper", {
    loop: false,
    autoplay: false,
    autoHeight: false,
    watchSlidesProgress: true,
    simulateTouch: true,
    grabCursor: true,
    slidesPerView: 3,
    spaceBetween: 16,
    preloadImages: false,
    initialSlide: 2,
    navigation: {
      nextEl: selector + " .swiper-button-next",
      prevEl: selector + " .swiper-button-prev",
    },
    pagination: {
      enabled: true,
      el: selector + " .swiper-pagination",
      clickable: true,
      type: "bullets",
      dynamicBullets: true,
      dynamicMainBullets: 1,
    },
    scrollbar: {
      enabled: true,
      el: selector + " .swiper-scrollbar",
      snapOnRelease: true,
      draggable: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      320: {
        slidesPerView: 1,
      },
      480: {
        slidesPerView: 1,
      },
      640: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 3,
      }
    },
  });
}

/**
 * Слайдер Новостей.
 * Используется в функциях: на всех страницах
 * Использует функции: Swiper
 */
function swiperNews(selector) {
  const related = document.querySelector(selector);
  // console.log("[DEBUG]: related", related);
  if (!related) return;
  const swiper = new Swiper(selector + " .swiper", {
    loop: true,
    autoplay: false,
    autoHeight: true,
    watchSlidesProgress: true,
    simulateTouch: true,
    grabCursor: true,
    slidesPerView: 3,
    spaceBetween: 16,
    preloadImages: false,
    navigation: {
      nextEl: "#news .swiper-button-next",
      prevEl: "#news .swiper-button-prev",
    },
    pagination: {
      enabled: true,
      el: "#news .swiper-pagination",
      clickable: true,
      type: "bullets",
      dynamicBullets: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      320: {
        slidesPerView: 1,
      },
      375: {
        slidesPerView: 1,
      },
      480: {
        slidesPerView: 1,
      },
      640: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 3,
      }
    },
  });
}


/**
 * Слайдер товаров на главной.
 * Используется в функциях: на главной
 * Использует функции: Swiper
 */
function swiperPdt(selector) {
  const related = document.querySelector(selector);
  // console.log("[DEBUG]: related", related);

  if (!related) return;
  const swiper = new Swiper(selector + " .swiper", {
    loop: false,
    autoplay: false,
    watchSlidesProgress: true,
    simulateTouch: true,
    grabCursor: true,
    slidesPerView: 4,
    spaceBetween: 16,
    preloadImages: false,
    navigation: {
      nextEl: selector + " .swiper-button-next",
      prevEl: selector + " .swiper-button-prev",
    },
    pagination: {
      enabled: true,
      el: selector + " .swiper-pagination",
      clickable: true,
      type: "bullets",
      dynamicBullets: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      320: {
        slidesPerView: 2,
      },
      375: {
        slidesPerView: 2,
      },
      480: {
        slidesPerView: 2,
      },
      640: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      }
    },
  });
  // console.log("[DEBUG]: swiper", swiper);
}

/**
 * Слайдер Маленький.
 * Используется в функциях: на всех страницах
 * Использует функции: Swiper
 */
function swiperSmall(selector) {
  const related = document.querySelector(selector);
  console.log("[DEBUG]: swiperSmall", related);

  if (!related) return;
  const swiper = new Swiper(selector + " .swiper", {
    loop: false,
    autoplay: false,
    watchSlidesProgress: true,
    simulateTouch: true,
    grabCursor: true,
    slidesPerView: 5,
    spaceBetween: 16,
    preloadImages: false,
    navigation: {
      nextEl: selector + " .swiper-button-next",
      prevEl: selector + " .swiper-button-prev",
    },
    pagination: {
      enabled: true,
      el: selector + " .swiper-pagination",
      clickable: true,
      type: "bullets",
      dynamicBullets: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      320: {
        slidesPerView: 2,
      },
      375: {
        slidesPerView: 2,
      },
      480: {
        slidesPerView: 2,
      },
      640: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 4,
      },
      1200: {
        slidesPerView: 5,
      }
    },
  });
}

/**
 * Слайдер Обычный.
 * Используется в функциях: на всех страницах
 * Использует функции: Swiper
 */
function swiperMedium(selector) {
  const related = document.querySelector(selector);
  if (!related) return;
  const swiper = new Swiper(selector + " .swiper", {
    loop: false,
    autoplay: false,
    watchSlidesProgress: true,
    simulateTouch: true,
    grabCursor: true,
    slidesPerView: 4,
    spaceBetween: 16,
    preloadImages: false,
    navigation: {
      nextEl: selector + " .swiper-button-next",
      prevEl: selector + " .swiper-button-prev",
    },
    pagination: {
      enabled: true,
      el: selector + " .swiper-pagination",
      clickable: true,
      type: "bullets",
      dynamicBullets: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      320: {
        slidesPerView: 2,
      },
      375: {
        slidesPerView: 2,
      },
      480: {
        slidesPerView: 2,
      },
      640: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 4,
      },
      1200: {
        slidesPerView: 4,
      }
    },
  });
}

/**
 * Слайдшоу
 * Используется в функциях: на главной
 * Использует функции: Swiper
 */
function swiperShow() {
  const id = "#slideshow";
  const swiperSlider = new Swiper(id + " .swiper", {
    loop: false,
    preloadImages: false,
    watchSlidesProgress: true,
    watchOverflow: true,
    hashNavigation: false,
    slidesPerView: "1",
    spaceBetween: 16,
    speed: 400,
    autoplay: {
      enabled: false,
      delay: 5000,
    },
    navigation: {
      enabled: true,
      nextEl: id + " .swiper-button-next",
      prevEl: id + " .swiper-button-prev",
    },
    pagination: {
      enabled: true,
      el: id + " .swiper-pagination",
      clickable: true,
      type: "bullets",
      dynamicBullets: false,
    },
    scrollbar: {
      enabled: true,
      el: id + " .swiper-scrollbar",
      snapOnRelease: true,
      draggable: true,
    },
  });
}


/**
 * Слайдер Вы смотрели.
 * Используется в функциях: на всех страницах
 * Использует функции: Swiper
 */
function swiperViewed(selector) {
  const related = document.querySelector(selector);
  // console.log("[DEBUG]: related", related);

  if (!related) return;
  const swiper = new Swiper(selector + " .swiper--products", {
    loop: false,
    autoplay: false,
    watchSlidesProgress: true,
    simulateTouch: true,
    grabCursor: true,
    slidesPerView: 6,
    spaceBetween: 16,
    preloadImages: false,
    navigation: {
      nextEl: selector + " .swiper-button-next",
      prevEl: selector + " .swiper-button-prev",
    },
    pagination: {
      enabled: true,
      el: selector + " .swiper-pagination",
      clickable: true,
      type: "bullets",
      dynamicBullets: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      320: {
        slidesPerView: 2,
      },
      480: {
        slidesPerView: 3,
      },
      640: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 4,
      },
      1024: {
        slidesPerView: 4,
      },
      1440: {
        slidesPerView: 5,
      },
      1920: {
        slidesPerView: 6,
      },
    },
  });
  // console.log("[DEBUG]: swiper", swiper);
}


/**
 * Слайдер товаров на главной.
 * Используется в функциях: на главной
 * Использует функции: Swiper
 */
function swiperOpinions(selector) {
  const related = document.querySelector(selector);
  // console.log("[DEBUG]: related", related);

  if (!related) return;
  const swiper = new Swiper(selector + " .swiper", {
    loop: false,
    autoplay: false,
    watchSlidesProgress: true,
    simulateTouch: true,
    grabCursor: true,
    slidesPerView: 4,
    spaceBetween: 16,
    preloadImages: false,
    navigation: {
      nextEl: selector + " .swiper-button-next",
      prevEl: selector + " .swiper-button-prev",
    },
    pagination: {
      enabled: true,
      el: selector + " .swiper-pagination",
      clickable: true,
      type: "bullets",
      dynamicBullets: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      320: {
        slidesPerView: 1,
      },
      375: {
        slidesPerView: 1,
      },
      480: {
        slidesPerView: 2,
      },
      640: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      }
    },
  });
  // console.log("[DEBUG]: swiper", swiper);
}

/**
 * Табы.
 * Используется в функциях: на странице Товар
 * Использует функции: 
 */
function Tabs(selector) {
  const block = document.querySelector(selector);
  if (!block) return;
  const tabsContainer = block;
  const tabsContent = block.querySelectorAll('[data-tabs-content]');
  const tabsLinks = block.querySelectorAll('[data-tabs-link]');

  if (!tabsContainer || !tabsContent.length || !tabsLinks.length) return;

  tabsContainer.addEventListener('click', handleTabClick);

  function handleTabClick(event) {
    const target = event.target.closest('[data-tabs-link]');
    if (!target) return;

    event.preventDefault();

    // Убираем активный класс у всех табов
    tabsLinks.forEach(link => link.classList.remove('is-active'));
    // Добавляем активный класс текущему табу
    target.classList.add('is-active');

    const tabId = target.dataset.tabsLink;

    // Скрываем все контенты
    tabsContent.forEach(content => {
      content.classList.remove('is-active');
      if (content.dataset.tabsContent === tabId) {
        content.classList.add('is-active');
      }
    });
  }
}

/**
 * Слайдер изображений товара.
 * Используется в функциях: на странице "Товары"
 * Использует функции: Swiper
 */
function swiperProductImages(id) {
  // Основной слайдер
  var swiper = new Swiper(id, {
    loop: false,
    autoplay: false,
    watchSlidesVisibility: true,
    simulateTouch: true,
    grabCursor: true,
    slideToClickedSlide: true,
    slidesPerView: '1',
    spaceBetween: 0,
    preventClicks: true,
    watchOverflow: true,
    preloadImages: false,
    nested: true,
    lazy: {
      enabled: true,
      loadPrevNext: true,
      loadOnTransitionStart: true,
    },
    pagination: {
      enabled: false,
      el: id + ' .swiper-pagination',
      type: 'bullets',
      dynamicBullets: true,
      clickable: true,
    },
    scrollbar: {
      enabled: true,
      el: id + ' .swiper-scrollbar',
      snapOnRelease: true,
      draggable: true,
    },
    navigation: {
      enabled: false,
      nextEl: id + ' .swiper-button-next',
      prevEl: id + ' .swiper-button-prev',
    },
  });
}

/**
 * Обрабатывает авторизацию пользователя без перезагрузки страницы
 * 
 * Функция инициализирует обработку формы авторизации и обновляет UI после успешной авторизации:
 * - Отправляет данные формы асинхронно
 * - Обновляет содержимое диалога авторизации
 * - Обновляет ссылку авторизации в шапке сайта
 * - Обрабатывает ошибки и показывает уведомления
 * 
 * @requires getHtmlFromPost - Функция для отправки POST-запроса
 * @requires СreateNoty - Функция для создания уведомлений
 * 
 * @example
 * // HTML
 * <div id="dialogLogin">
 *   <form action="/auth" method="post">
 *     <input type="text" name="login" required>
 *     <input type="password" name="password" required>
 *     <button type="submit">Войти</button>
 *   </form>
 * </div>
 * 
 * // JavaScript
 * Autorization();
 */
function Autorization() {
  // Получаем элементы формы авторизации
  const dialogBlock = document.getElementById("dialogLogin");
  const authForm = dialogBlock?.querySelector("form");

  // Проверяем наличие необходимых элементов
  if (!dialogBlock || !authForm) {
    console.warn("[WARNING]: Authorization elements not found");
    return;
  }

  // Константы для селекторов
  const SELECTORS = {
    loginLink: ".addto__link.login",
    dialogContent: "#dialogLogin .dialog__container"
  };

  // Сообщения об ошибках
  const MESSAGES = {
    error: "Ошибка авторизации. Попробуйте позже.",
    success: "Авторизация успешно выполнена"
  };

  /**
   * Обновляет содержимое диалога авторизации
   * @param {Document} responseData - HTML-документ с ответом сервера
   */
  const updateDialogContent = (responseData) => {
    const newDialogContent = responseData.querySelector(SELECTORS.dialogContent)?.innerHTML;
    if (newDialogContent) {
      dialogBlock.querySelector(".dialog__container").innerHTML = newDialogContent;
    }
  };

  /**
   * Обновляет ссылку авторизации в шапке сайта
   * @param {Document} responseData - HTML-документ с ответом сервера
   */
  const updateLoginLink = (responseData) => {
    const loginLink = document.querySelector(SELECTORS.loginLink);
    const newLoginLink = responseData.querySelector(SELECTORS.loginLink);

    console.log('loginLink', loginLink);
    console.log('newLoginLink', newLoginLink);

    if (loginLink && newLoginLink) {
      loginLink.innerHTML = newLoginLink.innerHTML;
    }
  };

  /**
   * Обрабатывает отправку формы авторизации
   * @param {Event} event - Событие отправки формы
   */
  const handleAuthForm = async (event) => {
    event.preventDefault();

    try {
      // Добавляем индикатор загрузки
      dialogBlock.classList.add("is-loading");

      // Подготавливаем данные формы
      const formData = new FormData(authForm);
      formData.append("ajax_q", "1");

      // Отправляем запрос на сервер
      const responseData = await getHtmlFromPost(authForm.action, formData);

      // Показываем уведомление об успехе/ошибке
      const noticeError = responseData.querySelector('.notice--error')
      const noticeSuccess = responseData.querySelector('.notice--success')

      if (noticeError) {
        СreateNoty("error", noticeError.textContent);
      }

      if (noticeSuccess) {
        СreateNoty("success", noticeSuccess.textContent);
      }

      // Обновляем UI
      updateDialogContent(responseData);
      updateLoginLink(responseData);
    } catch (error) {
      console.error("[ERROR]: Authorization failed", error);
      СreateNoty("error", MESSAGES.error);
    } finally {
      // Убираем индикатор загрузки
      dialogBlock.classList.remove("is-loading");
    }
  };

  // Добавляем обработчик отправки формы
  authForm.addEventListener("submit", handleAuthForm);
}

/**
 * Обрабатывает отправку формы без перезагрузки страницы
 * 
 * Функция инициализирует обработку формы и отправляет данные асинхронно:
 * - Отправляет данные формы через POST-запрос
 * - Обрабатывает ответ сервера
 * - Показывает уведомления об успехе/ошибке
 * - Автоматически закрывает модальное окно после успешной отправки
 * 
 * @param {string} id - ID блока с формой
 * @param {string} successMessage - Сообщение об успешной отправке
 * @param {string} errorMessage - Сообщение об ошибке
 * 
 * @requires getJsonFromPost - Функция для отправки POST-запроса
 * @requires СreateNoty - Функция для создания уведомлений
 * 
 * @example
 * // HTML
 * <div id="contactForm">
 *   <form action="/contact" method="post">
 *     <input type="text" name="name" required>
 *     <input type="email" name="email" required>
 *     <textarea name="message" required></textarea>
 *     <button type="submit">Отправить</button>
 *   </form>
 * </div>
 * 
 * // JavaScript
 * Form(
 *   "contactForm",
 *   "Сообщение успешно отправлено",
 *   "Произошла ошибка при отправке"
 * );
 */
function Form(id, successMessage, errorMessage) {
  // Получаем элементы формы
  const formBlock = document.getElementById(id);
  const formElement = formBlock?.querySelector("form");
  const formButton = formElement?.querySelector("button");

  // Проверяем наличие необходимых элементов
  if (!formBlock || !formElement) {
    console.warn(`[WARNING]: Form elements not found for id: ${id}`);
    return;
  }

  // Константы для настройки
  const CONFIG = {
    closeDelay: 3000, // Задержка закрытия модального окна в мс
    ajaxFlag: "ajax_q",
    bodyOnlyFlag: "only_body"
  };

  /**
   * Показывает уведомление в зависимости от статуса ответа
   * @param {Object} response - Ответ сервера
   * @param {string} response.status - Статус ответа
   * @param {string} [response.message] - Сообщение от сервера
   */
  const showNotification = (response) => {
    if (response.status === "ok") {
      СreateNoty("success", successMessage);
    } else {
      СreateNoty("error", response.message || errorMessage);
    }
  };

  /**
   * Закрывает модальное окно с задержкой
   */
  const closeModal = () => {
    if (formBlock.hasAttribute("open")) {
      setTimeout(() => formBlock.close(), CONFIG.closeDelay);
    }
  };

  /**
   * Обрабатывает отправку формы
   * @param {Event} event - Событие отправки формы
   */
  const handleForm = async (event) => {
    event.preventDefault();

    try {
      // Добавляем индикатор загрузки
      formBlock.classList.add("is-loading");
      formButton.classList.add("is-loading");

      // Подготавливаем данные формы
      const formData = new FormData(formElement);
      formData.append(CONFIG.ajaxFlag, "1");
      formData.append(CONFIG.bodyOnlyFlag, "1");

      // Отправляем запрос на сервер
      const response = await getJsonFromPost(formElement.action, formData);

      // Показываем уведомление
      showNotification(response);

      // Закрываем модальное окно при успешной отправке
      if (response.status === "ok") {
        closeModal();
      }

    } catch (error) {
      console.error("[ERROR]: Form submission failed", error);
      СreateNoty("error", errorMessage);
    } finally {
      // Убираем индикатор загрузки
      formBlock.classList.remove("is-loading");
      formButton.classList.remove("is-loading");
    }
  };

  // Добавляем обработчик отправки формы
  formElement.addEventListener("submit", handleForm);
}

/**
 * Инициализирует кнопку прокрутки страницы вверх
 * 
 * Функция добавляет обработчики событий для кнопок с классом 'toTop':
 * - Отслеживает скролл страницы и показывает/скрывает кнопку
 * - При клике плавно прокручивает страницу вверх
 * 
 * @example
 * // HTML
 * <button class="toTop is-hidden">Наверх</button>
 * 
 * // JavaScript
 * toTop();
 * 
 * @requires scrollTop - Функция для плавной прокрутки страницы
 */
function toTop() {
  // Получаем все кнопки "наверх"
  const topButtons = document.querySelectorAll('.toTop');

  // Если кнопок нет, завершаем выполнение
  if (!topButtons.length) return;

  // Константы для настройки
  const SCROLL_THRESHOLD = 99; // Порог скролла в пикселях

  // Функция для обработки скролла
  const handleScroll = () => {
    const isScrolled = window.scrollY > SCROLL_THRESHOLD;

    topButtons.forEach(button => {
      button.classList.toggle('is-hidden', !isScrolled);
    });
  };

  // Функция для обработки клика
  const handleClick = () => {
    scrollTop(0);
  };

  // Добавляем обработчики для каждой кнопки
  topButtons.forEach(button => {
    // Добавляем обработчик скролла
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Добавляем обработчик клика
    button.addEventListener('click', handleClick);

    // Добавляем поддержку клавиатуры
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    });
  });

  // Вызываем handleScroll сразу для установки начального состояния
  handleScroll();
}

function ScrollToTop() {
  const button = document.querySelector('.mobile-nav__link--go');
  const buttonText = button.querySelector('.mobile-nav__label');
  const SCROLL_THRESHOLD = 200;

  // Функция для плавного скролла
  function smoothScrollTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Обработчик клика
  function handleClick(event) {
    event.preventDefault();

    if (window.scrollY > 0) {
      smoothScrollTop();
    } else {
      window.location.href = '/';
    }
  }

  // Обработчик нажатия клавиши
  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(event);
    }
  }

  // Обновление состояния кнопки
  function updateButtonState() {
    const isScrolled = window.scrollY > SCROLL_THRESHOLD;

    button.classList.toggle('is-visible', isScrolled);
    buttonText.textContent = isScrolled ? 'Наверх' : 'Главная';
    button.setAttribute('aria-label',
      isScrolled ? 'Прокрутить наверх' : 'Перейти на главную страницу'
    );
  }

  // Оптимизированный обработчик скролла
  const throttledScroll = () => {
    let isWaiting = false;

    return () => {
      if (!isWaiting) {
        isWaiting = true;

        requestAnimationFrame(() => {
          updateButtonState();
          isWaiting = false;
        });
      }
    };
  };

  // Инициализация
  function init() {
    if (!button) return;

    window.addEventListener('scroll', throttledScroll());
    button.addEventListener('click', handleClick);
    button.addEventListener('keydown', handleKeyDown);

    // Начальное состояние
    updateButtonState();
  }

  // Очистка обработчиков при необходимости
  function destroy() {
    if (!button) return;

    window.removeEventListener('scroll', throttledScroll());
    button.removeEventListener('click', handleClick);
    button.removeEventListener('keydown', handleKeyDown);
  }

  return {
    init,
    destroy
  };
}

// Инициализация
const scrollToTop = ScrollToTop();
scrollToTop.init();


/**
 * Загрузка основных функций шаблона на всех страницах.
 */
document.addEventListener("DOMContentLoaded", function () {
  Dialogs();
  Passwords();
  Mainnav(document.querySelector("#header"));
  CartClear();
  CartRemove();
  Addto();
  AddtoCart();
  AddtoMod();
  AddtoOrder();
  AddtoNotify();
  Products();
  Opener();
  Autorization();
  swiperViewed('#viewed');
  toTop();
  Form("dialogCallback", "Запрос обратного звонка успешно отправлен администрации магазина", "Вы уже отправляли запрос. Пожалуйста ожидайте звонка.");
  Form("dialogNotify", "Вы будете уведомлены о поступлении товара", "Вы уже отправляли запрос. Пожалуйста ожидайте.");
  Form("subscribe", "Спасибо за обращение! Вы подписались на нашу рассылку", "Вы уже отправляли запрос. Пожалуйста ожидайте.");
  // Маска ввода телефона
  $(".form__phone").mask("+7 (999) 999-9999");
});

console.timeEnd("start time");