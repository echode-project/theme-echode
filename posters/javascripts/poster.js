var Omeka = Omeka || {};
Omeka.Poster = {};

(function ($) {
    itemCount: 0;

    Omeka.Poster.setUpItemsSelect = function (itemOptionsUrl) {
        /*
         * Use Ajax to retrieve the list of items that can be attached.
         */
        var modalDiv = $('#additem-modal');
        modalDiv.hide();

        // Use site's search instead of plugin's
        $('#poster-additem button').click(function() {
          var posterForm = $('#poster-form');
          var hiddenStyle = " style='width:0;height:0;border:0;border:none;'"

          posterForm.after('<iframe id="posterFormFrame" name="posterFormFrame"' + hiddenStyle + '></iframe>');
          posterForm.attr('target', 'posterFormFrame');

          $('#poster-form').submit();

          if (typeof(Storage) !== 'undefined') {
            localStorage.openExplore = "true";
          }

          window.location = "/items/browse";
        });

        $('#poster-form').submit(function(){
            var index = 1;
            $('.poster-item-annotation').each(function() {
                $(this).find('textarea')
                       .attr('name','annotation-' + index)
                       .end()
                       .siblings('.hidden-item-id')
                       .attr('name','itemID-' + index);
                index++;
            })
            $('#itemCount').val(index-1);

        });

        function getItems(uri, params) {
            modalDiv.addClass('loading');
            $.ajax({
                url: uri,
                data: params,
                method: 'GET',
                success: function(data) {
                    $('#item-select').html(data);
                    $(document).trigger("omeka: loaditems");
                },
                error: function(xhr, textStatus, errorThrown) {
                    alert('Error getting items: ', textStatus);
                },
                complete: function() {
                    modalDiv.removeClass('loading');
                }
            });
        }
        function setSearchVisibility(show){
            var searchForm = $('#page-search-form');
            var searchButton = $('#show-or-hide-search');
           $('#revert-selected-item').hide();
            if(typeof show === 'undefined'){
                show = !searchForm.is(':visible');
                $('#item-select').show();
            }
            if(show) {
                searchForm.show();
                $('.show-search-label').hide();
                $('.hide-search-label').show();
                $('#item-select').hide();
            } else {
                searchForm.hide();
                $('.show-search-label').show();
                $('.hide-search-label').hide();
                $('#item-select').show();
            }
        }
        //initially load the paginated items
       getItems($('#search').attr('action'));

       $('#search').submit(function(event){
            event.preventDefault();
            getItems(this.action, $(this).serialize());
            setSearchVisibility(false);
       });
       //make searcn and pagination use ajax to respond.
       $('#item-form').on('click', '.pagination a, #view-all-items', function (event) {
            event.preventDefault();
            getItems(this.href);
            setSearchVisibility(false);

       });
       $('#item-select').on('submit', '.pagination form', function(event) {
            event.preventDefault();
            getItems(this.action + '?' + $(this).serialize());
            setSearchVisibility(false);
       });
       setSearchVisibility(false);
       $('#show-or-hide-search').click(function (event) {
            event.preventDefault();
            setSearchVisibility();
       });

       //Make Items Selectable
       $('#item-select').on('click', '.item-listing', function(event) {
              $('#item-list .item-selected').removeClass('item-selected');
              $(this).addClass('item-selected');
        });
        $('#item-select').on('click', '.item-selected',function(event){
            event.preventDefault();
            var d = itemOptionsUrl+'/'+$('#item-select .item-selected').data('itemId');
            //alert(itemOptionsUrl);
            $.get(d, function(data){
                if ($('.no-items').length > 0) { $('.no-items').removeClass('no-items'); }
                $('#poster-items').append(data);
                Omeka.Poster.wysiwyg();
                Omeka.Poster.bindControls();
                modalDiv.dialog('close');
            });
        });

        if (Omeka.Poster.itemCount > 0) {
            //When the form loads, hide up and down controls that can't be used
            Omeka.Poster.bindControls();
        }
    }

    /*
     * wraps tinyMCE.execCommand.
     */
    Omeka.Poster.wysiwyg = function(params) {
            $(function(params){
            tinymce.init({
                selector: "textarea",
                statusar: false,
                setup: function(editor) {
                   editor.onChange.add(function() {
                        tinymce.triggerSave();
                    })
               },
               theme: "advanced",
               theme_advanced_toolbar_location: "top",
               theme_advanced_statusbar_locaion: "none",
               theme_advanced_toolbar_align: "left",
               theme_advanced_buttons1: "bold,italic,underline,|,justifyleft,justifycenter,justifyright,|,bullist,numlist,|,link,formatselect,code",
               theme_advanced_buttons2: "",
               theme_advanced_buttons3: "",
               plugins: "paste,media",
               media_strict: false,
               width: "100%"
            },params);
        });
    }
   /**
     * bind functions to items controls
     */
    Omeka.Poster.mceExecCommand = function(command){
        $('#poster-canvas textarea').each(function(){
            tinyMCE.execCommand(command,false,this.id);
        });
    }

    Omeka.Poster.bindControls = function(){
        //Remove all previous binding for controls
        $('.poster-control').unbind();

        //Bind move up buttons
        $('.poster-move-up').click(function (event) {
            var element = $(this).parents('.poster-spot');
            event.preventDefault();
            Omeka.Poster.mceExecCommand('mceRemoveControl');
            element.insertBefore(element.prev());
            Omeka.Poster.mceExecCommand('mceAddControl');
        });
        //Bind move down  buttons
        $('.poster-move-down').click(function (event) {
            var element = $(this).parents('.poster-spot');
            event.preventDefault();
            Omeka.Poster.mceExecCommand('mceRemoveControl');
            element.insertAfter(element.next());
            Omeka.Poster.mceExecCommand('mceAddControl');
        });
        //Bind move to top buttons
        $('.poster-move-top').click(function (event) {
            var element = $(this).parents('.poster-spot');
            event.preventDefault();
            Omeka.Poster.mceExecCommand('mceRemoveControl');
            element.prependTo('#poster-items');
            Omeka.Poster.mceExecCommand('mceAddControl');
        });
        //Bind move to bottom button
        $('.poster-move-bottom').click(function (event) {
            var element = $(this).parents('.poster-spot');
            event.preventDefault();
            Omeka.Poster.mceExecCommand('mceRemoveControl');
            element.appendTo('#poster-items');
            Omeka.Poster.mceExecCommand('mceAddControl');
        });
        //Bind delete buttons
        $('.poster-delete').click(function (event) {
            var element = $(this).parents('.poster-spot');
            event.preventDefault();
            Omeka.Poster.mceExecCommand('mceRemoveControl');
            element.remove();
            Omeka.Poster.mceExecCommand('mceAddControl');
            if ($('.poster-spot').length < 1) {
                $('#poster-no-items-yet, #poster-canvas').addClass('no-items');
            }
        });

    }
  })(jQuery);
