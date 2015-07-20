function CallView(){
  this.typeNumber = function (number){
    var numberTyped = $("[softphone] .search_panel input[type='text']").val();
    $("[softphone] .search_panel input[type='text']").val(numberTyped + number);
    this.enabledCallingButton();
  }

  this.deleteNumber = function(){
    var number = $("[softphone] .search_panel input[type='text']").val();
    number = number.substring(0, number.length - 1);
    $("[softphone] .search_panel input[type='text']").val(number);

    var numberTyped = $("[softphone] .search_panel input[type='text']").val();

    if (!numberTyped) {
      this.disenabledCallingButton();
    }
  }

  this.loadNumbers = function(){
    var numberPanel = $("[softphone] .numbers_panel");
    numberPanel.children().remove();

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
                          '<img src="img/shadow.png"/>' +
                        '</span>'
                      );

    numberPanel.append(
                        '<span onclick="callView.typeNumber(0)">' +
                          '<label>0</label>' +
                          '<img src="img/shadow.png"/>' +
                        '</span>'
                      );

    numberPanel.append(
                        '<span>' +
                          '<label>#</label>' +
                          '<img src="img/shadow.png"/>' +
                        '</span>'
                      );

  }

  this.enabledCallingButton = function(){

    $("[softphone] .call_button").attr('disabled', false);
    $("[softphone] .call_button img").attr('src', "img/call_button.png");

  }

  this.disenabledCallingButton = function(){

    $("[softphone] .call_button").attr('disabled', true);
    $("[softphone] .call_button img").attr('src', "img/call_button_disabled.png");

  }

  this.changeCallingButtonState = function(){
    var numberTyped = $("[softphone] .search_panel input[type='text']").val();

    if (numberTyped) {
      this.enabledCallingButton();
    }else{
      callView.disenabledCallingButton();
    }
  }

  this.loadLoginPanel = function(){
    var numberPanel = $("[softphone] .numbers_panel");
    var query = ".panel_login .message";
    numberPanel.children().remove();
    numberPanel.append(
                        '<div class="panel panel_login">' +
                          '<h1>Debe Logearse antes de usar el servicio:</h1>' +
                        '<div class="row" style="postion:relative">' +
                            '<input id="login" type="text" placeholder="Login"/>' +
                        '</div>' +
                        '<div class="row">' +
                          '<input id="password" type="password" placeholder="Password"/>' +
                        '</div>' +
                        '<div class="button" onclick="call.login(' + "'" +  query + "'" + ')">' +
                          '<img src="img/ok_button.png"/>' +
                        '</div>' +
                        '<div class="message">' +
                        '</div>' +
                        '</div>'

                      );

  }

  /*this.showWaiting = function(q){
    $(q).append("<p class='waiting'>Espere...</p>");
  }

  this.sstopWaiting = function(q){
    $(q).children(".waiting").remove();
  }

  this.showError = function(message){
    $(q).addCss("error");
    $(q).html(message);
  }*/
}

var callView = new CallView();

(

  function(){
    callView.loadNumbers();

    var cw = $('[softphone] .numbers_panel span').width();
    $('[softphone] .numbers_panel span').css({'height':cw+'px'});

    $("[softphone] .call_button").attr('disabled', true);
    $("[softphone] .hang_up_button").attr('disabled', true);

    $("[softphone] .search_panel input[type='text']").on('keyup',
        callView.changeCallingButtonState);
  }()
)
