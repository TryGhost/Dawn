/* Mobile menu burger toggle */
(function () {
    var head = document.querySelector('.gh-head');
    var burger = head.querySelector('.gh-burger');
    if (!burger) return;

    burger.addEventListener('click', function () {
        if (!head.classList.contains('is-head-open')) {
            head.classList.add('is-head-open');
        } else {
            head.classList.remove('is-head-open');
        }
    });
})();

/* Add lightbox to gallery images */
(function () {
    lightbox(
        '.kg-image-card > .kg-image[width][height], .kg-gallery-image > img'
    );
})();

/* Responsive video in post content */
(function () {
    const sources = [
        '.gh-content iframe[src*="youtube.com"]',
        '.gh-content iframe[src*="youtube-nocookie.com"]',
        '.gh-content iframe[src*="player.vimeo.com"]',
        '.gh-content iframe[src*="kickstarter.com"][src*="video.html"]',
        '.gh-content object',
        '.gh-content embed',
    ];
    reframe(document.querySelectorAll(sources.join(',')));
})();

/* Turn the main nav into dropdown menu when there are more than 5 menu items */
(function () {
    dropdown();
})();
