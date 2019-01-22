/* Copyright (c) 2012 Mobile Developer Solutions. All rights reserved.


 * This software is available under the MIT License:
 * The MIT License
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, 
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software 
 * is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies 
 * or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var lang_translations;
 $(document).ready(function () {
   StatusBar.overlaysWebView(false);
       // document.addEventListener("deviceready", onDeviceReady, true);
 });

 function get_tranalation_by_code(code) {
    if (typeof lang_translations == 'undefined') {
        return "";
    }
    for (var i = 0, len = lang_translations.length; i < len; i++) {
        var obj = lang_translations[i];
        if (obj['code_name'] == code) {
            return obj['text_name'];
        }
    }
}

function onDeviceReady() {

  
    /*
     // code for ios keep the distance with top status bar 
    if (parseFloat(window.device.version) === 7.0) // if iphone 7 is the version  
    {
        document.body.style.marginTop = "20px";
    }*/
}


// onDeviceReady: function() {
//     if (window.device.platform === 'iOS' && parseFloat(window.device.version) === 7.0)
//         StatusBar.overlaysWebView(true);
//     app.receivedEvent('deviceready');
// }


$(document).on('pagebeforeshow', '#page_register', function()
{
    var siteName = localStorage.getItem("siteName");
    console.log("sitename:"+siteName);
        
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_register.php";
   
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        success: onSuccess,
        timeout: 10000,
        error: onError
        
    });
    
    function onSuccess(data, status)
    {
        dataT = $.trim(data);
        $('#page_register').empty();
     
        $('#page_register').append(dataT);
        $('#page_register').trigger('create');
    }
    
    function onError(jqXHR, status,errorThrown)
    {
        var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
        alertText = alertText || 'Network error has occurred please try again!';
         navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
    // handle an error
    }  
    
}); 


$(document).on('click', '#register', function() 
{
    //  alert('click');
        
    //catch the form's submit event
    if($('#username').val().length > 0 && $('#email').val().length > 0)
    {
        // action is functionality we want to call and outputJSON is our data
        var formData = $("#register-user").serialize();
               
        var siteName = localStorage.getItem("siteName");
               
        siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/getRegData.php";
               

        $.ajax({
            url: siteUrl,
            data: formData, // Convert a form to a JSON string representation
            type: 'post',                   
            async: true,
            dataType: "jsonp",
            jsonpCallback: 'successCallback',
              
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (result) 
            {
                $('#reg_result').empty();
                //   alert('succ==');
                $.each( result, function(i, row) 
                {
                    $('#reg_result').append('<p>' + row.section_title+ '</p>');
                });
            },
            error: function(x, t, m) {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }
             
        });   
    }
    else
    {
        var alertText = get_tranalation_by_code("DSP_FILL_IN_ALL_FIELDS");
        alertText = alertText || 'Please fill all required fields!';
         navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
    }   
         
});

$(document).on('click', '#show_reg', function() 
{

    $.mobile.changePage("register.html");
});

function reloadCaptcha()
{

    document.getElementById('captcha').src = document.getElementById('captcha').src+ '?' +new Date();
}

////////////////////////////////////////////////////////////////////////////




$(document).on('click', '#submit', function() 
{
    if($('#loginUsername').val().length > 0 && $('#password').val().length > 0)
    {
        var userName=$('#loginUsername').val();
        var siteName = localStorage.getItem("siteName");
            
        siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_login.php";
          
        var formData = $("#login_form").serialize();

        $.ajax({
            url: siteUrl,
            data: formData, // Convert a form to a JSON string representation
            type: 'post',                   
            async: true,
            dataType: "jsonp",
            jsonpCallback: 'successCallback',
               
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (result) 
            {
                  
                $.each( result, function(i, row) 
                {
                    if( row.section_title=='valid')
                    {
                        var uid=row.section_id;
                        localStorage.setItem("userName",userName);
                        localStorage.setItem("userId",uid);
                        localStorage.setItem("PrivatePic",'N');
                                    
                        // get refresh rate 
                        getRate();
                        // checkt notification mode is yes or not 
                        getNotificationMode();
                        // set interval for chat request
                        setInterval (check_chat_request, 10000);
                                                                    
                        //$.mobile.changePage("home.html");
                        viewProfile(uid, 'my_profile');   
                    }
                    else
                    {
                        $('#reg_result').empty();
                        $('#reg_result').append('<p>' + row.section_title+ '</p>');
                    }
                            
                            
                });
                      
                    
            },
            error: function(x, t, m) {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }
        });
            
          
           
    }
    else
    {
        var alertText = get_tranalation_by_code("DSP_FILL_IN_ALL_FIELDS");
        alertText = alertText || 'Please fill all necessary fields!';
         navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
    }
             
             
});



$(document).on('pagebeforeshow', '#page-login', function()
{
    
    localStorage.setItem("userId",0);
    var siteName = localStorage.getItem("siteName");  
    
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dspLogin.php";
    
    //alert(siteUrl);
    
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        success: function (data, status)
        {
            //alert('succ');
            dataT = $.trim(data);
            $('#page-login').empty();
                 
            $('#page-login').append(dataT);
            $('#page-login').trigger('create');
                             
        },
        timeout: 10000,
        error: function(jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            
        }  
        
    });
   
 
 
    //var userName= localStorage.getItem("userName",userName);
   
/*if(userName)
        {
        $.mobile.changePage("home.html");
        } */
    
        

});


function callHomePage()
{
     
    var siteName = localStorage.getItem("siteName");  
    var userId = localStorage.getItem("userId");
    
    var userList = {
        'user_id': userId
    };
    
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dspHome.php";
    
    $.ajax({
        type: "GET",
        url: siteUrl,
        data:userList,
        cache: false,
        dataType: "text",
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
                
            dataT = $.trim(data);
            $('#home_page').empty();
                    
            $('#home_page').append(dataT);
            $('#home_page').trigger('create');
            $('.MenuiPhone').show();
                       
            var notificationMode= localStorage.getItem("notificationMode");
            if(notificationMode=='Y') // if show notification is on 
            {
                checkNotification();
            }
                       
                       
                       
        },
        timeout: 10000,
        error: function(jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
           
    });
}



function checkNotification() 
{
    var rate = localStorage.getItem("refreshRate");
    var notiTime = localStorage.getItem("notificationTime");
    
    
    
    var check_notification_init = setInterval(function() {
        
        var siteName = localStorage.getItem("siteName");  
        var userId = localStorage.getItem("userId");
        
        var userList = {
            'user_id': userId,
            'action':'show',
            'pagetitle':'notification'
        };
        siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_header.php";

        $.ajax({
            type: "GET",
            url: siteUrl,
            data:userList,
            cache: false,
            dataType: "text",
            success: function (data, status)
            {
                data = $.trim(data);
                if(data!="fail")
                {
                
                    $('#popup_div').css('display','block');
                       
                    $('#popup_div').empty();
                     
                    $('#popup_div').append(data);
                    $('#popup_div').trigger('create');
                        
                    if(data!="fail")
                    {

                        setTimeout(function () 
                        {
                            if($('#notification_id').val())  // check if notification id is exist
                            {
                                $('#popup_div').css('display','none');
                                            
                                $.ajax({
                                    url: siteUrl+"?action=hide&pagetitle=notification&id="+$('#notification_id').val()+"&user_id="+userId,
                                    cache: false,
                                    success: function(html)
                                    {
                                        $('#popup_div').html("");
                                        $('#popup_div').css('display','none');
                                    }
                                });
                            }
                        }, notiTime);
                    }
                }
            },
            timeout: 10000,
            error: function(jqXHR, status,errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
                    alertText,
                    null,
                    null,
                    'ok'
                );       
            }  
            
        });
        clearInterval(check_notification_init);

        checkNotification();      
    }, rate);
        
      
}

function close_notifications(id)
{

    $('#popup_div').html("");
    $('#popup_div').css('display','none');
    
    var userId = localStorage.getItem("userId");
        
    var siteName = localStorage.getItem("siteName");
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_header.php?action=hide&pagetitle=notification&id="+id+'&user_id='+userId;
    
    $.ajax({
        url: siteUrl,
        cache: false,
        success: function(html)
        {        
            $('#popup_div').html("");
            $('#popup_div').css('display','none');
        }

    });

}

function getRate()
{
    var siteName = localStorage.getItem("siteName");
    
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_header.php";
    var userId = localStorage.getItem("userId");
    var userList = {
        'user_id': userId,
        'pagetitle':"refresh_rate"
    };
    
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:userList,
        success: function (data, status)
        {
            var viewArr= data.split('#'); // split the string with # //after # string contains alert msg
            var rate= $.trim(viewArr[0]);
            var notificationTime=$.trim(viewArr[1]);
            // alert(rate+' '+notificationTime);
                       
            localStorage.setItem("refreshRate",rate);
            localStorage.setItem("notificationTime",notificationTime);
        },
        timeout: 10000,
        error: function (jqXHR, status,errorThrown)
        {
            localStorage.setItem("refreshRate",10000);
            localStorage.setItem("notificationTime",10000);
        }
                
    });
           
}

function getNotificationMode()
{
    var siteName = localStorage.getItem("siteName");
    
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_header.php";
    var userId = localStorage.getItem("userId");
    var userList = {
        'user_id': userId,
        'pagetitle':"check_notification_mode"
    };
    
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:userList,
        success: function (data, status)
        {
            //alert(data);
            data = $.trim(data);
            localStorage.setItem("notificationMode",data);
        },
        timeout: 10000,
        error: function (jqXHR, status,errorThrown)
        {
            localStorage.setItem("notificationMode",'Y');
        }
                
    });
           
}

$(document).on('pagebeforeshow', '#home_page', function()
{
    //alert('homepage before show');
    callHomePage();
});

$(document).on('click', '#btn_logout', function() 
{
    localStorage.setItem("userName","");
    localStorage.setItem("userId","");
    
    $.mobile.changePage("index.html");
});

$(document).on('pagebeforeshow', '#online_page', function()
{
  
    var siteName = localStorage.getItem("siteName");
    
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dspGetOnline.php";
    
    
    var site_name=localStorage.getItem("site");
   
    
    //alert('site'+site_name);
    
    var userId = localStorage.getItem("userId");
    var userList = {
        'user_id': userId
    };
    
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:userList,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: onSuccessOnline,
        timeout: 10000,
        error: onErrorOnline
                
    });
            
    function onSuccessOnline(data, status)
    {
        // alert('succ');
        $('#online_page').empty();           
        $('#online_page').append(data);
    // show site name on header
    // $('#siteName').empty();           
    // $('#siteName').append(site_name);
    }
            
    function onErrorOnline(jqXHR, status,errorThrown)
    {
        var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
        alertText = alertText || 'Network error has occurred please try again!';
         navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
    }  
       
});

