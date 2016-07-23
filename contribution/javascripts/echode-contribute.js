jQuery(document).ready(function() {
  Dropzone.autoDiscover = false;

  jQuery('#contribute').on('submit', function(e) {
    var okayToSubmit = true;

    jQuery.each(jQuery('span.req'), function() {
      var field = jQuery(this).closest('div.field');
      var input = field.find('input[name^="Elements"]');

      if (input.length > 0 && !input.val()) {
        console.log("no value: " + input.attr('name'));
        okayToSubmit = false;
      } else {
        var select = field.find('select[name^="Elements"]');

        if (select.length > 0 && !select.val()) {
          console.log("no value: " + select.attr('name'));
          okayToSubmit = false;
        } else {
          var textarea = field.find('textarea[name^="Elements"]');

          if (textarea.length > 0 && !textarea.val()) {
            console.log("no textarea");
            okayToSubmit = false;
          }
        }
      }
    });

    if (!document.getElementById('terms-agree').checked) {
      okayToSubmit = false;
    }

    if (!okayToSubmit) {
      e.preventDefault();

      if (jQuery('#retry').length == 0) {
        jQuery('#contribution-item-metadata').prepend('<div id="retry" style="color:red">Please supply all the required values.</div>');
      }

      jQuery('html, body').animate({ scrollTop: jQuery('#retry').offset().top - 80 });
    } else {
      var dz = jQuery('#omekaDZ').get(0).dropzone;

      if (dz.getQueuedFiles().length > 0) {
        e.preventDefault();

        jQuery('div#flash').remove();
        jQuery('.dz-progress').css('opacity', '1');
        jQuery('html, body').animate({ scrollTop: jQuery('#omekaDZ').offset().top - 80 });

        dz.processQueue();
      } else if (jQuery('#Elements-51-0-text').val() != "Document") {
        e.preventDefault();

        if (jQuery('#retry').length == 0) {
          jQuery('#contribution-item-metadata').prepend('<div id="retry" style="color:red">Please supply all the required values.</div>');
        }

        jQuery('html, body').animate({ scrollTop: jQuery('#retry').offset().top - 80 });
      }
    }
  });
});
