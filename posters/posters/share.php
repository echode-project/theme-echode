<?php
    $pageTitle = 'Share Album: &quot;' . html_escape($poster->title) . '&quot;';
    echo head(array('title'=>$pageTitle));
?>

<div id="primary">
<?php echo flash(); ?>
<h1><?php echo $pageTitle; ?></h1>
<?php if ($emailSent): ?>
    <p>We just sent an email to <?php echo html_escape($this->emailTo); ?> with a link to your album.</p>
    <a href="<?php echo html_escape(url('guest-user/user/me')); ?>">Go back to your profile page</a>
<?php else: ?>
    <p>Enter an email address below and we'll send them a link to your album.</p>
    <form action="<?php echo html_escape(url(array('action'=>'share', 'id'=>$poster->id), get_option('poster_page_path'))); ?>" method="post" accept-charset="utf-8">
        <div class="poster-field">
            <label for="poster-emailTo">Email</label>
            <input type="text" name="email_to" value="<?php echo html_escape($this->emailTo); ?>" id="poster-emailTo" />
        </div>
        <div class="poster-field">
            <input type="submit" name="submit" value="Send Email" />
            <button type="button" onclick="window.location.href='/albums/browse/index';">Cancel</button>
        </div>
    </form>
<?php endif; ?>
</div>
<?php echo foot(); ?>