$(document).on('pagebeforeshow', '#mainPage', function() 
{
    var url=localStorage.getItem("siteName");
    if(url)
    {
        url = url.replace(/^http:\/\//i, ''); // remove any http:// or https:// from the url
        url = url.replace(/^https:\/\//i, '');
        
    }
    else
    {
        url="";
    }
    $('#sitename').textinput();
    $('#sitename').val(url);

});

$(document).on('click', '#submit_site', function() 
{
    if($('#sitename').val().length > 0)
    {

        var site=$('#sitename').val();

        console.log("sitename:"+site);


        var formData = $("#check_site").serialize();
            
        $.ajax({
            type: "GET",
            url: "http://www.idatingsolutions.com/wp-content/plugins/dating_repoz/checkValidSite.php",
            data: formData, // Convert a form to a JSON string representation
            dataType: "text",
                           
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (data, status)
            {
                data = $.trim(data);
                
                if(data=="false")
                {
                    var alertText = get_tranalation_by_code("DSP_APP_NOT_CONFIGURED");
                    alertText = alertText || 'Sorry,the owner has not configured the mobile dating app!';
                     navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
                       
                }
                else
                {
                    // alert(data+ ' '+site);
                    localStorage.setItem("siteName", data);
                    localStorage.setItem("site", site);
                    
                    //localStorage.setItem("siteName", "http://localhost:8888/datingsolutions");
                    //localStorage.setItem("site", "http://localhost:8888/datingsolutions");
                    var lang_url = data + "/wp-content/plugins/dsp_dating/m1/dsp_lang_translations.php";
                    //alert("Show lang for:" + lang_url);
                    $.ajax({
                        url: lang_url,
                        type: 'POST',
                        data: { "test" : "1"},
                        dataType: 'json',
                        success: function(data) {
                            //alert("Data here:" + JSON.stringify(data, null, 4));
                            lang_translations = data;

                            $.mobile.changePage( "index.html", {
                                transition: "pop",
                                reverse: false,
                                changeHash: false
                            });

                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                            alertText = alertText || 'Network error has occurred please try again!';
                             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
                        }
                    });
   

                    //localStorage.setItem("siteName", "http://localhost:8888/datingsolutions");
                    //localStorage.setItem("site", "http://localhost:8888/datingsolutions");
                        
                                             
                    
                }
            },
            timeout: 10000,
            error:  function (jqXHR, status,errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }  
                
        });
    }
    else
    {
        var alertText = get_tranalation_by_code("DSP_ENTER_SITE_NAME");
        alertText = alertText || 'Please enter site name!';
         navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
    }
        
});



/* function for online page */
function addFriend(frndId)
{
    var userId = localStorage.getItem("userId");
    
    var userList = {
        'user_id': userId,
        'frnd_userid': frndId
    };
    
    var siteName = localStorage.getItem("siteName");
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_add_frnd.php";
    
    $.ajax({
        type: "GET",
        url:siteUrl,
        data: userList, 
        dataType: "text",
                   
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            // we hv to decode the html entites here so that we can  print can't in alert
            var decoded = $("<div/>").html(data).text();
            alert(decoded);
            
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
        
    });
}

function addFavourite(frndId)
{
    var userId = localStorage.getItem("userId");
      
    var userList = {
        'user_id': userId,
        'fav_userid': frndId
    };
    
    var siteName = localStorage.getItem("siteName");
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_add_favourites.php";
    
    $.ajax({
        type: "GET",
        url:siteUrl,
        data: userList, // Convert a form to a JSON string representation
        dataType: "text",
                   
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            // we hv to decode the html entites here so that we can  print can't in alert
            var decoded = $("<div/>").html(data).text();
            alert(decoded);
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
        
    });
}

function sendWink(frndId)
{
    var userId = localStorage.getItem("userId");
      
    var userList = {
        'user_id': userId,
        'receiver_id': frndId,
        'pagetitle':'send_wink_msg'
    };
    
    var siteName = localStorage.getItem("siteName");
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_header.php";
    
    $.ajax({
        type: "GET",
        url:siteUrl,
        data: userList, // Convert a form to a JSON string representation
        dataType: "text",
                  
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            $(document).on('pagebeforeshow', '#wink', function()
            {
                $('#wink').empty();
                $('#wink').append(data);
                $('#wink').trigger('create');
            });   
            
            $.mobile.changePage("dsp_wink.html");
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
        
    });
}

$(document).on('click', '#send_flirt', function() 
{
      
    var formData = $("#sendwinkfrm").serialize();
    $.ajax({
        type: "GET",
        url:siteUrl,
        data: formData, // Convert a form to a JSON string representation
        dataType: "text",
           
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data)
        {
            // alert('succ'+data);
            $('#msg').empty();
                 
            $('#msg').append('<p>' + data+ '</p>');
                 
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
    });
           
});



function getOnlinePage(page)
{
   
    if(page==0)
    {
        var formData = $("#frm_online").serialize();
        
    }
    else
    {
        var userId = localStorage.getItem("userId");
        var formData = {
            'user_id': userId,
            'page1':page
        };
    }
    
    var siteName = localStorage.getItem("siteName");
    
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dspGetOnline.php";
     
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: onSuccessOnline,
        timeout: 10000,
        error: onErrorOnline
                
    });
            
    function onSuccessOnline(data, status)
    {
        //  alert('succ');
        $('#online_page').empty();           
        $('#online_page').append(data);
    }
            
    function onErrorOnline(jqXHR, status,errorThrown)
    {
        var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
        alertText = alertText || 'Network error has occurred please try again!';
         navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
    }  
        
}

/*------------------- End of  function for online page --------------------------------------*/

/*------------------- View profile function------------------------------*/

function viewProfile(memberId,view)
{
    // alert('view');
    localStorage.setItem("viewMemberId",memberId);
    localStorage.setItem("memberView",view);
    $.mobile.changePage("dsp_view_profile.html");
}

function viewMemberProfile(memberId,view)
{
    //alert('621memid='+memberId);
    localStorage.setItem("viewMemberId",memberId);
    var userId = localStorage.getItem("userId");
    valid="true";
   
    if(view.indexOf('#') === -1) // check if # exist in view
    {
       
    }
    else
    {
        var viewArr= view.split('#'); // split the string with # //after # string contains alert msg
        view=viewArr[0];
        var msg=viewArr[1];
    }
    
    if(view=="date_tracker" || view=="report" || view=="blocked")
    {
        if(confirm(msg))
        {
            var formData = {
                'user_id': userId,
                'member_id':memberId,
                'pagetitle':'view_profile',
                'Action':view
            };
        }
        else
        {
            valid="false";
           
        }
        
    }
   
    else if(view!=0)
    {
        
        var formData = {
            'user_id': userId,
            'member_id':memberId,
            'pagetitle':'view_profile',
            'view':view
        };
    }
    else
    {
        var formData = {
            'user_id': userId,
            'member_id':memberId,
            'pagetitle':'view_profile'
        };
    }

    var siteName = localStorage.getItem("siteName");
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_header.php";
    
    if(valid=="true")
    {
        
        $.ajax({
            type: "GET",
            url: siteUrl,
            cache: false,
            dataType: "text",
            data:formData,
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (data, status)
            {
                $('#dsp_profile').empty();           
                $('#dsp_profile').append(data);
                 if (navigator.userAgent.indexOf("Android") > 0){
                    $('.AndroidPlayer').show();
                }else{
                     $('.iPhonePlayer').hide();
                }
                // alert('succ');
                callSlider('friend'); // for friends slider
                callSlider('Video'); // for video slider
                callSlider('Photos'); // fot photos slider
                callSlider('Audio'); // fot Audio slider
                callSlider('Blog'); // fot Blog slider
            },
            timeout: 10000,
            error:  function (jqXHR, status,errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }  
            
        });
    }
}
$(document).on('pagebeforeshow', '#dsp_profile', function()
{
    var memId=  localStorage.getItem("viewMemberId");
    var memberView = localStorage.getItem("memberView");
    
    viewMemberProfile(memId,memberView);
});

$(document).on('pagebeforeshow', '#dsp_profile_info', function()
{
    
    var memId=  localStorage.getItem("viewMemberId");
    //   alert('memid=');
    $('#dsp_profile_info').empty();           
    $('#dsp_profile_info').append('hsadkasdkajsdhajdas');
             
    var userId = localStorage.getItem("userId");
    var formData = {
        'user_id': userId,
        'member_id':memId
    };
         
          
    var siteName = localStorage.getItem("siteName");
          
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dspProfileInfo.php";
           
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            //console.log(data);
            $('#dsp_profile_info').empty();           
            $('#dsp_profile_info').append(data);
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }
                      
    });
                  
                 
                  
                 
});

$(document).on('pagebeforeshow', '#dsp_profile_loc', function()
{
    
    var memId=  localStorage.getItem("viewMemberId");
    var userId = localStorage.getItem("userId");
    var formData = {
        'user_id': userId,
        'member_id':memId
    };
    
              
    var siteName = localStorage.getItem("siteName");
          
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dspProfileLoc.php";
           
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            $('#dsp_profile_loc').empty();           
            $('#dsp_profile_loc').append(data);
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
                      
    });
                  
});

$(document).on('pagebeforeshow', '#dsp_profile_friends', function()
{
    viewUserFriends(0,'text');
                  
});

function viewFriends()
{
    var userId = localStorage.getItem("userId");
    var memId=  localStorage.setItem("viewMemberId",userId);
    $.mobile.changePage("dsp_profile_mem_friend.html");
}
function viewUserFriends(delFriendId,delText)
{
   
    var userId = localStorage.getItem("userId");
      
    var siteName = localStorage.getItem("siteName");

    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dspProfileMemFriends.php";
    
    if(delFriendId!=0)
    {
        var formData = {
            'user_id': userId,
            'Action':'Del',
            'friend_Id':delFriendId
        };
        
        if(confirm(delText))
        {
            $.ajax({
                type: "GET",
                url: siteUrl,
                cache: false,
                dataType: "text",
                data:formData,
                beforeSend: function() {
                    $.mobile.showPageLoadingMsg(true);
                },
                complete: function() {
                    $.mobile.hidePageLoadingMsg();
                },
                success: function (data, status)
                {
                    $('#dsp_profile_friends').empty();           
                    $('#dsp_profile_friends').append(data);
                },
                timeout: 10000,
                error:  function (jqXHR, status,errorThrown)
                {
                    var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                    alertText = alertText || 'Network error has occurred please try again!';
                     navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
                }  
                
            });
        }
    }
    else
    {
        
        var formData = {
            'user_id': userId
        };
            
        $.ajax({
            type: "GET",
            url: siteUrl,
            cache: false,
            dataType: "text",
            data:formData,
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (data, status)
            {
                $('#dsp_profile_friends').empty();           
                $('#dsp_profile_friends').append(data);
            },
            timeout: 10000,
            error:  function (jqXHR, status,errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }  
            
        });
    }
  

   
 
    
}
/*
$(document).on('pagebeforeshow', '#dsp_profile_pic', function()
        {
              var memId=  localStorage.getItem("viewMemberId");
              var albumId=  localStorage.getItem("viewAlbumId");
              var userId = localStorage.getItem("userId");
              var formData = {'user_id': userId,'member_id':memId,'album_id':albumId};
      
          var siteName = localStorage.getItem("siteName");
          
          siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dspProfileUserPictures.php";
           
                  $.ajax({
                          type: "GET",
                          url: siteUrl,
                          cache: false,
                          dataType: "text",
                          data:formData,
                          beforeSend: function() {
                              $.mobile.showPageLoadingMsg(true);
                          },
                          complete: function() {
                              $.mobile.hidePageLoadingMsg();
                          },
                          success: function (data, status)
                          {
                              $('#dsp_profile_pic').empty();           
                              $('#dsp_profile_pic').append(data);
                          },
                          timeout: 10000,
                          error:  function (jqXHR, status,errorThrown)
                          {
                              alert('Network error has occurred please try again!');
                          }  
                      
                      });
                  
        }); */

