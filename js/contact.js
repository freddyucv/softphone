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
      contactsContainer.append(this.getContactsToShow(contacts, true, false));
    }else{
      callView.showErrorMessage("No contacts to show");
    }
  }

  this.getContactsToShow = function(contacts, showEditButtons, showCallButton){
    var result = "";

    for (var i = 0; i < contacts.length; i++){
        result += "<div class='contact_row'>" +
                    "<div class='contact_field'>" +
                      "<img src='img/hombre.png'>" +
                      "<span>" + contacts[i].name + "</span>" +
                    "</div>" +

                    "<div class='contact_field'>" +
                      "<img src='img/telefono.png'/>" +
                      "<span>" + contacts[i].number + "</span>" +
                    "</div>";

          if (showEditButtons){
            result += "<img class='edit_contact' src='img/edit.png' onclick='contactView.editContact(" + i + ")'></img>" +
                      "<img class='delete_contact' src='img/edit.png' onclick='contact.deleteContact(" + i + ")'></img>";
          }else if(showCallButton){
            result += "<img class='edit_contact' src='img/call_button.png' onclick='contact.callAutomaticTipeNumber(event, " + contacts[i].number + ")'></img>";
          }

          result += "</div>";
    }

    return result;

  }

  this.searchContacts = function(){

      var search = $("#phoneNumber").val();
      var contacts =  JSON.parse(window.localStorage.contacts);

      var filter = contacts.filter(function(item){
                      var itemNames = item.name.split(" ");
                      var result = false;

                      for(var i = 0; i < itemNames.length; i++){
                          if (itemNames[i].indexOf(search) == 0){
                            return true;
                          }
                      }

                    });

      $("#search_result").children().remove();
      $("#search_result").append(this.getContactsToShow(filter, false, true));

      if (filter.length > 0){
        $("#search_result_content").show();
        $("[softphone] .numbers_panel").hide();
      }
  }

  this.hideSearchContactsPanel = function(showNumberPanel, cleanText){
    $("#search_result_content").hide();

    if (cleanText){
      $("[softphone] .search_panel input[type='text']").val("");
    }

    if (showNumberPanel){
      $("[softphone] .numbers_panel").show();
    }
  }
}

var contactView = new ContactView();

function Contact(){
    this.newContact = function(){
      var contacts;

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
        var contactId = $("#contact_id").val();

        if (contactId == -1){
          this.newContact();
        }else{
          this.updateContact();
        }
    }

    this.deleteContact = function(){
      var contacts =  JSON.parse(window.localStorage.contacts);
      var id = $("#contact_id").val();
      delete contacts.splice(id, 1);

      window.localStorage.contacts = JSON.stringify(contacts);
      contactView.showContacts();
    }

    this.callAutomaticTipeNumber = function(event, number){
      event = event || window.event

      contactView.hideSearchContactsPanel();
      $("#phoneNumber").val(number);
      call.checkLogin();

      event.stopPropagation();
    }
}

var contact = new Contact();
$("#search_result_content").hide();
