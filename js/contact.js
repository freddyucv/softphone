function ContactView(){

  this.newContact = function(){

      $("[softphone] .call_panel").hide();

      var contactPanel = $("[softphone] .panel");
      contactPanel.show();
      contactPanel.children().remove();

      this.getContactPanelContent("new");

      callView.cleanMessage();
      $("[softphone] .search_panel input[type='text']").val("");
      callView.status.push(callView.panels.NEW_CONTACT);

      callView.enabledButton("back_button");
      callView.disenabledButton("ok");
  }

  this.editContact = function(index){
      var contactPanel = $("[softphone] .panel");
      contactPanel.show();
      contactPanel.children().remove();

      this.getContactPanelContent("edit");

      var contacts =  JSON.parse(window.localStorage.contacts);
      $("[softphone] .panel").find("#contact_name").val(contacts[index].name);
      $("[softphone] .panel").find("#contact_number").val(contacts[index].number);
      $("[softphone] .panel").find("#contact_id").val(index);

      callView.cleanMessage();
      $("[softphone] .search_panel input[type='text']").val("");

      callView.status.push(callView.panels.EDIT_CONTACT);

      callView.disenabledButton("ok");
  }

  this.getContactPanelContent = function(action){

    var title;

    if (action == "new"){
        title = "Agregar Contacto";
    }else{
      title = "Editar Contacto";
    }

    var contactPanel = $("[softphone] .panel");
    contactPanel.append('<div class="dialog_panel contact_panel">' +
                          '<h1>' + title + '</h1>' +
                          '<input type="hidden" id="contact_id" value="-1">' +
                        '<div class="row panel_color" style="postion:relative">' +
                            '<input id="contact_name" type="text" placeholder="Name" onKeyUp="contactView.activeOkButton()"/>' +
                        '</div>' +
                        '<div class="row panel_color">' +
                          '<input id="contact_number" type="text" placeholder="Number" onKeyUp="validator.isNumber(this);contactView.activeOkButton()"/>' +
                        '</div>' +
                        '<input type="image" class="ok_button" src="img/ok_button.png" onclick="contact.saveContact()"/>' +
                      '</div>');
  }

  this.activeOkButton = function(){
    var contactName = $("#contact_name").val();
    var contactNumber = $("#contact_number").val();

    if (contactName && contactNumber && !$("#contact_number").hasClass("error")){
      callView.enabledButton("ok");
    }else{
      callView.disenabledButton("ok");
    }
  }

  this.showContacts = function(){
    $("[softphone] .call_panel").hide();

    $(".buttons_bar .head .title_1").html("Contact");
    $(".buttons_bar .head .title_2").html("List");

    var contactPanel = $("[softphone] .panel");
    contactPanel.children().remove();
    callView.cleanMessage();
    contactPanel.show();

    if (window.localStorage.contacts){
      var contacts =  JSON.parse(window.localStorage.contacts);
      contactPanel.append("<div class='contacts_fix_container'></div>");
      contactPanel.children(".contacts_fix_container")
        .append("<div class='contacts_container'></div>");

      var contactsContainer = contactPanel.find(".contacts_fix_container .contacts_container");

      contactsContainer.append(this.getContactsToShow(contacts, true, false));

      callView.status.push(callView.panels.SHOW_CONTACTS);
      callView.enabledButton("back_button");

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
                      "<img class='delete_contact' src='img/delete.png' onclick='contact.deleteContact(" + i + ")'></img>";
          }else if(showCallButton){
            result += "<img class='call_contact' src='img/call_button.png' onclick='contact.callAutomaticTipeNumber(event, " + contacts[i].number + ")'></img>";
          }

          result += "</div>";
    }

    return result;

  }

  this.searchContacts = function(){

      if (window.localStorage.contacts){
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
        }
      }
  }

  this.hideSearchContactsPanel = function(showNumberPanel, cleanText){
    if ($("#search_result_content").is(":visible")){
      $("#search_result_content").hide();

      if (cleanText){
        $("[softphone] .search_panel input[type='text']").val("");
      }

      if (showNumberPanel && !$("[softphone] .panel").is(":visible")){
        $("[softphone] .numbers_panel").show();
      }

      callView.disenabledButton("calling");
    }
  }

  this.activeOkLoginButton = function(){
    var login = $("#login").val();
    var password = $("#password").val();

    if (login && password ){
      callView.enabledButton("ok_login_button");
    }else{
      callView.disenabledButton("ok_login_button");
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

      callView.enabledButton("view_contacts");
    }

    this.updateContact = function(){

      var contacts =  JSON.parse(window.localStorage.contacts);
      var id = $("#contact_id").val();

      contacts[id].name = $("#contact_name").val();
      contacts[id].number = $("#contact_number").val();

      window.localStorage.contacts = JSON.stringify(contacts);
      callView.showNumbersPanel();
      callView.showMessage("Contact successfully updated");
    }

    this.saveContact = function(){
        var contactId = $("#contact_id").val();

        if (contactId == -1){
          this.newContact();
        }else{
          this.updateContact();
        }
    }

    this.deleteContact = function(index){
      var contacts =  JSON.parse(window.localStorage.contacts);
      delete contacts.splice(index, 1);

      window.localStorage.contacts = JSON.stringify(contacts);
      contactView.showContacts();
    }

    this.callAutomaticTipeNumber = function(event, number){
      event = event || window.event

      contactView.hideSearchContactsPanel();
      $("#phoneNumber").val(number);
      call.checkSipStack();

      event.stopPropagation();
    }
}

var contact = new Contact();
$("#search_result_content").hide();

(

  function(){
    callView.disenabledButton("back_button");

  }()
)
