
var pictureSource;   // picture source
var destinationType; // sets the format of returned value 
var mediaType;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    mediaType = navigator.camera.MediaType;
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    /*
     // code for ios keep the distance with top status bar 
     if (parseFloat(window.device.version) === 7.0) // if iphone 7 is the version  
     {
     document.body.style.marginTop = "20px";
     }*/
}


/*---------------------For edit profile picture----------------*/
function onPhotoURISuccess(imageURI)
{
    $.mobile.showPageLoadingMsg(true);
    // alert('onPhotoURISuccess'+imageURI);
    var userId = localStorage.getItem("userId");
    var siteName = localStorage.getItem("siteName");

    /** File upload code */
    window.resolveLocalFileSystemURL(imageURI, function (fileEntry) {

        fileEntry.file(function (fileObj) {
            //1 megabyte (Mb) = 1024 kb = 1,048,576 bytes
            //if(fileObj.size < 1048576) // size should be less then 1 mb
            if (fileObj.size < 5242880) // size should be less then 5 mb
            {

                var fileName = fileObj.localURL;
                var options = new FileUploadOptions();
                options.fileKey = "ReferenceName";

                var file_Name = fileName.substr(fileName.lastIndexOf('/') + 1);

                options.fileName = file_Name;
                options.mimeType = fileObj.type;
                options.chunkedMode = false;


                var ft = new FileTransfer();


                var privateStatus = localStorage.getItem("PrivatePic");


                var fullURL = siteName + "/wp-content/plugins/dsp_dating/m1/dspUploadProfilePic.php?user_id=" + userId + "&private=" + privateStatus;
                //  alert(fullURL);
                ft.upload(fileName, fullURL, uploadSuccess, uploadFail, options);
            }
            else
            {
                var alertText = get_tranalation_by_code("DSP_UPLOAD_IMAGE_SIZE_ERROR");
                alertText = alertText || 'Image size should be less then 5 MB!';
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

function getPhoto()
{
    var prv = $("#chkPrivate").val();
    localStorage.setItem("PrivatePic", prv);
    // Retrieve image file location from specified source 
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {quality: 50, destinationType: destinationType.FILE_URI, sourceType: pictureSource.SAVEDPHOTOALBUM});

}

function uploadSuccess(r)
{
    $.mobile.hidePageLoadingMsg();
    //alert(r.response);
    editYourPeofile();  // refresh page with new uploaded picture

}

/*---------------------For edit profile picture----------------*/


/*---------------------For edit partner profile picture----------------*/
function onPhotoURISucPart(imageURI)
{

    // alert('onPhotoURISuccess'+imageURI);
    var userId = localStorage.getItem("userId");
    var siteName = localStorage.getItem("siteName");

    /** File upload code */
    window.resolveLocalFileSystemURL(imageURI, function (fileEntry) {

        fileEntry.file(function (fileObj) {
            //1 megabyte (Mb) = 1024 kb = 1,048,576 bytes

            if (fileObj.size < 5242880) // size should be less then 5 mb
            {

                var fileName = fileObj.localURL;
                var options = new FileUploadOptions();
                options.fileKey = "ReferenceName";

                var file_Name = fileName.substr(fileName.lastIndexOf('/') + 1);



                options.fileName = file_Name;
                options.mimeType = fileObj.type;
                options.chunkedMode = false;

                var privateStatus = localStorage.getItem("PrivatePic");


                var ft = new FileTransfer();

                var fullURL = siteName + "/wp-content/plugins/dsp_dating/m1/dspUploadPartnerPic.php?user_id=" + userId + "&private=" + privateStatus;
                // alert(fullURL);
                ft.upload(fileName, fullURL, uploadPartSuccess, uploadFail, options);
            }
            else
            {
                var alertText = get_tranalation_by_code("DSP_UPLOAD_IMAGE_SIZE_ERROR");
                alertText = alertText || 'Image size should be less then 5 MB!';
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

function getPartnerPhoto()
{ // Retrieve image file location from specified source
    var prv = $("#chkPrivate").val();
    localStorage.setItem("PrivatePic", prv);
    navigator.camera.getPicture(onPhotoURISucPart, onFail, {quality: 50, destinationType: destinationType.FILE_URI, sourceType: pictureSource.SAVEDPHOTOALBUM});

}

function uploadPartSuccess(r) {
    alert(r.response);
    editPartnerProfile(); // refresh page with new uploaded picture

}
/*---------------------For edit profile picture----------------*/

function onFail(message) {
    alert('Failed because: ' + message);
}


function uploadFail(message) {
    $.mobile.hidePageLoadingMsg();
    alert("Image upload failed: " + message.code);
}


/*---------------------For upload media picture----------------*/
function onMediaPhotoSucc(imageURI)
{
    $.mobile.showPageLoadingMsg(true);
    // alert('onMediaPhotoSucc'+imageURI);
    var userId = localStorage.getItem("userId");
    var siteName = localStorage.getItem("siteName");

    /** File upload code */
    window.resolveLocalFileSystemURL(imageURI, function (fileEntry) {

        fileEntry.file(function (fileObj) {

            //1 megabyte (Mb) = 1024 kb = 1,048,576 bytes
            if (fileObj.size < 5242880) // size should be less then 5 mb
            {

                var fileName = fileObj.localURL;
                var options = new FileUploadOptions();
                options.fileKey = "ReferenceName";



                var file_Name = fileName.substr(fileName.lastIndexOf('/') + 1);

                options.fileName = file_Name;
                options.mimeType = fileObj.type;
                options.chunkedMode = false;



                var ft = new FileTransfer();

                var albumId = localStorage.getItem("selectAlbumId");

                if (albumId == 0)
                {
                    $.mobile.hidePageLoadingMsg();
                    var alertText = get_tranalation_by_code("DSP_SELECT_ALBUM");
                    alertText = alertText || 'Please Select Album!';
                    alert(alertText);
                }
                else
                {

                    var fullURL = siteName + "/wp-content/plugins/dsp_dating/m1/dspUploadMediaPic.php?user_id=" + userId + "&album_id=" + albumId;
                    ft.upload(fileName, fullURL, uploadMediaPicSuccess, uploadFail, options);
                }

            }
            else
            {
                var alertText = get_tranalation_by_code("DSP_UPLOAD_IMAGE_SIZE_ERROR");
                alertText = alertText || 'Image size should be less then 5 MB!';
                navigator.notification.alert(
                    alertText,
                    null,
                    null,
                    'ok'
                );
            }
        }, function (error) {
            alert(error);
        });
    });
}

function getMediaPhoto()
{ // Retrieve image file location from specified source 
    navigator.camera.getPicture(onMediaPhotoSucc, onFail, {quality: 50, destinationType: destinationType.FILE_URI, sourceType: pictureSource.SAVEDPHOTOALBUM});

}

function uploadMediaPicSuccess(r) {
    alert(r.response);
    callPhoto('photo', 0); // refresh page with new uploaded picture
    localStorage.setItem("selectAlbumId", 0);
    $.mobile.hidePageLoadingMsg();

}

function saveAlbumId(val)
{
    // alert(val);
    localStorage.setItem("selectAlbumId", val);
}
/* to change the private status in edit profile picture*/
function getCheckBoxStatus()
{
    // alert( $("#chkPrivate").val());
    var org = $("#chkPrivate").val();
    if (org == 'Y')
    {
        $("#chkPrivate").val('N');
    }
    else
    {
        $("#chkPrivate").val('Y');
    }
}
function savePrivateStatus(st)
{
    //  alert(st);
    localStorage.setItem("PrivatePic", st);
}
/*---------------------For upload media picture----------------*/