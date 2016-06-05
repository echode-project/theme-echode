<?php
$user = current_user();
echo head(array('bodyid'=>'home'));
?>

<?php if (!current_user()): ?>
<section class="hero section">
  <div class="container container--medium">
    <h1 class="page-title">Share your story</h1>
    <p class="intro">Echode is an community-based, interactive storytelling platform that explores the history of Scotland County, North Carolina.</p>
    <a href="/guest-user/user/register" class="join-today">Register for free</a>
    <a href="/about" class="learn-more">Learn More</a>
  </div>
</section>
<?php else: ?>
<section class="hero section">
  <div class="container container--medium">
    <h1 class="page-title">Hello, <?php echo html_escape($user->name); ?></h1>
    <a href="/contribution" class="join-today">Contribute</a>
  </div>
</section>
<?php endif; ?>

<section class="recent-items section">
  <?php echo common('items-grid', array('items' => get_recent_items(12))); ?>
</section>

<?php fire_plugin_hook('public_append_to_home', array('view' => $this)); ?>

<?php echo foot(); ?>
