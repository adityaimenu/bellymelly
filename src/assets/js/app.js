export var enterOnlyNum = function (){
    $("#enterOnlyNumber").keypress(function (e) {

      alert(0)
      if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
         $("#errmsg").html("Digits Only").show().fadeOut("slow");
                return false;
     }
    });
  }