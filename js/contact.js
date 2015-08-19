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

      var contacts =  contactView.getContacts();
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

    var contacts =  contactView.getContacts();

    if (contacts){

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
                    "</div>";

        var number = (contacts[i].number) ? contacts[i].number : "No tiene numero";

        result +=  "<div class='contact_field'>" +
                      "<img src='img/telefono.png'/>" +
                      "<span>" + number + "</span>" +
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
      var contacts =  contactView.getContacts();

      if (contacts){
        var search = $("#phoneNumber").val();

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

  this.getContacts = function(){
    var contacts;

    if (googleContacts.isUsingGoogleContact()){
      if (window.sessionStorage.contacts){
        contacts =  JSON.parse(window.sessionStorage.contacts);
      }else{
        contacts = googleContacts.auth();
      }
    }else{
      contacts =  JSON.parse(window.localStorage.contacts);
    }

    return contacts;
  }

  this.setContacts = function(contacts){

    if (googleContacts.isUsingGoogleContact()){
      window.sessionStorage.contacts = JSON.stringify(contacts);
    }else{
      window.localStorage.contacts = JSON.stringify(contacts);
    }

  }
}

var contactView = new ContactView();

function Contact(){
    this.newContact = function(){
      this.addContact($("#contact_name").val(), $("#contact_number").val());

      callView.setContact(contacts);

      callView.showNumbersPanel();
      callView.showMessage("Contact successfully added");

      callView.enabledButton("view_contacts");
    }

    this.addContact = function(name, number){
      var contacts =  contactView.getContacts();

      if (!contacts){
        contacts =  [];
      }

      var contact = {
        name: name,
        number: number
      };

      contacts.push(contact);
    }

    this.updateContact = function(){

      var contacts =  contactView.getContacts();
      var id = $("#contact_id").val();

      contacts[id].name = $("#contact_name").val();
      contacts[id].number = $("#contact_number").val();

      contactView.setContacts(contacts);

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
      var contacts =  contactView.getContacts();
      delete contacts.splice(index, 1);

      contactView.setContacts(contacts);
      contactView.showContacts();
    }

    this.callAutomaticTipeNumber = function(event, number){
      event = event || window.event

      contactView.hideSearchContactsPanel();
      $("#phoneNumber").val(number);
      call.checkSipStack();

      event.stopPropagation();
    }

    this.changeGoogleContactOption = function(){
      var useGoogleContact =  $("#google_contact_check").is(":checked");

      window.localStorage.useGoogleContact = useGoogleContact;
      callView.showNumbersPanel();

      /*if(useGoogleContact){

      }*/
    }
}

var contact = new Contact();
$("#search_result_content").hide();

(

  function(){
    callView.disenabledButton("back_button");

  }()
)
