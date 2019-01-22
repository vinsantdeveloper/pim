 
    
    ////////////////////////////////
    // Called when capture operation is finished
    //
    function captureSuccess(mediaFiles) {
        alert('succ');
        var i, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            uploadFile(mediaFiles[i]);
        }       
    }

    // Called if something bad happens.
    // 
    function captureError(error) {
        var msg = 'An error occurred during capture: ' + error.code;
        navigator.notification.alert(msg, null, 'Uh oh!');
    }

    // A button will call this function
    //
    function captureAudio() {
        // Launch device audio recording application, 
        // allowing user to capture up to 2 audio clips
        navigator.device.capture.captureAudio(captureSuccess, captureError, {limit: 2});
    }

    // Upload files to server
    function uploadFile(mediaFile) {
        
        var ft = new FileTransfer(),
            path = mediaFile.fullPath,
            name = mediaFile.name;
        
        var siteName = localStorage.getItem("siteName");
        var  uploadUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dspUploadAudio.php";
        
        alert('upload file='+path);

        ft.upload(path,
                uploadUrl,
            function(result) {
                console.log('Upload success: ' + result.responseCode);
                console.log(result.bytesSent + ' bytes sent');
            },
            function(error) {
                console.log('Error uploading file ' + path + ': ' + error.code);
            },
            { fileName: name });   
    }

