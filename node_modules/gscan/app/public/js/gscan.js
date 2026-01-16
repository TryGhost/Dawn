(function ($) {
    $(document).ready(function () {
        if ($('#theme')[0]) {
            $('#theme-submit').prop('disabled', !$('#theme')[0].files.length);
        }

        $(document).on('change', '#theme', function () {
            $('#theme-submit').prop('disabled', !$(this)[0].files.length);
        });

        // Mobile Menu Trigger
        $('.gh-nav-burger').click(function () {
            $('.gh-mobilehead').toggleClass('gh-mobilehead-open');
        });

        // Toggle dropdown arrow
        $('#version').on('click', function () {
            $('.gh-input-icon.select-arrow').toggleClass('.active');
        });

        /** Toggle Details **/
        if ($('.toggle-details').length) {
            $('.toggle-details').on('click', function () {
                if ($(this).find('~ .details').is(':hidden')) {
                    $(this).find('~ .details').show();
                    $(this).find('.show').hide();
                    $(this).find('.hide').show();
                    $(this).parent().addClass('expanded');
                } else {
                    $(this).find('~ .details').hide();
                    $(this).find('.show').show();
                    $(this).find('.hide').hide();
                    $(this).parent().removeClass('expanded');
                }
            });
        }
    });
}(jQuery));
