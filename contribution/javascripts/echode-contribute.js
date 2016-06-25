jQuery(document).ready(function() {
  Dropzone.autoDiscover = false;

  jQuery('#contribute').on('submit', function(e) {
    e.preventDefault();
    jQuery('div#flash').remove();
    jQuery('.dz-progress').css('opacity', '1');
    jQuery('html, body').animate({ scrollTop: jQuery('#omekaDZ').offset().top - 80 });
    jQuery('#omekaDZ').get(0).dropzone.processQueue();
  });
});
