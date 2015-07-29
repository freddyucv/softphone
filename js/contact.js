function ContactView(){

  this.newContact = function(){
      $("[softphone] .numbers_panel").hide();
      var contactPanel = $("[softphone] .panel");
      contactPanel.show();
      contactPanel.children().remove();

      this.getContactPanelContent();

      callView.cleanMessage();
      $("[softphone] .search_panel input[type='text']").val("");
  }

  this.editContact = function(index){
      $("[softphone] .numbers_panel").hide();
      var contactPanel = $("[softphone] .panel");
      contactPanel.show();
      contactPanel.children().remove();

      this.getContactPanelContent();

      var contacts =  JSON.parse(window.localStorage.contacts);
      $("[softphone] .panel").find("#contact_name").val(contacts[index].name);
      $("[softphone] .panel").find("#contact_number").val(contacts[index].number);
      $("[softphone] .panel").find("#contact_id").val(index);

      callView.cleanMessage();
      $("[softphone] .search_panel input[type='text']").val("");
  }

  this.getContactPanelContent = function(index){
    var contactPanel = $("[softphone] .panel");
    contactPanel.append('<div class="dialog_panel panel_login">' +
                          '<h1>Agregar Contacto</h1>' +
                          '<input type="hidden" id="contact_id" value="-1">' +
                        '<div class="row panel_color" style="postion:relative">' +
                            '<input id="contact_name" type="text" placeholder="Name"/>' +
                        '</div>' +
                        '<div class="row panel_color">' +
                          '<input id="contact_number" type="text" placeholder="Number" onKeyUp="validator.isNumber(this)"/>' +
                        '</div>' +
                        '<div class="button" onclick="contact.saveContact()">' +
                          '<img src="img/ok_button.png"/>' +
                        '</div>' +
                      '</div>');
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

            "<img class='edit_contact' src='img/edit.png' onclick='contactView.editContact(" + i + ")'></img>" +
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

    this.updateContact = function(){

      var contacts =  JSON.parse(window.localStorage.contacts);
      var id = $("#contact_id").val();

      contacts[id].name = $("#contact_name").val();
      contacts[id].number = $("#contact_number").val();

      window.localStorage.contacts = JSON.stringify(contacts);
      callView.showNumbersPanel();
      callView.showMessage("Contact successfully added");
    }

    this.saveContact = function(){
        var contactId = $("#contact_id");

        if (contactId == -1){
          this.newContact();
        }else{
          this.updateContact();
        }
    }
}

var contact = new Contact();
