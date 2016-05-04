<?php
$pageTitle = __('Explore');
echo head(array('title' => $pageTitle,
  'bodyclass' => 'items advanced-search'));
?>

<section class="explore">

  <div class="explore__upper">
    <div class="container">
      <h1><?php echo $pageTitle; ?></h1>
      <?php echo common('nav-secondary'); ?>
    </div>
  </div>

  <div class="explore__lower">
    <div class="container form-wrap">
    <?php echo $this->partial('items/search-form.php',
      array('formAttributes' =>
      array('id'=>'advanced-search-form')));
    ?>
    </div>
  </div>
</section>

<?php echo foot(); ?>
