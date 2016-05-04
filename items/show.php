<?php echo head(array('title' => metadata('item', array('Dublin Core', 'Title')), 'bodyclass' => 'items show')); ?>

<article class="single section" itemscope="" itemtype="http://www.schema.org/Article">

  <?php if (metadata('item', 'has files')): ?>
  <div class="container container--medium">
    <div class="single__image">
      <?php echo files_for_item(array('imageSize' => 'fullsize')); ?>
    </div>
  </div>
  <?php endif; ?>
  <div class="container container--narrow">
    <div class="single__text">
      <?php echo metadata('item', array('Item Type Metadata', 'Text')); ?>
    </div>
    <div class="single_share">
      <?php echo get_specific_plugin_hook_output('SocialBookmarking', 'public_items_show', array('view' => $this, 'item' => $item)); ?>
    </div>
  </div>

  <aside class="single__post">
    <div class="container">
      <div class="single__meta o-left-half">

        <div class="meta">
          <h2><?php echo get_specific_plugin_hook_output('UserProfiles', 'public_items_show', array('view' => $this, 'item' => $item)); ?></h2>
        </div>

        <?php if(metadata('item','Collection Name')): ?>
        <div class="meta">
          <h3><?php echo __('Collection'); ?></h3>
          <p><?php echo link_to_collection_for_item(); ?></p>
        </div>
        <?php else: ?>
        <div class="meta">
          <h3><?php echo __('Collection'); ?></h3>
          <p>This item does not yet belong to a collection.</p>
        </div>
        <?php endif;?>

        <?php if (metadata('item','has tags')): ?>
        <div class="meta">
          <h3><?php echo __('Collection'); ?></h3>
          <p><?php echo tag_string('item'); ?></p>
        </div>
        <?php else: ?>
        <div class="meta">
          <h3><?php echo __('Tags'); ?></h3>
          <p>No tags found</p>
        </div>
        <?php endif;?>

        <div class="meta">
          <h3><?php echo __('Citation'); ?></h3>
          <?php echo metadata('item','citation',array('no_escape'=>true)); ?>
        </div>

      </div>
      <div class="single__comments o-right-half">
  
        <?php echo get_specific_plugin_hook_output('Commenting', 'public_items_show', array('view' => $this, 'item' => $item)); ?>
  
      </div>
    </div>
  </aside>

  <nav>
    <div class="container">
      <ul class="pagination navigation">
        <li id="previous-item" class="previous"><?php echo link_to_previous_item_show(); ?></li>
        <li id="next-item" class="next"><?php echo link_to_next_item_show(); ?></li>
      </ul>
    </div>
  </nav>

</article>

<?php echo foot(); ?>