$(document).on('pagebeforeshow', '#dsp_profile_album', function()
{
    var memId=  localStorage.getItem("viewMemberId");
    var userId = localStorage.getItem("userId");
    var formData = {
        'user_id': userId,
        'member_id':memId
    };
      
    var siteName = localStorage.getItem("siteName");
          
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dspProfileUserAlbums.php";
           
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            $('#dsp_profile_album').empty();           
            $('#dsp_profile_album').append(data);
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
                      
    });
                  
});

function member_pictures(albumId)
{
    localStorage.setItem("viewAlbumId",albumId);
       
    $.mobile.changePage("dsp_profile_photos.html");
}

$(document).on('pagebeforeshow', '#dsp_profile_blog', function()
{
    var memId=  localStorage.getItem("viewMemberId");
    var userId = localStorage.getItem("userId");
    var formData = {
        'user_id': userId,
        'member_id':memId
    };
      
    var siteName = localStorage.getItem("siteName");
          
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dspProfileBlog.php";
    //  alert(siteUrl);
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            // alert('succ');
            $('#dsp_profile_blog').empty();           
            $('#dsp_profile_blog').append(data);
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
                      
    });
                  
});

$(document).on('pagebeforeshow', '#dsp_profile_video', function()
{
    getVideo(0);
});
           
                  
        

function getVideo(page)
{
    //alert(page);
    
    var memId=  localStorage.getItem("viewMemberId");
    var userId = localStorage.getItem("userId");
    
    if(page==0)
    {
        var formData = {
            'user_id': userId,
            'member_id':memId
        };
    }
    else
    {
        var formData = {
            'user_id': userId,
            'member_id':memId,
            'page1':page
        };
    }
   
   

    var siteName = localStorage.getItem("siteName");

    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dspProfileVideos.php";

    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            // alert('succ');
            $('#dsp_profile_video').empty();           
            $('#dsp_profile_video').append(data);
                  
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
            
    });
}
$(document).on('pagebeforeshow', '#dsp_profile_audio', function()
{
    getAudio(0);
});

function getAudio(page)
{
    var memId=  localStorage.getItem("viewMemberId");
    var userId = localStorage.getItem("userId");
    
    if(page==0)
    {
        var formData = {
            'user_id': userId,
            'member_id':memId
        };
    }
    else
    {
        var formData = {
            'user_id': userId,
            'member_id':memId,
            'page1':page
        };
    }
   
    

    var siteName = localStorage.getItem("siteName");

    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dspProfileAudio.php";

    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            // alert('succ');
            $('#dsp_profile_audio').empty();           
            $('#dsp_profile_audio').append(data);
                  
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
            
    });
}


/*------------------- End of View profile function-----------------------*/

/*--------------------------View Status----------------------------------------*/
$(document).on('pagebeforeshow', '#dsp_status', function()
{
    viewStatus(0);
});

function viewStatus(post)
{
    var userId = localStorage.getItem("userId");
    
    if(post==1)
    {
        var formData = $("#frm_status").serialize();
    }
    else
    {
   
        var formData = {
            'user_id': userId
        };
    }
   
    

    var siteName = localStorage.getItem("siteName");

    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dspViewStatus.php";

    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            // alert('succ');
            $('#dsp_status').empty();           
            $('#dsp_status').append(data);
            
            $('input[name=new_status]', '#frm_status').val("");
                  
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
            
    });
}



/*----------------------- End of status------------------------------------------*/

/*----------------------- View Message------------------------------------------*/
$(document).on('pagebeforeshow', '#dsp_message', function()
{
    var userId = localStorage.getItem("userId");
    localStorage.setItem("senderId",0);
    localStorage.setItem("msgID",0);
 
    var formData = {
        'user_id': userId
    };
  
    var siteName = localStorage.getItem("siteName");

    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dspViewMessage.php";

    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            // alert('succ');
            $('#dsp_message').empty();           
            $('#dsp_message').append(data);
                  
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
            
    });
});

$(document).on('pagebeforeshow', '#dsp_inbox', function()
{
    //alert('show inbox');
    getInbox(0,'false');
});

function viewMessage(senderId)
{
    localStorage.setItem("msgSenderId",senderId);
     
    $.mobile.changePage("dsp_view_inbox_msg.html");
}

$(document).on('pagebeforeshow', '#dsp_inbox_msg', function()
{
    viewRecMsg(0,'view');
});
/* We are using this function for showing inbox page, inbox pageb pagination,delete received  messages*/
function getInbox(page,post)
{
    var userId = localStorage.getItem("userId");
          
    if(post=='true')
    {
        var formData = $("#frminbox").serialize();
            
    }
    else
    {
        var formData = {
            'user_id': userId,
            'message_template':'inbox',
            'page1':page
        };
    }
               
    var siteName = localStorage.getItem("siteName");

    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/email_header.php";

    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            $('#dsp_inbox').empty();           
            $('#dsp_inbox').append(data);
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
              
    });
}
function viewRecMsg(page,mode)
{
    var userId = localStorage.getItem("userId");
    var senderId = localStorage.getItem("msgSenderId");
   
     
    if(page==0 && mode=='view')
    {
        var formData = {
            'user_id': userId,
            'message_template':'view_message',
            'sender_ID':senderId,
            'Act':'R'
        };
    }
    
    else
    {
        var formData = {
            'user_id': userId,
            'message_template':'view_message',
            'sender_ID':senderId,
            'Act':'R',
            'page1':page
        };
    }
    
   
    
    var siteName = localStorage.getItem("siteName");

    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/email_header.php";

    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        { 
            $('#dsp_inbox_msg').empty();           
            $('#dsp_inbox_msg').append(data);
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
              
    });
}

function delRecMsg()
{
    getInbox(page,sender_id);
}

function composeMessage(senderID,msgId)
{
  
    localStorage.setItem("senderId",senderID);
    localStorage.setItem("msgID",msgId);
    $.mobile.changePage('dsp_compose.html');
   
}
$(document).on('pagebeforeshow', '#dsp_compose', function()
{
    getCompose('false');
});

function getCompose(post)
{
    
    var senderID= localStorage.getItem("senderId");
    var msgID= localStorage.getItem("msgID");
    var userId = localStorage.getItem("userId");
      
    if(post=='true')
    {
        var formData = $("#composefrm").serialize();
    }
    else
    {
        if(senderID==0)
        {
            var formData = {
                'user_id': userId,
                'message_template':'compose'
            };
        }
        else if(senderID!=0 && msgID !=0)
        {
            var formData = {
                'user_id': userId,
                'message_template':'compose',
                'sender_ID':senderID,
                'Act':'Reply',
                'msgid':msgID
            };
        }
        else
        {
            var formData = {
                'user_id': userId,
                'message_template':'compose',
                'receive_id':senderID
            };
        }
    }
  

    var siteName = localStorage.getItem("siteName");

    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/email_header.php";

    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        { 
            // alert('success');
            $('#dsp_compose').empty();           
            $('#dsp_compose').append(data);
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
              
    });
}

$(document).on('pagebeforeshow', '#dsp_sent', function()
{
    getSent('false',0);
});

function getSent(post,page)
{
    
    var userId = localStorage.getItem("userId");
    
    if(post=='true')
    {
    
        var formData = $("#frmdelmessages").serialize();
    
    }
    else
    {
        var formData = {
            'sender_ID': userId,
            'message_template':'sent',
            'user_id':userId,
            'page1':page
        };
    }
    
    var siteName = localStorage.getItem("siteName");

    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/email_header.php";

    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        { 
            // alert('success');
            $('#dsp_sent').empty();           
            $('#dsp_sent').append(data);
            var userId = localStorage.getItem("userId");
                      
        /*    if(post=='true')
                          {
                          var formData = $("#frmdelmessages").serialize();
                          }
                      else
                          {
                              if(view=="true")// view deleted message
                              {
                                  var formData = {'message_template':'delete_messages','user_id':userId,'sender_ID':senderID,'Act':'R'};
                              }
                              else
                              {
                                  var formData = {'message_template':'deleted','user_id':userId,'page1':page};
                              }
                          }
                       
                      var siteName = localStorage.getItem("siteName");

                      siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/email_header.php";

                            $.ajax({
                                    type: "GET",
                                    url: siteUrl,
                                    cache: false,
                                    dataType: "text",
                                    data:formData,
                                    beforeSend: function() {
                                        $.mobile.showPageLoadingMsg(true);
                                    },
                                    complete: function() {
                                        $.mobile.hidePageLoadingMsg();
                                    },
                                    success: function (data, status)
                                    { 
                                        $('#dsp_deleted').empty();           
                                        $('#dsp_deleted').append(data);
                                     },
                                    timeout: 10000,
                                    error:  function (jqXHR, status,errorThrown)
                                    {
                                        alert('Network error has occurred please try again!');
                                    }  
                                
                                }); */
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
              
    });
}

$(document).on('pagebeforeshow', '#dsp_deleted', function()
{
    getDeleted('false',0);
});

function getDeleted(post,page)
{
    
    var userId = localStorage.getItem("userId");
    
    if(post=='true')
    {
        var formData = $("#frmdelmessages").serialize();
    }
    else
    {
        var formData = {
            'message_template':'deleted',
            'user_id':userId,
            'page1':page
        };
    }
     
    var siteName = localStorage.getItem("siteName");

    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/email_header.php";

    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        { 
            $('#dsp_deleted').empty();           
            $('#dsp_deleted').append(data);
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
              
    });
}

function getViewDeleted(page,senderID)
{
    var userId = localStorage.getItem("userId");
    
 
         
    var formData = {
        'message_template':'delete_messages',
        'user_id':userId,
        'sender_ID':senderID,
        'Act':'R',
        'page1':page
    };
       
    var siteName = localStorage.getItem("siteName");

    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/email_header.php";

    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        { 
            $('#dsp_deleted').empty();           
            $('#dsp_deleted').append(data);
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
              
    });
}
function editYourPeofile()
{
    //alert('edit');
    var userId = localStorage.getItem("userId");
    var formData = {
        'user_id':userId,
        'pagetitle':2
    };
    var siteName = localStorage.getItem("siteName");
    // localStorage.setItem("PrivatePic",'N');
    
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_header.php";

    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        { 
            // alert('succ');
            $('#edit_profile').empty();           
            $('#edit_profile').append(data);
                     
                     
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
              
    });
}

