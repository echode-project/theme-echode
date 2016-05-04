<?php
queue_js_file('login');
$pageTitle = __('Log In');
echo head(array('bodyid' => 'login', 'title' => $pageTitle), $header);
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

  <h1>Sign In</h1>

    <?php echo $this->form->setAction($this->url('users/login')); ?>

    <div class="small-print">
      <p><?php echo link_to('users', 'forgot-password', __('Forgot your password?')); ?><br>Need an account? <a href="/guest-user/user/register">Register for free</a>.</p>
    </div>

  </div>
</section>

<?php echo foot(array(), $footer); ?>
