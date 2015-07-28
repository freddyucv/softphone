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
        console.log("-----------------------------YA EXISTE---------------------------");
        this.call();
      }
    }

    this.createSipStack = function(){
         callView.showMessage("Wait, starting...");

         this.sipStack = new SIPml.Stack({
                 realm: this.config.domain,
                 impi: this.config.username,
                 impu: 'sip:' + this.config.username + "@" + this.config.domain,
                 password: this.config.password,
                 websocket_proxy_url:'wss://ns313841.ovh.net:10062',
                 enable_rtcweb_breaker: true,
                 events_listener: { events: '*', listener: this.startEventsListener.bind(this) },
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
       console.log("-------EVENT " + e.type + " " + (e.type == "failed_to_start"));
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
               callView.showErrorMessage("At the moment the service is not available");
             }
         }else if(e.type == 'stopped' || e.type == "failed_to_start"){
           this.startIntent++;
            console.log("this.startIntent " + this.startIntent);
           if (this.startIntent < 3){
             this.sipStack.start();
           }else{
             callView.showErrorMessage("At the moment the service is not available");
             this.sipStack = null;
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

           callView.showErrorMessage("At the moment the service is not available");
           this.connected = false;
         }else if ((e.type == 'terminated' ||
                  e.type == 'failed_to_start' ||
                  e.type == 'stopped') &&
                  this.connected){
           callView.showErrorMessage("Incorrect login or password");
         }
    }

    this.callEventListener = function(e){
        console.log("--------------------Event " + e.type + " " + e.getSipResponseCode());
      	if (e.type == 'connected'){
          callView.showMessage("talking...");
          this.calling = true;
          this.stopRingbackTone();
      	}else if (e.type == 'connecting'){
          callView.showMessage("calling...");
          this.isHangup = false;
      	}else if(e.type == 'terminating'){
          callView.showMessage("hanging...");
          this.stopRingbackTone();
        }else if(e.type == 'terminated'){
          if (this.calling || this.isHangup){
            callView.cleanMessage();
            callView.showNumbersPanel();
          }else{
            callView.showErrorMessage("Sorry , you can not communicate, probably the dialed number is not correct");
          }
        }else if(e.type == 'i_ao_request'){
          var iSipResponseCode = e.getSipResponseCode();
          if (iSipResponseCode == 180 || iSipResponseCode == 183) {
              this.startRingbackTone();
              callView.showMessage("ringing...");
          }
        }else if (e.type ==  'stopping' || e.type == 'stopped' ||
                  e.type == 'failed_to_start' || e.type == 'failed_to_stop' ||
                  e.type == 'm_early_media'
                ){
                  this.stopRingbackTone();

        }


    }

    this.startRingbackTone = function () {
        try { ringbacktone.play(); }
        catch (e) { }
    }

    this.stopRingbackTone = function () {
         try { ringbacktone.pause(); }
         catch (e) { }
     }

    this.call = function(){
      callView.showCallingPanel();
      callView.enabledHangoutButton();

      this.callSession = this.sipStack.newSession('call-audio', {
          audio_remote: document.getElementById('audio_remote'),
          events_listener: { events: '*', listener: this.callEventListener.bind(this) }
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
            callView.cleanMessage();
            this.isHangup = true;
        }
    }
}

var call = new Call();
