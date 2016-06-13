<?php // Overriding purpose of this page as a quick hack; should be redone using MVC // ?>

<?php if (isset($_GET['album']) && isset($_GET['item'])): ?>
  <?php
    $user = current_user();

    if (!is_null($user) && is_numeric($_GET['album']) && is_numeric($_GET['item'])) {
      $user_id = $user->id;
      $db = get_db();

      // Fwiw, we've already checked that the two GETs are numeric values above
      $sql = "INSERT INTO {$db->prefix}poster_items (poster_id, item_id, ordernum) SELECT " .
        $_GET['album']  . ", " . $_GET['item']  . ", MAX(ordernum)+1 AS ordernum FROM omeka_poster_items;";

      $db->query($sql);
      echo "<script>window.location.replace('/albums/edit/" . $_GET['album'] . "');</script>";
    }
  ?>
<?php elseif (isset($_GET['get-albums']) && !isset($_GET['album']) && !isset($_GET['item'])): ?>
  <?php
    $newAlbumRedirect = "window.location='/albums/new/index'";
    $user = current_user();

    if (!is_null($user)) {
      $user_id = $user->id;
      $db = get_db();
      $result = $db->query("Select * from {$db->prefix}posters where user_id='" . $user_id  . "'");

      if ($count = $result->rowCount()) {
        $rows = $result->fetchAll();

        echo '<script>function submitToAlbum(e) {';
        echo ' e.preventDefault();';
        echo ' var parts = window.location.pathname.split("/");';
        echo ' jQuery("#item-album-input").val(parts[parts.length - 1]);';
        echo ' jQuery("#add-to-album").submit();';
        echo '}</script>';

        echo 'Add this item to one of your albums:<br>';
        echo '<form method="get" action="/albums/help" id="add-to-album">';
        echo '<input type="hidden" name="item" value="" id="item-album-input">';
        echo '<select name="album" id="albums-select">';

        foreach ($rows as $row) {
          $poster_id = $row['id'];
          $poster_title = $row['title'];

          echo "<option value='" . $poster_id  . "'>" . $poster_title  . "</option>";
        }

        echo "</select><br><button type='button' onclick='submitToAlbum(event);'>Add</button> ";
        echo "<button type='button' onclick=\"" . $newAlbumRedirect . "\">Create New Album</button>";
        echo "</form>";
      } else {
        echo "You can store items in albums<br><button type='button' onclick=\"" . $newAlbumRedirect . "\">Create New Album</button><br>to add this item to it";
      }
    }
  ?>
<?php else: ?>
  <?php
    $pageTitle = html_escape(get_option('poster_page_title'). ': Help');
    echo head(array('title' => $pageTitle));
  ?>
  <div id="poster-help">
    <h1><?php echo $pageTitle; ?></h1>
    <?php echo __(get_option('poster_help')); ?>
  </div>
  <?php echo foot(); ?>
<?php endif; ?>
