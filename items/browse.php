<?php
$pageTitle = __('Explore');
echo head(array('title'=>$pageTitle,'bodyclass' => 'items browse'));
?>

<section class="explore">

  <div class="explore__upper">
    <div class="container">
      <h1><?php echo $pageTitle; ?></h1>
      <?php echo common('nav-secondary'); ?>
    </div>
  </div>

  <div class="explore__lower">
    <div class="container">

      <?php echo item_search_filters(); ?>

      <?php if ($total_results > 0): ?>

      <?php
  //    $sortLinks[__('Title')] = 'Dublin Core,Title';
  //    $sortLinks[__('Creator')] = 'Dublin Core,Creator';
      $sortLinks[__('Date Added')] = 'added';
      ?>
      <div id="sort-links">
          <span class="sort-label"><?php echo __('Sort by: '); ?></span><?php echo browse_sort_links($sortLinks); ?>
      </div>

      <?php endif; ?>

    </div>
  </div>

<div class="items-grid">
<?php foreach (loop('items') as $item): ?>

<a href="<?php echo html_escape(public_url('items/show/'.metadata('item', 'id'))); ?>" class="item">

  <div class="photo-wrap">
    <div class="photo-placeholder">

      <?php if(metadata('item', 'Item Type Name') == 'Still Image'): ?>

        <?php if(metadata('item', 'has thumbnail')): ?>
        <?php echo item_image('square_thumbnail'), array('class' => 'image'); ?>
        <?php else: ?>
        <img src="<?php echo img('bg_storyPanel.png'); ?>">
        <?php endif; ?>
        <div class="item-icon">
          <i class="fa fa-camera"></i>
        </div>

      <?php else: ?>

        <?php if(metadata('item', 'has thumbnail')): ?>
        <?php echo item_image('square_thumbnail'), array('class' => 'image'); ?>
        <?php else: ?>
        <img src="<?php echo img('bg_storyPanel.png'); ?>">
        <?php endif; ?>
        <?php if($desc = metadata('item', array('Item Type Metadata', 'Text'), array('snippet'=>150))): ?>
        <div class="item-excerpt">
          <p><?php echo $desc; ?></p>
        </div>
        <?php endif; ?>
        <div class="item-icon">
          <i class="fa fa-pencil"></i>
        </div>

      <?php endif; ?>

    </div>
  </div><!-- /.photo-wrap -->

</a>
<?php endforeach; ?>

</div>

  <?php echo pagination_links(); ?>

</section>

<?php echo foot(); ?>
