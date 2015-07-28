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

  this.showContacts = function(){
    $("[softphone] .numbers_panel").hide();
    var contactPanel = $("[softphone] .panel");
    contactPanel.children().remove();
    callView.cleanMessage();
    contactPanel.show();

    var contacts =  JSON.parse(window.localStorage.contacts);
    contactPanel.append("<div class='contacts_fix_container'></div>");
    contactPanel.children(".contacts_fix_container")
      .append("<div class='contacts_container'></div>");

    var contactsContainer = contactPanel.find(".contacts_fix_container .contacts_container");

    if (contacts.length > 0){
      for (var i = 0; i < contacts.length; i++){
        contactsContainer.append(
          "<div class='contact_row'>" +
            "<div class='contact_field'>" +
              "<img src='img/hombre.png'>" +
              "<span>" + contacts[i].name + "</span>" +
            "</div>" +

            "<div class='contact_field'>" +
              "<img src='img/telefono.png'/>" +
              "<span>" + contacts[i].number + "</span>" +
            "</div>" +

          "</div>"
        );

      }
    }else{
      softphoneView.showErrorMessage("No contacts to show");
    }
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
