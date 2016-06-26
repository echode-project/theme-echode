
<?php if (!$type): ?>
  <p><?php echo __('You must choose a contribution type to continue.'); ?></p>
<?php else: ?>

  <?php if ($type->isFileRequired() || $type->isFileAllowed()): ?>
  <script>
    function rotateThumbnail(id) {
      var simpleHash = window.btoa(encodeURIComponent(escape(id)));
      var hashedId = 'dz-rotation_' + simpleHash.replace(new RegExp('[\+=\/]', 'g'), '');
      var rotation = jQuery('#' + hashedId);
      var img = jQuery('.dz-image img[alt="' + id + '"]');

      if (rotation.length < 1) {
        jQuery('#contribute').append('<input type="hidden" name="' + hashedId + '" id="' + hashedId + '" value="90" />');
        img.addClass("rotate90");
      } else {
        var currentRotation = rotation.val();

        if (currentRotation == "0") {
          rotation.val("90");
          img.addClass("rotate90");
        } else if (currentRotation == "90") {
          rotation.val("180");
          img.removeClass("rotate90");
          img.addClass("rotate180");
        } else if (currentRotation == "180") {
          img.removeClass("rotate180");
          img.addClass("rotate270");
          rotation.val("270");
        } else if (currentRotation == "270") {
          img.removeClass("rotate270");
          rotation.val("0");
        } else {
          console.log("Unexpected rotation value: " + currentRotation);
        }
      }
    }
  </script>

  <div style="display:none" id="odz-template">
    <div class="dz-preview dz-image-preview">
      <div class="dz-image"><img data-dz-thumbnail /></div>
      <div class="dz-details">
        <span onclick="rotateThumbnail(jQuery(this).closest('.dz-preview').find('.dz-image img').attr('alt'));" class="fa-stack fa-lg">
          <i class="fa fa-square fa-stack-2x"></i>
          <i class="fa fa-rotate-right fa-stack-1x fa-inverse"></i>
        </span>
      </div>
      <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
      <div class="dz-error-message"><span data-dz-errormessage></span></div>
      <div class="dz-success-mark"></div>
    </div>
  </div>
  <?php endif; ?>

  <?php if ($type->isFileRequired()): $required = true; ?>
    <?php echo $this->formLabel('contributed_file', __('Upload photo(s) [required]')); ?>

    <div id="omekaDZ" class="field-container dropzone">
      <div id="dzPhotos" class="dz-default dz-message">Drop photo(s) here or click to upload</div>
    </div>
    <div id="odz-fallback">
     <?php echo $this->formFile('contributed_file', array('class' => 'fileinput')); ?>
    </div>
  <?php endif; ?>

  <?php
    foreach ($type->getTypeElements() as $contributionTypeElement) {
      echo $this->elementForm($contributionTypeElement->Element, $item, array('contributionTypeElement'=>$contributionTypeElement));
    }
  ?>

  <?php if (!isset($required) && $type->isFileAllowed()): ?>
    <?php echo $this->formLabel('contributed_file', __('Upload a photo [Optional]')); ?>

    <div id="omekaDZ" class="field-container dropzone">
      <div id="dzStory" class="dz-default dz-message">Drop photo here or click to upload</div>
    </div>
    <div id="odz-fallback">
      <?php echo $this->formFile('contributed_file', array('class' => 'fileinput')); ?>
    </div>
  <?php endif; ?>

  <?php $user = current_user(); ?>

  <?php if (get_option('contribution_simple') && !$user): ?>
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

  <!-- user profile form -->
  <?php if (isset($profileType)): ?>
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
        <span class='contribution-userprofile-visibility'><?php echo __('Show'); ?></span>
        <span class='contribution-userprofile-visibility' style='display:none'><?php echo __('Hide'); ?></span>
      <?php else: ?>
        <span class='contribution-userprofile-visibility' style='display:none'><?php echo __('Show'); ?></span>
        <span class='contribution-userprofile-visibility'><?php echo __('Hide'); ?></span>
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

<?php // Allow other plugins to append to the form
  fire_plugin_hook('contribution_type_form', array('type'=>$type, 'view'=>$this));
?>

<?php endif; ?>
