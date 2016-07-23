<?php echo head(array('title' => metadata('item', array('Dublin Core', 'Title')), 'bodyclass' => 'items show')); ?>

<div id="album_add_popup">
  <button class="popup_close album_add_popup_close"><i class="fa fa-times"></i></button>
  <div class="album_add">
    <?php if (!is_null(current_user())): ?>
      <script>
        jQuery.get('/albums/help?get-albums=true', function(data){
          jQuery('.album_add').html(data);
        });
      </script>
    <?php endif; ?>
  </div>
</div>

<article class="single section" itemscope="" itemtype="http://www.schema.org/Article">
  <?php if (metadata('item', 'has files')): ?>
  <div class="container container--medium">
    <div class="single__image">
      <?php echo files_for_item(array('imageSize' => 'fullsize')); ?>
    </div>
    <?php
      $title = metadata('item', array('Dublin Core', 'Title'));
      $description = metadata('item', array('Dublin Core', 'Description'));
      $date = metadata('item', array('Dublin Core', 'Date'));
      $subjects = metadata('item', array('Dublin Core', 'Subject'), array('all' => true));
    ?>
    <?php if (isset($title)): ?>
      <div class="metadata metadata-minispacer" id="title-metadata">
        <span class="metadata-label" id="item-<?php echo metadata('item', 'id'); ?>">Title:</span><?php echo $title ?>
      </div>
    <?php endif; ?>
    <?php if (isset($description)): ?>
      <div class="metadata" id="description-metadata"><span class="metadata-label">Description:</span><span class="dt"><?php echo $description; ?></span></div>
    <?php endif; ?>
    <?php if (isset($date)): ?>
      <div class="metadata" id="date-metadata"><span class="metadata-label">Date:</span><?php echo $date; ?></div>
    <?php endif; ?>
    <?php if (isset($subjects) && count($subjects) > 0): ?>
      <div class="metadata" id="date-metadata">
      <?php if (count($subjects) == 1): ?>
        <span class="metadata-label">Subject:</span>
      <?php else: ?>
        <span class="metadata-label">Subjects:</span>
      <?php endif; ?>
      <?php for ($index = 0; $index < count($subjects); $index++): ?>
        <a class="keeper" href="/items/browse?advanced[0][type]=is%20exactly&amp;advanced[0][element_id]=49&amp;search=&amp;advanced[0][terms]=<?php echo $subjects[$index]; ?>">
        <?php echo $subjects[$index]; ?></a><?php if ($index + 1 < count($subjects)): ?> ; <?php endif; ?>
      <?php endfor; ?>
      </div>
    <?php endif; ?>
  </div>
  <?php endif; ?>
  <div class="container container--medium">
    <?php $text = metadata('item', array('Item Type Metadata', 'Text')); ?>
    <?php if (isset($text)): ?>
      <div class="single__text metadata-spacer">
        <?php echo $text; ?>
      </div>
    <?php endif; ?>

    <?php if (!metadata('item', 'has files')): ?>
      <?php
        $title = metadata('item', array('Dublin Core', 'Title'));
        $description = metadata('item', array('Dublin Core', 'Description'), array('snippet' => 150));
        $date = metadata('item', array('Dublin Core', 'Date'));
        $subjects = metadata('item', array('Dublin Core', 'Subject'), array('all' => true));
      ?>
      <?php if (isset($title)): ?>
        <div class="metadata metadata-minispacer" id="title-metadata">
          <span class="metadata-label" id="item-<?php echo metadata('item', 'id'); ?>">Title:</span><?php echo $title ?>
        </div>
      <?php endif; ?>
      <?php if (isset($description)): ?>
        <div class="metadata" id="description-metadata"><span class="metadata-label">Description:</span><?php echo $description; ?></div>
      <?php endif; ?>
      <?php if (isset($date)): ?>
        <div class="metadata" id="date-metadata"><span class="metadata-label">Date:</span><?php echo $date; ?></div>
      <?php endif; ?>
      <?php if (isset($subjects) && count($subjects) > 0): ?>
        <div class="metadata" id="date-metadata">
        <?php if (count($subjects) == 1): ?>
          <span class="metadata-label">Subject:</span>
        <?php else: ?>
          <span class="metadata-label">Subjects:</span>
        <?php endif; ?>
        <?php for ($index = 0; $index < count($subjects); $index++): ?>
          <a class="keeper" href="/items/browse?advanced[0][type]=is%20exactly&amp;advanced[0][element_id]=49&amp;search=&amp;advanced[0][terms]=<?php echo $subjects[$index]; ?>$
          <?php echo $subjects[$index]; ?></a><?php if ($index + 1 < count($subjects)): ?> ; <?php endif; ?>
        <?php endfor; ?>
      <?php endif; ?>
    <?php endif; ?>

    <div class="single_share" id="socialbookmarkingdiv">
      <br/>
      <?php echo get_specific_plugin_hook_output('SocialBookmarking', 'public_items_show', array('view' => $this, 'item' => $item)); ?>
    </div>
  </div>
  <div class="container container--medium">
    <?php $creator = metadata('item', array('Dublin Core', 'Creator')); ?>
    <?php if (isset($creator)): ?>
      <div class="metadata" id="description-metadata"><span class="metadata-label">Creator:</span><?php echo $creator; ?></div>
    <?php endif; ?>
    <?php $source = metadata('item', array('Dublin Core', 'Source')); ?>
    <?php if (isset($source)): ?>
      <div class="metadata" id="description-metadata"><span class="metadata-label">Source:</span><?php echo $source; ?></div>
    <?php endif; ?>
    <?php $publisher = metadata('item', array('Dublin Core', 'Publisher')); ?>
    <?php if (isset($publisher)): ?>
      <div class="metadata" id="description-metadata"><span class="metadata-label">Publisher:</span><?php echo $publisher; ?></div>
    <?php endif; ?>
    <?php $rights = metadata('item', array('Dublin Core', 'Rights')); ?>
    <?php if (isset($rights)): ?>
      <div class="metadata" id="description-metadata"><span class="metadata-label">Rights:</span><?php echo $rights; ?></div>
    <?php endif; ?>
    <?php $format = metadata('item', array('Dublin Core', 'Format')); ?>
    <?php if (isset($format)): ?>
      <div class="metadata" id="description-metadata"><span class="metadata-label">Format:</span><?php echo $format; ?></div>
    <?php endif; ?>
    <?php $dimensions = metadata('item', array('Item Type Metadata', 'Physical Dimensions')); ?>
    <?php if (isset($dimensions)): ?>
      <div class="metadata" id="description-metadata"><span class="metadata-label">Dimensions:</span><?php echo $dimensions; ?></div>
    <?php endif; ?>
    <?php $language = metadata('item', array('Dublin Core', 'Language')); ?>
    <?php if (isset($language)): ?>
      <div class="metadata" id="description-metadata"><span class="metadata-label">Language:</span><?php echo $language; ?></div>
    <?php endif; ?>
    <?php $type = metadata('item', array('Dublin Core', 'Type')); ?>
    <?php if (isset($type)): ?>
      <div class="metadata" id="description-metadata"><span class="metadata-label">Type:</span><?php echo $type; ?></div>
    <?php endif; ?>

    <div>
      <?php echo get_specific_plugin_hook_output('Geolocation', 'public_items_show', array('view' => $this, 'item' => $item)); ?>
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
