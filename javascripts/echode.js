jQuery(document).ready(function() {
  /* Popups for browse and search */
  jQuery('#search_popup').popup({color: 'white', opacity: .85, vertical: 'top', blur: false});

  if (window.location.pathname == '/items/browse') {
    if (localStorage.getItem("openExplore") !== null && localStorage.openExplore == 'true') {
      jQuery('#search_popup').popup('show');
      localStorage.openExplore = 'false';
    }
  }

  /* Make geolocation map extend to height of page */
  if (window.location.pathname == '/items/map') {
    jQuery('#geolocation-browse').css('height', jQuery(window).height()-jQuery('header').height()*2+5);
  }

  if (window.location.pathname.substr(0, 11) === '/items/show') {
    var itemImage = jQuery("div.item-file a img.full");
    var height = jQuery(window).height() - jQuery('header').height()*2;

    itemImage.css('width', 'auto');
    itemImage.css('max-width', 'auto');
    itemImage.css('max-height', height + 'px');
  }

  /* Construct valid date range for advanced search */
  jQuery('#advanced-search-form').on('submit', function(e) {
    var pictureCheckbox = jQuery(this).find("#picture-checkbox");
    var storyCheckbox = jQuery(this).find("#story-checkbox");

    /* If both selected, remove both for a 'search everything' request */
    if (storyCheckbox.is(':checked') && pictureCheckbox.is(':checked')) {
      storyCheckbox.prop('checked', false);
      pictureCheckbox.prop('checked', false);
    }

    var viewValue = jQuery(this).find("#view-results").val();

    /* If we want to plot results on map, change form's action */
    if (viewValue == 'locations') {
      jQuery(this).attr("action", "/items/map");
    }

    var subject = jQuery(this).find("#subject-value");

    /* Form won't submit with empty subject w/o removing hidden fields */
    if (subject.val() == '') {
      var subjectQuery = jQuery(this).find("#subject-query");
      var subjectField = jQuery(this).find("#subject-field");

      jQuery(subjectQuery).remove();
      jQuery(subjectField).remove();
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

    /* Reset the state of our infinite scroll */
    if (typeof(Storage) !== 'undefined') {
      localStorage.scrollPage = 1;
      localStorage.removeItem("lastItem");
    }
  });

  /* Enter submits for advanced search */
  jQuery("#search-box").keypress(function(e) {
    if (e.which == 13) {
      jQuery(this).closest('form').submit();
    }
  });

  jQuery('div.logo-btn-wrap a').click(function() {
    /* Workaround for buggy two popup behavior */
    jQuery('#search_popup').popup('hide');

    /* Reset the state of our infinite scroll */
    if (typeof(Storage) !== 'undefined') {
      localStorage.scrollPage = 1;
      localStorage.removeItem("lastItem");
    }
  });

  jQuery('ul.navigation li a').click(function() {
    /* Workaround for buggy two popup behavior */
    jQuery('#search_popup').popup('hide');

    /* Reset the state of our infinite scroll */
    if (typeof(Storage) !== 'undefined') {
      localStorage.scrollPage = 1;
      localStorage.removeItem("lastItem");
    }

    /* Redirect "Explore" nav clicks to /items/browse page */
    if (window.location.pathname == '/contribution' || window.location.pathname == '/guest-user/user/me'
        || window.location.pathname.substr(0, 11) === '/items/show') {
      if (jQuery(this).attr('href') == '#') {
        if (typeof(Storage) !== 'undefined') {
          localStorage.openExplore = "true";
        }

        window.location.href = '/items/browse';
      }
    }
  });

  /* Jump to page and item in infinite scroll */
  if (typeof(Storage) !== 'undefined') {
    if (window.location.href.indexOf('/items/browse') != -1 || window.location.href.lastIndexOf('/') == window.location.href.length - 1) {
      if (localStorage.scrollPage > 1) {
        jQuery('div.items-grid a').remove();
        console.log("Getting page " + localStorage.scrollPage  + " through back button");

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

          var oldHeight = jQuery(document).height();
          var oldScroll = jQuery(window).scrollTop();

          itemsGrid.append(links);
          itemsGrid.append(html.find('li.pagination_next'));

          jQuery(document).scrollTop(oldScroll + jQuery(document).height() - oldHeight);

          if (localStorage.getItem("lastItem") !== null) {
            var lastItem = jQuery("#" + localStorage.lastItem);

            if (lastItem.length === 0) {
              lastItem = jQuery("#" + localStorage.lastItem + "_" + localStorage.scrollPage);
              jQuery("html, body").animate({ scrollTop: lastItem.offset().top - 72 });

              console.log("Reset page position to " + localStorage.lastItem + " [top offset: " + (lastItem.offset().top - 72).toString() + "]");
            } else {
              console.log("Last item " + localStorage.lastItem  + "  not found on page (" + localStorage.scrollPage + ")");
            }

            localStorage.removeItem("lastItem");
          } else {
            console.log("Last item is null, can't scroll'");
          }

            localStorage.ignoreScroll = "true";
        });
      }

    } else if (window.location.href.indexOf('/items/show') != -1) {
      localStorage.removeItem("ignoreScroll");
    } else {
      localStorage.scrollPage = 1;
      localStorage.removeItem("lastItem");
      localStorage.removeItem("ignoreScroll");
    }
  }

  /* Infinite scroll */
  jQuery(window).scroll(function() {
    if (jQuery(window).scrollTop() + jQuery(window).height() == jQuery(document).height()) {
      if (localStorage.getItem("ignoreScroll") !== null) {
        localStorage.removeItem("ignoreScroll");
      } else {

      if (location.pathname == '/') {
        jQuery("<ul style='display:none;'><li class='pagination_next'><a href='/items/browse?page=2'></a></li></ul>").insertAfter(jQuery('div.items-grid'));
      }

      if (jQuery('li.pagination_next a').length) {
        var nextPage = jQuery('li.pagination_next a').attr('href');
        var itemsGrid  = jQuery('div.items-grid');
        var arr = nextPage.split("=");
        var pageNum = arr[arr.length - 1];

        if (pageNum > 1) {
          console.log("Getting new page: " + pageNum);
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
    }
  });
});