$(document).on('pagebeforeshow', '#edit_profile', function()
{
    editYourPeofile();
 
});

function editProfileQuestion(post,text)
{
    var userId = localStorage.getItem("userId");
    var  valid="true";
    
  
   
    if(post=="true")
    {
        /* check validation for country state city*/
        if($('#cmbCountry_id').val()==0 )
        {
            var alertText = get_tranalation_by_code("DSP_COUNTRY_EMPTY_ERROR");
            alertText = alertText || 'Country cannot not be empty!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            valid="false";
        }
      
       
        
        /* checking validation for question */
        var i=0;
        $('[name="hidprofileqquesid[]"]').each(function(){
            
            var q_id1=  $(this).val();
            var q_name=  $('input[name="hidprofileqques[]"]:eq('+i+')').val();
            var sel_option_id=$('#q_opt_ids'+q_id1).val();
            // alert(q_name+' '+sel_option_id);
            if(sel_option_id==0) 
            {
                alert("Please Select " + q_name +" value");
                valid="false";
                return false; // to exit from each loop
            }
            i++;
        });
        if ($('#txtaboutme').val()=="")  /* checking validation for about me text*/
        {
            var alertText = get_tranalation_by_code("DSP_ABOUT_ME_EMPTY_ERROR");
            alertText = alertText || 'Please Enter About Me!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            valid="false";
        }    
       
        /*We are commenting this code as this is not required 
         * this is a validation for profile otional question
         * var j=0;
        $('[name="hidtextprofileqquesid[]"]').each(function(){
            
            var q_id2=  $(this).val();
            alert(q_id2);
            
            var q_name2=  $('input[name="hidetextqu_name[]"]:eq('+j+')').val();
            alert(q_name2);
            var text_option_id=$('#text_option_id'+q_id2).text();
            alert('testarea='+text_option_id);
            if(text_option_id=="") 
            {
                alert('enter');
              alert("Please Enter " + q_name2 +" value");
              valid="false";
            }
            j++;
         }); */
 
        
        var formData = $("#frmEdit").serialize();
                  
    }
    else
    {
        var formData = {
            'user_id':userId,
            'pagetitle':"edit_profile_question"
        };
    }
    
    if(valid=="true")
    {
   
        var siteName = localStorage.getItem("siteName");
        
        siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_header.php";
 
        $.ajax({
            type: "GET",
            url: siteUrl,
            cache: false,
            dataType: "text",
            data:formData,
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (data, status)
            {
                $('#edit_profile').empty();           
                $('#edit_profile').append(data);
            },
            timeout: 10000,
            error:  function (jqXHR, status,errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }  
              
        });
    }
}
/*
$(document).on('pagebeforeshow', '#edit_profile_pic', function()
        {
            editProfilePicture('false','text');
        }); */

function editProfilePicture(post,text)
{
    var userId = localStorage.getItem("userId");
    localStorage.setItem("PrivatePic",'N');
    
    var formData = {
        'user_id':userId,
        'pagetitle':"edit_picture"
    };
 
    var siteName = localStorage.getItem("siteName");

    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_header.php";
 
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            $('#div_edit_pic').empty();           
            $('#div_edit_pic').append(data);
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
              
    });
        
}

$(document).on('pagebeforeshow', '#myFavorite', function()
{
    myFavorite(0,'text');
});

function myFavorite(delUserID,confText)
{
    var userId = localStorage.getItem("userId");
    var valid='true';
    
    if(delUserID!=0)
    {
        if(confirm(confText))
        {
            var formData = {
                'user_id':userId,
                'favourite_Id':delUserID,
                'Action':'Del'
            };
        }
        else
        {
            valid="false";
        }
    }
    else
    {
        var formData = {
            'user_id':userId
        };
    }
    
    if(valid=="true")
    {
   
        var siteName = localStorage.getItem("siteName");

        siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_my_favourites.php";
 
        $.ajax({
            type: "GET",
            url: siteUrl,
            cache: false,
            dataType: "text",
            data:formData,
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (data, status)
            {
                    
                //alert('succ');
                $('#myFavorite').empty();           
                $('#myFavorite').append(data);
            },
            timeout: 10000,
            error:  function (jqXHR, status,errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }  
              
        });
    }
}

$(document).on('pagebeforeshow', '#date_tracker', function()
{
    myDate('false','text',0,1);
});

function myDate(post,confText,msgID,page)
{
    var userId = localStorage.getItem("userId");
    var valid='true';
      
    if(post=='true')
    {
        if (!$.trim($("#txtmessage").val()))// check if text box is not empty
        {
            alert(confText);
            valid="false";
        }
        else
        {
            var formData = $("#frmsave").serialize();
        }
    }
    else if(post=='edit')
    {
        var formData = {
            'user_id':userId,
            'mode':'edit',
            'msg':msgID,
            'page1':page
        };
    }
    else if(post=='editSave')
    {
        if (!$.trim($("#edittxtmessage").val()))// check if user enter in text box
        {
            alert(confText);
            valid="false";
        }
        else
        {
            var formData = $("#frmEditMsg").serialize();
           
        }
    }
    else if(post=='page')
    {
        var formData = {
            'user_id':userId,
            'page1':page
        };
    }
    else if(post=='delUser')
    {
        if(confirm(confText))
        {
            //here msgID is deluserId
            var formData = {
                'user_id':userId,
                'mode':'del_user',
                'delUserID':msgID,
                'page1':page
            };
        }
        else
        {
            valid='false';
        }
       
       
    }
    else
    {
        var formData = {
            'user_id':userId
        };
    }
    
    if(valid=="true")
    {
   
        var siteName = localStorage.getItem("siteName");

        siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/date_tracker.php";
 
        $.ajax({
            type: "GET",
            url: siteUrl,
            cache: false,
            dataType: "text",
            data:formData,
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (data, status)
            {
                    
                //alert('succ');
                $('#date_tracker').empty();           
                $('#date_tracker').append(data);
            },
            timeout: 10000,
            error:  function (jqXHR, status,errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }  
              
        });
    }
}

$(document).on('pagebeforeshow', '#edit_partner_profile', function()
{
    editPartnerProfile('false');
});

function editPartnerProfile(post)
{
    // alert('part');
    var userId = localStorage.getItem("userId");
    var formData = {
        'user_id':userId,
        'pagetitle':'2',
        'title':'partner_profile'
    };
    
    var siteName = localStorage.getItem("siteName");

    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_header.php";
 
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
                    
            //  alert('succ');
            $('#edit_partner_profile').empty();           
            $('#edit_partner_profile').append(data);
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
              
    });
}

function editPartnerQuestion(post,text)
{
    var userId = localStorage.getItem("userId");
    var valid="true";
    //  alert('edit ques');
    if(post=="true")
    {
        /* check validation for country */
        if($('#cmbCountry_id').val()==0 )
        {
            var alertText = get_tranalation_by_code("DSP_COUNTRY_EMPTY_ERROR");
            alertText = alertText || 'Country cannot not be empty!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            valid="false";
        }
        /* checking validation for question */
        var i=0;
        $('[name="hidprofileqquesid[]"]').each(function(){
                
            var q_id1=  $(this).val();
            var q_name=  $('input[name="hidprofileqques[]"]:eq('+i+')').val();
            var sel_option_id=$('#q_opt_ids'+q_id1).val();
            
            if(sel_option_id==0) 
            {
                alert("Please Select " + q_name +" value");
                valid="false";
                exit();
            }
            i++;
        });
        if ($('#txtaboutme').val()=="")  /* checking validation for about me text*/
        {
            var alertText = get_tranalation_by_code("DSP_ABOUT_ME_EMPTY_ERROR");
            alertText = alertText || 'Please Enter About Me!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            valid="false";
        }  
        var formData = $("#frmEditQuestion").serialize();
            
    }
    else
    {
        var formData = {
            'user_id':userId,
            'pagetitle':'2',
            'title':'partner_question'
        };
    }
    if(valid=="true")
    {
        var siteName = localStorage.getItem("siteName");

        siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_header.php";
 
        $.ajax({
            type: "GET",
            url: siteUrl,
            cache: false,
            dataType: "text",
            data:formData,
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (data, status)
            {
                // alerT('succ');
                $('#edit_partner_profile').empty();           
                $('#edit_partner_profile').append(data);
            },
            timeout: 10000,
            error:  function (jqXHR, status,errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }  
              
        });
    }
}


/* $(document).on('pagebeforeshow', '#edit_partner_picture', function()
        {
            editPartnerPicture('false','text');
        }); */

function editPartnerPicture(post,text)
{
    var userId = localStorage.getItem("userId");
    localStorage.setItem("PrivatePic","N");
    

    var formData = {
        'user_id':userId,
        'pagetitle':'2',
        'title':'partner_picture'
    };

    var siteName = localStorage.getItem("siteName");

    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_header.php";
 
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            $('#div_edit_pic').empty();           
            $('#div_edit_pic').append(data);
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
              
    });
     
}

$(document).on('pagebeforeshow', '#view_partner_loc', function()
{
    var userId = localStorage.getItem("userId");
    var memId= localStorage.getItem("viewMemberId");
    
   
    var siteName = localStorage.getItem("siteName");

    var formData = {
        'user_id':userId,
        'member_id':memId
    };
    
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dspPartProfileLoc.php";
 
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            $('#view_partner_loc').empty();           
            $('#view_partner_loc').append(data);
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
              
    });
    
});


$(document).on('pagebeforeshow', '#view_partner_info', function()
{
    var userId = localStorage.getItem("userId");
    var memId= localStorage.getItem("viewMemberId");
    
   
    var siteName = localStorage.getItem("siteName");

    var formData = {
        'user_id':userId,
        'member_id':memId
    };
    
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dspPartProfileInfo.php";
 
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            $('#view_partner_info').empty();           
            $('#view_partner_info').append(data);
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
              
    });
    
});

function loadExtra()
{
    var userId = localStorage.getItem("userId");
    
    var siteName = localStorage.getItem("siteName");

    var formData = {
        'user_id':userId
    };
    
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dspExtras.php";
 

    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            $('#dsp_extras').empty();           
            $('#dsp_extras').append(data);
                     
            callSlider('ViewedMe');
            callSlider('IViewed');
            callSlider('Trending');
        },
        timeout: 20000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
              
    });
}
$(document).on('pagebeforeshow', '#dsp_extras', function()
{
    loadExtra();
    
});
function callExtra(view)
{
    localStorage.setItem("viewExtra",view);
    $.mobile.changePage('dsp_extra_detail.html');
}

