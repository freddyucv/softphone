function ContactView(){

  this.newContact = function(){
      $("[softphone] .numbers_panel").hide();
      var contactPanel = $("[softphone] .panel");
      contactPanel.show();
      contactPanel.children().remove();

      contactPanel.append(
                          '<div class="dialog_panel panel_login">' +
                            '<h1>Agregar Contacto</h1>' +
                          '<div class="row panel_color" style="postion:relative">' +
                              '<input id="contact_name" type="text" placeholder="Name"/>' +
                          '</div>' +
                          '<div class="row panel_color">' +
                            '<input id="contact_number" type="text" placeholder="Number" onKeyUp="validator.isNumber(this)"/>' +
                          '</div>' +
                          '<div class="button" onclick="contact.newContact()">' +
                            '<img src="img/ok_button.png"/>' +
                          '</div>' +
                          '</div>'

                        );

      callView.cleanMessage();
      $("[softphone] .search_panel input[type='text']").val("");

  }
}

var contactView = new ContactView();

function Contact(){
    this.newContact = function(){

      if (window.localStorage.contacts){
        contacts =  JSON.parse(window.localStorage.contacts);
      }else{
        contacts =  [];
      }

      var contact = {
        name: $("#contact_name").val(),
        number: $("#contact_number").val()
      };
      contacts.push(contact);
      window.localStorage.contacts = JSON.stringify(contacts);
      callView.showNumbersPanel();
      callView.showMessage("Contact successfully added");
    }
}

var contact = new Contact();
