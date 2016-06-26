
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
      var simpleHash = window.btoa(encodeURIComponent(escape(file.name)));
      var hashedBaseId = simpleHash.replace(new RegExp('[\+=\/]', 'g'), '');
      var contributionForm = jQuery('#contribute');

      var titleField = contributionForm.find('#Elements-50-0-text');
      var titleFieldVal = titleField.val();
      var descriptionField = contributionForm.find('#Elements-41-0-text');
      var descriptionFieldVal = descriptionField.val();

      var subtitle = contributionForm.find('#dz-subtitle_' + hashedBaseId);
      var otherTopic = contributionForm.find('#dz-topic_' + hashedBaseId);
      var moreDescription = contributionForm.find('#dz-description_' + hashedBaseId);

      if (subtitle.length > 0) {
        if (titleFieldVal == undefined || titleFieldVal.trim().length < 1) {
          titleField.val(subtitle.val());
        } else if (titleFieldVal.indexOf(':') > -1) {
          titleField.val(titleFieldVal + ' - ' + subtitle.val());
        } else {
          titleField.val(titleFieldVal + ': ' + subtitle.val());
        }
      }
      if (otherTopic.length > 0) {
        contributionForm.append(jQuery('<input type="hidden" name="Elements[49][1][text]" id="Elements-49-1-text" value="' + otherTopic.val() + '">'));
      }
      if (moreDescription.length > 0) {
        if (descriptionFieldVal == undefined || descriptionFieldVal.trim().length < 1) {
          descriptionField.val(moreDescription.val());
        } else if (descriptionFieldVal.endsWith('.') || descriptionFieldVal.endsWith('!') || descriptionFieldVal.endsWith('?')) {
          descriptionField.val(descriptionFieldVal + ' ' + moreDescription.val());
        } else {
          descriptionField.val(descriptionFieldVal + '. ' + moreDescription.val());
        }
      }

      var values = contributionForm.serialize().split('&');

      for (var index = 0; index < values.length; index++) {
        var parts = values[index].split('=');
        var key = parts[0];
        var value = parts[1];

        // Exclude hidden fields used in form processing
        if (key.substring(0, 3) !== 'dz-') {
          formData.append(decodeURI(key), decodeURIComponent(value).replace(/\+/g, ' '));
        }
      }

      formData.append('form-submit', 'Contribute');

      // Restore the state of our form for the next upload
      jQuery(contributionForm.find('#Elements-49-1-text')).remove();
      titleField.val(titleFieldVal);
      descriptionField.val(descriptionFieldVal);
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

  oDropzone.on("addedfile", function(file) {
    var timestamp = new Date().getTime();
    var details = Dropzone.createElement('<a class="dz-edit-details" id="dz-edit-' + timestamp  + '" href="">Add details</a>');
    var help = jQuery('#crowd-shortcut');

    file.previewElement.appendChild(details);

    // Remove overlapping help widget while uploading files
    if (help.length > 0) {
      jQuery(help.parent()).remove();
    }

    // Create image specific metadata form
    jQuery('#dz-edit-' + timestamp).click(function(e) {
      e.preventDefault();

      var simpleHash = window.btoa(encodeURIComponent(escape(file.name)));
      var hashedBaseId = simpleHash.replace(new RegExp('[\+=\/]', 'g'), '');
      var popup = "", subtitleVal = "", topicVal = "", descriptionVal = "" ;
      var contributionForm = jQuery('#contribute');

      var subtitle = contributionForm.find('#dz-subtitle_' + hashedBaseId);
      var topic = contributionForm.find('#dz-topic_' + hashedBaseId);
      var description = contributionForm.find('#dz-description_' + hashedBaseId);

      if (subtitle.length > 0) subtitleVal = subtitle.val();
      if (topic.length > 0) topicVal = topic.val();
      if (description.length > 0) descriptionVal = description.val();

      popup += '<div id="' + hashedBaseId  + '_details_popup" class="details_popup">';
      popup += '<span id="popup_title">Additional Details</span>';
      popup += '<button class="popup_close ' + hashedBaseId + '_details_popup_close details_popup_close"><i class="fa fa-times"></i></button>';
      popup += '<div class="additional_details"><form id="form_' + hashedBaseId  + '" class="additional_details_form" method="get" action="#"><dl>';
      popup += '<dt>Title:</dt><dd><input name="dz-subtitle" id="dz-subtitle" type="text" value="' + subtitleVal  + '"></dd>';
      popup += '<dt>Topic:</dt><dd><input name="dz-topic" id="dz-topic" type="text" value="' + topicVal  + '"></dd>';
      popup += '<dt>Description:</dt><dd><textarea name="dz-description" id="dz-description" rows="8">' + descriptionVal + '</textarea></dd>';
      popup += '</dl></form></div>';
      popup += '</div>';

      jQuery('body').append(popup);

      // Record image specific metadata in the larger submit form
      jQuery('#form_' + hashedBaseId).submit(function(event) {
        event.preventDefault();

        var realForm = jQuery('#contribute');
        var formSubtitle = realForm.find('#dz-subtitle_' + hashedBaseId);
        var formTopic = realForm.find('#dz-topic_' + hashedBaseId);
        var formDescription = realForm.find('#dz-description_' + hashedBaseId);

        var thisForm = jQuery('#form_' + hashedBaseId);
        var sValue = thisForm.find('#dz-subtitle').val();
        var tValue = thisForm.find('#dz-topic').val();
        var dValue = thisForm.find('#dz-description').val();

        if (formSubtitle.length > 0) {
          formSubtitle.val(sValue);
        } else if (sValue != undefined && sValue.length > 1) {
          var subtitleId = 'dz-subtitle_' + hashedBaseId;
          jQuery('#contribute').append('<input type="hidden" id="' + subtitleId + '" name="' + subtitleId + '" value="' + sValue + '">');
        }
        if (formTopic.length > 0) {
          formTopic.val(tValue);
        } else if (tValue != undefined && tValue.length > 1) {
          var topicId = 'dz-topic_' + hashedBaseId;
          jQuery('#contribute').append('<input type="hidden" id="' + topicId + '" name="' + topicId + '" value="' + tValue + '">');
        }
        if (formDescription.length > 0) {
          formDescription.val(dValue);
        } else if (dValue != undefined && dValue.length > 1) {
          var descriptionId = 'dz-description_' + hashedBaseId;
          jQuery('#contribute').append('<input type="hidden" id="' + descriptionId + '" name="' + descriptionId + '" value="' + dValue + '">');
        }
      });

      // Open the image specific metadata form
      jQuery('#' + hashedBaseId  + '_details_popup').popup({
        color: 'white', opacity: .85, blur: false, autoopen: true, outline: true, detach: true,
        onclose: function() { jQuery('#form_' + hashedBaseId).submit(); }
      });
    });
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