function viewExtra(page,view)
{
    
    var userId = localStorage.getItem("userId");
    var siteName = localStorage.getItem("siteName");
    var valid="true";
    
    //alert(view);
   
    if(view!='')
    {
        
        if(view=="post")
        {
            if($("#blog-title").val().length==0){
                 var blogTitle = get_tranalation_by_code("DSP_BLog_TITLE");
                blogTitle = blogTitle || 'Please enter blog title!';
                 navigator.notification.alert(
            blogTitle,
            null,
            null,
            'ok'
        );
                    return false;
                }
             if($("#blog-content").val().length==0){
                 var blogContent = get_tranalation_by_code("DSP_BLog_CONTENT");
                blogContent = blogContent || 'Please enter blog contnet!';
                 navigator.notification.alert(
            blogContent,
            null,
            null,
            'ok'
        );
                    return false;
                }
             if($("#blog-tag").val().length==0){
                 var blogTag = get_tranalation_by_code("DSP_BTAG");
                blogTag = blogTag || 'Please enter blog tag!';
                 navigator.notification.alert(
            blogTag,
            null,
            null,
            'ok'
        );
                 return false;
            }

            var formData = $("#dsp_trending").serialize();

        }
        else if(view=="add_blogs" && page==0) // that means this is for add blogs
        {
            var formData = {
                'user_id':userId,
                'pagetitle':'blogs',
                'subpage':view
            };
         
        }
        else if(view=="my_blogs" && page==0) // that means this is for show all blogs
        {
            var formData = {
                'user_id':userId,
                'pagetitle':'blogs',
                'subpage':view
            };
         
        }
        else if(view=="add_blogs" && page!=0) // that means this is  for edit blog and page contains blog_id
        {
            var formData = {
                'user_id':userId,
                'pagetitle':'blogs',
                'subpage':view,
                'blog_id':page,
                'mode':'edit'
            };
             
        }
        else if(view=="my_blogs" && page!=0) // that means this is  for delete blog and page contains blog_id
        {
            var alertText = get_tranalation_by_code("DSP_CONFIRM_DELETE");
            alertText = alertText || 'Are you sure to delete this ?';
            if(confirm(alertText))
            {
                var formData = {
                    'user_id':userId,
                    'pagetitle':'blogs',
                    'subpage':view,
                    'blog_id':page,
                    'Action':'Del'
                };
            }
            else
            {
                valid="false";
            }
        
         
        }
        else if(view=="add_meet" && page!=0) // that means this is  for meet me and page contains action yes or no
        {
            if((page=="yes"))
            {
                var formData = $("#dsp_yes").serialize();
            }
            else
            {
                var formData = $("#dsp_no").serialize();
            }
         
        }
        else
        {
            if(page!=0)
            {
                var gender_filter=  $("#gender_filter").val();
                var prof_filter=$("#profile_filter").val();
                // alert(gender_filter+' prof fil=='+prof_filter);
                var formData = {
                    'user_id':userId,
                    'pagetitle':view,
                    'page1':page,
                    'profile_filter':prof_filter,
                    'gender_filter':gender_filter
                };
            }
            else
            {
                var formData = {
                    'user_id':userId,
                    'pagetitle':view
                };
            }
        }
       
   
    }
    else
    {
        var formData = {
            'user_id':userId
        };
    }

    if(valid=="true")
    {
        siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/extras_header.php";
 
        $.ajax({
            type: "GET",
            url: siteUrl,
            cache: false,
            dataType: "text",
            data:formData,
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (data, status)
            {
                //alert('succ');
                $('#date_extra_detail').empty();           
                $('#date_extra_detail').append(data);
            },
            timeout: 10000,
            error:  function (jqXHR, status,errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }  
              
        });
    }
    
}

$(document).on('pagebeforeshow', '#date_extra_detail', function()
{
    var view = localStorage.getItem("viewExtra");
    viewExtra(0,view);
});

function redirectEditProfile(msg)
{
    alert(msg);
   
}

$(document).on('pagebeforeshow', '#dsp_setting', function()
{
    var view = localStorage.getItem("viewSetting");
    viewSetting(0,view);
});

function callSetting(view)
{
    localStorage.setItem("viewSetting",view);
    $.mobile.changePage('dsp_setting.html');
}

function viewSetting(page,view)
{
    var userId = localStorage.getItem("userId");
       
    var siteName = localStorage.getItem("siteName");

    if(view=="post")
    {
        var formData = $("#dspAccount").serialize();
    // alert(formData);
    }
    else
    {
        var formData = {
            'user_id':userId,
            'pagetitle':view
        };
            
    }
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/settings_header.php";    
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            //  alert('succ');
            $('#dsp_setting').empty();           
            $('#dsp_setting').append(data);
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
              
    });
}

function reload()
{
    callSetting();
}

/*-------------------------  Search Page----------------------------*/
$(document).on('pagebeforeshow', '#dsp_main_search', function()
{
    // alert('ji');
    var userId = localStorage.getItem("userId");
    
    var siteName = localStorage.getItem("siteName");

    var formData = {
        'user_id':userId,
        'pagetitle':"main_search"
    };
            
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/search_header.php"; 
    
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            //alert('succ');
            $('#dsp_main_search').empty();           
            $('#dsp_main_search').append(data);
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
              
    });
});

$(document).on('pagebeforeshow', '#dsp_search', function()
{
    var view = localStorage.getItem("viewSearch");
    viewSearch(0,view);
});

function callSearch(view)
{
    localStorage.setItem("viewSearch",view);
    $.mobile.changePage('dsp_search.html');
}

//function callBackSearch(view){
//    viewSearch(0,view);
//}

function viewSearch(page,view)
{
    var userId = localStorage.getItem("userId");
    var valid="true";   
    var siteName = localStorage.getItem("siteName");

    if(view=="post")
    {
        var formData = $("#frmsearch").serialize();
    //alert(formData);
    }
    else if(view=='del') /* This will perform the delete action for save searches*/
    {
        // here page variable holds the save search id
        // get the hidden field del_msg value for showing delete alert
        var delAlert= $('#del_msg').val();
        if(confirm(delAlert))
        {
            var formData = {
                'user_id':userId,
                'pagetitle':"save_searches",
                'Action':'Del',
                'search_Id':page
            };
        }
        else
        {
            valid="false";
        }
    }
    else if(view=='show_save_search') /* This will show the saved search*/
    {
        // here page variable holds the save search id
    
        // save the search id value into hidden field         
        $('#save_search_Id').val(page);
          
        var formData = $("#frmsearch").serialize();
    // alert(formData);
    }
    else
    {
        if(page=="page") // for pagination
        {
            var formData = $("#frmsearch").serialize();
        //  alert(formData);
        }
        else
        {
            var formData = {
                'user_id':userId,
                'pagetitle':view
            };
        }
         
            
    }
     
    if(valid=="true")
    {
        siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/search_header.php";  
        $.ajax({
            type: "GET",
            url: siteUrl,
            cache: false,
            dataType: "text",
            data:formData,
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (data, status)
            {
                $('#dsp_search').empty();           
                $('#dsp_search').append(data);

                $('html, body').animate({
                    scrollTop: 0
                }, 100);
            },
            timeout: 10000,
            error:  function (jqXHR, status,errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }  
              
        });
    }
}

/*This function will take page no as argument and store that no in a hidden field so that we can post the search 
 * with all the hidden field and shoe the pagination.
 * */
function saveHidden(page)
{
    $('#page').val(page);
    var mypage= $('#page').val();
    //  alert(mypage);
    viewSearch('page','search_result');
}

/*-------------------------  Search Page----------------------------*/
// Called when capture operation is finished
/*
function captureSuccess(mediaFiles) {
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
function captureImage() {
    // Launch device camera application, 
    // allowing user to capture up to 2 images
    navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 1});
}

// Upload files to server
function uploadFile(mediaFile) {
    var ft = new FileTransfer(),
        path = mediaFile.fullPath,
        name = mediaFile.name;

    ft.upload(path,
        "www.dsdev.biz/wp-content/plugins/dsp_dating/m1/dsp_header.php",
        function(result) {
            console.log('Upload success: ' + result.responseCode);
            console.log(result.bytesSent + ' bytes sent');
        },
        function(error) {
            console.log('Error uploading file ' + path + ': ' + error.code);
        },
        { fileName: name });   
}
 */

//----------------------------------------------------------------------------------
$(document).on('pagebeforeshow', '#dsp_chat', function()
{
    callChat(0,0);
});

function callChat(post,val)
{
    var userId = localStorage.getItem("userId");
    var siteName = localStorage.getItem("siteName");

    var formData = {
        'user_id':userId
    };
            
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_chat_page.php"; 
    
    if(post=='add_smile') // add the smily to text box
    {
        var clientmsg = $("#usermsg1").val(); // get the value of text
           
        $("#usermsg1").val(clientmsg+val); // add the smily with text value in text box
    }
    else if(post=='post')
    {
        var message =$("#usermsg1").val();
        if(message.length == 0){
                    var alertText = get_tranalation_by_code("DSP_EMPTY_CHAT");
                        alertText = alertText || 'Please enter some message!';
                         navigator.notification.alert(
                    alertText,
                    null,
                    null,
                    'ok'
                );
            return false;
        }
        var formData = $("#frmchat").serialize();
           
        siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/post.php"; 
        $.ajax({
            type: "GET",
            url: siteUrl,
            cache: false,
            dataType: "text",
            data:formData,
            success: function (data, status)
            {
                $('#usermsg1').val("");
            // $("#usermsg1").attr("value", ""); // clear the text box
            },
            timeout: 10000,
            error:  function (jqXHR, status,errorThrown)
            {

                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            "Chat",
            'ok'
        );
            }  
            
        });
    }
    else
    {
    $.ajax({
            type: "GET",
            url: siteUrl,
            cache: false,
            dataType: "text",
            data:formData,
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (data, status)
            {
                //alert('succ');
                $('#dsp_chat').empty();           
                $('#dsp_chat').append(data);
                $("div#chat1").scrollTop($("div#chat1")[0].scrollHeight+8);
                // this will call the loadlog function in each 2.5 second 2500
                var intervalId= setInterval (loadLog, 2500);  
                localStorage.setItem("intervalId",intervalId); // set the time interval id in a variable
            },
            timeout: 10000,
            error:  function (jqXHR, status,errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            "Chat Post",
            'ok'
        );
            }  
              
        });
    }
}
 

/*this function will load the chat log on chat page.. this is calling from setInterval function in each 2.5  sec
 * */
