jQuery(document).ready(function() {
  var query = window.location.search.substring(1);
  var vars = query.split("&");

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");

    if (pair[0] == 'search_type') {
      jQuery("#advanced-search-panel").show("slideDown");
      jQuery("#datepicker-1").datepicker({dateFormat: "yy-mm-dd", changeYear: true, changeMonth: true, yearRange: "1900:2020"});
      jQuery("#datepicker-2").datepicker({dateFormat: "yy-mm-dd", changeYear: true, changeMonth: true, yearRange: "1900:2020"});
    }
  }

  jQuery("#datepicker-1, #datepicker-2").focusin(function() {
    console.log(jQuery("div.ui-datepicker-title").children().length);
  });

  jQuery("#advanced-search-toggle").click(function(e) {
    if (jQuery("#advanced-search-panel").is(":visible") == true) {
      jQuery("#advanced-search-panel").hide("slideUp");
    } else {
      jQuery("#advanced-search-panel").show("slideDown");
      jQuery("#datepicker-1").datepicker({dateFormat: "yy-mm-dd", changeYear: true, changeMonth: true, yearRange: "1900:2020"});
      jQuery("#datepicker-2").datepicker({dateFormat: "yy-mm-dd", changeYear: true, changeMonth: true, yearRange: "1900:2020"});
    }
  });

  jQuery("#search-box").keypress(function(e) {
    if (e.which == 13) {
      jQuery(this).closest('form').submit();
    }
  });

  jQuery('#advanced-search-form').on('submit', function(e) {
    var fromDate = jQuery(this).find('input[id="datepicker-1"]').val();
    var toDate = jQuery(this).find('input[id="datepicker-2"]').val();

    if (fromDate && toDate) {
      document.getElementById("date_search_term").value = fromDate + "-" + toDate;
    }
  });
});
