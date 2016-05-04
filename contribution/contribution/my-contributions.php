<?php echo head(); ?>
<section class="section">
  <div class="container">
    <?php echo flash(); ?>
    <form method='post'>
      <table>
        <thead>
          <tr>
            <th><?php echo __('Public'); ?></th>
            <th><?php echo __('Anonymous'); ?></th>
            <th><?php echo __('Item'); ?></th>
          </tr>
        </thead>
            <tbody>
                <?php foreach(loop('contrib_items') as $contribItem): ?>
                <?php $item = $contribItem->Item; ?>
                <tr>
                    <td><?php echo $this->formCheckbox("contribution_public[{$contribItem->id}]", null, array('checked'=>$contribItem->public) ); ?>
                    </td>
                    <td><?php echo $this->formCheckbox("contribution_anonymous[{$contribItem->id}]", null, array('checked'=>$contribItem->anonymous) ); ?>
                    </td>
                    <td><?php echo link_to($item, 'show', metadata($item, array('Dublin Core', 'Title'))); ?></td>
                </tr>
                
                <?php endforeach; ?>
            </tbody>
        </table>
        <br>
        <input id="save-changes" class="" type="submit" value="Save Changes" name="submit">
    </form>
  </div>
</section>
<?php echo foot(); ?>
