jQuery(document).ready(function() {
  /* Popups for browse and search */
  jQuery('#search_popup').popup({color: 'white', opacity: .85, vertical: 'top', blur: false});

  /* Create popup viewer for infinite scroller */
  var ModLinks = function() {
    jQuery(this).click(function(e) {
      var height = jQuery(window).height() * .8;
      var width = jQuery(window).width() * .50;
      var item = jQuery("<div id='item_view' style='width:" + width  + "px;height:" + height + "px;'>" +
        "<button class='popup_close item_view_close'><i class='fa fa-times'></i></button></div>");
      var href = jQuery(this).attr('href');

      /* Put our popup on the page so it can popup */
      jQuery('.items-grid').append(item);

      jQuery('#item_view').popup({color: 'white', opacity: .85, autoopen: true, blur: false, scrolllock: true,
          detach: true, outline: true, beforeopen: function(){
        jQuery.ajax({
          url: href,
          async: false
        }).done(function(data) {
          var html = jQuery(jQuery.parseHTML(data));
          var article = html.find('article.section');
          var nav = jQuery(article).find('nav');

          article.css('background-color', 'white');
          article.css('opacity', '1');

          jQuery(article).find('div.container:gt(0)').remove();
          jQuery(article).find('a:not([class="keeper"])').contents().unwrap();
          jQuery(article).find('a[class="keeper"]').attr('target', '_blank');
          jQuery(article).find('aside').remove();
          nav.remove();

          item.append(article);
        });
      }, onopen: function(){
        var view = jQuery('#item_view');
        var image = jQuery(view).find('img');
        var text = jQuery(view).find('.single__text');

        if (image.length) {
          var maxHeight = parseInt(view.css('height')) * .75;
          var maxWidth = parseInt(view.css('width')) - 20;
          var ratio;

          /* Scale image to fit in popup */
          image.load(function() {
            var imgHeight = image.height();
            var imgWidth = image.width();

            if (imgWidth > maxWidth){
              ratio = maxWidth / imgWidth;
              image.css("width", maxWidth);
              image.css("height", imgHeight * ratio);
            }

            imgHeight = image.height();
            imgWidth = image.width();

            if (height > maxHeight){
              ratio = maxHeight / imgHeight;
              image.css("height", maxHeight);
              image.css("width", imgWidth * ratio);
            }
          });
        } else {
          var paragraphs = text.text();
          var trimmed = paragraphs.substr(0, 1000);

          trimmed = trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(" ")));
          text.text(trimmed + "...");
        }

        var itemID = view.find('#title-metadata span').attr('id').split('-')[1];
        var floater = jQuery("<div class='item_view_floater'>" +
          "<a target='_blank' href='/items/show/" + itemID + "'>" +
          "Visit the full record</a> to see more details or leave comments.</div>");

        if (image.length > 0) {
          floater.insertAfter(image);
        } else {
          floater.insertAfter(text);
        }
      }});

      e.preventDefault();
    });
  }

  if (window.location.pathname == '/items/browse') {
    if (localStorage.getItem("openExplore") !== null && localStorage.openExplore == 'true') {
      jQuery('#search_popup').popup('show');
      localStorage.removeItem('openExplore');
    }
  }

  if (window.location.pathname == '/' || window.location.pathname.substring(0, 13) == '/items/browse') {
    var itemsGrid = jQuery('div.items-grid');

    itemsGrid.find("a").each(ModLinks);

    /* Enable infinite scroll on home page too  */
    if (window.location.pathname == '/') {
      jQuery("<ul style='display:none;'><li class='pagination_next'><a href='/items/browse?page=2'></a></li></ul>").insertAfter(itemsGrid);
    }
  }

  /* Make geolocation map extend to height of page */
  if (window.location.pathname == '/items/map') {
    jQuery('#geolocation-browse').css('height', jQuery(window).height()-jQuery('header').height()*2 + 27);
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
      if (fromDate == '1877' && toDate == new Date().getFullYear()) {
        document.getElementById("date_search_term").value = "";
      } else {
        document.getElementById("date_search_term").value = fromDate + "-" + toDate;
      }
    } else if (fromDate) {
      toDate = new Date().getFullYear() + 1;
      document.getElementById("date_search_term").value = fromDate + "-" + toDate;
    } else if (toDate) {
      fromDate = "1877";
      document.getElementById("date_search_term").value = fromDate + "-" + toDate;
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
  });

  jQuery('ul.navigation li a').click(function() {
    /* Workaround for buggy two popup behavior */
    jQuery('#search_popup').popup('hide');

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

  /* Infinite scroll */
  jQuery(window).scroll(function() {
    if (jQuery(window).scrollTop() + jQuery(window).height() == jQuery(document).height()) {
      if (window.location.pathname == '/' || window.location.pathname.substring(0, 13) == '/items/browse') {
        if (jQuery('li.pagination_next a').length) {
          var nextPage = jQuery('li.pagination_next a').attr('href');
          var itemsGrid  = jQuery('div.items-grid');
          var arr = nextPage.split("=");
          var pageNum = arr[arr.length - 1];

          if (pageNum > 1) {
            console.log("Getting new page: #" + pageNum);
            jQuery.get(nextPage, function(data, status) {
              var html = jQuery(jQuery.parseHTML(data));
              var links = html.find('div.items-grid a');

              jQuery('li.pagination_next').each(function(index, elem) {
                jQuery(elem).remove();
              });

              links.each(ModLinks);
              itemsGrid.append(links);
              itemsGrid.append(html.find('li.pagination_next'));
            });
          }
        }
      }
    }
  });
});
