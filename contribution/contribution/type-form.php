
<?php if (!$type): ?>
<p><?php echo __('You must choose a contribution type to continue.'); ?></p>
<?php else: ?>

<?php
if ($type->isFileRequired()):
    $required = true;
?>

<div class="field-container">
  <?php echo $this->formLabel('contributed_file', __('Upload a photo (required)')); ?>
  <?php echo $this->formFile('contributed_file', array('class' => 'fileinput')); ?>
</div>

<?php endif; ?>

<?php
foreach ($type->getTypeElements() as $contributionTypeElement) {
    echo $this->elementForm($contributionTypeElement->Element, $item, array('contributionTypeElement'=>$contributionTypeElement));
}
?>

<?php
if (!isset($required) && $type->isFileAllowed()):
?>
<div class="field-container">
  <?php echo $this->formLabel('contributed_file', __('Upload a photo (Optional)')); ?>
  <?php echo $this->formFile('contributed_file', array('class' => 'fileinput')); ?>
</div>
<?php endif; ?>

<?php $user = current_user(); ?>
<?php if(get_option('contribution_simple') && !$user) : ?>
<div class="field-container">

    <?php echo $this->formLabel('contribution_simple_email', __('Email (Required)')); ?>

    <?php
        if(isset($_POST['contribution_simple_email'])) {
            $email = $_POST['contribution_simple_email'];
        } else {
            $email = '';
        }
    ?>
    <?php echo $this->formText('contribution_simple_email', $email ); ?>

</div>
<?php endif; ?>
    <?php
    //pull in the user profile form if it is set
    if( isset($profileType) ): ?>

    <script type="text/javascript" charset="utf-8">
    //<![CDATA[
    jQuery(document).bind('omeka:elementformload', function (event) {
         Omeka.Elements.makeElementControls(event.target, <?php echo js_escape(url('user-profiles/profiles/element-form')); ?>,'UserProfilesProfile'<?php if ($id = metadata($profile, 'id')) echo ', '.$id; ?>);
         Omeka.Elements.enableWysiwyg(event.target);
    });
    //]]>
    </script>

        <h2 class='contribution-userprofile <?php echo $profile->exists() ? "exists" : ""  ?>'><?php echo  __('Your %s profile', $profileType->label); ?></h2>
        <p id='contribution-userprofile-visibility'>
        <?php if ($profile->exists()) :?>
            <span class='contribution-userprofile-visibility'><?php echo __('Show'); ?></span><span class='contribution-userprofile-visibility' style='display:none'><?php echo __('Hide'); ?></span>
            <?php else: ?>
            <span class='contribution-userprofile-visibility' style='display:none'><?php echo __('Show'); ?></span><span class='contribution-userprofile-visibility'><?php echo __('Hide'); ?></span>
        <?php endif; ?>
        </p>
        <div class='contribution-userprofile <?php echo $profile->exists() ? "exists" : ""  ?>'>
        <p class="user-profiles-profile-description"><?php echo $profileType->description; ?></p>
        <fieldset name="user-profiles">
        <?php
        foreach($profileType->Elements as $element) {
            echo $this->profileElementForm($element, $profile);
        }
        ?>
        </fieldset>
        </div>
        <?php endif; ?>

<?php
// Allow other plugins to append to the form (pass the type to allow decisions
// on a type-by-type basis).
fire_plugin_hook('contribution_type_form', array('type'=>$type, 'view'=>$this));
?>
<?php endif; ?>
