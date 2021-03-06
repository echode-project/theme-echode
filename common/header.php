<!DOCTYPE html>
<html lang="<?php echo get_html_lang(); ?>">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <link rel="apple-touch-icon" sizes="57x57" href="<?php echo img('apple-icon-57x57.png'); ?>">
  <link rel="apple-touch-icon" sizes="60x60" href="<?php echo img('apple-icon-60x60.png'); ?>">
  <link rel="apple-touch-icon" sizes="72x72" href="<?php echo img('apple-icon-72x72.png'); ?>">
  <link rel="apple-touch-icon" sizes="76x76" href="<?php echo img('apple-icon-76x76.png'); ?>">
  <link rel="apple-touch-icon" sizes="114x114" href="<?php echo img('apple-icon-114x114.png'); ?>">
  <link rel="apple-touch-icon" sizes="120x120" href="<?php echo img('apple-icon-120x120.png'); ?>">
  <link rel="apple-touch-icon" sizes="144x144" href="<?php echo img('apple-icon-144x144.png'); ?>">
  <link rel="apple-touch-icon" sizes="152x152" href="<?php echo img('apple-icon-152x152.png'); ?>">
  <link rel="apple-touch-icon" sizes="180x180" href="<?php echo img('apple-icon-180x180.png'); ?>">
  <link rel="icon" type="image/png" sizes="192x192" href="<?php echo img('android-icon-192x192.png'); ?>">
  <link rel="icon" type="image/png" sizes="32x32" href="<?php echo img('favicon-32x32.png'); ?>">
  <link rel="icon" type="image/png" sizes="96x96" href="<?php echo img('favicon-96x96.png'); ?>">
  <link rel="icon" type="image/png" sizes="16x16" href="<?php echo img('favicon-16x16.png'); ?>">
  <link rel="manifest" href="<?php echo img('manifest.json'); ?>">
  <meta name="msapplication-TileColor" content="#003144">
  <meta name="msapplication-TileImage" content="<?php echo img('ms-icon-144x144.png'); ?>">
  <meta name="theme-color" content="#003144">
  <?php if (!is_null(current_user())): ?>
  <meta name="omeka-user-id" content="<?php echo current_user()->id; ?>">
  <?php endif; ?>

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

