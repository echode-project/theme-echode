<nav class="secondary-nav">
<?php
  $search = filter_input(INPUT_GET, 'search', FILTER_SANITIZE_URL);

  $navs = array(
    array (
      'label' => __('By Tag'),
      'uri' => url('items/tags')
    ),
    array (
      'label' => __('By Location'),
      'uri' => url('items/map')
    )
  );

  if (isset($search)) {
    array_unshift($navs,
      array(
        'label' => __('Search Results'),
        'uri' => url('items/browse?' . $_SERVER['QUERY_STRING'])
      )
    );
  } else {
    array_unshift($navs,
      array(
        //'label' => __('All (' . total_records('Item') . ')'),
        'label' => __('All'),
        'uri' => url('items/browse')
      )
    );
  }

  echo public_nav_items($navs);
?>
</nav>
