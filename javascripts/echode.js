jQuery(document).ready(function() {
  /* Popups for browse and search */
  jQuery('#browse_popup').popup({color: 'white', opacity: .85, vertical: 'top', blur: false});
  jQuery('#search_popup').popup({color: 'white', opacity: .85, vertical: 'top', blur: false});

  jQuery("#everything-button").click(function () {
    jQuery(this).css("border-style", "inset")
    jQuery("#title-button").css("border-style", "outset;");
    jQuery("#subject-button").css("border-style", "outset;");
    jQuery("#search-field-value").val("everything");
  });
  jQuery("#title-button").click(function () {
    jQuery(this).css("border-style", "inset")
    jQuery("#everything-button").css("border-style", "outset;");
    jQuery("#subject-button").css("border-style", "outset;");
    jQuery("#search-field-value").val("title");
  });
  jQuery("#subject-button").click(function () {
    jQuery(this).css("border-style", "inset")
    jQuery("#everything-button").css("border-style", "outset;");
    jQuery("#title-button").css("border-style", "outset;");
    jQuery("#search-field-value").val("subject");
  });

  /* Construct valid date range for advanced search */
  jQuery('#advanced-search-form').on('submit', function(e) {
    var pictureCheckbox = jQuery(this).find("#picture-checkbox");
    var storyCheckbox = jQuery(this).find("#story-checkbox");
    var mapSearch = jQuery(this).find("#map-search");

    /* If both selected, remove both for a 'search everything' request */
    if (storyCheckbox.is(':checked') && pictureCheckbox.is(':checked')) {
      storyCheckbox.prop('checked', false);
      pictureCheckbox.prop('checked', false);
    }

    /* If we want to plot results on map, change form's action */
    if (mapSearch.is(':checked')) {
      jQuery(this).attr("action", "/items/map");
      mapSearch.prop('checked', false);
    }

    var dateValues = document.getElementById('dateSlider').noUiSlider.get();
    var fromDate = new Date(dateValues[0]).getFullYear() + 1;
    var toDate = new Date(dateValues[1]).getFullYear() + 1;

    if (fromDate && toDate) {
      document.getElementById("date_search_term").value = fromDate + "-" + toDate;
    } else if (fromDate) {
      toDate = new Date().getFullYear() + 1;
      document.getElementById("date_search_term").value = fromDate + "-" + toDate;
    } else if (toDate) {
      fromDate = "1877";
      document.getElementById("date_search_term").value = fromDate + "-" + toDate;
    }
<!--
    var searchFieldValue = jQuery(this).find("#search-field-value");
    if (searchFieldValue == 'title' || searchFieldValue == 'subject') {
      var searchBox = jQuery(this).find("#search-box");
      jQuery(this).find("#advanced_search").val(searchBox.val())
      searchBox.val("");
    }
    if (searchFieldValue == 'title') {
      jQuery(this).find("#advanced_search_type").val('50');
    } else if (searchFieldValue == 'subject') {
      jQuery(this).find("#advanced_search_type").val('49');
    }
-->
  });

  /* Enter submits for advanced search */
  jQuery("#search-box").keypress(function(e) {
    if (e.which == 13) {
      jQuery(this).closest('form').submit();
    }
  });

  jQuery('ul.navigation li a').click(function() {
    /* Workaround for buggy two popup behavior */
    jQuery('#browse_popup').popup('hide');
    jQuery('#search_popup').popup('hide');

    /* Reset the state of our infinite scroll */
    if (typeof(Storage) !== 'undefined') {
      localStorage.scrollPage = 1;
      localStorage.lastItem = 0;
    }
  });

  /* Jump to page and item in infinite scroll */
  if (typeof(Storage) !== 'undefined') {
    if (window.location.href.indexOf('/items/browse') != -1) {
      if (localStorage.scrollPage > 1) {
        jQuery('div.items-grid a').remove();

        jQuery.ajax({
          url: '/items/browse?page=' + localStorage.scrollPage,
          async: true
        }).done(function(data) {
          var html = jQuery(jQuery.parseHTML(data));
          var links = html.find('div.items-grid a');
          var itemsGrid = jQuery('div.items-grid');

          jQuery('li.pagination_next').each(function(index, elem) {
            jQuery(elem).remove();
          });

          links.each(function() {
            jQuery(this).attr('id', jQuery(this).attr('id') + '_' + localStorage.scrollPage);

            jQuery(this).click(function() {
              var parts = jQuery(this).attr('id').split('_');

              localStorage.scrollPage = parts[1];
              localStorage.lastItem = parts[0];
            });
          });

          itemsGrid.append(links);
          itemsGrid.append(html.find('li.pagination_next'));

          jQuery('li.pagination_next a').val('/items/browse?page=' + localStorage.scrollPage + 1);

          if (localStorage.getItem("lastItem") !== null) {
            var lastItem = jQuery("#" + localStorage.lastItem);

            if (lastItem.length === 0) {
              lastItem = jQuery("#" + localStorage.lastItem + "_" + localStorage.scrollPage);
            }

            try {
              jQuery("html, body").animate({ scrollTop: lastItem.offset().top - 72 });
            } catch (e) {
              // Page reload doesn't have last offset, and that's okay... started with next batch
            }
          }
        });
      }

    } else if (window.location.href.indexOf('/items/show') != -1) {
      // Don't need to do anything here
    } else {
      localStorage.scrollPage = 1;
      localStorage.lastItem = 0;
    }
  }

  /* Inifinite scroll */
  jQuery(window).scroll(function() {
    if (jQuery(window).scrollTop() + jQuery(window).height() == jQuery(document).height()) {
      if (location.pathname == '/') {
        localStorage.scrollPage = 2;
        localStorage.lastItem = jQuery('div.items-grid a:last').attr('id');
        window.location = "/items/browse?page=2";
      } else if (jQuery('li.pagination_next a').length) {
        var nextPage = jQuery('li.pagination_next a').attr('href');
        var itemsGrid  = jQuery('div.items-grid');
        var arr = nextPage.split("=");
        var pageNum = arr[arr.length - 1];

        if (pageNum > 1) {
          //alert("Getting new page: " + pageNum);
          jQuery.get(nextPage, function(data, status) {
            var html = jQuery(jQuery.parseHTML(data));
            var links = html.find('div.items-grid a');

            jQuery('li.pagination_next').each(function(index, elem) {
              jQuery(elem).remove();
            });

            links.each(function() {
              jQuery(this).attr('id', jQuery(this).attr('id') + '_' + pageNum);

              jQuery(this).click(function() {
                if (typeof(Storage) !== 'undefined') {
                  var parts = jQuery(this).attr('id').split('_');

                  localStorage.scrollPage = parts[1];
                  localStorage.lastItem = parts[0];
                }
              });
            });

            itemsGrid.append(links);
            itemsGrid.append(html.find('li.pagination_next'));
          });
        }

        if (typeof(Storage) !== 'undefined') {
          localStorage.scrollPage = pageNum;
        }
      }
    }
  });
});