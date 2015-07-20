function Call(){
    this.call = function (){
        if (!sessionStorage.currentUser){
          callView.loadLoginPanel();
        }
    }

    this.login = function (q){

        var login = $("#login").val();
        var password = $("#password").val();

        var http = new XMLHttpRequest();

        var url = "https://www.global-link.us/api/accounts/get-account.php?user_email=test@global-link.us&user_password=D3V3L0P3N7";

        http.onreadystatechange = function() {
            if (http.readyState == 4 && http.status == 200) {

                this.config = JSON.parse(http.responseText);
                alert(this.config );
            }else if(http.readyState == 4){
                callView.showError("Disculpe, el servicio no esta disponible en este momento", q);
            }
        }

        http.open("POST", url, true);

        var formData = new FormData();
        formData.append("user_email", login);
        formData.append("user_password", password);

        http.send(formData);
    }
}

var call = new Call();
