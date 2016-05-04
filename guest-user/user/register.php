<?php
queue_js_file('guest-user-password');
$pageTitle = get_option('guest_user_register_text') ? get_option('guest_user_register_text') : __('Register');
echo head(array('bodyid' => 'register', 'title' => $pageTitle));
?>

<?php
$flash = flash();
if ($flash):
?>
<div class="remodal" data-remodal-id="modal" data-remodal-options="hashTracking: false">
  <?php echo $flash; ?>
  <button onclick="location.href='/';" data-remodal-action="confirm" class="remodal-confirm">OK</button>
</div>
<?php endif; ?>

<section class="register section">
  <div class="container two-col">

    <div class="primary">
      <div class="register__icon hide-up-to-med">
      </div>
      <div class="capabilities">
        <h1>Join Our Community!</h1>
        <p>Echode is a free and easy way to share your history and connect with other people.</p>
        <p>Post pictures or stories then share them on Facebook, Twitter, Pinterest and more—or send them directly as an email message. Explore and comment on other member's posts and be part of an inspirational community.</p>
      </div>
    </div>

    <div class="secondary">
      <?php echo $this->form; ?>
      <div class="small-print">
        <p class="">By clicking register, you agree to use Echode in accordance with our <a href="">Community Guidelines</a>.
        <p>Already have an Echode account? <a href="/users/login">Sign in</a>.</p>
      </div>
    </div>

  </div>
</section>

<?php echo foot(); ?>
