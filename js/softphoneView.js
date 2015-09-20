var buttons = [];
buttons["calling"] = {
                      query: ".call_button",
                      img: "img/call_button.png",
                      img: "img/call_button.png"
                    };

buttons["hang_up"] = {
                        query: ".hang_up_button",
                        img: "img/hang_up_button.png"
                      };

buttons["ok"] =  {
                    query: ".ok_button",
                    img: "img/ok_button.png",
                    disabledImg: "img/ok_button_disabled.png"
                  };

buttons["view_contacts"] = {
                              query: ".search_contact_button",
                              img: "img/view_contacts.png",
                              disabledImg: "img/view_contacts.png"
                            };

buttons["new_contact"] =  {
                            query: ".new_contact_button",
                            img: "img/new_contact.png",
                          };

buttons["back_button"] =  {
                            query: ".back_contact_button",
                            img: "img/back_button.png",
                            disabledImg: "img/back_button_disabled.png"
                          };

buttons["ok_login_button"] =  {
                    query: ".ok_login_button"
                  };


function CallView(){

  this.panels = {
    NUMBER_PANEL: 'NUMBER_PANEL',
    SHOW_CONTACTS: 'SHOW_CONTACTS',
    NEW_CONTACT: 'NEW_CONTACT',
    SHOW_CONTACTS: 'SHOW_CONTACTS',
    EDIT_CONTACT: "EDIT_CONTACT",
    SETTING: "SETTING"
  };

  this.status = [this.panels.NUMBER_PANEL];

  this.typeNumber = function (number){
    var numberTyped = $("[softphone] .search_panel input[type='text']").val();
    $("[softphone] .search_panel input[type='text']").val(numberTyped + number);
    this.enabledButton("calling");
    this.cleanMessage();
  }

  this.deleteNumber = function(){
    var number = $("[softphone] .search_panel input[type='text']").val();
    number = number.substring(0, number.length - 1);
    $("[softphone] .search_panel input[type='text']").val(number);

    var numberTyped = $("[softphone] .search_panel input[type='text']").val();

    if (!numberTyped) {
      this.disenabledButton("calling");
    }
  }

  this.deleteAllNumber = function(){
    $("[softphone] .search_panel input[type='text']").val("");
  }

  this.showNumbersPanel = function(){
    $("[softphone] .call_panel").show();
    $("[softphone] .panel").hide();
    $("[softphone] #phoneNumber").val("");
    this.connected = false;
    this.calling = false;

    this.status = [];
    this.status.push(this.panels.NUMBER_PANEL);

    callView.disenabledButton("back_button");

    $(".buttons_bar .head .title_1").html("Call");
    $(".buttons_bar .head .title_2").html("Number");
  }

  this.loadNumbers = function(){

    var numberPanel = $("[softphone] .numbers_panel");
    $("[softphone]  .message").html("");
    $("[softphone] .search_panel input[type='text']").val("");
    numberPanel.children().remove();
    $("[softphone] .panel").hide();

    this.loadNumbersInPanel(numberPanel);

    $("[softphone] .main_panel").css('background-image', '');
    $("[softphone] .main_panel").css('background-color', 'white');
    $("[softphone] .main_panel").children('.panel_login').remove();

    $("[softphone] .call_panel").show();
    $("[softphone] .buttons_bar").show();
    $("[softphone] .panel").hide();
    $("[softphone] .c_panel").hide();

    $(".buttons_bar .head .title_1").html("Call");
    $(".buttons_bar .head .title_2").html("Number");
    callView.makeResponsive();
  }

  this.loadNumbersInPanel = function(numberPanel){
    for (var i = 1; i < 10; i++){
      numberPanel.append(
                          '<div onclick="callView.typeNumber(' + i + ')">' +
                            '<label>' + i + '</label>' +
                            /*'<img src="img/shadow.png"/>' +*/
                          '</div>'
                        );
    }

    numberPanel.append(
                        '<div onclick="callView.typeNumber(' + "*" + ')">' +
                          '<label>*</label>' +
                        '</div>'
                      );

    numberPanel.append(
                        '<div onclick="callView.typeNumber(0)">' +
                          '<label>0</label>' +
                          /*'<img src="img/shadow.png"/>' +*/
                        '</div>'
                      );

    numberPanel.append(
                        '<div onclick="callView.typeNumber(' + "#" + ')">' +
                          '<label>#</label>' +
                        '</div>'
                      );
  }

  this.enabledButton = function(name){
    var query = buttons[name].query;
    var img = buttons[name].img;

    $("[softphone]").find(query).removeAttr('disabled');

    if (img){
      $("[softphone]").find(query).attr('src', img);
    }

    if (name == 'back_button'){
      $("[softphone] .back").show();
    }
  }

  this.disenabledButton = function(name){
    var query = buttons[name].query;
    var img = buttons[name].disabledImg;

    $("[softphone]").find(query).attr('disabled', 'disabled');

    if (img){
      $("[softphone]").find(query).attr('src', img);
    }

    if (name == 'back_button'){
      $("[softphone] .back").hide();
    }
  }

  this.changeCallingButtonState = function(){
    var numberTyped = $("[softphone] .search_panel input[type='text']").val();

    if (numberTyped) {
      callView.enabledButton("calling");
    }else{
      callView.disenabledButton("calling");
    }
  }

  this.loadLoginPanel = function(){

    var mainPanel = $("[softphone] .main_panel");

    mainPanel.append(
                        '<div class="dialog_panel panel_login">' +
                            '<div class="row panel_color" style="postion:relative">' +
                                '<input id="login" type="text" placeholder="Your e-mail Address" onKeyUp="contactView.activeOkLoginButton()"/>' +
                            '</div>' +
                            '<div class="row panel_color">' +
                              '<input id="password" type="password" placeholder="Password" onKeyUp="contactView.activeOkLoginButton()"/>' +
                            '</div>' +
                            '<input type="button" class="ok_login_button" onclick="call.login()" value="Start calling!"/>' +
                            '<div class="message_login"></div>' +
                            '<div class="waiting_panel">' +
                              '<div id="circularG">' +
                                	'<div id="circularG_1" class="circularG"></div>' +
                                  '<div id="circularG_2" class="circularG"></div>' +
                                  '<div id="circularG_3" class="circularG"></div>' +
                                  '<div id="circularG_4" class="circularG"></div>' +
                                  '<div id="circularG_5" class="circularG"></div>' +
                                  '<div id="circularG_6" class="circularG"></div>' +
                                  '<div id="circularG_7" class="circularG"></div>' +
                                  '<div id="circularG_8" class="circularG"></div>' +
                              '</div>' +
                              '<div class="waiting_label">Waiting...</div>' +
                            '</div>' +
                        '</div>'
                      );

    callView.disenabledButton("ok_login_button");

    $("[softphone] .call_panel").hide();
    $("[softphone] .panel").hide();
    $("[softphone] .main_panel").css('background-image', 'url(../img/blue_background.jpg)');
    $("[softphone] .buttons_bar").hide();

  }

  /*this.showWaiting = function(q){
    $(q).append("<p class='waiting'>Espere...</p>");
  }

  this.sstopWaiting = function(q){
    $(q).children(".waiting").remove();
  }*/

  this.showErrorMessage = function(message){
    this.showNumbersPanel();
    $(".message").removeClass("success");
    $(".message").addClass("error");
    $(".message").html(message);
    $(".message").show();
    $("[softphone] .panel").hide();
  }

  this.showErrorLoginMessage = function(message){
    $(".message_login").removeClass("success");
    $(".message_login").addClass("error");
    $(".message_login").html(message);
  }

  this.showMessage = function(message){
    $(".message").addClass("success");
    $(".message").removeClass("error");
    $(".message").html(message);
    $(".message").show();
  }

  this.cleanMessage = function(message){
    $(".message").removeClass("error");
    $(".message").removeClass("success");
    $(".message").html("");
  }

  this.showCallingPanel = function(){
    console.log("showCallingPanel");
    $("[softphone] .call_panel").hide();
    $("[softphone] .buttons_bar").hide();

    var loginPanel = $("[softphone] .c_panel");
    loginPanel.show();
    loginPanel.children().remove();

    var phoneNumber = $("#phoneNumber").val();

    loginPanel.append(
                        "<div class='calling_panel'>" +
                        "<span class='phone_number'>" + phoneNumber + "</span>" +
                        "<div class='calling_image'>" +
                          "<img style='width:100%' src='img/panel_calling.png'/>" +
                          "<div style='margin-top:2%;text-align:center'>00:00</div>" +
                        "</div>" +
                        "<div class='keypad' onclick='callView.showKeypad()'>Keypad</div>" +
                        "<div class='numbers_panel'></div>" +
                        "<input type='image' src='img/hang_up_button.png' onclick='call.sipHangUp()'>" +
                        "</div>"
                      );

    this.callLast = 0;
  }

  this.showKeypad = function(){

      var numberPanel = $("[softphone] .calling_panel .numbers_panel");

      if(numberPanel.is(":visible")){
        numberPanel.hide();
      }else{
        numberPanel.children().remove();
        this.loadNumbersInPanel(numberPanel);
        numberPanel.show();

        numberPanel.children("div").each(function() {
          $(this).click(function(){
            call.dtmf($(this).children("label").text());
          });
        });

        var width = $("[softphone]").width();
        $("[softphone]").height(width * 2);
        if (width < 150){
          $("[softphone] .calling_panel .numbers_panel div label").css('font-size', '70%');
        }else if (width < 200){
          $("[softphone] .calling_panel .numbers_panel div label").css('font-size', '100%');
        }

      }
  }

  this.startCallingTime = function (){
    this.callLast = 0;
    this.callLastTimeout = setInterval(this.callLastShow.bind(this), 1000);
  }

  this.callLastShow = function (){
    this.callLast++;

    var seconds = parseInt(this.callLast % 60);
    var minutes = parseInt(this.callLast / 60);

    if (seconds < 10){
        seconds = "0" + seconds;
    }

    if (minutes < 10){
      minutes = "0" + minutes;
    }

    $("[softphone] .c_panel .calling_panel .calling_image div").html(minutes + ":" + seconds);
  }

  this.goBack = function(){

    var back = this.status[this.status.length-2];
    this.status = this.status.slice(0, this.status.length-2);

    if (back == this.panels.NUMBER_PANEL){
      callView.showNumbersPanel();
    }else if (back == this.panels.SHOW_CONTACTS){
      contactView.showContacts();
    }else if (back == this.panels.NEW_CONTACT){
      contactView.newContact();
    }else if (back == this.panels.SETTING){
      callView.showSetting();
    }

  }

  this.showLoginWaiting = function(){
    $(".waiting_panel").show();
  }

  this.hideLoginWaiting = function(){
    $(".waiting_panel").hide();
  }

  this.makeResponsive = function(){
    var width = $("[softphone]").width();
    $("[softphone]").height(width * 2);

    if (width < 150){
      $("[softphone] .search_panel input[type='text']").css('font-size', '50%');
      $("[softphone] .numbers_panel div").css('height', '20%');
      $("[softphone] .numbers_panel div label").css('font-size', '70%');
      $("[softphone] .buttons_bar .buttons input[type='image']").height(15);
      $("[softphone] .buttons_bar").css('height', 'auto');
      $("[softphone] .buttons_bar").css('display', 'block');
    }else if (width < 200){
      $("[softphone] .search_panel input[type='text']").css('font-size', '60%');
      $("[softphone] .numbers_panel div label").css('font-size', '200%');

      $("[softphone] input[type='text'], [softphone] input[type='password']").css('font-size', '60%');
      $("[softphone] .ok_login_button").css('font-size', '60%');
      $("[softphone] .buttons_bar .head span").css('font-size', '60%');
      $("[softphone] .panel").css('border-width', '0');
      $("[softphone]").find(".contacts_fix_container").css('overflow', 'scroll');

    }
  }

  this.showSetting = function(){
    callView.status.push(callView.panels.SETTING);

    $("[softphone] .call_panel").hide();

    $(".buttons_bar .head .title_1").html("Setting");
    $(".buttons_bar .head .title_2").html("Options");

    var panel = $("[softphone] .panel");
    panel.children().remove();
    callView.cleanMessage();
    panel.show();
    callView.enabledButton("back_button");

    var checked = googleContacts.isUsingGoogleContact() ? 'checked' : '';

    panel.append(
      "<div class='dialog_panel contact_panel'>" +
        "<div class='row panel_color'>"  +
          "<input type='checkbox' id='google_contact_check' " + checked + "/>" +
          "<label style='font-size:12px'>Use google contact</label>" +
        "</div>" +
        '<input type="image" class="ok_button" src="img/ok_button.png" onclick="contact.changeGoogleContactOption()"/>' +
      "</div>"

    );
  }
}

var callView = new CallView();

(
  function(){
    var cw = $('[softphone] .numbers_panel span').width();
    $('[softphone] .numbers_panel span').css({'height':cw+'px'});

    callView.disenabledButton("calling");
    callView.disenabledButton("hang_up");

    $("[softphone] .search_panel input[type='text']").on('keyup',
        callView.changeCallingButtonState);

    $("[softphone]  .calling_panel").hide();

    $("[softphone] .back").hide();

    callView.disenabledButton("back_button");

    call.checkLogin();
    callView.hideLoginWaiting();
    callView.makeResponsive();
  }()
)
