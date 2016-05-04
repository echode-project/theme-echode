<?php 
queue_css_file('geolocation-items-map');

$title = __('Browse Items on the Map') . ' ' . __('(%s total)', $totalItems);
echo head(array('title' => $title, 'bodyclass' => 'map browse'));
?>

<section class="explore">
  <div class="explore__upper">
    <div class="container">
      <h1><?php echo $title; ?></h1>
      <?php echo common('nav-secondary'); ?>
    </div>
  </div>

  <div class="explore__lower">

    <?php
    echo item_search_filters();
    echo pagination_links();
    ?>
    
    <div id="geolocation-browse">
      <?php echo $this->googleMap('map_browse', array('list' => 'map-links', 'params' => $params)); ?>

      <div id="map-links"><h2><?php echo __('Find An Item on the Map'); ?></h2>
      </div>

    </div>

  </div>
</section>

<?php echo foot(); ?>
