// @codekit-prepend "/vendor/foundation.js";
// @codekit-prepend "/vendor/foundation.offcanvas.js";
// @codekit-prepend "/vendor/remodal.js";

// Initialize the javascript here

$(document).foundation();

$(window).load(function() {
var options = { };
$('[data-remodal-id=modal]').remodal(options).open();
});