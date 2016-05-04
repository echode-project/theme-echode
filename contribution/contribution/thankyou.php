<?php echo head(); ?>
<section class="contribute section">
  <div class="container container--medium">
    <h1><?php echo __("Thank you for contributing!"); ?></h1>
    <p><?php echo __("Your contribution will be viewable once it is approved by an Echode administrator. Meanwhile, feel free to %s or %s ." , contribution_link_to_contribute(__('make another contribution')), "<a href='" . url('items/browse') . "'>" . __('browse the archive') . "</a>"); ?>
    </p>
    <?php if(get_option('contribution_simple') && !current_user()): ?>
    <p><?php echo __("If you would like to interact with the site further, you can use an account that is ready for you. Visit %s, and request a new password for the email you used", "<a href='" . url('users/forgot-password') . "'>" . __('this page') . "</a>"); ?>
    <?php endif; ?>
  </div>
</section>
<?php echo foot(); ?>
