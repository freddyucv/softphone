function GoogleContacts(){
  this.config = {
    'client_id': '536034278311-4svg7vthkpe1l0n41cpunoegn7itnpfo.apps.googleusercontent.com',
    'scope': 'https://www.google.com/m8/feeds'
  };

  this.auth = function () {
                  var googleContactsApi = this;

                  gapi.auth.authorize(this.config, function() {
                      var accessToken = gapi.auth.getToken().access_token;
                      console.log('We have got our token....');
                      console.log(accessToken);
                      console.log('We are now going to validate our token....');
                      googleContactsApi.validateToken(accessToken);

                  });
              }

  this.validateToken = function (accessToken) {
                        var googleContactsApi = this;

                        $.ajax({
                            url: 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + accessToken,
                            data: null,
                            success: function(response){
                                console.log('Our token is valid....');
                                console.log('We now want to get info about the user using our token....');
                                googleContactsApi.getContacts(accessToken);
                            },
                            error: function(error) {
                                console.log('Our token is not valid....');
                            },
                            dataType: "jsonp"
                        });
                    }

  this.getContacts = function (accessToken) {
    this.auxContacts  = [];
    this.getContactsFromIndex(1, accessToken);
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
                            console.log("COntactos cargados");
                          }else{
                            googleContacts.getContactsFromIndex(nextStartIndex, accessToken);
                          }
                    }
                 });
    }

    this.isUsingGoogleContact = function(){
      return window.localStorage.useGoogleContact == 'true';
    }
}

var googleContacts = new GoogleContacts();