function loadLog()
{  
    if ($('#chatbox1').length > 0) // check if chat div exist
    {
        //alert('find log tab');
        var oldscrollHeight = $("#chatbox1").prop("scrollHeight") - 20;
        var siteName = localStorage.getItem("siteName");
    
        siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/log_tab.php"; 
    
        $.ajax({

            url: siteUrl,
            cache: false,
            success: function(html)
            {    
                // alert('succ');
                $("#chatbox1").html(html); //Insert chat log into the #chatbox div  
            
                if($("div#chat1").length)
                {
                    $("div#chat1").scrollTop($("div#chat1")[0].scrollHeight+8);
                    
                    //  alert('scrol height'+ $("#chatbox1").prop("scrollHeight"));
                    var newscrollHeight = $("#chatbox1").prop("scrollHeight") - 20;
                    
                    //alert('new height'+ newscrollHeight +'old height:=='+oldscrollHeight);
                    
                    if(newscrollHeight > oldscrollHeight)
                    {
                        $("#chatbox1").animate({
                            scrollTop: newscrollHeight
                        }, 'normal'); //Autoscroll to bottom of div
                    }               
                }
            }
        });
    }
   
    
}
/*This funcation will clear the interval and redirect the user to home page
 * so that loadlog function will not called in other pages
 * */
function goBlank()
{
    //get the set interval id 
    var intv= localStorage.getItem("intervalId");
    // clear the interval
    var intv = clearInterval(intv);
    // redirect to home page 
    $.mobile.changePage("home.html");
}
//----------one on one chat-------------------------------------------------------------
$(document).on('pagebeforeshow', '#dsp_one_chat', function()
{
    var chatRecId = localStorage.getItem("chat_rec_id");
    callOneChat(chatRecId,0,0);
});
function openChatRoom(chat_rec_id,action)
{
    // alert('chatroom');
    localStorage.setItem("chat_action",action);
    localStorage.setItem("chat_rec_id",chat_rec_id);
    $.mobile.changePage("dsp_one_on_chat.html");
}

function callOneChat(rec_id,post,val)
{
    // alert('click');
    action=   localStorage.getItem("chat_action");
            
    //alert('one chat'+post);
    var userId = localStorage.getItem("userId");
    var siteName = localStorage.getItem("siteName");
            
    localStorage.setItem("chatReceiverId",rec_id);
    localStorage.setItem("chatSenderId",userId);

    var formData = {
        'user_id':userId,
        'mem_id':rec_id,
        'sender_id':userId,
        'receiver_id':rec_id,
        'action':action
    };
                    
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_one_on_one_chat.php"; 
            
    if(post=='add_smile') // add the smily to text box
    {
        var clientmsg = $("#usermsg1").val(); // get the value of text
                   
        $("#usermsg1").val(clientmsg+val); // add the smily with text value in text box
    }
    else if(post=='post')
    {
         var message =$("#usermsg1").val();
        if(message.length == 0){
                    var alertText = get_tranalation_by_code("DSP_EMPTY_CHAT");
                        alertText = alertText || 'Please enter some message!';
                         navigator.notification.alert(
                    alertText,
                    null,
                    null,
                    'ok'
                );
            return false;
        }

        //   alert('post');
        var formData = $("#frmchat").serialize();
        //  alert(formData);
        siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/post_one.php"; 
        $.ajax({
            type: "GET",
            url: siteUrl,
            cache: false,
            dataType: "text",
            data:formData,
            success: function (data, status)
            {
                // alert(data);
                $('#usermsg1').val(""); // clear textbox text
                        
            },
            timeout: 10000,
            error:  function (jqXHR, status,errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }  
                    
        });
    }
    else
    {
            
        $.ajax({
            type: "GET",
            url: siteUrl,
            cache: false,
            dataType: "text",
            data:formData,
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (data, status)
            {
                //alert('succ');
                $('#dsp_one_chat').empty();           
                $('#dsp_one_chat').append(data);
                // this will call the loadlog function in each 2.5 second 2500
                var intervalId= setInterval (loadOneLog, 2500);  
                localStorage.setItem("intervalId",intervalId); // set the time interval id in a variable
            },
            timeout: 10000,
            error:  function (jqXHR, status,errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }  
                      
        });
    }
}
        
// chat popup request 
/*This function will check wheather this user has any chat request
 * 
 * */
function check_chat_request()
{
    var userId = localStorage.getItem("userId");
    var siteName = localStorage.getItem("siteName");
            
           
            
    if(userId!=0 || userId!=null)
    {
        var chat_popup_url=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_chat_popup.php";
        var formData = {
            'user_id':userId
        };
         
        $.ajax({
            url: chat_popup_url,
            type: "GET",
            cache: false,
            dataType: "text",
            data:formData,
            success: function(result){
                    
                textArray= result.split("#");
                   
                if($.trim(textArray[0]) == "valid")
                {
                    //  alert(aj[1]);
                    if( confirm(textArray[1]))
                    {
                        openChatRoom(textArray[2],'accept_request');
                    }
                    else
                    {
                        var chat_reject_url=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_chat_popup_reject.php";
                        // alert(chat_reject_url+textArray[1]);
                        formData={
                            'user_id':userId,
                            'sender_id':textArray[2]
                            };
                        $.ajax({
                            url: chat_reject_url,
                            type: "GET",
                            cache: false,
                            dataType: "text",
                            data:formData
                                 
                        });
                    }
                } 
                    
            }
        });
    }
        
}
        
      
        
function loadOneLog()
{
    if($('#onechatbox1').length && $('#chat1').length)
    {
             
        var siteName = localStorage.getItem("siteName");
            
        siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/log_tab_one.php"; 
            
        var chatReceiverId=localStorage.getItem("chatReceiverId");
        var chatSenderId=localStorage.getItem("chatSenderId");
            
           
          
        var formData = {
            'sender_id':chatSenderId,
            'receiver_id':chatReceiverId
        };
        var message =$("#usermsg1").val();
        /*
        if(message.length == 0){
                    var alertText = get_tranalation_by_code("DSP_EMPTY_CHAT");
                        alertText = alertText || 'Please enter some message!';
                         navigator.notification.alert(
                    alertText,
                    null,
                    null,
                    'ok'
                );
            return false;
        }
        */
            
        var oldscrollHeight = $("#chatbox_one").prop("scrollHeight") - 20;

        $.ajax({

            url: siteUrl,
            cache: false,
            data:formData,
            success: function(html)
            {
                   
                $("#chatbox_one").html(html); //Insert chat log into the #chatbox div  
                if($("#chat1").length)
                {
                    var chatHeight=$("div#chat1")[0].scrollHeight;
                    $("div#chat1").scrollTop(chatHeight+8);
                    var newscrollHeight = $("#chatbox_one").prop("scrollHeight") - 20;
                    if(newscrollHeight > oldscrollHeight)
                    {
                        $("#chatbox_one").animate({
                            scrollTop: newscrollHeight+8
                        }, 'normal'); //Autoscroll to bottom of div
                    }    
                }
                              
            },
            error:  function (jqXHR, status,errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }  
        });
    }
}

        
function callInterestSearch(page,view)
{
    var userId = localStorage.getItem("userId");
           
    var siteName = localStorage.getItem("siteName");
    // alert(page +'  view=' +view);

    if(view=="post_interest") // for interest cloud search
    {
        var formData = $("#"+page).serialize();
    // alert(formData);
    }
    else
    {
        if(page=="page") // for pagination
        {
            var formData = $("#frmsearch").serialize();
        //  alert(formData);
        }
                                  
    }
             
           
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/search_header.php"; 
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            $('#dsp_extras').empty();           
            $('#dsp_extras').append(data);
                             
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
                      
    });
                 
}
        
function saveInterestHidden(page)
{
    $('#page').val(page);
    var mypage= $('#page').val();
    //  alert(mypage);
    callInterestSearch('page','search_result');
}

$(document).on('pagebeforeshow',"#dsp_upgrade",function()
{
    // alert('call');
    callUpgrade('upgrade_account',0);
}      
);
function callUpgrade(view,post)
{
   
    var siteName = localStorage.getItem("siteName");
    var userId = localStorage.getItem("userId");
    var valid="true";
  
    if(view=="auth_settings" || view=="pro_settings")
    {
        var formData = {
            'user_id':userId,
            'pagetitle':view,
            'id':post
        };
    }
    else if(view=="auth_settings_detail") // for post
    {
        // check form validation
        if($('#customer_credit_card_number').val()=="" || $('#cc_expiration_year').val()=="" || $('#cc_cvv2_number').val()=="" || $('#customer_first_name').val()=="" )
        {
            alert("* "+post); // post contains alert message
            valid="false";
        }
        var formData = $("#frmAuth").serialize();
    //  alert(formData);
    }
    else if(view=="pro_settings_detail") // for post
    {
        // check form validation
        if($('#customer_credit_card_number').val()=="" || $('#cc_expiration_year').val()=="" || $('#cc_expiration_month').val()=="" || $('#cc_cvv2_number').val()=="" || $('#customer_first_name').val()=="" || $('#customer_last_name').val()=="" || $('#customer_address1').val()=="" || $('#customer_city').val()=="" || $('#customer_state').val()=="" || $('#customer_zip').val()=="" )
        {
            alert("* "+post); // post contains alert message
            valid="false";
        }
        var formData = $("#frmAuth").serialize();
       
    }
    else if(view=="credit_auth_setting") //for open credit card payment page for credit system  
    {
        var formData = $("#frm_auth").serialize();
    //alert(formData);
    }
    else if(view=="credit_auth_settings_detail") // for post
    {
        //alert('credit_auth_settings_detail');
        // check form validation
        if($('#customer_credit_card_number').val()=="" || $('#cc_expiration_year').val()=="" || $('#cc_cvv2_number').val()=="" || $('#customer_first_name').val()=="" || $('#customer_last_name').val()=="" || $('#customer_address1').val()=="" ||  $('#customer_state').val()=="" || $('#customer_zip').val()=="" )
        {
            alert("* "+post); // post contains alert message
            valid="false";
        }
        var formData = $("#frm_auth_detail").serialize();
    //alert(formData);
    }
    else if(view=="credit_pro_settings") //for open credit card payment page for credit system  
    {
        var formData = $("#frm_pro").serialize();
    //alert(formData);
    }
    else if(view=="credit_pro_settings_detail") // for post
    {
        //alert('credit_auth_settings_detail');
        // check form validation
        if($('#customer_credit_card_number').val()=="" || $('#cc_expiration_year').val()=="" || $('#cc_cvv2_number').val()=="" || $('#customer_first_name').val()=="" || $('#customer_last_name').val()=="" || $('#customer_address1').val()=="" ||  $('#customer_state').val()=="" || $('#customer_zip').val()=="" )
        {
            alert("* "+post); // post contains alert message
            valid="false";
        }
        var formData = $("#frm_pro_detail").serialize();
    // alert(formData);
    }
    else
    {
        var formData = {
            'user_id':userId,
            'pagetitle':view
        };
    }
    
    if(valid=="true")
    {
        siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/upgrade_header.php"; 
        $.ajax({
            type: "GET",
            url: siteUrl,
            cache: false,
            dataType: "text",
            data:formData,
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (data, status)
            {
                // alert('succ');
                $('#dsp_upgrade').empty();           
                $('#dsp_upgrade').append(data);
                if (navigator.userAgent.indexOf("Android") > 0){

                }
                      
            },
            timeout: 10000,
            error:  function (jqXHR, status,errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }  
               
        });
    }
     
}

