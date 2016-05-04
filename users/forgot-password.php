<?php
$pageTitle = __('Forgot your password?');
echo head(array('title' => $pageTitle, 'bodyid' => 'reset-password'), $header);
?>

<?php
$flash = flash();
if ($flash):
?>
<div class="remodal" data-remodal-id="modal" data-remodal-options="hashTracking: false">
  <?php echo $flash; ?>
  <button data-remodal-action="confirm" class="remodal-confirm">OK</button>
</div>
<?php endif; ?>

<section class="login section">
  <div class="container form-wrap">

    <h1><?php echo $pageTitle; ?></h1>

    <form method="post" accept-charset="utf-8">
      <div class="field-container">
        <label for="email"><?php echo __('Enter your email address to reset your password.'); ?></label>
        <?php echo $this->formText('email', @$_POST['email']); ?>
      </div>
    
      <input type="submit" class="submit" value="<?php echo __('Submit'); ?>">
    </form>

    <div class="small-print">
      <?php echo link_to('users', 'login', __('Back to Sign In')); ?>
    </div>

  </div>
</section>

  <?php echo foot(array(), $footer); ?>
