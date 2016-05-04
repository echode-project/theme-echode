<?php
$pageTitle = __('Explore');
echo head(array('title'=>$pageTitle, 'bodyclass'=>'items tags'));
?>

<section class="explore">

  <div class="explore__upper">
    <div class="container">
      <h1><?php echo $pageTitle; ?></h1>
      <?php echo common('nav-secondary'); ?>
    </div>
  </div>

  <div class="explore__lower">
    <?php echo tag_cloud($tags, 'items/browse'); ?>
  </div>

</section>

<?php echo foot(); ?>
