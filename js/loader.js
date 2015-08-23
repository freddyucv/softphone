(function() {
  document.write('<link rel="stylesheet" type="text/css" href="css/softphone.css"/>');
  document.write('<link rel="stylesheet" type="text/css" href="css/waiting.css"/>');
  document.write('<link href="http://fonts.googleapis.com/css?family=Anton" rel="stylesheet" type="text/css">');

  var mainElement = document.querySelector('[softphone]');
  var tempDiv = document.createElement('div');
  mainElement.appendChild(tempDiv);

  var htmlCode =
    '<audio id="audio_remote" autoplay="autoplay"></audio>' +
      '<audio id="ringbacktone" loop src="sounds/ringbacktone.wav"></audio>' +
      '<audio id="dtmfTone" src="sounds/dtmf.wav"></audio>' +
      '<div class="main_panel" onclick="contactView.hideSearchContactsPanel(true, true)">' +
        '<div class="buttons_bar">' +
          '<div class="head">' +
          '<img src="img/small_global_link.png"/>' +
            '<span class="title_1" style="color:black;margin-left:2%">Call </span>' +
            '<span class="title_2" style="color:#afafaf">Number</span>' +
            '<div class="buttons">' +
              '<input type="image" class="search_contact_button button" src="img/view_contacts.png"' +
                'onclick="contactView.showContacts()"//>' +
                '<input type="image" class="search_contact_button button" src="img/setting.png"' +
                  'onclick="callView.showSetting()"//>' +
                '<input type="image" class="search_contact_button button" src="img/exit.jpg"' +
                  'onclick="call.logout()"//>' +
                '<span class="back" onclick="callView.goBack()">' +
                  'Back' +
                '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="call_panel">' +
          '<div class="search_panel" onblur="contactView.hideSearchContactsPanel()">' +
            '<input id="phoneNumber" type="text" placeholder="Phone Number or Contact Name"' +
              'onkeyup="contactView.searchContacts()"/>' +
              '<div id="search_result_content">' +
                '<div id="search_result"></div>' +
              '</div>' +
          '</div>' +
          '<div class="message"></div>' +
          '<div class="numbers_panel">' +
          '</div>' +
          '<div class="call_button_panel">' +
            '<input type="image" class="new_contact_button" src="img/new_contact.png"' +
              'onclick="contactView.newContact()"/>' +
            '<input class="call_button" type="image" src="img/call_button.png" onclick="call.checkSipStack()"/>' +
            '<input class="delete_number_button" type="image" src="img/delete_number.png" onclick="callView.deleteNumber()"/>' +
          '</div>' +
       '</div>' +
       '<div class="panel">' +
       '</div>' +
       '<div class="c_panel">' +
         '<div class="message"></div>' +
      '</div>';

      var scripts =
      [
        "js/SIPml-api.js",
        "js/validator.js",
        "js/google_contact.js",
        "js/contact.js",
        "js/softphone.js",
        "js/softphoneView.js",
        "https://apis.google.com/js/client.js"
      ];

      for (var i = 0; i < scripts.length; i++){
        var new_script = document.createElement('script');
        new_script.setAttribute('src', scripts[i]);
        document.head.appendChild(new_script);
      }

      tempDiv.insertAdjacentHTML('afterend', htmlCode);
}());
