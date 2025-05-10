///////////////////////////////////////////////////////
/* Поиск (реализация без jQuery) */
//////////////////////////////////////////////////////
function SearchFieldInit(object) {
  // Блок в котором лежит поле поиска
  object.search_form = object.querySelector('.search__form');
  if (!object.search_form) return;
  object.search_input = object.querySelector('.search__input');
  object.search_submit = object.querySelector('.search__submit');
  object.s_reset = object.querySelector('.search__reset');

  object.__SearchFieldCheck = function (isAfter) {
    if (object.search_input.value.length) {
      object.classList.add('search--filled');
      if (object.search_input.value.length > 2) {
        object.classList.add('search--success');
      } else {
        object.classList.remove('search--success');
      }
    } else {
      object.classList.remove('search--filled');
      object.classList.remove('search--success');
    }
    if (typeof isAfter === 'undefined' || !isAfter) {
      setTimeout(function () {
        object.__SearchFieldCheck(1);
      }, 20);
    } else {
      return object.SearchFieldCheck();
    }
  };

  object.search_input.addEventListener('click', function () {
    object.__SearchFieldCheck();
  });
  object.search_input.addEventListener('focus', function () {
    object.classList.add('search--focused');
    object.__SearchFieldCheck();
  });
  object.search_input.addEventListener('blur', function () {
    object.classList.remove('search--focused');
    object.__SearchFieldCheck();
  });
  object.search_input.addEventListener('keyup', function (I) {
    switch (I.keyCode) {
      case 13:
      case 27:
      case 38:
      case 40:
        break;
      default:
        object.classList.remove('search--focused');
        object.__SearchFieldCheck();
        break;
    }
  });
  object.search_input.addEventListener('paste', function (e) {
    object.__SearchFieldCheck();
    setTimeout(function () {
      object.__SearchFieldCheck();
    }, 20);
  });
  object.search_input.addEventListener('cut', function (e) {
    hideSearchResults();
    removeAllSearchItems();
    object.__SearchFieldCheck();
  });

  var suggestCount;
  var suggestSelected = 0;
  function keyActivate(n) {
    var $links = document.querySelectorAll('.search-results__item');
    if ($links[suggestSelected - 1]) $links[suggestSelected - 1].classList.remove('is-active');
    if (n === 1 && suggestSelected < suggestCount) {
      suggestSelected++;
    } else if (n === -1 && suggestSelected > 0) {
      suggestSelected--;
    }
    if (suggestSelected > 0 && $links[suggestSelected - 1]) {
      $links[suggestSelected - 1].classList.add('is-active');
    }
  }
  object.search_input.addEventListener('keydown', function (I) {
    switch (I.keyCode) {
      case 27:
        hideSearchResults();
        I.preventDefault();
        return false;
      case 13:
        if (suggestSelected) {
          var $links = document.querySelectorAll('.search-results__item');
          var $link = $links[suggestSelected - 1];
          var href = $link ? $link.getAttribute('href') : null;
          if (href) {
            document.location = href;
          } else if ($link) {
            $link.click();
          }
          I.preventDefault();
          return false;
        }
        break;
      case 38:
      case 40:
        I.preventDefault();
        suggestCount = document.querySelectorAll('.search-results__item').length;
        if (suggestCount) {
          keyActivate(I.keyCode - 39);
        }
        break;
      default:
        suggestSelected = 0;
        break;
    }
  });
  object.s_reset.addEventListener('click', function (event) {
    event.preventDefault();
    object.search_input.value = '';
    object.search_input.focus();
    hideSearchResults();
    removeAllSearchItems();
    document.querySelectorAll('.search').forEach(function (el) {
      el.classList.remove('search--focused', 'search--success', 'search--loading');
    });
  });
  object.__SearchFieldCheck();
}

function hideSearchResults() {
  const el = document.querySelector('.search__results');
  if (el) el.style.display = 'none';
}
function showSearchResults() {
  const el = document.querySelector('.search__results');
  if (el) el.style.display = '';
}
function removeAllSearchItems() {
  document.querySelectorAll('.search-results__item').forEach(function (el) {
    el.remove();
  });
}

