/******* Restaurent Detail Sticky *******/
export var sticky = function () {
  $(document).ready(function () {

    $(window).scroll(function () {
      var sticky = $('.sticker'),
        scroll = $(window).scrollTop();

      if (scroll >= 100) sticky.addClass('stick');
      else sticky.removeClass('stick');
    });
  });
}
export var enterOnlyNum = function (){
  $(".enterOnlyNumber").keypress(function (e) {

    alert(0)
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
       $("#errmsg").html("Digits Only").show().fadeOut("slow");
              return false;
   }
  });
}
/******* Datepicker *******/
export var datePicker = function () {
  $("#datepicker").datepicker();
}
/******* Scroll Link *******/
export var scrollLink = function () {
  $(document).ready(function () {
    $(function () {
      $('ul.categories-list a').bind('click', function (event) {
        var $anchor = $(this);

        $('html, body').stop().animate({
          scrollTop: $($anchor.attr('href')).offset().top
        }, 1000);
        /*
        if you don't want to use the easing effects:
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1000);
        */
        event.preventDefault();
      });
    });
  });
}
/******* Fancy Popup *******/
export var fancyBox = function () {
  $(document).ready(function () {

    $('[data-fancybox^="inline"]').fancybox({
      autoSize: false,
      closeClick: false,
      animationDuration: 300,
      fixed: true,
      fitToView: true,
      clickOutside: false,
      margin: 0,
      gutter: 0,
      helpers: {
        overlay: { closeClick: false } // prevents closing when clicking OUTSIDE fancybox
      }
    });
  })
 
};


/******* Show Extra Toppings *******/
export var checked = function () {
  $(function () {
    $("#defaultCheck1").click(function () {
      if ($(this).is(":checked")) {
        $(".extra-options").slideDown();
      } else {
        $(".extra-options").slideUp();
      }
    });
  });
};
/******* Show Tooltip *******/
export var tooltip = function () {
  $(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });
}



function classChecker() {
  if ($('.payment-sec').hasClass('active')) {
    $('#addAddModal').hide();
  } else {
    $('#addAddModal').show();
  }
}
/******* Show Swipper *******/
export var swipper = function () {
  var swiper = new Swiper('.similar-item', {
    slidesPerView: 2,
    spaceBetween: 15,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
  var swiper = new Swiper('.charity-swiper', {
    slidesPerView: 3,
    // centeredSlides: true,
    spaceBetween: 30,
    navigation: {
      nextEl: '.slide-btn .swiper-button-next',
      prevEl: '.slide-btn .swiper-button-prev',
    },
    //<---Add this two lines in your code-->   
    observer: true,  
    observeParents: true,
    breakpoints: {
      1199: {
        slidesPerView: 3,
        spaceBetween: 20,
      }
    }
  });

  var swiper = new Swiper('.charity-swiperMobile', {
    slidesPerView: 2,

    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    //<---Add this two lines in your code-->   
    observer: true,  
    observeParents: true,
  });
  
};
/******* Show Sidemenu *******/
export var sideNav = function () {
  $('#sidenav').click(function () {
    $('#wrapper').toggleClass('sidenavopened');
  })
};
export var closeCheck = function () {
  // $('.ks-cboxtags input.chk').on('change', function() {
  $('input.custom-control-input').prop('checked', false);
  // });
};
export var resetAddOn = function () {
  $('#addOnRadioGrp nb-radio').each((i, ele) => {
    $('nb-radio label input').prop('checked', false);
  });
  // $('#addOnCheck .custom-check-addOn').each((i, ele) => {
  //   $('input.custom-control-input').prop('checked', false);
  // })
};
export var resetAddOnAll = function () {
  $('nb-radio-group nb-radio').each((i, ele) => {
    $('nb-radio label input').prop('checked', false);
  });
  $('#addOnCheck nb-checkbox').each((i, ele) => {
    $('nb-checkbox label span').removeClass('checked');
    $('nb-checkbox label nb-icon').remove();
  })
};
export var activeOnScroll = function () {
  $(window).scroll(function () {
    var scrollDistance = $(window).scrollTop();
    $('.dish-items').each(function (i) {
      if ($(this).position().top <= scrollDistance) {
        $('.categories-list li.active').removeClass('active');
        $('.sidebar-cat a.cat-active').removeClass('cat-active');
        $('.categories-list li').eq(i).addClass('active');
        $('.sidebar-cat a').eq(i).addClass('cat-active');
      }
    });
  }).scroll();
};
export var customFixed = function () {
  $(window).scroll(function () {

    if ($(window).scrollTop() >= 228) {
      $('.categories').addClass('slidebarcls');
      $('.cart-wrapper').addClass('cardcls');
    } else {
      $('.categories').removeClass('slidebarcls');
      $('.cart-wrapper ').removeClass('cardcls');
    }
  })
}

export var showPass = function () {
  var temp = document.getElementById("typepass"); 
  if (temp.type === "password") { 
      temp.type = "text"; 
  } 
  else { 
      temp.type = "password"; 
  } 
}




export var openFancyBox = function () {
  jQuery.fancybox.open(jQuery('#animatedModal'), {
    clickOutside: false
  });
}



export var stickyNew = function(){
  (function($) {
    "use strict"; // Start of use strict
  
    
  
    // Closes responsive menu when a scroll trigger link is clicked
    $('.js-scroll-trigger').click(function() {
      $('.navbar-collapse').collapse('hide');
    });
  
    // Activate scrollspy to add active class to navbar items on scroll
    $('body').scrollspy({
      target: '#mainNav',
      offset: 75
    });
  
    // Collapse Navbar
    var navbarCollapse = function() {
      if ($("#mainNav").offset().top > 100) {
        $("#mainNav").addClass("navbar-scrolled");
      } else {
        $("#mainNav").removeClass("navbar-scrolled");
      }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);
  
    $(".js-range-slider").ionRangeSlider();
  
    $('#filter-menu').click(function() {
      $('.responsive-filter').toggleClass('active');
    })
  
  })(jQuery); // End of use strict
}

export var scrolltop = function(){
  $("#srchbtn").click(function() {
    $("html").animate({ scrollTop: 1000 }, "slow");
    });
}
export var scrolltopnm = function(){
  $("#srchbtnnme").click(function() {
    $("html").animate({ scrollTop: 1000 }, "slow");
    });
}
