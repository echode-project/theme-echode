
function toggleProfileEdit() {
  jQuery('div.contribution-userprofile').toggle();
  jQuery('span.contribution-userprofile-visibility').toggle();
}

function initDropzone(maxFilesVar) {
  var previewTemplate = jQuery('#odz-template').html();

  var oDropzone = new Dropzone("#omekaDZ", {
    url: "/contribution",
    paramName: "contributed_file",
    autoProcessQueue: false,
    parallelUploads: 1,
    addRemoveLinks: true,
    maxFiles: maxFilesVar,
    previewTemplate: previewTemplate,
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    },
    fallback: function() {
      jQuery('#odz-fallback').show();
      jQuery('#omekaDZ').hide();
    },
    success: function(file, response) {
      var html = jQuery(jQuery.parseHTML(response));
      var errorFlash = html.find('div#flash');

      // Omeka doesn't have an API for this so we're scraping
      if (errorFlash.length == 1) {
        this.options.autoProcessQueue = false;
        jQuery('main.content-wrapper').prepend(errorFlash);
        file.status = Dropzone.QUEUED;
        jQuery('.dz-progress').css('opacity', '0');
        jQuery('html, body').animate({ scrollTop: 0 });
      } else {
        file.previewElement.classList.add("dz-success");
      }
    },
    sending: function(file, xhr, formData) {
      var values = jQuery('#contribute').serialize().split('&');

      for (var index = 0; index < values.length; index++) {
        var parts = values[index].split('=');
        var key = parts[0];
        var value = parts[1];

        // Exclude hidden fields used in form processing
        if (key.substring(0, 3) !== 'dz-') {
          formData.append(decodeURI(key), decodeURI(value).replace(/\+/g, ' '));
        }
      }

      formData.append('form-submit', 'Contribute');
    },
    processing: function() {
      this.options.autoProcessQueue = true;
    },
    renameFilename: function(filename) {
      var hash = window.btoa(encodeURIComponent(escape(filename)));
      var hashedId = 'dz-rotation_' + hash.replace(new RegExp('[\+=\/]', 'g'), '');
      var dzRotation = jQuery('#' + hashedId).val();

      if (parseInt(dzRotation) == dzRotation) {
        return dzRotation + "_~_" + filename;
      } else {
        return filename;
      }
    },
    queuecomplete: function() {
      if (jQuery('div#flash').length < 1) {
        window.location = window.location.href + '/thankyou';
      }
    }
  });
}

function enableContributionAjaxForm(url) {
  jQuery(document).ready(function() {
    // Div that will contain the AJAX'ed form.
    var form = jQuery('#contribution-type-form');
    // Select element that controls the AJAX form.
    var contributionType = jQuery('#contribution-type');
    // Elements that should be hidden when there is no type form on the page.
    var elementsToHide = jQuery('#contribution-confirm-submit, #contribution-contributor-metadata');
    // Duration of hide/show animation.
    var duration = 0;

    // Remove the noscript-fallback type submit button.
    jQuery('#submit-type').remove();

    // When the select is changed, AJAX in the type form
    contributionType.change(function () {
      var value = this.value;
      elementsToHide.hide();

      form.hide(duration, function() {
        form.empty();

        if (value != "") {
          jQuery.post(url, {contribution_type: value}, function(data) {
            form.append(data);

            form.show(duration, function() {
              var maxFilesVar;

              form.trigger('contribution-form-shown');
              form.trigger('omeka:tabselected');
              elementsToHide.show();
              // In case profile info is also being added, do the js for that form
              jQuery(form).trigger('omeka:elementformload');
              jQuery('.contribution-userprofile-visibility').click(toggleProfileEdit);

              if (jQuery('#dzStory').length > 0) {
                maxFilesVar = 1;
              } else {
                maxFilesVar = null;
              }

              // If we have a dropzone, initialize it
              initDropzone(maxFilesVar);
            });
          });
        }
      });
    });
  });
}

jQuery(document).ready(function() {
  jQuery('.contribution-userprofile-visibility').click(toggleProfileEdit);
  var form = jQuery('#contribution-type-form');
  jQuery(form).trigger('omeka:elementformload');
});
