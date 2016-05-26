<!DOCTYPE html>
<html lang="<?php echo get_html_lang(); ?>">

<?php
function getAdvancedSearch($width) {
  $search = filter_input(INPUT_GET, 'search', FILTER_SANITIZE_URL);
  $type = filter_input(INPUT_GET, 'type', FILTER_SANITIZE_URL);
  $dateSearch = filter_input(INPUT_GET, 'date_search_term', FILTER_SANITIZE_URL);

  if (strcmp($type, "6") == 0) {
    $picture = 'checked="checked"';
  } else {
    $picture = "";
  }

  if (strcmp($type, "1") == 0) {
    $text = 'checked="checked"';
  } else {
    $text = "";
  }

  // Parsing of date ranges for searching using dates
  if (isset($dateSearch)) {
    $dateParts = explode('-', $dateSearch);
    $partCount = count($dateParts);

    if ($partCount == 2) {
      $dateFrom = implode('-', array_slice($dateParts, 0, 1));
      $dateTo = implode('-', array_slice($dateParts, 1, 1));
    } else if ($partCount == 4) {
      if (strlen($dateParts[0]) == 4 && strlen($dateParts[2]) == 4) {
        $dateFrom = implode('-', array_slice($dateParts, 0, 2));
        $dateTo = implode('-', array_slice($dateParts, 2, 2));
      } else if (strlen($dateParts[0]) == 4 && strlen($dateParts[1]) == 4) {
        $dateFrom = $dateParts[0];
        $dateTo = implode('-', array_slice($dateParts, 1, 3));
      } else if (strlen($dateParts[0]) == 4 && strlen($dateParts[3]) == 4) {
        $dateFrom = implode('-', array_slice($dateParts, 0, 3));
        $dateTo = $dateParts[3];
      } else {
        $dateFrom = "";
        $dateTo = "";
      }
    } else if ($partCount == 6) {
      $dateFrom = implode('-', array_slice($dateParts, 0, 3));
      $dateTo = implode('-', array_slice($dateParts, 3, 3));
    } else if ($partCount == 3) {
      if (strlen($dateParts[0]) == 4 && strlen($dateParts[1]) == 4) {
        $dateFrom = $dateParts[0];
        $dateTo = implode('-', array_slice($dateParts, 1, 2));
      } else if (strlen($dateParts[0]) == 4 && strlen($dateParts[2]) == 4) {
        $dateFrom = implode('-', array_slice($dateParts, 0, 2));
        $dateTo = $dateParts[2];
      } else {
        $dateFrom = "";
        $dateTo = "";
      }
    } else if ($partCount == 5) {
      if (strlen($dateParts[0]) == 4 && strlen($dateParts[2]) == 4) {
        $dateFrom = implode('-', array_slice($dateParts, 0, 2));
        $dateTo = implode('-', array_slice($dateParts, 2, 3));
      } else if (strlen($dateParts[0]) == 4 && strlen($dateParts[3]) == 4) {
        $dateFrom = implode('-', array_slice($dateParts, 0, 3));
        $dateTo = implode('-', array_slice($dateParts, 3, 2));
      } else {
        $dateFrom = "";
        $dateTo = "";
      }
    } else {
      $dateFrom = "";
      $dateTo = "";
    }

    // TODO check that values are numeric + slashes
  } else {
    $dateFrom = "";
    $dateTo = "";
  }

return <<<HTML
  <div style="display:none;width:{$width}%;margin:0 auto; margin-top:10px; background-color:#00adef;border-radius:5px;padding:0px 20px 20px" id="advanced-search-panel">
    <form method="get" name="advanced-search-form" id="advanced-search-form" action="/items/browse">
      <input type="hidden" name="search_type" value="advanced">
      <input type="hidden" name="advanced[0][element_id]" value="">
      <input type="hidden" name="date_search_term" id="date_search_term" value="">
      <fieldset style="display:inline-block">
        <legend>Date Taken</legend>
        <input type="text" id="datepicker-1" placeholder="From: YYYY-MM-DD" value="{$dateFrom}" style="display:inline;width:40%">
        <input type="text" id="datepicker-2" placeholder="To: YYYY-MM-DD" value="{$dateTo}" style="display:inline;width:40%;">
      </fieldset>
      <fieldset style="display:inline-block;margin-left:-60px">
        <legend style="padding-bottom:5px;">Filter By</legend>
        <label style="display:inline;font-weight:normal !important;">
          <input type="radio" name="type" value="6" {$picture} style="float:none;margin-right:.5em;line-height:1.6">Pictures</label>
        <label style="display:inline;font-weight:normal !important;margin-left:.5em;">
          <input type="radio" name="type" value="1" {$text} style="float:none;margin-right:.5em;line-height:1.6">Stories</label>
      </fieldset>
      <fieldset style="margin-top:10px;display:inline;margin-left:30px;">
        <legend>Search Terms</legend>
        <input type="text" name="search" id="search-box" value="{$search}" title="Search" style="display:inline;padding-top:10px;" size="30">
      </fieldset>
      <span onclick="jQuery(this).closest('form').submit();">
        <i class="fa fa-search" style="z-index:1;color:#7B7B7B;width:0;margin-left:-30px;"></i>
      </span>
    </form>
  </div>
HTML;
}
?>

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

  <!-- Stylesheets -->
  <?php
    queue_css_url('//code.cdn.mozilla.net/fonts/fira.css');
    queue_css_url('//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css');
    queue_css_file('echode');
    echo head_css();
  ?>

  <!-- JavaScripts -->
  <?php
    queue_js_file('vendor/modernizr');
    queue_js_file('vendor/foundation');
    queue_js_file('vendor/foundation.offcanvas');
    queue_js_file('vendor/remodal');
    queue_js_file('echode-search');
    echo head_js();
  ?>

  <script>
    jQuery(window).load(function() {
      jQuery(".preloader").fadeOut("slow");;
    });
  </script>
