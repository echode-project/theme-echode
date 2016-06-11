<?php
$user = current_user();
$pageTitle =  get_option('guest_user_dashboard_label');
echo head(array('title' => $pageTitle));
?>

<section class="section">
  <div class="container container--medium">
    <div class="register__icon">
    </div>
    <div class="capabilities">
      <h1><?php echo __($user->name); ?> <a class="btn btn-default" href="/guest-user/user/update-account">Edit Profile</a></h1>
    </div>
    <div class="albumslink"><a href="/albums/browse/index">View and create personal albums</a></div>
  </div>
</section>

<?php echo foot(); ?>
