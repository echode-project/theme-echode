<?php

$js = "
var guestUserPasswordAgainText = '" . __('Password again for match') . "';
var guestUserPasswordsMatchText = '" . __('Passwords match!') . "';
var guestUserPasswordsNoMatchText = '" . __("Passwords do not match!") . "'; ";

queue_js_string($js);
queue_js_file('guest-user-password');
$pageTitle = __('Update Account');
echo head(array('bodyid' => 'update-account', 'title' => $pageTitle));
?>

<section class="section">
  <div class="container form-wrap">
    <h1 class="u-crosshead"><?php echo $pageTitle; ?></h1>
    <?php echo flash(); ?>
    <?php echo $this->form; ?>
  </div>
</section>
<?php echo foot(); ?>