//----------------- Photos-------------------------------
$(document).on('pagebeforeshow',"#dsp_media",function()
{
    callPhoto('media',0);
}      
);
$(document).on('pagebeforeshow',"#dsp_photo",function()
{
    view=localStorage.getItem("photoPage");
    callPhoto(view,0);
}      
);
function changePhotoPage(view)
{
    localStorage.setItem("photoPage",view);
    
    $.mobile.changePage("dsp_photo.html");
}


function callPhoto(view,post)
{
    // alert(view);
    var siteName = localStorage.getItem("siteName");
    var userId = localStorage.getItem("userId");
    localStorage.setItem("selectAlbumId",0);
    
    var valid="true";
    
    if(post=='post')
    {
        var formData =  $("#frmCreate").serialize();
    // alert(formData);
    }
    else
    {
        if(view=="delete") // to delete album 
        {
            var alertText = get_tranalation_by_code("DSP_CONFIRM_DELETE");
            alertText = alertText || 'Are you sure to delete this ?';
            if(confirm(alertText))
            {
                var formData = {
                    'user_id':userId,
                    'pagetitle':"album",
                    'Action':'Del',
                    'album_Id':post
                };
            }
            else
            {
                valid="false";
            }
            
        }
        else if(view=="deletePic") // to delete photo 
        {
            var alertText = get_tranalation_by_code("DSP_CONFIRM_DELETE");
            alertText = alertText || 'Are you sure to delete this ?';
            if(confirm(alertText))
            {
                var formData = {
                    'user_id':userId,
                    'pagetitle':"photo",
                    'Action':'Del',
                    'picture_Id':post
                }; // post hold picture id
            }
            else
            {
                valid="false";
            }
        
        }
        else if(view=="edit")
        {
            var formData = {
                'user_id':userId,
                'pagetitle':"album",
                'Action':'update',
                'album_Id':post
            };
        }
        else if(view=="manage_photos") 
        {
            // alert(post);
            var formData = {
                'user_id':userId,
                'pagetitle':view,
                "album_id":post
            };
        }
        else if(view=="page")// for photo page pagination // post will hold the value of page no
        {
            //alert(view);
            var formData = {
                'user_id':userId,
                'pagetitle':"photo",
                "page1":post
            };
        }
        else if(view=="deleteAlbumPic")
        {
            var alertText = get_tranalation_by_code("DSP_CONFIRM_DELETE");
            alertText = alertText || 'Are you sure to delete this ?';
            if(confirm(alertText))
            {
                var formData =  $("#"+post).serialize();
            }
            else
            {
                valid="false";
            }
        }
        else
        {
            var formData = {
                'user_id':userId,
                'pagetitle':view
            };
        }
      
    }
    
    if(valid=="true")
    {
    
        siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/media_header.php"; 
        $.ajax({
            type: "GET",
            url: siteUrl,
            cache: false,
            dataType: "text",
            data:formData,
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (data, status)
            {
                // alert('succ='+view);
              
                if(view=="media")
                {
                    $('#dsp_media').empty();           
                    $('#dsp_media').append(data);
                }
                else
                {
                
                    $('#dsp_photo').empty();           
                    $('#dsp_photo').append(data);
                }
            // alert('succ');
                  
              
            },
            timeout: 10000,
            error:  function (jqXHR, status,errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }  
       
        });
    }
}
//-------------------Photos ends-----------------------

//-------------------------Video Start -------------------

$(document).on('pagebeforeshow',"#dsp_video",function()
{
    callVideo("add_video",0);
}      
);

function callVideo(view,post)
{
    var siteName = localStorage.getItem("siteName");
    var userId = localStorage.getItem("userId");
    var valid="true";
    localStorage.setItem("videoPrivate",0);
    //alert(view);
    if(view=="page") // for pagination
    {
        var formData = {
            'user_id':userId,
            'pagetitle':"add_video",
            'page1':post
        };
    }
    else if(view=="Del")
    {
        var alertText = get_tranalation_by_code("DSP_CONFIRM_DELETE");
        alertText = alertText || 'Are you sure to delete this ?';
        if(confirm(alertText))
        {
            var formData = {
                'user_id':userId,
                'pagetitle':"add_video",
                "Action":"Del",
                "video_Id":post
            };
        }
        else
        {
            valid="false";
        }
            
       
    }
    else
    {
        var formData = {
            'user_id':userId,
            'pagetitle':view
        };
    }
    
   
    
    if(valid=="true")
    {
 
        siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/media_header.php"; 
        $.ajax({
            type: "GET",
            url: siteUrl,
            cache: false,
            dataType: "text",
            data:formData,
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (data, status)
            {
                $('#dsp_video').empty();           
                $('#dsp_video').append(data);
                 if (navigator.userAgent.indexOf("Android") > 0){
                    $('.AndroidPlayer').show();
                }else{
                     $('.iPhonePlayer').hide();
                }
            
            },
            timeout: 10000,
            error:  function (jqXHR, status,errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }  
    
        });
    }
}
//-------------------------Video Ends----------------------

//------------------------------Play Video Start---------------------
function playMyVideo(url)
{
    window.plugins.VideoPlayer.play(url);
// cordova.plugins.videoPlayer.play("http://path.to.my/video.mp4");
}
//------------------------------Play video ends---------------------

// ----------------Play audio---------------------------------
$(document).on('pagebeforeshow',"#dsp_sound",function()
{
    callAudio("add_audio",0);
}      
);

function callAudio(view,post)
{
    var siteName = localStorage.getItem("siteName");
    var userId = localStorage.getItem("userId");
    var valid="true";
    localStorage.setItem("audioPrivate",0);
    //alert(view);
    if(view=="page") // for pagination
    {
        var formData = {
            'user_id':userId,
            'pagetitle':"add_audio",
            'page1':post
        };
    }
    else if(view=="Del")
    {
        var alertText = get_tranalation_by_code("DSP_CONFIRM_DELETE");
        alertText = alertText || 'Are you sure to delete this ?';
        if(confirm(alertText))
        {
            var formData = {
                'user_id':userId,
                'pagetitle':"add_audio",
                "Action":"Del",
                "audio_Id":post
            };
        }
        else
        {
            valid="false";
        }
            
       
    }
    else
    {
        var formData = {
            'user_id':userId,
            'pagetitle':view
        };
    }
    
   
    
    if(valid=="true")
    {
 
        siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/media_header.php"; 
        $.ajax({
            type: "GET",
            url: siteUrl,
            cache: false,
            dataType: "text",
            data:formData,
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (data, status)
            {
                $('#dsp_sound').empty();           
                $('#dsp_sound').append(data);
            
            },
            timeout: 10000,
            error:  function (jqXHR, status,errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }  
    
        });
    }
}
//-------------------Play Audio Ends----------------------------
$(document).on('click', '#galleryImg', function() 
{
    var src= $(this).attr('show');
   
    //  alert('thiss=='+$('#iGallery').css('display'));
    $('#iGallery').css('display','none');
    // alert('nex=='+$('#iGallery').css('display'));
 

    $("#tadnavi").css('display','block');
  
    $("#displayImg").attr('src',src);
    $("#displayImg").css('display','block');
    $('#imageflipimg').css('text-align','center');
    $('#imageflipimg').css('display','block');
  
    $("#galleryPage").css('display','none'); // hide the all pic div
    
    $("li.start").removeClass("start"); // remove already added start class from li
    
    $(this).parent().addClass("start");
}); 


function nextPic()
{
   
    if ($("li.start").next().children("a").length) 
    {
        $("li.start").next().children("a").click();
    }
    else
    {
        $("a.one").click();
    }
     
}
function previousPic()
{
    if ($("li.start").prev().length) 
    {
        $("li.start").prev().children("a").click();
    }
    else
    {
        $("ul.gallery a").last().click();
    }
}
/* function to close picture gallery*/
$(document).on('click', '#tadclose', function()   
{
    $('#iGallery').css('display','block');
    
    $("#displayImg").css('display','none');
    $("#tadnavi").css('display','none');
    $('#imageflipimg').css('display','none');
    $("#galleryPage").css('display','block'); // show the all pic div
});
///-------------------End picture gallery-----------------------

$(document).on('pagebeforeshow',"#dsp_about",function()
{
    var siteName = localStorage.getItem("siteName");
    
        
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_about.php"; 
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            $('#dsp_about').empty();           
            $('#dsp_about').append(data);
        
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
    
    });
});

//-------------------------term page----------------------
 

$(document).on('pagebeforeshow',"#dsp_term",function()
{
    var siteName = localStorage.getItem("siteName");
            
                
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_terms.php"; 
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            $('#dsp_term').empty();           
            $('#dsp_term').append(data);
                
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
            
    });
});
//--------------end of term page---------------------------

function slide_me(id)
{
    $("#"+id).slideToggle("fast");
}
 
function ExtraLoad(view,post)
{
    var siteName = localStorage.getItem("siteName");
    var valid="true";
    // alert(view);
     
    if(post=="true")
    {
        var formData = $("#dsp_"+view).serialize();
    }
    else  // that means this is  for meet me and post contains action yes or no
    {
        if((post=="yes"))
        {
            var formData = $("#dsp_yes").serialize();
        }
        else
        {
            var formData = $("#dsp_no").serialize();
        }
    }
    // alert(formData);
     
    if(valid=="true")
    {
        siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/extras_header.php";
  
        $.ajax({
            type: "GET",
            url: siteUrl,
            cache: false,
            dataType: "text",
            data:formData,
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (data, status)
            {
                //alert('succ');
                $('#'+view).empty();           
                $('#'+view).append(data);
                 callSlider("Trending");
            },
            timeout: 10000,
            error:  function (jqXHR, status,errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }  
               
        });
    }
}
 
// delete own friends from view profile page
function deleteFriends(delFriendId,delText,profiveView)
{
    var memId=  localStorage.getItem("viewMemberId");
    var userId = localStorage.getItem("userId");
        
    // alert(memId+'  '+profiveView);
          
    var siteName = localStorage.getItem("siteName");

    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dspProfileMemFriends.php";
        
    if(delFriendId!=0)
    {
        var formData = {
            'user_id': userId,
            'member_id':memId,
            'Action':'Del',
            'friend_Id':delFriendId
        };
            
        if(confirm(delText))
        {
            $.ajax({
                type: "GET",
                url: siteUrl,
                cache: false,
                dataType: "text",
                data:formData,
                beforeSend: function() {
                    $.mobile.showPageLoadingMsg(true);
                },
                complete: function() {
                    $.mobile.hidePageLoadingMsg();
                },
                success: function (data, status)
                {
                    // alert('succ memid='+memId);
                    viewMemberProfile(memId,profiveView);
                },
                timeout: 10000,
                error:  function (jqXHR, status,errorThrown)
                {
                    var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                    alertText = alertText || 'Network error has occurred please try again!';
                     navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
                }  
                    
            });
        }
    }
}

