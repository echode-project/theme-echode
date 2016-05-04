<nav class="secondary-nav">
  <?php echo public_nav_items(array (
    array (
      'label' => __('All'),
      'uri' => url('items/browse')
    ),
    array (
      'label' => __('By Tag'),
      'uri' => url('items/tags')
    ),
    array (
      'label' => __('By Location'),
      'uri' => url('items/map')
    )
  )); ?>
</nav>