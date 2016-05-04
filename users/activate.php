<?php
$pageTitle = __('Reset your password');
echo head(array('title' => $pageTitle), $header);
?>

<section class="section">
  <div class="container form-wrap">

      <h1><?php echo $pageTitle; ?></h1>

      <?php echo flash(); ?>
      <!-- remove for now
      <h2><?php echo html_escape(__('Hello %s. Your username is %s', $user->name , $user->username)); ?></h2>
      -->
      <form method="post">
        <div class="field">
          <?php echo $this->formLabel('new_password1', __('New Password')); ?>
          <input type="password" name="new_password1" id="new_password1" class="textinput">
        </div>
        <div class="field">
          <?php echo $this->formLabel('new_password2', __('Confirm Password')); ?>
          <input type="password" name="new_password2" id="new_password2" class="textinput">
        </div>
        <input type="submit" class="submit" name="submit" value="<?php echo __('Set Password'); ?>">
        <p class="helper">Need help? <a href="mailto:info@echode.org">Contact us</a>.
      </form>

  </div>
</section>
<?php echo foot(array(), $footer); ?>