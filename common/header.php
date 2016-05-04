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

  <!-- Stylesheets -->
  <?php
    queue_css_url('//code.cdn.mozilla.net/fonts/fira.css');
    queue_css_file('echode');
    echo head_css();
  ?>

  <!-- JavaScripts -->
  <?php
    queue_js_url('//ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js');
    queue_js_url('//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.2/modernizr.js');
    queue_js_file('min/echode-min');
    echo head_js(); 
  ?>



</head>
<script>
  $(window).load(function() {
    $(".preloader").fadeOut("slow");;
  });
</script>

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
            <li class="search">
              <?php echo search_form(array('placeholder'=>'Search Echode')); ?>
            </li>
            <li class="go--right"><a href="/guest-user/user/me">My Profile</a></li>
            <li class="go--right"><a href="/users/logout">Sign Out</a></li>
          </ul>

          <?php else: ?>

          <ul class="navigation">
            <li><a href="/items/browse">Browse</a></li>
            <li><a href="/contribution">Contribute</a></li>
            <li class="search">
              <?php echo search_form(array('placeholder'=>'Search Echode')); ?>
            </li>
            <li class="go--right"><a href="/guest-user/user/register">Register</a></li>
            <li class="go--right"><a href="/users/login">Sign In</a></li>
          </ul>

          <?php endif; ?>

        </nav>
      </div>
    </header>

    <main class="content-wrapper" role="main" tabindex="-1">
