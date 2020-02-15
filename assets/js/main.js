var body = $('body');

$(function () {
  'use strict';
  featured();
  pagination();
  gallery();
  table();
  modal();
  search();
  burger();
  gravatar();
  plan();
  notification();
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

function table() {
  'use strict';
  if (body.hasClass('post-template') || body.hasClass('page-template')) {
    var tables = $('.single-content').find('.table');
    tables.each(function (_, table) {
      var labels = []

      $(table).find('thead th').each(function (_, label) {
        labels.push($(label).text());
      });
      
      $(table).find('tr').each(function (_, row) {
        $(row).find('td').each(function (index, column) {
          $(column).attr('data-label', labels[index]);
        });
      });
    });
  }
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
  var popular = $('.popular-wrapper');

  var search = searchInput.ghostHunter({
    includebodysearch: true,
    info_template: '',
    onComplete: function (results) {
      if (results.length > 0) {
        popular.hide();
      } else {
        popular.show();
      }

      if (searchInput.val().length > 0) {
        searchButton.addClass('search-button-clear');
      } else {
        searchButton.removeClass('search-button-clear');
      }
    },
    onKeyUp: true,
    results: '.search-result',
    result_template: '<div id="gh-{{ref}}" class="search-result-row gh-search-item"><a class="search-result-row-link" href="{{link}}">{{title}}</a></div>',
    zeroResultsInfo: false
  });

  searchButton.on('click', function () {
    if ($(this).hasClass('search-button-clear')) {
      search.clear();
      searchInput.focus();
      searchButton.removeClass('search-button-clear');
      popular.show();
    }
  });
}

function burger() {
  'use strict';
  $('.burger').on('click', function() {
    body.toggleClass('menu-opened');
  });
}

function gravatar() {
  'use strict';
  var image = $('.account-image');
  if (image.length) {
    image.attr('data-src', 'https://www.gravatar.com/avatar/' + md5(image.attr('data-email')) + '?d=mp&s=160');
    lazySizes.loader.unveil(image[0]);
  }
}

function plan() {
  'use strict';
  var button = $('.plan-selector-button');

  button.on('click', function () {
    button.addClass('button-secondary')
    $(this).removeClass('button-secondary');
    $(this).closest('.plan-selector').attr('class', 'plan-selector plan-selector-' + $(this).attr('data-plan'));
  });
}

function notification() {
  'use strict';
  $('.notification-close').on('click', function (e) {
    e.preventDefault();

    body.removeClass('notification-opened');
    var uri = window.location.toString();
    if (uri.indexOf('?') > 0) {
      var clean_uri = uri.substring(0, uri.indexOf('?'));
      window.history.replaceState({}, document.title, clean_uri);
    }

    if ($(this).closest('.auth-form').length) {
      $(this).closest('.auth-form').removeClass('success error');
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