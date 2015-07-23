function Call(){

    this.checkLogin = function (){

        this.connected = true;

        if (!sessionStorage.config){
          callView.loadLoginPanel();
        }else{
          this.config = JSON.parse(sessionStorage.config);
          this.checkSipStack();
        }
    }

    this.login = function (){

        this.config = {
                        "username": "1000007",
                        "password": "sipP@ssword123456",
                        "domain": "dispatcher.global-link.us",
                        "transport": "udp",
                        "proxy": "sip:dispatcher.global-link.us;transport=udp"
                      };
        sessionStorage.config = JSON.stringify(this.config);
        this.checkSipStack();

        /*var login = $("#login").val();
        var password = $("#password").val();

        var http = new XMLHttpRequest();

        var url = "https://www.global-link.us/api/accounts/get-account.php?user_email=test@global-link.us&user_password=D3V3L0P3N7";

        http.onreadystatechange = function() {
            if (http.readyState == 4 && http.status == 200) {
                sessionStorage.config = http.responseText;
                this.config = JSON.parse(http.responseText);

            }else if(http.readyState == 4){
                callView.showError("Disculpe, el servicio no esta disponible en este momento");
            }
        }

        http.open("POST", url, true);

        var formData = new FormData();
        formData.append("user_email", login);
        formData.append("user_password", password);

        http.send(formData);*/
    }

    this.checkSipStack = function(){
      if (!this.sipStack){
        this.createSipStack();
      }else{
        this.call();
      }
    }

    this.createSipStack = function(){

         this.sipStack = new SIPml.Stack({
                 realm: this.config.domain,
                 impi: this.config.username,
                 impu: 'sip:' + this.config.username + "@" + this.config.domain,
                 password: this.config.password,
                 enable_rtcweb_breaker: true,
                 events_listener: { events: '*', listener: this.EventsListener.bind(this) },
                 sip_headers: [
                         { name: 'User-Agent', value: 'IM-client/OMA1.0 sipML5-v1.0.0.0' },
                         { name: 'Organization', value: 'global-link.us' }
                 ]
             }
         );

 	      this.sipStack.start();
        this.startIntent = 0;
     }

     this.startEventsListener = function(e){
       console.log("-------EVENT " + e.type);
         if(e.type == 'started'){
             try {
                 this.oSipSessionRegister = this.sipStack.newSession('register', {
                     expires: 200,
                     events_listener: { events: '*', listener: this.connectionEventsListener.bind(this)},
                     sip_caps: [
                                 { name: '+g.oma.sip-im', value: null },
                                 { name: '+audio', value: null },
                                 { name: 'language', value: '\"en,fr\"' }
                         ]
                 });
                 this.oSipSessionRegister.register();
             }
             catch (e) {
               callView.showErrorMessage("En este momento el servicio no esta disponible");
             }
         }else if(e.type == 'stopped'){
           this.startIntent++;

           if (this.startIntent < 10){
             this.sipStack.start();
           }else{
             callView.showErrorMessage("En este momento el servicio no esta disponible");
           }
         }
     }

     this.connectionEventsListener = function(e){

         if(e.type == 'connected'){
           this.call();
           this.connected = true;
         }else if ((e.type == 'terminated' ||
                  e.type == 'failed_to_start' ||
                  e.type == 'stopped') &&
                  !this.connected){

           callView.showErrorMessage("En este momento el servicio no esta disponible");
           this.connected = false;
         }else if ((e.type == 'terminated' ||
                  e.type == 'failed_to_start' ||
                  e.type == 'stopped') &&
                  this.connected){
           callView.showErrorMessage("Login o password incorrecto");
         }
    }

    this.callEventListener = function(e){
        console.log("--------------------Event " + e.type);
      	if (e.type == 'connected'){
          callView.showMessage("Hablando...");
          this.calling = true;
      	}else if (e.type == 'connecting'){
          callView.showMessage("Llamando...");
      	}else if(e.type == 'terminating'){
          callView.showMessage("Colgando...");
        }else if(e.type == 'terminated'){
          if (this.calling){
            callView.cleanMessage();
            callView.showNumbersPanel();
          }else{
            callView.showErrorMessage("No es posible comunicarse, probablemente el numero marcado no sea el correcto");
          }
        }
    }

    this.call = function(){
      callView.showCallingPanel();
      callView.enabledHangoutButton();

      this.callSession = this.sipStack.newSession('call-audio', {
          audio_remote: document.getElementById('audio_remote'),
          events_listener: { events: '*', listener: this.callEventListener }
      });

       if (!this.callSession){
         callView.showError("Disculpe, el servicio no esta disponible en este momento");
       }else{
          var phoneNumber = $("#phoneNumber").val();
          this.callSession.call(phoneNumber);
       }
    }

    this.sipHangUp = function() {
        if (this.callSession) {
            this.callSession.hangup({events_listener: { events: '*', listener: this.callEventListener.bind(this) }});
            callView.enabledCallingButton();
            callView.disenabledHangoutButton();
        }
    }
}

var call = new Call();