// Живой поиск (без jQuery)
document.addEventListener('DOMContentLoaded', function () {
  const searchBlock = document.querySelector('.search');
  const options = {
    target: 'form.store_ajax_catalog',
    url: '/admin/store_catalog',
    items_target: '#goods',
    last_search_query: '',
  };
  const randHash = GenMd5Hash();
  if (typeof document.SearchInCatalogAjaxQuerySender === 'undefined') {
    document.SearchInCatalogAjaxQuerySender = {};
  }
  searchBlock.SearchFieldCheck = function () {
    if (typeof document.lastTimeoutId !== 'undefined') {
      clearTimeout(document.lastTimeoutId);
    }
    document.lastTimeoutId = setTimeout(function () {
      document.SearchInCatalogAjaxQuerySender[randHash](htmlspecialchars(searchBlock.search_input.value));
    }, 300);
  };
  document.SearchInCatalogAjaxQuerySender[randHash] = function (old_val) {
    const last_search_query_array = [];
    if (typeof sessionStorage !== 'undefined') {
      try {
        if (sessionStorage.getItem('lastSearchQueryArray')) {
          last_search_query_array = JSON.parse(sessionStorage.getItem('lastSearchQueryArray'));
          const currentSearch = last_search_query_array.filter(function (item) {
            return item.search_query == old_val;
          })[0];
          if (currentSearch) {
            showDropdownSearch(JSON.parse(currentSearch.content));
            return;
          }
        } else {
          sessionStorage.setItem('lastSearchQueryArray', '[]');
        }
      } catch (e) {}
    }
    if (htmlspecialchars(searchBlock.search_input.value) == old_val && searchBlock.search_input.value.length > 1) {
      options['last_search_query'] = old_val;
      searchBlock.classList.add('search--loading');
      const params = new URLSearchParams({
        ajax_q: 1,
        goods_search_field_id: 0,
        q: options['last_search_query'],
      });
      const search_field_object = searchBlock.search_input;
      fetch(searchBlock.search_form.getAttribute('action'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      })
        .then(function (response) { return response.json(); })
        .then(function (data) {
          if (search_field_object.value != old_val) return false;
          if (typeof sessionStorage !== 'undefined') {
            try {
              sessionStorage.setItem('lastSearchQueryArray', JSON.stringify(last_search_query_array));
              const currentSearch = last_search_query_array.filter(function (item) {
                return item.search_query == old_val;
              })[0];
              if (typeof currentSearch == 'undefined') {
                last_search_query_array.push({
                  search_query: old_val,
                  content: JSON.stringify(data),
                });
                sessionStorage.setItem('lastSearchQueryArray', JSON.stringify(last_search_query_array));
              }
            } catch (e) {}
          }
          showDropdownSearch(data);
          searchBlock.classList.remove('search--loading');
        });
    } else {
      hideSearchResults();
    }

    function showDropdownSearch(data) {
      // Категории
      const catItems = document.querySelector('.search-results__items--category');
      if (catItems) {
        catItems.querySelectorAll('.search-results__item').forEach(function (el) { el.remove(); });
      }
      hideSearchResults();
      if (data.category && data.category.length > 0) {
        for (var c = 0; c < data.category.length; c++) {
          if (data.category[c].image_icon == null) {
            data.category[c].image_icon = '/design/no-photo.png';
          }
          if (c <= 3 && catItems) {
            catItems.insertAdjacentHTML('beforeend',
              `<a class="search-results__item" href="${data.category[c].url}">
                <span class="search-results__name">${data.category[c].goods_cat_name}</span>
              </a>`
            );
          }
        }
      }
      // Товары
      const goodsItems = document.querySelector('.search-results__items--goods');
      if (goodsItems) {
        goodsItems.querySelectorAll('.search-results__item').forEach(function (el) { el.remove(); });
      }
      hideSearchResults();
      const buttons = document.querySelector('.search-results__buttons');
      if (data.goods && data.goods.length > 0) {
        for (var i = 0; i < data.goods.length; i++) {
          if (data.goods[i].image_icon == null) {
            data.goods[i].image_icon = '/design/no-photo.png';
          }
          if (i <= 3 && goodsItems) {
            if (buttons) buttons.classList.add('is-hide');
            goodsItems.insertAdjacentHTML('beforeend',
              `<a class="search-results__item" href="${data.goods[i].url}">
                <div class="search-results__image">
                  <img src="${data.goods[i].image_icon}">
                </div>
                <div class="search-results__content RUB">
                  <div class="search-results__name"><span>${data.goods[i].goods_name}</span></div>
                  <b class="search-results__price price__now"><span class="num">${getMoneyFormat(parseInt(data.goods[i].min_price_now))}</span></b>
                </div>
              </a>`
            );
          }
          if (i > 3 && buttons) {
            buttons.classList.remove('is-hide');
          }
        }
      }
      // Скрываем результаты поиска если ничего не найдено
      if ((data.category && data.category.length || 0) + (data.goods && data.goods.length || 0) > 0) {
        showSearchResults();
      } else {
        hideSearchResults();
      }
      // Категории видимость
      if (catItems) {
        if (data.category && data.category.length > 0) {
          catItems.style.display = '';
          if (catItems.previousElementSibling) catItems.previousElementSibling.style.display = '';
        } else {
          catItems.style.display = 'none';
          if (catItems.previousElementSibling) catItems.previousElementSibling.style.display = 'none';
        }
      }
      // Товары видимость
      if (goodsItems) {
        if (data.goods && data.goods.length > 0) {
          goodsItems.style.display = '';
          if (goodsItems.previousElementSibling) goodsItems.previousElementSibling.style.display = '';
        } else {
          goodsItems.style.display = 'none';
          if (goodsItems.previousElementSibling) goodsItems.previousElementSibling.style.display = 'none';
        }
      }
      searchBlock.classList.remove('search--loading');
    }
  };
  SearchFieldInit(searchBlock);
  const searchResultsButton = document.querySelector('.search-results__button');
  if (searchResultsButton) {
    searchResultsButton.addEventListener('click', function () {
      const form = document.querySelector('.search__form');
      if (form) form.submit();
    });
  }
});

