// Audio player
        //
        var my_media = null;
        var mediaTimer = null;
        var playing = false;

        // Play audio
        //
   function playAudio(src,row) {
    if (playing) 
    {   
         pauseAudio(row);
        
    }
    else 
    {
        if(my_media){
            my_media.play();
        $('#play'+row).attr("src", "images/pause.png");
       playing = true; 
   }else{
         my_media = new Media(src, onSuccess, onError);
        my_media.play();
        $('#play'+row).attr("src", "images/pause.png");
       playing = true; 
   }
       
        
       
     }
           
 }

        // Pause audio
        //
        function pauseAudio(row) {
            if (my_media) {
                my_media.pause();
               $('#play'+row).attr("src", "images/play.png");
               playing = false;
            }
        }

        // Stop audio
        //
        function stopAudio(row) {
            if (my_media) {
                my_media.stop();
                playing = false;
                $('#play'+row).attr("src", "images/play.png");
            }
            clearInterval(mediaTimer);
            mediaTimer = null;
        }

        // onSuccess Callback
        //
        function onSuccess(row) {
            playing = false;
            //console.log("playAudio():Audio Success");
             $('#play'+row).attr("src", "images/play.png");
        }

        // onError Callback
        //
        function onError(error) {
            navigator.notification.alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n',null,null,'ok');
        }

        // Set audio position
        //
        function setAudioPosition(position) {
            document.getElementById('audio_position').innerHTML = position;
        }
