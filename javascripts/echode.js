jQuery(document).ready(function() {
  jQuery('#search_popup').popup({color: 'white', opacity: .85, vertical: 'top', blur: false});

  /* Trims text for mobile or desktop popup display */
  function trimText(text, cutoffs) {
    var isMobile = false;

    if (jQuery(window).width() < 800) {
      isMobile = true;
    }

    var paragraphs = text.text();
    var trimmed = paragraphs.substr(0, (isMobile ? cutoffs[0] : cutoffs[1]));

    trimmed = trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(" ")));

    if (trimmed.length > 0) {
      text.text(trimmed + "...");
    }
  }

  var ImageResize = function(image, maxWidth, maxHeight) {
    var imgHeight = image.height();
    var imgWidth = image.width();

    if (imgHeight == 0) {
      console.log("Image height: 0");
    }

    if (imgWidth > maxWidth){
      ratio = maxWidth / imgWidth;
      image.css("width", maxWidth);
      image.css("height", imgHeight * ratio);
    }

    imgHeight = image.height();
    imgWidth = image.width();

    if (imgHeight > maxHeight){
      ratio = maxHeight / imgHeight;
      image.css("height", maxHeight);
      image.css("width", imgWidth * ratio);
    }
  }

  /* Opens image navigation popup */
  function openPopup(href, item) {
    jQuery('#item_view').popup({color: 'white', opacity: .85, autoopen: true, blur: false, scrolllock: true,
        detach: true, outline: true, beforeopen: function() {
      jQuery.ajax({
        url: href,
        async: false
      }).done(function(data) {
        var html = jQuery(jQuery.parseHTML(data));
        var article = html.find('article.section');
        var nav = jQuery(article).find('nav');
        var previous = jQuery(nav).find('#previous-item a');
        var next = jQuery(nav).find('#next-item a');
        var nextHref, prevHref;

        /* Omeka has a different concept of next/previous than user */
        if (previous.length > 0) {
          nextHref = previous.attr('href');
        }

        if (next.length > 0) {
          prevHref = next.attr('href');
        }

        article.css('background-color', 'white');
        article.css('opacity', '1');

        jQuery(article).find('div.container:gt(0)').remove();
        jQuery(article).find('a:not([class="keeper"])').contents().unwrap();
        jQuery(article).find('a[class="keeper"]').attr('target', '_blank');
        jQuery(article).find('aside').remove();

        /* Tidy up what wasn't removed by 'div.container:gt(0)' above */
        nav.remove();

        item.append(article);

        if (nextHref !== undefined && nextHref !== null) {
          item.append('<a href="' + nextHref + '" class="nextprev"><i class="fa fa-arrow-circle-right fa-lg" id="search-nav-right" aria-hidden="true"></i></a>');
        }

        if (prevHref !== undefined && prevHref !== null) {
          item.append('<a href="' + prevHref + '" class="nextprev"><i class="fa fa-arrow-circle-left fa-lg" id="search-nav-left" aria-hidden="true"></i></a>');
        }

        item.find('.nextprev').click(function(e) {
          var isMobile = false;

          if (jQuery(window).width() < 800) {
            isMobile = true;
          }

          jQuery('#item_view').popup('hide');

          var height = jQuery(window).height() * .8;
          var width = jQuery(window).width() * (isMobile ? .8 : .5);
          var href = jQuery(this).attr('href');

          /* Popup markup */
          var item = jQuery("<div id='item_view' style='width:" + width  + "px;height:" + height + "px;'>" +
            "<button class='popup_close item_view_close'><i class='fa fa-times'></i></button></div>");

          /* Put our popup on the page so it can popup */
          jQuery('.items-grid').append(item);
          openPopup(href, item);
          e.preventDefault();
        });
      });
    }, onopen: function() {
      var view = jQuery('#item_view');
      var image = jQuery(view).find('img');
      var text = jQuery(view).find('.single__text');
      var isMobile = false;

      if (jQuery(window).width() < 800) {
        isMobile = true;
      }

      if (image.length) {
        var maxHeight = parseInt(view.css('height')) * (isMobile ? .50 : .75);
        var maxWidth = parseInt(image.parent().css('width'));
        var ratio;

        /* Scale image to fit in popup */
        /*
           Odd behavior here. It works with an inline function but not an external function(?!)

           jQuery warns there are issues related to trying to detect image loads with .load():
             http://api.jquery.com/load-event/

           StackOverflow recommends an external library to supposedly resolve all the weirdness:
             https://github.com/desandro/imagesloaded
        */
        //image.load(ImageResize(image, maxWidth, maxHeight));
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

          if (imgHeight > maxHeight){
            ratio = maxHeight / imgHeight;
            image.css("height", maxHeight);
            image.css("width", imgWidth * ratio);
          }
        });
      } else {
        /* Pass cutoff sizes for textual items */
        trimText(text, [300, 1000]);
      }

      var description = view.find('#description-metadata .dt');
      trimText(description, [40, 140]);

      /* Screen too small for description */
      if (isMobile) jQuery(view.find('#description-metadata')).remove();

      var itemID = view.find('#title-metadata span').attr('id').split('-')[1];
      var floater = jQuery("<div class='item_view_floater'>" +
        "<a target='_blank' href='/items/show/" + itemID + "'>" +
        "Visit the full record</a> to see more details or leave comments.</div>");

      if (isMobile) {
        floater.insertAfter(view.find('.metadata').last());
      } else {
        if (image.length > 0) {
          floater.insertAfter(image);
        } else {
          floater.insertAfter(text);
        }
      }
    }});
  }

  var getQueryString = function(field, url) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
  };

  /* Create popup viewer for infinite scroller */
  var ModLinks = function() {
    jQuery(this).click(function(e) {
      if (getQueryString('skipPopups') == "true") {
        jQuery(this).attr('target', '_blank');
      }
      else {
        var isMobile = false;

        if (jQuery(window).width() < 800) {
          isMobile = true;
        }

        var height = jQuery(window).height() * .8;
        var width = jQuery(window).width() * (isMobile ? .8 : .5);
        var href = jQuery(this).attr('href');

        /* Popup markup */
        var item = jQuery("<div id='item_view' style='width:" + width  + "px;height:" + height + "px;'>" +
          "<button class='popup_close item_view_close'><i class='fa fa-times'></i></button></div>");

        /* Put our popup on the page so it can popup */
        jQuery('.items-grid').append(item);

        openPopup(href, item);
        e.preventDefault();
      }
    });
  }

  if (window.location.pathname == '/items/browse') {
    if (localStorage.getItem('openExplore') !== null && localStorage.openExplore == 'true') {
      jQuery('#search_popup').popup('show');
      localStorage.removeItem('openExplore');
    }
    if (localStorage.getItem('shortcutBrowse') !== null && localStorage.shortcutBrowse == 'true') {
      localStorage.removeItem('shortcutBrowse');
      jQuery('#advanced-search-form').append('<input type="hidden" name="skipPopups" value="true"/>');
    }
  }

  /* Add a button that enables bookmarking in albums */
  if (window.location.pathname.substring(0, 12) == '/items/show/') {
    jQuery('#album_add_popup').popup({color: 'white', opacity: .85, outline: true, border: true, blur: false});

    if (jQuery('meta[name="omeka-user-id"]').length > 0) {
      var itemFile = jQuery('.item-file');
      var image = itemFile.find('img');

      if (itemFile.length > 0) {
        jQuery('<a href="#" onclick="jQuery(\'#album_add_popup\').popup(\'show\');" title="Add to album" alt="Add to album">'+
          '<i class="fa fa-plus fa-3x" id="add-to-album-button"></i></a>').appendTo(itemFile);
      } else {
        jQuery('<a href="#" onclick="jQuery(\'#album_add_popup\').popup(\'show\');" title="Add to album" alt="Add to album">'+
          '<i class="fa fa-plus fa-3x" style="float:right"></i></a>').appendTo(jQuery('.single__text'));
      }

      if (image.length > 0) {
        var offset = parseInt(jQuery('article.section').css('padding-top').replace('px',''));
        var maxHeight = jQuery(window).height()-jQuery('header').height()-jQuery('footer').height()-offset;
        var maxWidth = jQuery(window).width();

        ImageResize(image, maxWidth, maxHeight);

        var position = (itemFile.width() - image.width()) / 2 + 5;
        jQuery('#add-to-album-button').css('margin-right', position + "px");
      }
    }
  }

  // Fixing what isn't extensible through plugin theme override(?!)
  if (window.location.pathname.substring(0, 22) == '/albums/delete-confirm') {
    var wrapper = jQuery('.content-wrapper');
    var h1 = wrapper.find('h1');
    var primary = wrapper.find('#primary div');

    wrapper.css('margin-top', '90px');
    wrapper.css('margin-left', '40px');
    h1.text('Delete Album');
    primary.unwrap();
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

  function pageNext() {
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

  /* We need to help iPads out a little on first load  */
  if (jQuery(window).width() == 768 && (window.location.pathname == '/' || window.location.pathname.substring(0, 13) == '/items/browse')) {
    pageNext();
  }

  /* Infinite scroll */
  jQuery(window).scroll(function() {
    if (jQuery(window).scrollTop() + jQuery(window).height() == jQuery(document).height()) {
      if (window.location.pathname == '/' || window.location.pathname.substring(0, 13) == '/items/browse') {
        pageNext();
      }
    }
  });
});