// Аналог php функции.
function htmlspecialchars(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function substr(str, start, len) {
  str += "";
  let end = str.length;
  if (start < 0) {
    start += end;
  }
  end = typeof len === "undefined" ? end : len < 0 ? len + end : len + start;
  return start >= str.length || start < 0 || start > end ? !1 : str.slice(start, end);
}
function md5(str) {
  let xl;
  const rotateLeft = function (lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  };
  const addUnsigned = function (lX, lY) {
    let lX4, lY4, lX8, lY8, lResult;
    lX8 = lX & 0x80000000;
    lY8 = lY & 0x80000000;
    lX4 = lX & 0x40000000;
    lY4 = lY & 0x40000000;
    lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) {
      return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      } else {
        return lResult ^ 0x40000000 ^ lX8 ^ lY8;
      }
    } else {
      return lResult ^ lX8 ^ lY8;
    }
  };
  const _F = function (x, y, z) {
    return (x & y) | (~x & z);
  };
  const _G = function (x, y, z) {
    return (x & z) | (y & ~z);
  };
  const _H = function (x, y, z) {
    return x ^ y ^ z;
  };
  const _I = function (x, y, z) {
    return y ^ (x | ~z);
  };
  const _FF = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };
  const _GG = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };
  const _HH = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };
  const _II = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };
  const convertToWordArray = function (str) {
    let lWordCount;
    let lMessageLength = str.length;
    let lNumberOfWords_temp1 = lMessageLength + 8;
    let lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    let lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    const lWordArray = new Array(lNumberOfWords - 1);
    let lBytePosition = 0;
    let lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition);
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  };
  const wordToHex = function (lValue) {
    let wordToHexValue = "",
      wordToHexValue_temp = "",
      lByte,
      lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValue_temp = "0" + lByte.toString(16);
      wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
    }
    return wordToHexValue;
  };
  var x = [],
    k,
    AA,
    BB,
    CC,
    DD,
    a,
    b,
    c,
    d,
    S11 = 7,
    S12 = 12,
    S13 = 17,
    S14 = 22,
    S21 = 5,
    S22 = 9,
    S23 = 14,
    S24 = 20,
    S31 = 4,
    S32 = 11,
    S33 = 16,
    S34 = 23,
    S41 = 6,
    S42 = 10,
    S43 = 15,
    S44 = 21;
  str = this.utf8_encode(str);
  x = convertToWordArray(str);
  a = 0x67452301;
  b = 0xefcdab89;
  c = 0x98badcfe;
  d = 0x10325476;
  xl = x.length;
  for (k = 0; k < xl; k += 16) {
    AA = a;
    BB = b;
    CC = c;
    DD = d;
    a = _FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
    d = _FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
    c = _FF(c, d, a, b, x[k + 2], S13, 0x242070db);
    b = _FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = _FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
    d = _FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
    c = _FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
    b = _FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = _FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
    d = _FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
    c = _FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
    b = _FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = _FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
    d = _FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
    c = _FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
    b = _FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
    a = _GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
    d = _GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
    c = _GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
    b = _GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
    a = _GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
    d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = _GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
    b = _GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = _GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
    d = _GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
    c = _GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
    b = _GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = _GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
    d = _GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
    c = _GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
    b = _GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
    a = _HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
    d = _HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
    c = _HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
    b = _HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = _HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
    d = _HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
    c = _HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
    b = _HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = _HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
    d = _HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
    c = _HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
    b = _HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
    a = _HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
    d = _HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
    c = _HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
    b = _HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
    a = _II(a, b, c, d, x[k + 0], S41, 0xf4292244);
    d = _II(d, a, b, c, x[k + 7], S42, 0x432aff97);
    c = _II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
    b = _II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = _II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
    d = _II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
    c = _II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
    b = _II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = _II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
    d = _II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
    c = _II(c, d, a, b, x[k + 6], S43, 0xa3014314);
    b = _II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = _II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
    d = _II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
    c = _II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
    b = _II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }
  var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
  return temp.toLowerCase();
}
function utf8_encode(argString) {
  var string = argString + "";
  var utftext = "";
  var start, end;
  var stringl = 0;
  start = end = 0;
  stringl = string.length;
  for (var n = 0; n < stringl; n++) {
    var c1 = string.charCodeAt(n);
    var enc = null;
    if (c1 < 128) {
      end++;
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
    } else {
      enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.substring(start, end);
      }
      utftext += enc;
      start = end = n + 1;
    }
  }
  if (end > start) {
    utftext += string.substring(start, string.length);
  }
  return utftext;
}
function rand(min, max) {
  var argc = arguments.length;
  if (argc === 0) {
    min = 0;
    max = 2147483647;
  } else if (argc === 1) {
    throw new Error("Warning: rand() expects exactly 2 parameters, 1 given");
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Получить md5 хэш
function GenMd5Hash() {
  return substr(md5(parseInt(new Date().getTime() / 1000, 10)), rand(0, 24), 8);
}