<div id="search_popup">
  <button class="popup_close search_popup_close"><i class="fa fa-times"></i></button>
  <ul>
    <form method="get" name="advanced-search-form" id="advanced-search-form" action="/items/browse">
      <input type="hidden" name="advanced[0][type]" id="subject-query" value="is exactly">
      <input type="hidden" name="advanced[0][element_id]" value="49" id="subject-field">
      <input type="hidden" name="date_search_term" id="date_search_term" value="">
      <input type="hidden" name="sort_field" value="added">
      <li id="as-text">
        <input type="text" name="search" id="search-box" value="<?php if (isset($_GET['search'])) { echo $_GET['search']; } ?>" title="Search" size="40">
        <span onclick="jQuery(this).closest('form').submit();">
          <i class="fa fa-search"></i>
        </span>
      </li>
      <li id="as-subject">
        <label for="advanced[0][terms]">Subject:</label>
        <select name="advanced[0][terms]" id="subject-value">
          <option selected="selected" value="">All</option>
          <?php // this could be done much better as array but scope creep is making this tech debt ?>
          <option <?php if (isset($_GET['advanced']['0']['terms']) && $_GET['advanced']['0']['terms'] == 'Education') { echo " selected='selected' "; } ?>
            value="Education">Education</option>
          <option <?php if (isset($_GET['advanced']['0']['terms']) && $_GET['advanced']['0']['terms'] == 'Religion') { echo " selected='selected' "; } ?>
            value="Religion">Religion</option>
          <option <?php if (isset($_GET['advanced']['0']['terms']) && $_GET['advanced']['0']['terms'] == 'Race') { echo " selected='selected' "; } ?>
            value="Race">Race</option>
          <option <?php if (isset($_GET['advanced']['0']['terms']) && $_GET['advanced']['0']['terms'] == 'Agriculture') { echo " selected='selected' "; } ?>
            value="Agriculture">Agriculture</option>
          <option <?php if (isset($_GET['advanced']['0']['terms']) && $_GET['advanced']['0']['terms'] == 'Legal affairs') { echo " selected='selected' "; } ?>
            value="Legal affairs">Legal affairs</option>
          <option <?php if (isset($_GET['advanced']['0']['terms']) && $_GET['advanced']['0']['terms'] == 'Industry') { echo " selected='selected' "; } ?>
            value="Industry">Industry</option>
          <option <?php if (isset($_GET['advanced']['0']['terms']) && $_GET['advanced']['0']['terms'] == 'Civic life') { echo " selected='selected' "; } ?>
            value="Civic life">Civic life</option>
          <option <?php if (isset($_GET['advanced']['0']['terms']) && $_GET['advanced']['0']['terms'] == 'Military') { echo " selected='selected' "; } ?>
            value="Military">Military</option>
          <option <?php if (isset($_GET['advanced']['0']['terms']) && $_GET['advanced']['0']['terms'] == 'Healthcare') { echo " selected='selected' "; } ?>
            value="Healthcare">Healthcare</option>
          <option <?php if (isset($_GET['advanced']['0']['terms']) && $_GET['advanced']['0']['terms'] == 'Politics') { echo " selected='selected' "; } ?>
            value="Politics">Politics</option>
          <option <?php if (isset($_GET['advanced']['0']['terms']) && $_GET['advanced']['0']['terms'] == 'Athletics') { echo " selected='selected' "; } ?>
            value="Athletics">Athletics</option>
          <option <?php if (isset($_GET['advanced']['0']['terms']) && $_GET['advanced']['0']['terms'] == 'Recreation') { echo " selected='selected' "; } ?>
            value="Recreation">Recreation</option>
          <option <?php if (isset($_GET['advanced']['0']['terms']) && $_GET['advanced']['0']['terms'] == 'Towns and districts') { echo " selected='selected' "; } ?>
            value="Towns and districts">Towns and districts</option>
          <option <?php if (isset($_GET['advanced']['0']['terms']) && $_GET['advanced']['0']['terms'] == 'Family records') { echo " selected='selected' "; } ?>
            value="Family records">Family records</option>
          <option <?php if (isset($_GET['advanced']['0']['terms']) && $_GET['advanced']['0']['terms'] == 'Food and drink') { echo " selected='selected' "; } ?>
            value="Food and drink">Food and drink</option>
          <option <?php if (isset($_GET['advanced']['0']['terms']) && $_GET['advanced']['0']['terms'] == 'Crime') { echo " selected='selected' "; } ?>
            value="Crime">Crime</option>
        </select>
      </li>
      <li id="as-tag">
        <?php $tags = get_recent_tags(50); ?>
        <label for="tags">Tag:</label>
        <select name="tags">
          <option selected="selected" value="">All</option>
        <?php foreach ($tags as $tagValue): ?>
          <option <?php if (isset($_GET['tags']) && $_GET['tags'] == $tagValue) { echo " selected='selected' "; } ?>
            value="<?php echo $tagValue; ?>"><?php echo $tagValue; ?></option>
        <?php endforeach; ?>
        </select>
      </li>
      <li id="as-format">In:
        <label>
          <input type="checkbox" name="type" value="6" id="picture-checkbox" <?php
            if (!isset($_GET['type']) || $_GET['type'] == "6") {
              echo " checked='checked' ";
            }
          ?>>Pictures</label>
        <label id="label2">
          <input type="checkbox" name="type" value="1" id="story-checkbox" <?php
            if (!isset($_GET['type']) || $_GET['type'] == "1") {
              echo " checked='checked' ";
            }
          ?>>Stories</label>
      </li>
      <li id="as-daterange">
        <div id="as-daterange-label">Date Range:</div>
        <div id="dateSlider"></div>
        <script>
          var dateSlider = document.getElementById('dateSlider');
          var query = window.location.search.substring(1);
          var vars = query.split("&");
          var dates = [ 1877, new Date().getFullYear() + 1];

          for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");

            if (pair[0] == 'date_search_term') {
              if (jQuery.isEmptyObject(pair[1])) {
                dates = [ 1877, new Date().getFullYear() + 1];
              } else {
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
      <li id="as-view">
        <label for="view">View as:</label>
        <select name="view" id="view-results">
          <option value="items">Thumbnails</option>
          <option <?php if (isset($_SERVER["REQUEST_URI"]) && strpos($_SERVER["REQUEST_URI"], "/items/map") === 0) { echo " selected='selected' "; } ?>
            value="locations">Map</option>
        </select>
      </li>
      <li id="as-sort">
        <label for="sort">Sort by:</label>
        <select name="sort_dir" id="sort-results">
          <option value="d">Newest to Oldest</option>
          <option <?php if (isset($_GET['sort_dir']) && $_GET['sort_dir'] == 'a') { echo " selected='selected' ";  } ?>  value="a">Oldest to Newest</option>
        </select>
      </li>
      <li id="as-submit">
        <input type="submit" value="Explore">
        <span onclick="jQuery(this).closest('form').submit();">
          <i class="fa fa-search"></i>
        </span>
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

          <?php if ($user = current_user()): ?>

          <ul class="navigation">
            <li>
              <a href="#" class="search_popup_open" id="explore-link">Explore</a>
              <i id="explore-icon" class="fa fa-search"></i>
            </li>
            <li><a href="/contribution">Contribute</a></li>
            <li class="go--right"><a href="/guest-user/user/me">My Profile</a></li>
            <li class="go--right"><a href="/users/logout">Sign Out</a></li>
            <li id="m-about"><a href="/about">About</a></li>
            <li id="m-guidelines"><a href="/tos">Community Guidelines</a></li>
            <li id="m-instagram"><a href="https://instagram.com/echode_project">Instagram</a></li>
            <li id="m-twitter"><a href="https://twitter.com/echode_project">Twitter</a></li>
            <li id="m-facebook"><a href="https://www.facebook.com/Echode-217460368604751">Facebook</a></li>
          </ul>

          <?php else: ?>

          <ul class="navigation">
            <li>
              <a href="#" class="search_popup_open">Explore</a>
              <i id="explore-icon" class="fa fa-search"></i>
            </li>
            <li><a href="/contribution">Contribute</a></li>
            <li class="go--right"><a href="/users/login">Sign In</a></li>
            <li id="m-about"><a href="/about">About</a></li>
            <li id="m-guidelines"><a href="/tos">Community Guidelines</a></li>
            <li id="m-instagram"><a href="https://instagram.com/echode_project">Instagram</a></li>
            <li id="m-twitter"><a href="https://twitter.com/echode_project">Twitter</a></li>
            <li id="m-facebook"><a href="https://www.facebook.com/Echode-217460368604751">Facebook</a></li>
          </ul>

          <?php endif; ?>
        </nav>
      </div>
    </header>

    <main class="content-wrapper" role="main" tabindex="-1">
