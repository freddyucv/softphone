function Call(){
    this.startIntent = 0;

    this.dtmf = function (c){

      if(this.callSession && c){
          if(this.callSession.dtmf(c) == 0){
              try { document.getElementById("dtmfTone").play(); } catch(e){ }
          }
      }
    }

    this.checkLogin = function (){

        //this.connected = true;
        if (!sessionStorage.config){
          callView.loadLoginPanel();
        }else{
          this.config = JSON.parse(sessionStorage.config);
          callView.loadNumbers();
          contactView.getContacts();
        }
    }

    this.login = function (){

        callView.showLoginWaiting();
        var login = $("#login").val();
        var password = $("#password").val();

        var http = new XMLHttpRequest();

        var url = "https://www.global-link.us/api/accounts/get-account.php";

        http.onreadystatechange = function() {

            if (http.readyState == 4 && http.status == 200) {
                var isError = http.responseText.indexOf("Fatal error") != -1;

                if (!isError){
                  sessionStorage.config = http.responseText;
                  this.config = JSON.parse(http.responseText);

                  callView.loadNumbers();

                  if (googleContacts.isUsingGoogleContact()){
                    googleContacts.getContacts();
                  }

                }else{
                  callView.showErrorLoginMessage("Incorrect login or password");
                }

                callView.hideLoginWaiting();
            }else if(http.readyState == 4){
              callView.showErrorLoginMessage("Sorry, the service is not available at this time");
            }
        }.bind(this);

        http.open("POST", url, true);

        var formData = new FormData();
        formData.append("user_email", login);
        formData.append("user_password", password);

        http.send(formData);
    }

    this.logout = function (){

        callView.loadLoginPanel();
        $("#login").val("");
        $("#password").val("");

        sessionStorage.removeItem("config");
        this.config = null;
        callView.hideLoginWaiting();
    }

    this.checkSipStack = function(){

      if (!this.sipStack){
        this.createSipStack();
      }else{
        this.call();
      }
    }

    this.createSipStack = function(){
         callView.showMessage("Wait, starting...");

         //var port = 10062 + (1000 * this.startIntent);
         //var port = 11060;

         var config = {
                         realm: this.config.domain,
                         impi: this.config.username,
                         impu: 'sip:' + this.config.username + "@" + this.config.domain,
                         password: this.config.password,
                         //websocket_proxy_url:'wss://ns313841.ovh.net:' + port,
                         enable_rtcweb_breaker: true,
                         events_listener: { events: '*', listener: this.startEventsListener.bind(this) },
                         sip_headers: [
                                 { name: 'User-Agent', value: 'IM-client/OMA1.0 sipML5-v1.0.0.0' },
                                 { name: 'Organization', value: 'global-link.us' }
                         ]
                     };

         this.sipStack = new SIPml.Stack(config);

 	      this.sipStack.start();
        //this.startIntent++;
     }

     this.startEventsListener = function(e){
       console.log("-------EVENT " + e.type + " " + (e.type == 'm_permission_refused') + " " + (e.type == "failed_to_start"));
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
                 this.startIntent = 0;
             }
             catch (e) {
               callView.showErrorMessage("At the moment the service is not available");
               this.startIntent = 0;
             }
         }else if(e.type == 'stopped' || e.type == "failed_to_start"){
           this.startIntent++;
            console.log("this.startIntent " + this.startIntent);
           if (this.startIntent < 4){
             this.createSipStack();
           }else{
             callView.showErrorMessage("At the moment the service is not available");
             this.sipStack = null;
             this.startIntent = 0;
           }
         }else if(e.type == 'm_permission_refused'){
           callView.showErrorMessage("You must grant permission to use the microphone");
           //sessionStorage.config
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

           this.oSipSessionRegister = null;

           if (this.calling){
             callView.loadNumbers();
           }
         }
    }

    this.callEventListener = function(e){
        console.log("--------------------Event " + e.type + " " + e.getSipResponseCode());
      	if (e.type == 'connected'){
          callView.showMessage("talking...");
          this.calling = true;
          this.stopRingbackTone();
          callView.startCallingTime();
      	}else if (e.type == 'connecting'){
          callView.showMessage("calling...");
          this.isHangup = false;
      	}else if(e.type == 'terminating'){

          if(this.calling){
            callView.showMessage("hanging...");
            this.stopRingbackTone();
            $("[softphone]  .c_panel").hide();
          }/*else{
            callView.showErrorMessage("Unexpected error");
            $("[softphone]  .c_panel").hide();
            callView.loadNumbers();
          }*/
        }else if(e.type == 'terminated'){
          this.stopCall();
          this.stopRingbackTone();

          if (callView.callLastTimeout){
            clearTimeout(callView.callLastTimeout);
          }

          if (this.calling || this.isHangup){
            callView.cleanMessage();
            $("[softphone]  .c_panel").hide();
          }else{
            callView.showErrorMessage("Sorry , you can not communicate, probably the dialed number is not correct");
          }
        }else if(e.type == 'i_ao_request'){
          var iSipResponseCode = e.getSipResponseCode();
          if (iSipResponseCode == 180 || iSipResponseCode == 183) {
              this.startRingbackTone();
              callView.showMessage("ringing...");
              callView.showCallingPanel();
          }
        }else if (e.type ==  'stopping' || e.type == 'stopped' ||
                  e.type == 'failed_to_start' || e.type == 'failed_to_stop' ||
                  e.type == 'm_early_media'
                ){
                  this.stopRingbackTone();

        }


    }

    this.stopCall = function (){
      $("[softphone]  .c_panel").hide();
      $("[softphone]  .call_panel").show();
      $("[softphone]  .buttons_bar").show();

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
      console.log("Call");
      callView.enabledButton("hang_up");

      this.callSession = this.sipStack.newSession('call-audio', {
          audio_remote: document.getElementById('audio_remote'),
          events_listener: { events: '*', listener: this.callEventListener.bind(this) }
      });

       if (!this.callSession){
         callView.showError("Sorry, the service is not available at this time");
       }else{
          var phoneNumber = $("#phoneNumber").val();
          this.callSession.call(phoneNumber);
       }
    }

    this.sipHangUp = function() {
        if (this.callSession) {
            this.callSession.hangup({events_listener: { events: '*', listener: this.callEventListener.bind(this) }});
            callView.disenabledButton("calling");
            callView.disenabledButton("hang_up");
            callView.cleanMessage();
            this.isHangup = true;
            $("[softphone]  .c_panel").hide();
            callView.loadNumbers();
        }
    }
}

var call = new Call();
