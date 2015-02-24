﻿$.ajaxSetup({ cache: false });
$(function () {
    $(document).ajaxStart(function () {
        $("#loading").show();
    });
    $(document).ajaxStop(function () {
        $("#loading").hide();
    });
    $().dropdown();
    $("[rel='tooltip']").tooltip();

    Globalize.culture($("#CurrentUICulture").val());
    $.validator.methods.number = function (value, element) {
        return this.optional(element) ||
            !isNaN(Globalize.parseFloat(value));
    };

    $.validator.methods.date = function (value, element) {
        return this.optional(element) ||
            !isNaN(Globalize.parseDate(value));
    };

    $(".datepicker").datepicker();

    if (Dropzone) {
        Dropzone.autoDiscover = false;
    }

    $(document).on('click', '.date-time-picker', function () {
        var that = $(this);
        if (!that.hasClass('hasDatepicker')) {
            that.datetimepicker({
                timeFormat: 'hh:mm'
            }).blur().focus();
        }
    });

    
    $(document).featherlight({
        filter: '[data-toggle="fb-modal"]',
        type: 'iframe',
        iframeWidth: 800,
        afterOpen: function () {  },
        beforeOpen: function () {
        }
    });


    $('[data-action=save]').click(function (e) {
        e.preventDefault();
        var formId = $(this).data('form-id');
        $('#' + formId).submit();
    });

    $('[data-action=post-link]').click(function (e) {
        e.preventDefault();
        var self = $(this);
        var url = self.attr('href') || self.data('link');
        if (url != null) {
            post_to_url(url, {});
        }
    });

    $(window).resize(function () {
        $('.modal').each(function (index, element) {
            resizeModal($(element));
        });
    });

    $(document).on('click', 'div[data-paging-type="async"] .pagination a[href]', function () {
        var self = $(this);
        $.get(this.href, function (response) {
            self.parents('div[data-paging-type="async"]').replaceWith(response);
        });
        return false;
    });

    $(document).on('click', 'div[data-paging-type="async"] button[data-action=update]', function () {
        var self = $(this);
        var data = self.parents('div[data-paging-type="async"]').find('input, select, textarea').serialize();
        $.get($(this).data('url'), data, function (response) {
            self.parents('div[data-paging-type="async"]').replaceWith(response);
        });
        return false;
    });

    $(document).on('click', 'a.more-link', function () {
        return false;
    });

    $(document).on('change', '#admin-site-selector', function () {
        location.href = $(this).val();
    });
    
    //fix ckeditor on scroll
    $(".main-content").scroll(function (e) {
        if ($('.body-content #cke_1_contents').height() > 500) {
            if ($(this).scrollTop() > 110 && $(".body-content #cke_1_top").css('position') != 'fixed') {
                $(".body-content #cke_1_top").css({ 'position': 'fixed', 'top': '51px' });
            }
            if ($(this).scrollTop() < 110 && $(".body-content #cke_1_top").css('position') != 'inherit') {
                $(".body-content #cke_1_top").css({ 'position': 'inherit', 'top': 'auto;' });
            }
        }
    });
});

function resizeModal(jqElement) {
    var modal = jqElement.hasClass('modal') ? jqElement : jqElement.parents('.modal');
    var height = modal.outerHeight(),
	    windowHeight = $(window).outerHeight(),
	    width = modal.outerWidth(),
	    windowWidth = $(window).outerWidth();
    var top = (windowHeight - height) / 2,
	    left = (windowWidth - width) / 2;

    modal.css('top', top).css('left', left);
}

function getRemoteModel(href) {
    var link = $("<a>");
    link.attr('href', href);
    link.featherlight({
        type: 'iframe',
        iframeWidth: 820,
    }).click();
}

$(function () {
    admin.initializePlugins();
});
window.admin = {
    initializePlugins: function () {
        CKEDITOR.replaceAll('ckedit-enabled');
        CKEDITOR.on('instanceReady', function (ev) {
            if (window.location != window.parent.location) // if in iframe, trigger resize.
                top.$(top).trigger('resize');
        });
        $('[data-type=media-selector], [class=media-selector]').mediaSelector();
        var form = $('form');
        form.removeData("validator");
        form.removeData("unobtrusiveValidation");
        form.find('input, select').each(function () {
            $.data(this, "previousValue", null);
        });
        $.validator.unobtrusive.parse("form");
        initTagging();
    }
};


function post_to_url(path, params, method) {
    method = method || "post"; // Set method to post by default, if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for (var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", params[key].name);
        hiddenField.setAttribute("value", params[key].value);

        form.appendChild(hiddenField);
    }

    document.body.appendChild(form);
    form.submit();
}
$.fn.delayKeyup = function (e, callback, ms) {
    var timer = 0;
    $(this).keyup(function (event) {
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback(event);
        }, ms);
    });
    return $(this);
};