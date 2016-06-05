<?php
$pageTitle = __('Explore');
echo head(array('title'=>$pageTitle,'bodyclass' => 'items browse'));
?>

<section class="explore">
  <?php if ($total_results == 0): ?>
    <div class="explore__lower">
      <div class="container">
        <div>No results found. Please broaden your search.</div>
      </div>
    </div>
  <?php endif; ?>

  <?php echo common('items-grid', array('items' => $items)); ?>
  <!--<div class="items-grid">
    <?php //foreach (loop('items') as $item): ?>
  </div>-->

  <?php echo pagination_links(); ?>
</section>

<?php echo foot(); ?>