</head>

<?php echo body_tag(array('id' => @$bodyid, 'class' => @$bodyclass)); ?>

<div class="preloader"></div>

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
            <li><a href="/items/browse">Browse</a></li>
            <li><a href="/contribution">Contribute</a></li>
            <li class="search" style="margin-top:-15px;">
              <form id="search-form" name="search-form" action="/items/browse" method="get">
                <?php
                  $search = filter_input(INPUT_GET, 'search', FILTER_SANITIZE_URL);
                  $search_type = filter_input(INPUT_GET, 'search_type', FILTER_SANITIZE_URL);

                  // If search type is set, we're working with an advanced search; ignore here
                  if (isset($search_type)) {
                    $search = "";
                  }
                ?>
                <input type="text" name="search" id="search" value="<?php echo $search; ?>" style="display:inline;" title="Search" class="form-control search-field">
                <input type="hidden" name="advanced[0][element_id]" value="">
                <button name="submit_search" id="submit_search" type="submit" value="Search" class="search-submit btn btn-default" style="padding-top:20px;">Search</button>
              </form>
            </li>
            <li><a href="#" id="advanced-search-toggle">Advanced Search</a></li>
            <li class="go--right"><a href="/guest-user/user/me">My Profile</a></li>
            <li class="go--right"><a href="/users/logout">Sign Out</a></li>
          </ul>

          <?php else: ?>

          <ul class="navigation">
            <li><a href="/items/browse">Browse</a></li>
            <li><a href="/contribution">Contribute</a></li>
            <li class="search" style="margin-top:-15px;">
              <form id="search-form" name="search-form" action="/items/browse" method="get">
                <?php
                  $search = filter_input(INPUT_GET, 'search', FILTER_SANITIZE_URL);
                  $search_type = filter_input(INPUT_GET, 'search_type', FILTER_SANITIZE_URL);

                  // If search type is set, we're working with an advanced search; ignore here
                  if (isset($search_type)) {
                    $search = "";
                  }
                ?>
                <input type="text" name="search" id="search" value="<?php echo $search; ?>" style="display:inline;" title="Search" class="form-control search-field">
                <input type="hidden" name="advanced[0][element_id]" value="">
                <button name="submit_search" id="submit_search" type="submit" value="Search" class="search-submit btn btn-default" style="padding-top:20px;">Search</button>
              </form>
            </li>
            <li><a href="#" id="advanced-search-toggle">Advanced Search</a></li>
            <li class="go--right"><a href="/guest-user/user/register">Register</a></li>
            <li class="go--right"><a href="/users/login">Sign In</a></li>
          </ul>

          <?php endif; ?>

          <?php if (is_current_url("/")) { echo getAdvancedSearch("100"); } ?>

        </nav>
      </div>
    </header>

    <main class="content-wrapper" role="main" tabindex="-1">

    <?php if (!is_current_url("/")) { echo getAdvancedSearch("90"); } ?>
