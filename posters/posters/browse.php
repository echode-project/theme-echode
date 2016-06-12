<?php
echo queue_css_file('poster');

$pageTitle = html_escape(get_option('poster_page_title'));
echo head(array('title' => $pageTitle, 'bodyclass' => 'posters browse'));
?>
<div id="primary">
<h1><?php echo __('Browse My Albums'); ?></h1>
<?php $posters = $this->posters; ?>
<?php if(current_user()): ?>
    <?php if (count($posters) == 0): ?>
        <div><?php echo __("You have not created any albums yet."); ?></div>
    <?php endif; ?>
    <div><a href="<?php echo public_url(array('controller'=> 'posters', 'action' => 'new')); ?>" class="button">Create a new album</a></div>
<?php else: ?>
    <div><a href="<?php echo url('users/login'); ?>">Login</a></div>
<?php endif; ?>

<?php if (count($posters) != 0): ?>
  <table id="posters">
    <thead>
      <th id="poster-titles"><?php echo __('Title'); ?></th>
      <th id="poster-dates"><?php echo __('Date Added'); ?></th>
      <th id="poster-descriptions"><?php echo __('Description'); ?></th>
    </thead>
  <?php foreach($posters as $poster): ?>
    <tr class="poster">
      <td class="poster-title">
        <h3><a href="<?php echo html_escape(url(array('action' => 'show','id'=>$poster->id), get_option('poster_page_path'))); ?>"
          class="view-poster-link"><?php echo html_escape($poster->title); ?></a></h3>
        <ul class="poster-actions">
          <?php if($this->user) : ?>
            <li><a href="<?php echo html_escape(url(array('action'=>'edit','id' => $poster->id), get_option('poster_page_path'))); ?>">Edit</a></li>
            <li><a href="<?php echo html_escape(url(array('action' => 'delete-confirm', 'id' => $poster->id),  get_option('poster_page_path'))); ?>">Delete</a></li>
            <li><a href="<?php echo html_escape(url(array('action'=>'share','id' => $poster->id), get_option('poster_page_path'))); ?>">Share</a></li>
          <?php endif; ?>
            <li><a href="<?php echo html_escape(url(array('action'=>'print','id' => $poster->id), get_option('poster_page_path'))); ?>" class="print" media="print" >Print</a></li>
        </ul>
      </td>
      <td class="poster-date"><?php echo html_escape(format_date($poster->date_created)); ?></td>
      <td><?php echo html_escape(snippet($poster->description,0, 200)); ?></td>
    <!--</ul>-->
    </tr>
  <?php endforeach; ?>
  </table>
<?php endif; ?>
</div>
<?php echo foot(); ?>
