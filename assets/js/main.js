var body = $('body');

$(function () {
  'use strict';
  featured();
  pagination();
  gallery();
  modal();
  search();
});

function featured() {
  'use strict';
  $('.featured-feed').owlCarousel({
    dots: false,
    margin: 30,
    nav: true,
    navText: ['<i class="icon icon-chevron-left"></i>', '<i class="icon icon-chevron-right"></i>'],
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
    },
  });
}

function pagination() {
  'use strict';
  var wrapper = $('.post-feed');

  if (body.hasClass('paged-next')) {
    wrapper.infiniteScroll({
      append: '.feed',
      button: '.infinite-scroll-button',
      debug: false,
      hideNav: '.pagination',
      path: '.pagination .older-posts',
      scrollThreshold: false,
      status: '.infinite-scroll-status',
    });
  }

  wrapper.on('append.infiniteScroll', function (event, response, path, items) {
    $(items[0]).addClass('feed-paged');
  });
}

function gallery() {
  'use strict';
  var images = document.querySelectorAll('.kg-gallery-image img');
  images.forEach(function (image) {
    var container = image.closest('.kg-gallery-image');
    var width = image.attributes.width.value;
    var height = image.attributes.height.value;
    var ratio = width / height;
    container.style.flex = ratio + ' 1 0%';
  });
}

function modal() {
  'use strict';
  var modal = $('.modal');
  var modalSearch = $('.modal-search');
  var modalInput = $('.modal-input');

  $('.js-modal').on('click', function (e) {
    e.preventDefault();
    switch ($(this).attr('data-modal')) {
      case 'search':
        modalSearch.show();
        break;
      default:
        break;
    }
    body.addClass('modal-opened');
    modalInput.focus();
  });

  $('.modal-close, .modal-overlay').on('click', function () {
    body.removeClass('modal-opened');
  });

  modal.on('click', function (e) {
    e.stopPropagation();
  });

  $(document).keyup(function (e) {
    if (e.keyCode === 27 && body.hasClass('modal-opened')) {
      body.removeClass('modal-opened');
    }
  });
}

function search() {
  'use strict';
  var searchInput = $('.search-input');
  var searchButton = $('.search-button');
  var searchResult = $('.search-result');
  var posts = [];

  if (themeOptions.search_key == '') {
    return;
  }

  searchInput.one('focus', function () {
    var base = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname.split('/')[1];
    $.get(base + '/ghost/api/v3/content/posts/?key=' + themeOptions.search_key + '&limit=all&fields=title,url,visibility&formats=plaintext', function (data) {
      posts = data.posts
    });
  })

  searchInput.on('keyup', function (e) {
    var output = '';

    if (e.target.value.length > 2) {
      var result = fuzzysort.go(e.target.value, posts, {keys: ['title', 'plaintext']});
      result.forEach(function (item) {
        output += '<div class="search-result-row">' +
          '<a class="search-result-row-link" href="' + item.obj.url + '">' + item.obj.title + '</a>' +
        '</div>';
      });
      searchResult.html(output);
    }

    if (e.target.value.length > 0) {
      searchButton.addClass('search-button-clear');
    } else {
      searchButton.removeClass('search-button-clear');
    }

    searchResult.html(output);
  });

  $('.search-form').on('submit', function (e) {
    e.preventDefault();
  });

  searchButton.on('click', function () {
    if ($(this).hasClass('search-button-clear')) {
      searchInput.val('').focus().keyup();
    }
  });
}

function getParameterByName(name, url) {
  'use strict';
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  var results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}