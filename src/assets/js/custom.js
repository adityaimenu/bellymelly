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
export var enterOnlyNum = function () {
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
export var popover = function () {
  $(document).ready(function () {
    $('[data-toggle="popover"]').popover();
  });
}


export var stickyNew = function () {
  (function ($) {
    "use strict"; // Start of use strict



    // Closes responsive menu when a scroll trigger link is clicked
    $('.js-scroll-trigger').click(function () {
      $('.navbar-collapse').collapse('hide');
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $('body').scrollspy({
      target: '#mainNav',
      offset: 75
    });

    // Collapse Navbar
    var navbarCollapse = function () {
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

    $('#filter-menu').click(function () {
      $('.responsive-filter').toggleClass('active');
    })

  })(jQuery); // End of use strict
}

export var scrolltop = function () {
  $("#srchbtn").click(function () {
    $("html").animate({ scrollTop: 1000 }, "slow");
  });
}
export var scrolltopnm = function () {
  $("#srchbtnnme").click(function () {
    $("html").animate({ scrollTop: 1000 }, "slow");
  });
}


// export var orgi = function(){
//   var DonutWidget = function (element, options) {
//     if (element && element instanceof jQuery) {
//         if ($(element).length > 1) {
//             for (var i = 0; i < $(element).length; i++) {
//                 this.init(element[i], options);
//             }
//         }
//         else {
//             this.init(element, options);
//         }
//     }
// };
// DonutWidget.defaults = {
//     max: 100
//     , value: 0
//     , text: ""
//     , rotate: 0
//     , caption: ""
//     , colors: {
//         primary: "#ffe600"
//         , background: "#eee"
//     }
//     , size: "normal"
// };
// DonutWidget.instances = 0;
// DonutWidget.prototype = {
//     constructor: DonutWidget
//     , init: function (element, options) {
//         var self = this;
//         this.options = $.extend({}, DonutWidget.defaults, options);
//         this.$element = $(element);
//         if (this.$element.attr("data-chart-instance")) {
//             this.instanceID = this.$element.attr("data-chart-instance");
//         }
//         else {
//             DonutWidget.instances++;
//             this.instanceID = DonutWidget.instances;
//         }
//         this.paint();
//         return this;
//     }
//     , paint: function () {
//         var template = [
//             '<div class="donut-hole"><span class="donut-filling"></div>'
//             , '<div class="donut-bite" data-segment-index="0"></div>'
//             , '<div class="donut-bite" data-segment-index="1"></div>'
//             , '<div class="donut-caption-wrapper"><span class="donut-caption"></span></div>'
//         ].join('');
//         this.$element.html(template);
//         if (!this.$element.hasClass("donut-widget")) {
//             this.$element.addClass("donut-widget");
//         }
//         this.$element.addClass(this.options.size);
//         this.$element.attr("data-chart-instance", this.instanceID);
//         this.setSegments();
//         this.setPoints();
//         this.setText();
//         this.setAttributes();
//     }
//     , setSegments: function () {
//         this.segments = {
//             0: ["0", this.options.value, this.options.colors.primary]
//             , 1: [this.options.value, this.options.max - this.options.value, this.options.colors.background]
//         };
//     }
//     , setPoints: function () {
//         for (var i = 0; i < Object.keys(this.segments).length; i++) {
//             var s = this.segments[i];
//             this.points = {};
//             var start = ((s[0] / this.options.max) * 360) + this.options.rotate;
//             var deg = ((s[1] / this.options.max) * 360);
//             if (!this.$element.find(".donut-bite.large").length) {
//                 if (s[1] >= (this.options.max / 2)) {
//                     this.$element.find(".donut-bite[data-segment-index='0']").addClass("large");
//                 }
//                 else {
//                     this.$element.find(".donut-bite[data-segment-index='1']").addClass("large");
//                 }
//             }
//             this.setStyle(start, deg, s, i);
//         }
//     }
//     , setStyle: function (start, deg, segment, index) {
//         if (!$("#dynamic").length) {
//             $("<style type='text/css' id='dynamic' />").appendTo("head");
//         }
//         var selector = ".donut-widget[data-chart-instance='" + this.instanceID + "']";
//         if (this.$element.attr("id")) {
//             selector = "#" + this.$element.attr("id");
//         }
//         this.selector = selector;
//         this.removeStyle(index);
//         var style = $("#dynamic").text() + "/*Style for " + this.instanceID + "_" + index + "*/" + selector + " .donut-bite[data-segment-index=\"" + index + "\"]{-moz-transform:rotate(" + start + "deg);-ms-transform:rotate(" + start + "deg);-webkit-transform:rotate(" + start + "deg);-o-transform:rotate(" + start + "deg);transform:rotate(" + start + "deg);}" + selector + " .donut-bite[data-segment-index=\"" + index + "\"]:BEFORE{-moz-transform:rotate(" + deg + "deg);-ms-transform:rotate(" + deg + "deg);-webkit-transform:rotate(" + deg + "deg);-o-transform:rotate(" + deg + "deg);transform:rotate(" + deg + "deg); background-color: " + segment[2] + ";}" + selector + " .donut-bite[data-segment-index=\"" + index + "\"]:BEFORE{ background-color: " + segment[2] + ";}" + selector + " .donut-bite[data-segment-index=\"" + index + "\"].large:AFTER{ background-color: " + segment[2] + ";}";
//         style += "/*Style End for " + this.instanceID + "_" + index + "*/";
//         $("#dynamic").text(style);
//     }
//     , removeStyle: function (index) {
//         var style = $("#dynamic").text();
//         var split = style.split("/*Style for " + this.instanceID + "_" + index + "*/");
//         if (split.length != 1) {
//             var part1 = split[0];
//             var part2 = split[1].split("/*Style End for " + this.instanceID + "_" + index + "*/")[1];
//             $(dynamic).text(part1 + part2);
//         }
//     }
//     , setText: function () {
//         if (!this.options.text) {
//             this.options.text = Math.round(((this.options.value / this.options.max) * 100)) + "%";
//         }
//         this.$element.find(".donut-filling").text(this.options.text);
//         this.$element.find(".donut-caption").text(this.options.caption);
//     }
//     , setAttributes: function () {
//         this.$element.attr("data-chart-max", this.options.max);
//         this.$element.attr("data-chart-value", this.options.value);
//         this.$element.attr("data-chart-text", this.options.text);
//         this.$element.attr("data-chart-rotate", this.options.rotate);
//         this.$element.attr("data-chart-caption", this.options.caption);
//         this.$element.attr("data-chart-primary", this.options.colors.primary);
//         this.$element.attr("data-chart-background", this.options.colors.background);
//         this.$element.attr("data-chart-size", this.options.size);
//     },
//     redraw: function(options){
//        return this.init(this.$element, $.extend({},this.options, options));
//     }
// }
// DonutWidget.draw = function (element, options) {
//     if (!element) {
//         element = $(".donut-widget")
//     }
//     var results = [];
//     for (var i = 0; i < element.length; i++) {
//         var doptions = {};
//         if ($(element[i]).data("chart-max")) {
//             doptions.max = $(element[i]).data("chart-max");
//         }
//         if ($(element[i]).data("chart-value")) {
//             doptions.value = $(element[i]).data("chart-value");
//         }
//         if ($(element[i]).data("chart-text")) {
//             doptions.text = $(element[i]).data("chart-text");
//         }
//         if ($(element[i]).data("chart-rotate")) {
//             doptions.rotate = $(element[i]).data("chart-rotate");
//         }
//         if ($(element[i]).data("chart-caption")) {
//             doptions.caption = $(element[i]).data("chart-caption");
//         }
//         if ($(element[i]).data("chart-primary")) {
//             doptions.colors = doptions.colors || {};
//             doptions.colors.primary = $(element[i]).data("chart-primary");
//         }
//         if ($(element[i]).data("chart-background")) {
//             doptions.colors = doptions.colors || {};
//             doptions.colors.background = $(element[i]).data("chart-background");
//         }
//         if ($(element[i]).data("chart-size")) {
//             doptions.size = $(element[i]).data("chart-size");
//         }
//         results.push(new DonutWidget($(element[i]), $.extend(doptions, options)));
//     }
//     if(results.length == 1){
//         results = results[0];
//     }
//     return results;
// };
// DonutWidget.redraw = function (element, options) {
//     return DonutWidget.draw(element, options);
// };
// /* 
//  * jQuery plugin Implementation 
//  */
// $.fn.DonutWidget = function (option) {
//     return this.each(function () {
//         var $this = $(this);
//         var data = $this.data("$donut");
//         var options = null;
//         if(data){
//             options = $.extend({}, data.options, option);
//         }
//         else{
//             options = typeof option === 'object' && option;
//         }
//         $this.donut = data;
//         $this.data("$donut", (data = new DonutWidget($(this), options)));

//     })
// };
// $.fn.DonutWidget.Constructor = DonutWidget;


// var widget1 = null;
// var widgets = null;
// var jq = null;
// $(document).ready(function () {
//      widgets = DonutWidget.draw();
//      jq = $("#jq-widget").DonutWidget({
//          max: 200
//          , value: 50
//          , caption: "jquery Implementation"
//      });
//      widget1 = DonutWidget.draw($("#widget1"), {value: 84});
//  });


// }



export var prog = function (valdata) {
  // const a = Math.round(valdata)
  // var b = `0.${a}`;
  // $('#circle1').circleProgress({
  //   value: b,
  //   size: 100,
  //   fill: {
  //     gradient: ["#FD0000", "#FD7300", "#FDBD00"]
  //   }
  // });

  function Circlle(el) {
    $(el).circleProgress({ fill: { color: '#ff5c5c', data: 50 } }).on('circle-animation-progress', function (event, progress, stepValue) {

      $(this).find('strong').text(String(stepValue.toFixed(2)).substr(2) + '%');
    });
  };
  Circlle('.round');
}



export var eventEmitter = function (eventName, transaction_id, affiliation, currency, value, tax, shipping, items) {
  gtag('event', eventName, {
    transaction_id: transaction_id,
    affiliation: affiliation,
    currency: currency,
    value: value,
    tax: tax,
    shipping: shipping,
    items: items
  });

}



export var transactionData = function (transaction_id, affiliation, currency, value, tax, donation, items,orderData) {
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event : 'purchase',
    ecommerce: {
      purchase: {
        actionField: {
          id: transaction_id,                         // Transaction ID. Required for purchases and refunds
          revenue: value,                     // Total transaction value (incl. tax and shipping)
          tax: tax,
          donation : donation?donation:'',
          formid:'transactionSuccessfull',
          paymentmothod:orderData.PaymentTypeId == 2?'Card':orderData.PaymentTypeId == 3?'Cash':'',
          service:orderData.ServiceId == 1?'Pick Up':orderData.ServiceId == 2?'Delivery':orderData.ServiceId == 3?'Curbside':orderData.ServiceId == 5?'Dine In':'',
          organizationname:orderData.NGOName?orderData.NGOName:'',
        },
        products: items
      }
    }
  });
}

export var checkout = function(service,items){
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
      event: 'checkout',
      ecommerce: {
        checkout: {
          actionField: {step: 1, option: service},
          products: items
       }
     }
  });
}


export var addToCart = function (name, id, price, brand, category, variant, quantity) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
  event: 'addToCart',
  ecommerce: {
    currencyCode: 'EUR',
    add: {                                // 'add' actionFieldObject measures.
      products: [{                        //  adding a product to a shopping cart.
        name: name,
        id: id,
        price: price,
        brand: brand,
        category: category,
        variant: variant,
        quantity: quantity
       }]
    }
  }
});
}

export var removeFromCart = function (name, id, price, brand, category, variant, quantity) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
  event: 'removeFromCart',
  ecommerce: {
    currencyCode: 'EUR',
    remove: {                                // 'remove' actionFieldObject measures.
      products: [{                        //  remove a product to a shopping cart.
        name: name,
        id: id,
        price: price,
        brand: brand,
        category: category,
        variant: variant,
        quantity: quantity
       }]
    }
  }
});
}