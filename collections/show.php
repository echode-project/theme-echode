<?php
$collectionTitle = strip_formatting(metadata('collection', array('Dublin Core', 'Title')));
?>

<?php echo head(array('title'=> $collectionTitle, 'bodyclass' => 'collections show')); ?>

<section class="section">
  <div class="container">
    <h1 class="page-title"><?php echo $collectionTitle; ?></h1>

    <div id="collection-items">

        <?php if (metadata('collection', 'total_items') > 0): ?>

        <?php if ($description = metadata('collection', array('Dublin Core', 'Description'))): ?>
        <div class="item-description">
          <h3>About this collection</h3>
          <p><?php echo $description; ?></p>
        </div>
        <?php endif; ?>

        <div class="items-grid">
            <?php foreach (loop('items') as $item): ?>
            <?php $itemTitle = strip_formatting(metadata('item', array('Dublin Core', 'Title'))); ?>
            <div class="item hentry">

                <?php if (metadata('item', 'has thumbnail')): ?>
                <div class="item-img">
                    <?php echo link_to_item(item_image('square_thumbnail', array('alt' => $itemTitle))); ?>
                </div>
                <?php endif; ?>

                <?php if ($text = metadata('item', array('Item Type Metadata', 'Text'), array('snippet'=>250))): ?>
                <div class="item-description">
                    <p><?php echo $text; ?></p>
                </div>

                <?php elseif ($description = metadata('item', array('Dublin Core', 'Description'), array('snippet'=>250))): ?>
                <div class="item-description">
                    <?php echo $description; ?>
                </div>

                <?php endif; ?>
            </div>
            <?php endforeach; ?>
        </div>
        <?php else: ?>
            <p><?php echo __("There are currently no items within this collection."); ?></p>
        <?php endif; ?>
    </div><!-- end collection-items -->

    <?php fire_plugin_hook('public_collections_show', array('view' => $this, 'collection' => $collection)); ?>

  </div>
</section>

<?php echo foot(); ?>
