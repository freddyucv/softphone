function GoogleContacts(){
  this.auth =  function () {

                var config = {
                  'client_id': '536034278311-4svg7vthkpe1l0n41cpunoegn7itnpfo.apps.googleusercontent.com',
                  'scope': 'https://www.googleapis.com/auth/urlshortener'
                };

                gapi.auth.authorize(config, function() {
                  console.log('login complete');
                  this.fetch(gapi.auth.getToken());
                }.bind(this));
              }

  this.fetch = function (token) {
      $.ajax({
        url: "https://www.google.com/m8/feeds/contacts/default/full?access_token=" + token.access_token + "&alt=json",
        dataType: "jsonp",
        success:function(data) {
                              // display all your data in console
                  console.log(JSON.stringify(data));
        }
    });
  }
}

var googleContacts = new GoogleContacts();
