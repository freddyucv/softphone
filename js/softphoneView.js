var buttons = [];
buttons["calling"] = {
                      query: ".call_button",
                      img: "img/call_button.png",
                      disabledImg: "img/call_button_disabled.png"
                    };

buttons["hang_up"] = {
                        query: ".hang_up_button",
                        img: "img/hang_up_button.png",
                        disabledImg: "img/hang_up_button_disabled.png"
                      };

buttons["ok"] =  {
                    query: ".ok_button",
                    img: "img/ok_button.png",
                    disabledImg: "img/ok_button_disabled.png"
                  };

buttons["view_contacts"] = {
                              query: ".search_contact_button",
                              img: "img/view_contacts.png",
                              disabledImg: "img/view_contacts_disabled.png"
                            };

buttons["new_contact"] =  {
                            query: ".new_contact_button",
                            img: "img/new_contact.png",
                            disabledImg: "img/new_contact_disabled.png"
                          };

buttons["back_button"] =  {
                            query: ".back_contact_button",
                            img: "img/back_button.png",
                            disabledImg: "img/back_button_disabled.png"
                          };

function CallView(){

  this.panels = {
    NUMBER_PANEL: 'NUMBER_PANEL',
    SHOW_CONTACTS: 'SHOW_CONTACTS',
    NEW_CONTACT: 'NEW_CONTACT',
    SHOW_CONTACTS: 'SHOW_CONTACTS',
    EDIT_CONTACT: "EDIT_CONTACT"
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
    $("[softphone] .numbers_panel").show();
    $("[softphone] .panel").hide();
    $("[softphone] #phoneNumber").val("");
    this.connected = false;
    this.calling = false;

    this.status = [];
    this.status.push(this.panels.NUMBER_PANEL);

    callView.disenabledButton("back_button");
  }

  this.loadNumbers = function(){

    var numberPanel = $("[softphone] .numbers_panel");
    numberPanel.children().remove();
    $("[softphone] .panel").hide();

    for (var i = 1; i < 10; i++){
      numberPanel.append(
                          '<span onclick="callView.typeNumber(' + i + ')">' +
                            '<label>' + i + '</label>' +
                            '<img src="img/shadow.png"/>' +
                          '</span>'
                        );
    }

    numberPanel.append(
                        '<span onclick="callView.deleteNumber()">' +
                          '<img src="img/arrow_left_inv.png"/>' +
                        '</span>'
                      );

    numberPanel.append(
                        '<span onclick="callView.typeNumber(0)">' +
                          '<label>0</label>' +
                          '<img src="img/shadow.png"/>' +
                        '</span>'
                      );

    numberPanel.append(
                        '<span onclick="callView.deleteAllNumber(0)">' +
                          '<label>__</label>' +
                        '</span>'
                      );

  }

  this.enabledButton = function(name){
    var query = buttons[name].query;
    var img = buttons[name].img;

    $("[softphone]").find(query).removeAttr('disabled');
    $("[softphone]").find(query).attr('src', img);
  }

  this.disenabledButton = function(name){
    var query = buttons[name].query;
    var img = buttons[name].disabledImg;

    $("[softphone]").find(query).attr('disabled', 'disabled');
    $("[softphone]").find(query).attr('src', img);
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
    $("[softphone] .numbers_panel").hide();
    var loginPanel = $("[softphone] .panel");
    loginPanel.show();
    loginPanel.children().remove();

    loginPanel.append(
                        '<div class="dialog_panel panel_login">' +
                          '<h1>Debe Logearse antes de usar el servicio:</h1>' +
                        '<div class="row panel_color" style="postion:relative">' +
                            '<input id="login" type="text" placeholder="Login"/>' +
                        '</div>' +
                        '<div class="row panel_color">' +
                          '<input id="password" type="password" placeholder="Password"/>' +
                        '</div>' +
                        '<div  class="button" >' +
                          '<input type="image" class="ok_button src="img/ok_button.png" onclick="call.login()"/>' +
                        '</div>' +
                        '</div>'

                      );

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
    $("[softphone] .numbers_panel").hide();
    var loginPanel = $("[softphone] .panel");
    loginPanel.show();
    loginPanel.children().remove();

    loginPanel.append(
                        "<img src='img/calling_panel.png' style='width:100%;height:100%'/>"
                      );
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
    }

  }
}

var callView = new CallView();

(

  function(){
    callView.loadNumbers();

    var cw = $('[softphone] .numbers_panel span').width();
    $('[softphone] .numbers_panel span').css({'height':cw+'px'});

    callView.disenabledButton("calling");
    callView.disenabledButton("hang_up");

    $("[softphone] .search_panel input[type='text']").on('keyup',
        callView.changeCallingButtonState);

    $("[softphone] .panel").hide();


  }()
)
