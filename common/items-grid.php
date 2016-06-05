<?php set_loop_records('items', get_recent_items(12)); ?>

<div class="items-grid">
<?php foreach (loop('items') as $item): ?>

<a href="<?php echo html_escape(public_url('items/show/'.metadata('item', 'id'))); ?>" class="item"
  id="item-<?php echo metadata('item', 'id'); ?>">

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

<?php echo foot(); ?>
