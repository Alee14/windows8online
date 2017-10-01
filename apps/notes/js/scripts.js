(function ($, $S) {
    //$ jQuery
    //$S window.localStorage
    //Variables Declaration
    var $board = $('#board'),
        //Board where the Posticks are sticked
        Postick, //Singleton Object containing the Functions to work with the LocalStorage
        len = 0,
        //Length of Objects in the LocalStorage 
        currentNotes = '',
        //Storage the html construction of the posticks
        o; //Actual Postick data in the localStorage
   
   
   
    //Manage the Posticks in the Local Storage
	//Each postick is saved in the localStorage as an Object  
    Postick = {
        add: function (obj) {
            obj.id = $S.length;
            $S.setItem(obj.id, JSON.stringify(obj));
        },

        retrive: function (id) {
            return JSON.parse($S.getItem(id));
        },

        remove: function (id) {
            $S.removeItem(id);
        },

        removeAll: function () {
            $S.clear();
        }

    };

    //If exist any postick, Create it/them
    len = $S.length;
    if (len) {
        for (var i = 0; i < len; i++) {
            //Create all posticks saved in localStorage
            var key = $S.key(i);
            o = Postick.retrive(key);
            currentNotes += '<div class="postick"';
            currentNotes += ' style="left:' + o.left;
            currentNotes += 'px; top:' + o.top;
			//data-key is the attribute to know what item delete in the localStorage
            currentNotes += 'px"><div class="toolbar"><span class="delete" data-key="' + key;
            currentNotes += '">x</span></div><div contenteditable="true" class="editable">';
            currentNotes += o.text;
            currentNotes += '</div></div>';
        }

        //Append all the posticks to the board
        $board.html(currentNotes);
    }

    //When the document is ready, make all posticks Draggable
    $(document).ready(function () {
        $(".postick").draggable({
            cancel: '.editable',
			"zIndex": 3000,
			"stack" : '.postick'
        });
    });

    //Remove Postick
    $('span.delete').live('click', function () {
        if (confirm('Are you sure you want to delete this Note?')) {
            var $this = $(this);
			//data-key is the attribute to know what item delete in the localStorage
            Postick.remove($this.attr('data-key'));
            $this.closest('.postick').fadeOut('slow', function () {
                $(this).remove();
            });
        }
    });

    //Create postick
    $('#btn-addNote').click(function () {
        $board.append('<div class="postick" style="left:20px;top:70px"><div class="toolbar"><span class="delete" title="Close">x</span></div><div contenteditable class="editable"></div></div>');
        $(".postick").draggable({
            cancel: '.editable'
        });
    });

    //Save all the posticks when the user leaves the page
    window.onbeforeunload = function () {
        //Clean the localStorage
        Postick.removeAll();
        //Then insert each postick into the LocalStorage
		//Saving their position on the page, in order to position them when the page is loaded again
        $('.postick').each(function () {
            var $this = $(this);
            Postick.add({
                top: parseInt($this.position().top),
                left: parseInt($this.position().left),
                text: $this.children('.editable').text()
            });
        });
    }
})(jQuery, window.localStorage);