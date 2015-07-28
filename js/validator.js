function Validator(){

  this.isNumber = function(target){
      var val = $(target).val();

      if (!val || (isNaN(parseFloat(val)) || !isFinite(val))){

        $(target).addClass('error');
        $(target).removeClass('input_success');

        $(target).parent('.row').addClass('panel_error');
        $(target).parent('.row').removeClass('panel_color');

        return false;
      }else{
        $(target).removeClass('error');
        $(target).addClass('input_success');
        $(target).parent('.row').removeClass('panel_error');
        $(target).parent('.row').addClass('panel_color');


        return true;
      }
  }
}

var validator = new Validator();
