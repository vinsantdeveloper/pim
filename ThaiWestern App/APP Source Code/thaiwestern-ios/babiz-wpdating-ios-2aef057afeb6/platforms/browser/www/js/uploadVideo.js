/*---------------------For upload media picture----------------*/
var pictureSource;   // picture source
var destinationType; // sets the format of returned value 
var mediaType;

    document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
//dd.resolve();
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
    mediaType=navigator.camera.MediaType;
  
    /*
    // code for ios keep the distance with top status bar 
    if (parseFloat(window.device.version) === 7.0) // if iphone 7 is the version  
    {
        document.body.style.marginTop = "20px";
    } */
}


function onVideoSucc(imageURI) 
{ 
  $.mobile.showPageLoadingMsg(true);
  //alert('onMediaPhotoSucc'+imageURI);
    var userId = localStorage.getItem("userId");
    var siteName = localStorage.getItem("siteName");

  /** File upload code */
  window.resolveLocalFileSystemURL(imageURI, function(fileEntry){
    
      fileEntry.file(function(fileObj) 
      {
        if(fileObj.size < 5242880) // size should be less then 5 mb   //1 megabyte (Mb) = 1024 kb = 1,048,576 bytes
        {
          //  alert('type'+fileObj.type);
            var fileName = fileObj.localURL;
            var options = new FileUploadOptions();    
            options.fileKey = "file-upload";
           
            var file_Name= fileName.substr(fileName.lastIndexOf('/') + 1);
            
       
            
            options.fileName =file_Name;
            options.mimeType=fileObj.type; // accepted types are: 'video/quicktime', 'video/x-ms-wmv', 'video/mp4' , 'video/avi','application/octet-stream'
            options.chunkedMode = false;
           
           
            var ft = new FileTransfer();
            
            var videoPrivate=localStorage.getItem("videoPrivate");
            
            var fullURL=siteName+"/wp-content/plugins/dsp_dating/m1/dspUploadVideo.php?user_id="+userId+"&private="+videoPrivate+"&txtmode=add";
            ft.upload(fileName, fullURL, uploadVideoSuccess, uploadFail, options);
             
        }
          else
              {
              var alertText = get_tranalation_by_code("DSP_UPLOAD_VIDEO_SIZE_ERROR");
                alertText = alertText || 'Video size should be less then 5 MB!';
                navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
              }
      });
  });      
}   

function uploadVideo() 
{ // Retrieve image file location from specified source 
  //alert('video'+mediaType.ALLMEDIA);
    navigator.camera.getPicture(onVideoSucc, onFail, { quality: 50, destinationType: destinationType.FILE_URI, sourceType: pictureSource.SAVEDPHOTOALBUM,mediaType: mediaType.VIDEO });
  
}

function uploadFail(message){
    $.mobile.hidePageLoadingMsg();
    alert("Video upload failed: " + message.code);
}


function uploadVideoSuccess(r)
{
    $.mobile.hidePageLoadingMsg();
    alert(r.response);
    callVideo('add_video',0); // refresh page with new uploaded picture
    localStorage.setItem("videoPrivate",0);
}

function savePrivate(val)
{
   // alert(val);
    localStorage.setItem("videoPrivate",val);
}



/*---------------------For upload media picture----------------*/