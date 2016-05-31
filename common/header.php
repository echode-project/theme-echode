<!DOCTYPE html>
<html lang="<?php echo get_html_lang(); ?>">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <?php if ( $description = option('description')): ?>
  <meta name="description" content="<?php echo $description; ?>">
  <?php endif; ?>

  <?php
  if (isset($title)) {
    $titleParts[] = strip_formatting($title);
  }

  $titleParts[] = option('site_title');
  ?>

  <title><?php echo implode(' | ', $titleParts); ?></title>

  <?php echo auto_discovery_link_tags(); ?>

  <!-- Plugin Stuff -->
  <?php fire_plugin_hook('public_head', array('view'=>$this)); ?>

  <!-- JavaScripts -->
  <?php
    queue_js_file('vendor/jquery.popupoverlay');
    queue_js_file('vendor/nouislider.min');
    queue_js_file('vendor/wNumb');
    queue_js_file('vendor/modernizr');
    queue_js_file('vendor/foundation');
    queue_js_file('vendor/foundation.offcanvas');
    queue_js_file('vendor/remodal');
    queue_js_file('echode');

    echo head_js();
  ?>

  <!-- Stylesheets -->
  <?php
    queue_css_url('//code.cdn.mozilla.net/fonts/fira.css');
    queue_css_url('//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css');
    queue_css_file('nouislider.min');
    queue_css_file('echode');

    echo head_css();
  ?>

  <script>
    jQuery(window).load(function() {
      jQuery(".preloader").fadeOut("slow");;
    });
  </script>
</head>

<?php echo body_tag(array('id' => @$bodyid, 'class' => @$bodyclass)); ?>

<div class="preloader"></div>

<div id="browse_popup">
  <?php $tags = get_recent_tags(50); ?>
  <button class="popup_close browse_popup_close"><i class="fa fa-times"></i></button>
  <ul>
    <li><a href="/items/browse">Browse All Items</a></li>
    <li>Browse By Tag
      <form method="get" action="/items/browse" style="float:right;padding-left:10px">
        <select name="tags" style="height:1.5em;" onchange="this.form.submit()">
        <option></option>
        <?php foreach ($tags as $tagValue): ?>
          <option><?php echo $tagValue; ?></option>
        <?php endforeach; ?>
        </select>
      </form>
    </li>
    <li><a href="/items/map">Browse By Location</a></li>
  </ul>
</div>

<div id="search_popup">
  <button class="popup_close search_popup_close"><i class="fa fa-times"></i></button>
  <ul>
    <form method="get" name="advanced-search-form" id="advanced-search-form" action="/items/browse">
      <input type="hidden" name="search_type" value="advanced">
      <input type="hidden" name="advanced[0][element_id]" id="advanced_search_type" value="">
      <input type="hidden" name="advanced[0][type]" value="contains">
      <input type="hidden" name="advanced[0][terms]" id="advanced_search" value="">
      <input type="hidden" name="date_search_term" id="date_search_term" value="">
      <li style="display:inline-block;float:left;padding-top:5px;padding-right:30px;">
        <label style="display:inline;font-weight:normal !important;">
          <input type="checkbox" name="type" value="6" id="picture-checkbox" <?php
            if (!isset($_GET['type']) || $_GET['type'] == "6") {
              echo " checked='checked' ";
            }
          ?> style="float:none;margin-right:.5em;line-height:1.6">Pictures</label>
        <label style="display:inline;font-weight:normal !important;margin-left:.5em;">
          <input type="checkbox" name="type" value="1" id="story-checkbox" <?php
            if (!isset($_GET['type']) || $_GET['type'] == "1") {
              echo " checked='checked' ";
            }
          ?> style="float:none;margin-right:.5em;line-height:1.6">Stories</label>
      </li>
      <li style="display:inline-block;float:left;padding-top:5px;padding-right:30px;">
        <label style="display:inline;font-weight:normal !important;">
          <input type="checkbox" name="map" value="yes" id="map-search" style="float:none;margin-right:.5em;line-height:1.6">View items on map</label>
      </li>
      <li style="display:inline-block;position:relative;float:left">
        <input type="text" name="search" id="search-box" value="<?php if (isset($_GET['search'])) { echo $_GET['search']; } ?>" title="Search" size="40">
        <span onclick="jQuery(this).closest('form').submit();" style="right:5px;position:absolute;top:9px">
          <i class="fa fa-search" style="z-index:1;color:#7B7B7B;width:0;margin-left:-25px"></i>
        </span>
      </li>
<!--
      <li style="display:inline-block;float:left;padding-top:5px;padding-left:30px;">
        <button type="button" id="everything-button">Everything</button>
        <button type="button" id="title-button">Titles</button>
        <button type="button" id="subject-button">Subjects</button>
        <input type="hidden" id="search-field-value" value="everything" />
      </li>
-->
      <li style="clear:both;padding-top:50px;padding-left:15px;padding-right:15px;">
        <div id="dateSlider"></div>
        <script>
          var dateSlider = document.getElementById('dateSlider');
          var query = window.location.search.substring(1);
          var vars = query.split("&");
          var dates = [ 1877, new Date().getFullYear() + 1];

          for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");

            if (pair[0] == 'date_search_term') {
              var dateVals = pair[1].split("-");

              try {
                var fromDate = new Date(dateVals[0]).getFullYear() + 1;
                var toDate = new Date(dateVals[1]).getFullYear() + 1;

                dates[0] = fromDate;
                dates[1] = toDate;
              } catch(err) {
                /* We'll used initialized default values */
              }
            }
          }

          noUiSlider.create(dateSlider, {
            range: {
              min: 1877, max: new Date().getFullYear()
            },
            connect: true,
            behaviour: 'drag',
            tooltips: [ true, wNumb({ decimals: 0 }) ],
            step: 1,
            start: [ dates[0], dates[1] ],
            format: wNumb({
              decimals: 0,
            })
          });
          //-->
        </script>
      </li>
    </form>
  </ul>
</div>

<div class="outer-wrap" data-offcanvas>
  <div class="inner-wrap">
    <header class="masthead" role="banner">
      <div class="container">
        <div class="logo-btn-wrap">
          <?php echo link_to_home_page('Echode', array('class'=>'logo')); ?>
          <a href="#" role="button" class="menu-btn"></a>
        </div>
        <nav class="global-nav" role="navigation">
          <a href="#" class="exit-off-canvas">Close Menu</a>

          <?php if($user = current_user()): ?>

          <ul class="navigation">
            <li><a href="#" class="browse_popup_open">Browse</a></li>
            <li><a href="#" class="search_popup_open">Search</a></li>
            <li><a href="/contribution">Contribute</a></li>
            <li class="go--right"><a href="/guest-user/user/me">My Profile</a></li>
            <li class="go--right"><a href="/users/logout">Sign Out</a></li>
          </ul>

          <?php else: ?>

          <ul class="navigation">
            <li><a href="#" class="browse_popup_open">Browse</a></li>
            <li><a href="#" class="search_popup_open">Search</a></li>
            <li><a href="/contribution">Contribute</a></li>
            <li class="go--right"><a href="/guest-user/user/register">Register</a></li>
            <li class="go--right"><a href="/users/login">Sign In</a></li>
          </ul>

          <?php endif; ?>
        </nav>
      </div>
    </header>

    <main class="content-wrapper" role="main" tabindex="-1">