function callSlider(id)
{
   
    var width= $("#swipe_ul"+id).children().length*85+16* $("#swipe_ul"+id).children().length;
    $("#swipe_ul"+id).css("width",width+"px");
    // alert(width);
    $("#main"+id).on("swipeleft",function()
    {
        // alert('left'+"#swipe_ul"+id);
        var width= $("#swipe_ul"+id).children().length*85+16* $("#swipe_ul"+id).children().length;
        var vall= $("#swipe_ul"+id).position().left;
        vall=vall-150;
        //  alert(vall);
        var total=width-150;
        if(Math.abs(vall)<total)
        {
            $("#swipe_ul"+id).animate({
                "left"  : vall
            }, 'slow');
            //$("#swipe_ul"+id).css("left",vall+"px");
        }
        else
        {
        // alert('End of image');
        }
    });
    
    $("#main"+id).on("swiperight",function()
    {
        // alert('right');
        var width= $("#swipe_ul"+id).children().length*85+16* $("#swipe_ul"+id).children().length;
        var left= $("#swipe_ul"+id).position().left;
               
        //  alert(left+' '+width);
        var total=width+150;
                                            
        if(left==-150)
        {
            vall=0;
        }
        else
        {
            vall=Math.abs(left)-150;
        }
        if(Math.abs(left)!=0)
        {
            $("#swipe_ul"+id).animate({
                "left"  : -vall
            }, 'slow');
            //$("#swipe_ul"+id).css("left",-vall+"px");
        }
        else
        {
        // alert('no move');
        }
    });
}

function viewBlog(blog_id)
{
    var memId=  localStorage.getItem("viewMemberId");
    var userId = localStorage.getItem("userId");
          
    var siteName = localStorage.getItem("siteName");

    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dspBlogDetail.php";
        
    // alert('blogid==='+blog_id);
    var formData = {
        'user_id': userId,
        'member_id':memId,
        'blog_id':blog_id
    };
         
            
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            // alert('blog==='+data);
            $('#BlogDetail').css('display','block');
            $('#bDetail').append(data);
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
                    
    });
                         
}

// for the close button ig blog detail page
function closeBlog()
{
    $('#bDetail').empty();
    $('#BlogDetail').css('display','none');
    
}

function getProfilePic(view)
{
    alert('loadpic');
    var siteName = localStorage.getItem("siteName");
    var user_id = localStorage.getItem("userId");
    
    siteUrl=  siteName+"/wp-content/plugins/dsp_dating/m1/dspGetProfilePic.php";
    formData={
        'user_id':user_id
    };
    // if ($('#profilePicture').length > 0) // check if chat div exist
    // {
    //     alert('ext');
    // }
    // else
    // {
    //     alert('not ext');
    // }
    
    if(view=="myProfile")
    {
        // alert('prof');
        $.ajax({
            type: "GET",
            url: siteUrl,
            cache: false,
            dataType: "text",
            data:formData,
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (data, status)
            {
                //alert('succ'+data);
                $('#profilePicture').empty();  
                $('#profilePicture').append(data);
            },
            timeout: 10000,
            error:  function (jqXHR, status,errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }  
        
        });
    // alert(siteName+"/wp-content/plugins/dsp_dating/m1/dspGetProfilePic.php?user_id="+userId);
    // $("#profilePicture").load(siteName+"/wp-content/plugins/dsp_dating/m1/dspGetProfilePic.php?user_id="+userId);
    }
  
}

function gateWayDisable(msg)
{
    alert(msg);
}
 
function change_credit(val)
{
    var per_credit=$("#price_per_credit").val();
    $(".no_of_credit_to_purchase").each(function() 
    {
        $(this).val(val);
    });
    if($.trim(val)!="")
    {

        var new_price=val*per_credit;
        $(".credit_price_change").each(function() {
            $(this).html('$'+new_price);
        });
        $(".credit_amount").each(function() {
            $(this).val(new_price);
        });
    }
    else
    {
        $(".credit_price_change").each(function() {
            $(this).html('$'+per_credit);
        });
        $(".credit_amount").each(function() {
            $(this).val(per_credit);
        });
    }
}

/*-------------------------  MEMBERSHIP PAGE----------------------------*/
$(document).on('pagebeforeshow', '#dsp_membership', function()
{
    var userId = localStorage.getItem("userId");
    
    var siteName = localStorage.getItem("siteName");

    var formData = {
        'user_id':userId
    };
            
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_membership.php"; 
    
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            //alert('succ');
            $('#dsp_membership').empty();           
            $('#dsp_membership').append(data);
            if (navigator.userAgent.indexOf("Android") > 0){

            }
        },
        timeout: 10000,
        error:  function (jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
              
    });
});

function openUpgrade()
{
    $.mobile.changePage("dsp_upgrade.html");
}



$(document).on('pagebeforeshow', '#dsp_alert', function()
{
    showAlertPage('alert',0,0);
});

function showAlertPage(view,post,frnd_request_Id)
{
    var userId = localStorage.getItem("userId");
    var siteName = localStorage.getItem("siteName");
    
    if(post!=0)
    {
        var formData = {
            'user_id':userId,
            'pagetitle':view,
            'Action':post,
            'frnd_request_Id':frnd_request_Id
        };
    }
    else
    {
        var formData = {
            'user_id':userId,
            'pagetitle':view
        };
    }
   
      
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_header.php";
      
    //alert(siteUrl);
      
    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            if(post==0)
            {
                dataT = $.trim(data);
                $('#dsp_alert').empty();
                $('#dsp_alert').append(dataT);
                callSlider('Winks'); // for winks slider
                callSlider('Gift'); // for virtual Gift
                callSlider('Comment'); // for Comment 
                callSlider('FriendReq'); // for FriendRequest 
                                   

            }
            else
            {
                showAlertPage('alert',0,0);
            }
        },
        timeout: 10000,
        error: function(jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
          
    });
}
function displayComment(comments_id)
{
    var siteName = localStorage.getItem("siteName");
    var formData = {
        'comments_id':comments_id,
        'view':'viewComments',
        'pagetitle':'alert'
    };
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_header.php";

    //alert(siteUrl);

    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            $("#showComment").css('display','block');
            dataT = $.trim(data);
            $('#cDetail').empty();
            $('#cDetail').append(dataT);
        },
        timeout: 10000,
        error: function(jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
   
    });
}

function updateComment(comment_id,post,msg)
{
    var siteName = localStorage.getItem("siteName");
    var valid="true";
    
    if(post=="Del")
    {
        if(confirm(msg))
        {
            var formData = {
                'comments_id':comment_id,
                'pagetitle':'alert',
                'view':'comments',
                'Action':post
            };
        }
        else
        {
            valid="false";
        }
    }
    else
    {
        var formData = {
            'comments_id':comment_id,
            'pagetitle':'alert',
            'view':'comments',
            'Action':post
        };
    }
 
    if(valid=="true")
    {
        siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_header.php";
        $.ajax({
            type: "GET",
            url: siteUrl,
            cache: false,
            dataType: "text",
            data:formData,
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (data, status)
            {
                showAlertPage('alert',0,0);
            },
            timeout: 10000,
            error: function(jqXHR, status, errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }  
                
        });
    }
}

//--------------display gift-----------------------

function displayGift(gift_Id)
{
    var siteName = localStorage.getItem("siteName");
    var formData = {
        'gift_Id':gift_Id,
        'view':'viewGift',
        'pagetitle':'alert'
    };
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_header.php";

    //alert(siteUrl);

    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            $("#showGift").css('display','block');
            dataT = $.trim(data);
            $('#gDetail').empty();
            $('#gDetail').append(dataT);
        },
        timeout: 10000,
        error: function(jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
   
    });
}

function updateGift(gift_Id,post,msg)
{
    var siteName = localStorage.getItem("siteName");
    var valid="true";
    
    if(post=="Del")
    {
        if(confirm(msg))
        {
            var formData = {
                'gift_Id':gift_Id,
                'pagetitle':'alert',
                'view':'virtual_gifts',
                'Action':post
            };
        }
        else
        {
            valid="false";
        }
    }
    else
    {
        var formData = {
            'gift_Id':gift_Id,
            'pagetitle':'alert',
            'view':'virtual_gifts',
            'Action':post
        };
    }
 
    if(valid=="true")
    {
        siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_header.php";
        $.ajax({
            type: "GET",
            url: siteUrl,
            cache: false,
            dataType: "text",
            data:formData,
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (data, status)
            {
                showAlertPage('alert',0,0);
            },
            timeout: 10000,
            error: function(jqXHR, status,errorThrown)
            {
                var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }  
                
        });
    }
}

//--------------display wink-----------------------

function displayWink(wink_id)
{
    var siteName = localStorage.getItem("siteName");
    var formData = {
        'wink_id':wink_id,
        'view':'viewWink',
        'pagetitle':'alert'
    };
    siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_header.php";

    $.ajax({
        type: "GET",
        url: siteUrl,
        cache: false,
        dataType: "text",
        data:formData,
        beforeSend: function() {
            $.mobile.showPageLoadingMsg(true);
        },
        complete: function() {
            $.mobile.hidePageLoadingMsg();
        },
        success: function (data, status)
        {
            $("#showWink").css('display','block');
            dataT = $.trim(data);
            $('#wDetail').empty();
            $('#wDetail').append(dataT);
           
        },
        timeout: 10000,
        error: function(jqXHR, status,errorThrown)
        {
            var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
            alertText = alertText || 'Network error has occurred please try again!';
             navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
        }  
   
    });
}

function updateWink(wink_id,msg)
{
    var siteName = localStorage.getItem("siteName");
    var valid="true";
    
    
    if(confirm(msg))
    {
        var formData = {
            'wink_id':wink_id,
            'pagetitle':'alert',
            'view':'view_winks',
            'Action':"Del"
        };
    }
    else
    {
        valid="false";
    }
      
 
    if(valid=="true")
    {
        siteUrl=siteName+"/wp-content/plugins/dsp_dating/m1/dsp_header.php";
        $.ajax({
            type: "GET",
            url: siteUrl,
            cache: false,
            dataType: "text",
            data:formData,
            beforeSend: function() {
                $.mobile.showPageLoadingMsg(true);
            },
            complete: function() {
                $.mobile.hidePageLoadingMsg();
            },
            success: function (data, status)
            {
                showAlertPage('alert',0,0);
                callSlider('Winks'); // for winks slider
            },
            timeout: 10000,
            error: function(jqXHR, status,errorThrown)
            {
                   var alertText = get_tranalation_by_code("DSP_NETWORK_PROBLEM");
                alertText = alertText || 'Network error has occurred please try again!';
                 navigator.notification.alert(
            alertText,
            null,
            null,
            'ok'
        );
            }  
                
        });
    }
}


/* this function will use to cloase the open div*/
function closeDiv(id,divid)
{
    $('#'+divid).empty();
    $('#'+id).css('display','none');
}
function showmenu(){
    if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
     $( "#left-panel" ).panel().panel("open");
 }else{
    $( "#left-panel" ).panel().panel("close");
 }
}
 