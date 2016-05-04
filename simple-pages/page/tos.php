<section class="hero section">
  <div class="container container--medium">
    <h1 class="page-title">Community Guidelines</h1>
  </div>
</section>

<section class="section">
  <div class="container container--medium">

    <?php if (!$is_home_page): ?>
    <h1><?php echo metadata('simple_pages_page', 'title'); ?></h1>
    <?php endif; ?>
    <?php
    $text = metadata('simple_pages_page', 'text', array('no_escape' => true));
    echo $this->shortcodes($text);
    ?>

  </div>
</section>