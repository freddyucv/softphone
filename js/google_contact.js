function GoogleContacts(){
  this.config = {
    'client_id': '536034278311-4svg7vthkpe1l0n41cpunoegn7itnpfo.apps.googleusercontent.com',
    'scope': 'https://www.google.com/m8/feeds'
  };

  this.auth = function (callback) {
                  var googleContactsApi = this;

                  gapi.auth.authorize(this.config, function() {
                      var accessToken = gapi.auth.getToken().access_token;
                      console.log('We have got our token....');
                      console.log(accessToken);
                      console.log('We are now going to validate our token....');
                      googleContactsApi.validateToken(accessToken, callback);

                  });
              }

  this.validateToken = function (accessToken, callback) {
                        var googleContactsApi = this;

                        $.ajax({
                            url: 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + accessToken,
                            data: null,
                            success: function(response){
                                console.log('Our token is valid....');
                                callback(accessToken);
                            },
                            error: function(error) {
                                console.log('Our token is not valid....');
                            },
                            dataType: "jsonp"
                        });
                    }

  this.getContacts = function () {
    googleContacts.auth(function(accessToken){
      console.log('We now want to get info about the user using our token....');
      googleContacts.auxContacts  = [];
      googleContacts.getContactsFromIndex(1, accessToken);
    });
  }

  this.getContactsFromIndex = function(startIndex, accessToken){
          $.ajax({
                    url: 'https://www.google.com/m8/feeds/contacts/default/thin?alt=json',
                    dataType: "jsonp",
                    data: {
                      access_token: accessToken,
                      access_token_type: "bearer",
                      'max-results': 200,
                      'start-index': startIndex
                    },
                    success:function(data) {
                          var entries = data.feed.entry;

                          for (var i = 0; i < data.feed.entry.length; i++) {
                              var name = entries[i].title.$t;

                                if (name){
                                  var number = "";

                                  if (entries[i].gd$phoneNumber){
                                    number = entries[i].gd$phoneNumber[0].$t;
                                  }

                                  var contact = {
                                    name: name,
                                    number: number,
                                    google: entries[i]
                                  };

                                  googleContacts.auxContacts.push(contact);
                                }
                          }

                          var nextStartIndex = startIndex + data.feed.entry.length;
                          var totalContacts = data.feed.openSearch$totalResults.$t;

                          if (nextStartIndex > totalContacts)  {
                            contactView.setContacts(googleContacts.auxContacts);

                          }else{
                            googleContacts.getContactsFromIndex(nextStartIndex, accessToken);
                          }
                    }
                 });
    }

    this.addContact = function (contact){

      googleContacts.auth(function(accessToken){


        /*$.ajax({type: "POST",
                url: "https://www.google.com/m8/feeds/contacts/default/thin",
                dataType: "xml",
                contentType: "application/atom+xml",
                cache: false,
                async: true,
                crossDomain: true,
                data:{
                  access_token_type: "bearer",
                  access_token: accessToken,
                  'message-body':'<atom:entry xmlns:atom="http://www.w3.org/2005/Atom"' +
                'xmlns:gd="http://schemas.google.com/g/2005">' +
                '<atom:category scheme="http://schemas.google.com/g/2005#kind"' +
                'term="http://schemas.google.com/contact/2008#contact"/>' +
                '<gd:name>' +
                '<gd:givenName>Elizabeth</gd:givenName>' +
                '<gd:familyName>Bennet</gd:familyName>' +
                '<gd:fullName>Elizabeth Bennet</gd:fullName>' +
                '</gd:name>' +
                '<atom:content type="text">Notes</atom:content>' +
                '<gd:email rel="http://schemas.google.com/g/2005#work"' +
                'primary="true"' +
                'address="liz@gmail.com" displayName="E. Bennet"/>' +
                '<gd:email rel="http://schemas.google.com/g/2005#home"' +
                'address="liz@example.org"/>' +
                '<gd:phoneNumber rel="http://schemas.google.com/g/2005#work"' +
                'primary="true">' +
                '(206)555-1212' +
                '</gd:phoneNumber>' +
                '<gd:phoneNumber rel="http://schemas.google.com/g/2005#home">' +
                '(206)555-1213' +
                '</gd:phoneNumber>' +
                '<gd:im address="liz@gmail.com"' +
                'protocol="http://schemas.google.com/g/2005#GOOGLE_TALK"' +
                'primary="true"' +
                'rel="http://schemas.google.com/g/2005#home"/>' +
                '<gd:structuredPostalAddress' +
                'rel="http://schemas.google.com/g/2005#work"' +
                'primary="true">' +
                '<gd:city>Mountain View</gd:city>' +
                '<gd:street>1600 Amphitheatre Pkwy</gd:street>' +
                '<gd:region>CA</gd:region>' +
                '<gd:postcode>94043</gd:postcode>' +
                '<gd:country>United States</gd:country>' +
                '<gd:formattedAddress>' +
                '1600 Amphitheatre Pkwy Mountain View' +
                '</gd:formattedAddress>' +
                '</gd:structuredPostalAddress>' +
                '</atom:entry>'},
                function(result) {alert("SIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIi");}})*/

      });
    }

    this.isUsingGoogleContact = function(){
      return window.localStorage.useGoogleContact && window.localStorage.useGoogleContact == 'true';
    }
}

var googleContacts = new GoogleContacts();
