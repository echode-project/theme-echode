
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

      var dateField = contributionForm.find('#Elements-40-0-text');
      var dateFieldVal = dateField.val();
      var dimensionsField = contributionForm.find('#Elements-10-0-text');
      var dimensionsFieldVal = dimensionsField.val();
      var descriptionField = contributionForm.find('#Elements-41-0-text');
      var descriptionFieldVal = descriptionField.val();
      var formatField = contributionForm.find('#Elements-42-0-text');
      var formatFieldVal = formatField.val();
      var typeField = contributionForm.find('#Elements-51-0-text');
      var typeFieldVal = typeField.val();

      var otherDate = contributionForm.find('#dz-date_' + hashedBaseId);
      var otherDimensions = contributionForm.find('#dz-dimensions_' + hashedBaseId);
      var moreDescription = contributionForm.find('#dz-description_' + hashedBaseId);
      var otherFormat = contributionForm.find('#dz-format_' + hashedBaseId);
      var otherType = contributionForm.find('#dz-type_' + hashedBaseId);

      if (otherDate.length > 0) {
        dateField.val(otherDate.val());
      }
      if (otherDimensions.length > 0) {
        dimensionsField.val(otherDimensions.val());
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
      if (otherFormat.length > 0) {
        formatField.val(otherFormat.val());
      }
      if (otherType.length > 0) {
        typeField.val(otherType.val());
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

      // Restore the form for the next item to be processed
      dateField.val(dateFieldVal);
      dimensionsField.val(dimensionsFieldVal);
      descriptionField.val(descriptionFieldVal);
      formatField.val(formatFieldVal);
      typeField.val(typeFieldVal);
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
    var details = Dropzone.createElement('<a class="dz-edit-details" id="dz-edit-' + timestamp  + '" href="">Image Details</a>');
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
      var popup = "", dateVal = "", dimensionsVal = "", descriptionVal = "", formatVal = "", typeVal = "";
      var contributionForm = jQuery('#contribute');

      var date = contributionForm.find('#dz-date_' + hashedBaseId);
      var dimensions = contributionForm.find('#dz-dimensions_' + hashedBaseId);
      var description = contributionForm.find('#dz-description_' + hashedBaseId);
      var format = contributionForm.find('#dz-format_' + hashedBaseId);
      var type = contributionForm.find('#dz-type_' + hashedBaseId);

      if (date.length > 0) dateVal = date.val();
      if (dimensions.length > 0) dimensionsVal = dimensions.val();
      if (description.length > 0) descriptionVal = description.val();
      if (format.length > 0) formatVal = format.val();
      if (type.length > 0) typeVal = type.val();

      popup += '<div id="' + hashedBaseId  + '_details_popup" class="details_popup">';
      popup += '<span id="popup_title">Image Details</span>';
      popup += '<button class="popup_close ' + hashedBaseId + '_details_popup_close details_popup_close"><i class="fa fa-times"></i></button>';
      popup += '<div class="additional_details"><form id="form_' + hashedBaseId  + '" class="additional_details_form" method="get" action="#"><dl>';
      popup += '<dt>Description:</dt><dd><div class="smTxt">Narrative description of the item</div><textarea name="dz-description" id="dz-description" rows="8">' + descriptionVal + '</textarea></dd>';
      popup += '<dt>Date:</dt><dd><div class="smTxt">I.e. 1936-03-24, 2000-2010, etc.</div><input name="dz-date" id="dz-date" type="text" value="' + dateVal  + '"></dd>';
      popup += '<dt>Dimensions:</dt><dd><div class="smTxt">Size of the item (i.e. 4 x 5 in, etc.)</div><input name="dz-dimensions" id="dz-dimensions" type="text" value="' + dimensionsVal  + '"></dd>';

      popup += '<dt>Format:</dt><dd><div class="smTxt">The file format or physical medium</div><select name="dz-format" id="dz-format">';
      popup += ('<option ' + (formatVal == '' ? 'selected="selected"' : '') + ' value=""></option>');
      popup += ('<option ' + (formatVal == 'color photographs' ? 'selected="selected"' : '') + ' value="color photographs">color photographs</option>');
      popup += ('<option ' + (formatVal == 'aerial photographs' ? 'selected="selected"' : '') + ' value="aerial photographs">aerial photographs</option>');
      popup += ('<option ' + (formatVal == 'astrophotographs' ? 'selected="selected"' : '') + ' value="astrophotographs">astrophotographs</option>');
      popup += ('<option ' + (formatVal == 'black-and-white photographs' ? 'selected="selected"' : '') + ' value="black-and-white photographs">black-and-white photographs</option>');
      popup += ('<option ' + (formatVal == 'boudoir photographs' ? 'selected="selected"' : '') + ' value="boudoir photographs">boudoir photographs</option>');
      popup += ('<option ' + (formatVal == 'cabinet photographs' ? 'selected="selected"' : '') + ' value="cabinet photographs">cabinet photographs</option>');
      popup += ('<option ' + (formatVal == 'composite photographs' ? 'selected="selected"' : '') + ' value="composite photographs">composite photographs</option>');
      popup += ('<option ' + (formatVal == 'copy prints' ? 'selected="selected"' : '') + ' value="copy prints">copy prints</option>');
      popup += ('<option ' + (formatVal == 'digital images' ? 'selected="selected"' : '') + ' value="digital images">digital images</option>');
      popup += ('<option ' + (formatVal == 'documentary photographs' ? 'selected="selected"' : '') + ' value="documentary photographs">documentary photographs</option>');
      popup += ('<option ' + (formatVal == 'dye diffusion transfer prints' ? 'selected="selected"' : '') + ' value="dye diffusion transfer prints">dye diffusion transfer prints</option>');
      popup += ('<option ' + (formatVal == 'fashion photographs' ? 'selected="selected"' : '') + ' value="fashion photographs">fashion photographs</option>');
      popup += ('<option ' + (formatVal == 'forensic photographs' ? 'selected="selected"' : '') + ' value="forensic photographs">forensic photographs</option>');
      popup += ('<option ' + (formatVal == 'identification photographs' ? 'selected="selected"' : '') + ' value="identification photographs">identification photographs</option>');
      popup += ('<option ' + (formatVal == 'news photographs' ? 'selected="selected"' : '') + ' value="news photographs">news photographs</option>');
      popup += ('<option ' + (formatVal == 'photograph albums' ? 'selected="selected"' : '') + ' value="photograph albums">photograph albums</option>');
      popup += ('<option ' + (formatVal == 'photomurals' ? 'selected="selected"' : '') + ' value="photomurals">photomurals</option>');
      popup += ('<option ' + (formatVal == 'radiographs' ? 'selected="selected"' : '') + ' value="radiographs">radiographs</option>');
      popup += ('<option ' + (formatVal == 'wire photographs' ? 'selected="selected"' : '') + ' value="wire photographs">wire photographs</option>');
      popup += '</select></dd>';

      popup += '<dt>Type:</dt><dd><div class="smTxt">The nature or genre of the resource</div><select name="dz-type" id="dz-type">';
      popup += ('<option ' + (typeVal == '' ? 'selected="selected"' : '') + ' value=""></option>');
      popup += ('<option ' + (typeVal == 'Still Image' ? 'selected="selected"' : '') + ' value="Still Image">Still Image</option>');
      popup += ('<option ' + (typeVal == 'Letter' ? 'selected="selected"' : '') + ' value="Letter">Letter</option>');
      popup += ('<option ' + (typeVal == 'Literature' ? 'selected="selected"' : '') + ' value="Literature">Literature</option>');
      popup += ('<option ' + (typeVal == 'Poem' ? 'selected="selected"' : '') + ' value="Poem">Poem</option>');
      popup += ('<option ' + (typeVal == 'Program' ? 'selected="selected"' : '') + ' value="Program">Program</option>');
      popup += ('<option ' + (typeVal == 'Email' ? 'selected="selected"' : '') + ' value="Email">Email</option>');
      popup += ('<option ' + (typeVal == 'Event' ? 'selected="selected"' : '') + ' value="Event">Event</option>');
      popup += ('<option ' + (typeVal == 'Lesson' ? 'selected="selected"' : '') + ' value="Lesson">Lesson</option>');
      popup += ('<option ' + (typeVal == 'Moving Image' ? 'selected="selected"' : '') + ' value="Moving Image">Moving Image</option>');
      popup += ('<option ' + (typeVal == 'Website' ? 'selected="selected"' : '') + ' value="Website">Website</option>');
      popup += ('<option ' + (typeVal == 'Plan' ? 'selected="selected"' : '') + ' value="Plan">Plan</option>');
      popup += ('<option ' + (typeVal == 'Hyperlink' ? 'selected="selected"' : '') + ' value="Hyperlink">Hyperlink</option>');
      popup += ('<option ' + (typeVal == 'Interactive Resource' ? 'selected="selected"' : '') + ' value="Interactive Resource">Interactive Resource</option>');
      popup += ('<option ' + (typeVal == 'Sound' ? 'selected="selected"' : '') + ' value="Sound">Sound</option>');
      popup += ('<option ' + (typeVal == 'Oral History' ? 'selected="selected"' : '') + ' value="Oral History">Oral History</option>');
      popup += '</select></dd>';

      popup += '</dl></form></div>';
      popup += '</div>';

      jQuery('body').append(popup);

      // Record image specific metadata in the larger submit form
      jQuery('#form_' + hashedBaseId).submit(function(event) {
        event.preventDefault();

        var realForm = jQuery('#contribute');
        var formDate = realForm.find('#dz-date_' + hashedBaseId);
        var formDimensions = realForm.find('#dz-dimensions_' + hashedBaseId);
        var formDescription = realForm.find('#dz-description_' + hashedBaseId);
        var formFormat = realForm.find('#dz-format_' + hashedBaseId);
        var formType = realForm.find('#dz-type_' + hashedBaseId);

        var thisForm = jQuery('#form_' + hashedBaseId);
        var dateValue = thisForm.find('#dz-date').val();
        var dimensionsValue = thisForm.find('#dz-dimensions').val();
        var descriptionValue = thisForm.find('#dz-description').val();
        var formatValue = thisForm.find('#dz-format').val();
        var typeValue = thisForm.find('#dz-type').val();

        if (formDate.length > 0) {
          formDate.val(dateValue);
        } else if (dateValue != undefined && dateValue.length > 1) {
          var dateId = 'dz-date_' + hashedBaseId;
          jQuery('#contribute').append('<input type="hidden" id="' + dateId + '" name="' + dateId + '" value="' + dateValue + '">');
        }
        if (formDimensions.length > 0) {
          formDimensions.val(dimensionsValue);
        } else if (dimensionsValue != undefined && dimensionsValue.length > 1) {
          var dimensionsId = 'dz-dimensions_' + hashedBaseId;
          jQuery('#contribute').append('<input type="hidden" id="' + dimensionsId + '" name="' + dimensionsId + '" value="' + dimensionsValue + '">');
        }
        if (formDescription.length > 0) {
          formDescription.val(descriptionValue);
        } else if (descriptionValue != undefined && descriptionValue.length > 1) {
          var descriptionId = 'dz-description_' + hashedBaseId;
          jQuery('#contribute').append('<input type="hidden" id="' + descriptionId + '" name="' + descriptionId + '" value="' + descriptionValue + '">');
        }
        if (formFormat.length > 0) {
          formFormat.val(formatValue);
        } else if (formatValue != undefined && formatValue.length > 1) {
          var formatId = 'dz-format_' + hashedBaseId;
          jQuery('#contribute').append('<input type="hidden" id="' + formatId + '" name="' + formatId + '" value="' + formatValue + '">');
        }
        if (formType.length > 0) {
          formType.val(typeValue);
        } else if (typeValue != undefined && typeValue.length > 1) {
          var typeId = 'dz-type_' + hashedBaseId;
          jQuery('#contribute').append('<input type="hidden" id="' + typeId + '" name="' + typeId + '" value="' + typeValue + '">');
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

              // Then we have Echode form customizations
              var story = jQuery("#element-1");

              // IF story ELSE photos
              if (story.length) {
                var photoLabel = jQuery("label[for='contributed_file']").detach();
                var photo = jQuery("#omekaDZ").detach();
                var photoFallback = jQuery("odz-fallback").detach();

                story.after(photoFallback);
                story.after(photo);
                story.after(photoLabel);

                var storyLabel = jQuery("#element-1 div label");
                storyLabel.append("<span class='req'>&nbsp;&nbsp;*</span>");

                jQuery('#contribute').append('<input type="hidden" name="Elements[51][0][text]" id="Elements-51-0-text" value="Document">');
              } else {
                jQuery("label[for='contributed_file']").append("<span class='req'>&nbsp;&nbsp;*</span>");

                var format = jQuery("#element-42 div label");
                format.append("<span class='req'>&nbsp;&nbsp;*</span>");
                format.after("<div class='smTxt'>The file format or physical medium.</div>");

                var type = jQuery("#element-51 div label");
                type.append("<span class='req'>&nbsp;&nbsp;*</span>");
                type.after("<div class='smTxt'>The nature or genre of the resource.</div>");

                var dimensions = jQuery("#element-10 div label");
                dimensions.append("<span class='req'>&nbsp;&nbsp;*</span>");
                dimensions.after("<div class='smTxt'>Size of the item. (i.e. 4 x 5 in, 8 x 10 in, etc.)</div>");
              }

              var title = jQuery("#element-50 div label");
              title.append("<span class='req'>&nbsp;&nbsp;*</span>");
              title.after("<div class='smTxt'>A name given to this contribution (ie. Basketball Practice). It is up to you to decide how much information to include.</div>");

              var subject = jQuery("#element-49 div label");
              subject.append("<span class='req'>&nbsp;&nbsp;*</span>");
              subject.after("<div class='smTxt'>What is this resource about?</div>");

              var subjectInput = jQuery("#Elements-49-0-text");
              var subjectSelect = '<select name="Elements[49][0][text]" id="Elements-49-0-text">';
              subjectSelect += '<option selected="selected" value=""></option>';
              subjectSelect += '<option value="Education">Education</option>';
              subjectSelect += '<option value="Religion">Religion</option>';
              subjectSelect += '<option value="Race">Race</option>';
              subjectSelect += '<option value="Agriculture">Agriculture</option>';
              subjectSelect += '<option value="Legal affairs">Legal affairs</option>';
              subjectSelect += '<option value="Industry">Industry</option>';
              subjectSelect += '<option value="Civic life">Civic life</option>';
              subjectSelect += '<option value="Military">Military</option>';
              subjectSelect += '<option value="Healthcare">Healthcare</option>';
              subjectSelect += '<option value="Politics">Politics</option>';
              subjectSelect += '<option value="Athletics">Athletics</option>';
              subjectSelect += '<option value="Recreation">Recreation</option>';
              subjectSelect += '<option value="Towns and districts">Towns and districts</option>';
              subjectSelect += '<option value="Family records">Family records</option>';
              subjectSelect += '<option value="Food and drink">Food and drink</option>';
              subjectSelect += '<option value="Crime">Crime</option>';
              subjectSelect += '</select>';
              subjectInput.replaceWith(subjectSelect);

              var description = jQuery("#element-41 div label");
              description.append("<span class='req'>&nbsp;&nbsp;*</span>");
              description.after("<div class='smTxt'>Narrative description of the item. This free-text description can be as short or as long as necessary.</div>");

              var creator = jQuery("#element-39 div label");
              creator.append("<span class='req'>&nbsp;&nbsp;*</span>");
              creator.after("<div class='smTxt'>Institutions or individuals that created or assembled this item. (ie. original photographer, author, artist, performer, etc.)</div>");

              var source = jQuery("#element-48 div label");
              source.append("<span class='req'>&nbsp;&nbsp;*</span>");
              source.after("<div class='smTxt'>A related resource from which the described resource is derived. (ie. newspaper, magazine, etc.)</div>");

              var publisher = jQuery("#element-45 div label");
              publisher.after("<div class='smTxt'>An entity responsible for making the resource available (ie. an actual publisher, if there is one; entity or consortium publishing digital materials.)</div>");

              var date = jQuery("#element-40 div label");
              date.append("<span class='req'>&nbsp;&nbsp;*</span>");
              date.after("<div class='smTxt'>Your best assessment of a point or period of time associated with an event in the contents of the resource (ie. When was this picture taken or article written?) Please use the following format: 4DigitYear-2DigitMonth-2DigitDay (ie. 1936-03-24). If you do not know an accurate date, please enter your most accurate guess using a range (ie. 1906 - 1910).</div>");

              var rights = jQuery("#element-47 div label");
              rights.append("<span class='req'>&nbsp;&nbsp;*</span>");
              rights.after("<div class='smTxt'>Please designate the usage rights granted upon upload by the person or organization owning or managing the resource.</div>");

              var rightsInput = jQuery("#Elements-47-0-text");
              var rightsRadio = '<input type="radio" value="Public Domain" id="dz-rights-ignore-PublicDomain" name="dz-rights-ignore" class="Elements-47-0-text" />';
              rightsRadio += '<label for="Public Domain">Public Domain</label>';
              rightsRadio += '<input type="radio" value="Creative Commons" id="dz-rights-ignore-CreativeCommons" name="dz-rights-ignore" class="Elements-47-0-text" />';
              rightsRadio += '<label for="Creative Commons">Creative Commons</label>';
              rightsRadio += '<input type="radio" value="View Only" id="dz-rights-ignore-ViewOnly" name="dz-rights-ignore" class="Elements-47-0-text" />';
              rightsRadio += '<label for="View Only">View Only</label>';
              rightsRadio += '<input type="radio" value="Other" id="dz-rights-ignore-Other" name="dz-rights-ignore" class="Elements-47-0-text" />';
              rightsRadio += '<label for="Other">Other</label>';
              rightsRadio += '<input id="Elements-47-0-text" name="Elements[47][0][text]" style="display:none" placeholder="Please enter other license" value="" type="text" />';
              rightsInput.replaceWith(rightsRadio);

              jQuery(".Elements-47-0-text").change(function() {
                if (this.checked && this.value === "Other") {
                  var rightsValue = jQuery("#Elements-47-0-text");
                  rightsValue.show();
                  rightsValue.val('');
                  rightsValue.attr('placeholder', 'Please enter other license');
                } else {
                  var rightsValue = jQuery("#Elements-47-0-text");
                  rightsValue.hide();
                  rightsValue.val(this.value);
                }
              });

              var formatInput = jQuery("#Elements-42-0-text");
              var formatSelect = '<select name="Elements[42][0][text]" id="Elements-42-0-text">';
              formatSelect += '<option selected="selected" value=""></option>';
              formatSelect += '<option value="color photographs">color photographs</option>';
              formatSelect += '<option value="aerial photographs">aerial photographs</option>';
              formatSelect += '<option value="astrophotographs">astrophotographs</option>';
              formatSelect += '<option value="black-and-white photographs">black-and-white photographs</option>';
              formatSelect += '<option value="boudoir photographs">boudoir photographs</option>';
              formatSelect += '<option value="cabinet photographs">cabinet photographs</option>';
              formatSelect += '<option value="composite photographs">composite photographs</option>';
              formatSelect += '<option value="copy prints">copy prints</option>';
              formatSelect += '<option value="digital images">digital images</option>';
              formatSelect += '<option value="documentary photographs">documentary photographs</option>';
              formatSelect += '<option value="dye diffusion transfer prints">dye diffusion transfer prints</option>';
              formatSelect += '<option value="fashion photographs">fashion photographs</option>';
              formatSelect += '<option value="forensic photographs">forensic photographs</option>';
              formatSelect += '<option value="identification photographs">identification photographs</option>';
              formatSelect += '<option value="news photographs">news photographs</option>';
              formatSelect += '<option value="photograph albums">photograph albums</option>';
              formatSelect += '<option value="photomurals">photomurals</option>';
              formatSelect += '<option value="radiographs">radiographs</option>';
              formatSelect += '<option value="wire photographs">wire photographs</option>';
              formatSelect += '</select>';
              formatInput.replaceWith(formatSelect);

              var typeInput = jQuery("#Elements-51-0-text");
              var typeSelect = '<select name="Elements[51][0][text]" id="Elements-51-0-text">';
              typeSelect += '<option selected="selected" value=""></option>';
              typeSelect += '<option value="Still Image">Still Image</option>';
              typeSelect += '<option value="Oral History">Oral History</option>';
              typeSelect += '<option value="Letter">Letter</option>';
              typeSelect += '<option value="Literature">Literature</option>';
              typeSelect += '<option value="Poem">Poem</option>';
              typeSelect += '<option value="Program">Program</option>';
              typeSelect += '<option value="Email">Email</option>';
              typeSelect += '<option value="Event">Event</option>';
              typeSelect += '<option value="Lesson">Lesson</option>';
              typeSelect += '<option value="Moving Image">Moving Image</option>';
              typeSelect += '<option value="Sound">Sound</option>';
              typeSelect += '<option value="Website">Website</option>';
              typeSelect += '<option value="Plan">Plan</option>';
              typeSelect += '<option value="Hyperlink">Hyperlink</option>';
              typeSelect += '<option value="Interactive Resource">Interactive Resource</option>';
              typeSelect += '</select>';
              typeInput.replaceWith(typeSelect);

              var lang = jQuery("#element-44 div label");
              lang.after("<div class='smTxt'>Language(s) of the original item.</div>");

              var langInput = jQuery("#Elements-44-0-text");
              var langRadio = '<input type="radio" value="English" id="dz-lang-ignore-English" name="dz-lang-ignore" class="Elements-44-0-text" />';
              langRadio += '<label for="English">English</label>';
              langRadio += '<input type="radio" value="Spanish" id="dz-lang-ignore-Spanish" name="dz-lang-ignore" class="Elements-44-0-text" />';
              langRadio += '<label for="Spanish">Spanish</label>';
              langRadio += '<input type="radio" value="Other" id="dz-lang-ignore-Other" name="dz-lang-ignore" class="Elements-44-0-text" />';
              langRadio += '<label for="Other">Other</label>';
              langRadio += '<input id="Elements-44-0-text" name="Elements[44][0][text]" style="display:none" placeholder="Please enter other language" value="" type="text" />';
              langInput.replaceWith(langRadio);

              jQuery(".Elements-44-0-text").change(function() {
                if (this.checked && this.value === "Other") {
                  var langValue = jQuery("#Elements-44-0-text");
                  langValue.show();
                  langValue.val('');
                  langValue.attr('placeholder', 'Please enter other language');
                } else {
                  var langValue = jQuery("#Elements-44-0-text");
                  langValue.hide();
                  langValue.val(this.value);
                }
              });

              var terms = jQuery("label[for='terms-agree']");

              if (terms.find('.req').length == 0) {
                terms.append("<span class='req'>&nbsp;&nbsp;*</span>");
              }

              jQuery('#contribution-public').attr('checked', true);
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
