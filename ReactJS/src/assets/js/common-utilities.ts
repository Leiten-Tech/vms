import $ from "jquery";
const currentPath = window.location.pathname;

export const pageLoadScript = () => {
  $(function () {
    findURL();
    pageHeight();
    getClock();
    // maxHeight()
    $(window).bind("resize", function () {
      pageHeight();
      getClock();
    });
  });
};
$(document).ready(function () {
  const pagesToRemoveClass = ["/home/print"];
  if (pagesToRemoveClass.includes(currentPath)) {
    $("body").removeClass("apps-bg").css("overflow", "auto");
    $("body").css("height", "100%");
    $("body").css("background-color", "#e9ecef");
  }
});

export const pageHeight = () => {
  // $(".apps-center").animate({ left: -500 }, 0);
  var bdyHeight: any = $(window).outerHeight(true);
  var hdrHeight: any = $("header").outerHeight(true);
  var pageTitleHeight: any = $(".page-title").outerHeight(true);
  var inputHeight: any = $(".input-container").outerHeight(true);
  var previewHeight: any = $(".preview-container").outerHeight(true);
  var previewHdr: any = $(".preview-container .widget-hdr").outerHeight(true);
  var previewFtr: any = $(".preview-container .widget-ftr").outerHeight(true);
  var appointmentHdr: any = $(".appointment-hdr").outerHeight(true);
  var appointmentHeight: any = $(".appointment-container").outerHeight(true);
  if (pageTitleHeight == null) pageTitleHeight = 0;
  if (previewHdr == null) previewHdr = 0;
  if (previewFtr == null) previewFtr = 0;
  if (appointmentHdr == null) appointmentHdr = 0;
  var pageHeight01 = bdyHeight - hdrHeight - 10;
  var pageHeight02 = bdyHeight - hdrHeight;
  var pageHeight03 = pageHeight02 - pageTitleHeight - 20;
  var outputHeight = pageHeight03 - inputHeight - 10;
  var previewScroll = previewHeight - (previewHdr + previewFtr);
  var appointmentScroll = bdyHeight - appointmentHdr - 110;
  var wpScroll = bdyHeight - appointmentHdr - 180;
  var tabParentScroll = bdyHeight - appointmentHdr - 180;
  $("body").attr("style", "height:" + bdyHeight + "px;");

  // $('.page-container.dashboard-page,.page-container:not(.dashboard-page) .inner-page-container > .white').attr('style', 'height:' + pageHeight01 + 'px;');
  $(".sidebar,.main-menu").attr("style", "height:" + pageHeight02 + "px;");
  $(".form-container").attr("style", "height:" + pageHeight03 + "px;");
  $(".preview-final .widget-body").attr("style", "height:calc(100vh - 350px);");
  $(".visitor-pass-container .visitor-pass-body").attr(
    "style",
    "height:calc(100% - 155px);"
  );
  $(".scroll-height").attr("style", "height:" + outputHeight + "px;");
  $(".appointment-container").attr(
    "style",
    "height:" + appointmentScroll + "px;"
  );
  $(".tab-parent-container").attr("style", "height:" + tabParentScroll + "px;");
  $(".wp-container").attr("style", "height:" + wpScroll + "px;");

  // $(document).on("click", ".menu-tabs > a", function () {
  //   var relID = $(this).attr("rel");
  //   var parentRelID: any = $(this).parent().attr("rel");
  //   var parentClass: any = $(this).parent().attr("class");
  //   if (
  //     $("." + parentRelID + " ." + parentClass + "-container." + relID)
  //       .length >= 1
  //   ) {
  //     if (relID !== undefined) {
  //       $(".apps-center").animate({ left: 60 }, 0);
  //       var trimClass = parentClass.split(" ")[1];
  //       if (trimClass == null) {
  //         $(".menu-tabs-container").removeClass("select");
  //         $(".menu-tabs > a").removeClass("select");
  //         $(this).addClass("select");
  //         $(
  //           "." + parentRelID + " ." + parentClass + "-container." + relID
  //         ).addClass("select");
  //       }
  //     } else {
  //       findURL();
  //       pageHeight();
  //       // maxHeight();
  //     }
  //   } else {
  //     $(".apps-center").animate({ left: -500 }, 0);
  //   }
  // });
  // $(document).on("click", function (event) {
  //   if (!$(event.target).closest(".apps-left,.apps-center").length) {
  //     $(".apps-center").animate({ left: -500 }, 0);
  //   }
  // });
  $(document).on(
    "click",
    ".p-dropdown:not(.p-datatable .p-dropdown)",
    function () {
      var ddPanel: any = $(this).width();
      var ddPanelLeft: any = $(this).position().left;
      if (ddPanel == null) ddPanel = 0;
      $(".p-dropdown-panel").css({ width: ddPanel, left: ddPanelLeft });
    }
  );
  $(document).on("click", ".instant-checkout", function () {
    $(".checkout-widget").animate({ bottom: 0 }, 0).addClass("open");
  });
  $(document).on(
    "click",
    ".widget-close,.checkout-widget .preview-close",
    function () {
      $(".checkout-widget").animate({ bottom: -500 }, 0).removeClass("open");
    }
  );
  // $(document).on('click','.visitor-add:not(.visitor-add.opened)',function(){
  //   $('.visitor-info .preview-container:not(.preview-container.opened)').animate({right:0},350).addClass('opened');
  //   $(this).addClass('opened');
  // })
  // $(document).on('click','.visitor-add.opened,.preview-close',function(){
  //   $('.visitor-info .preview-container.opened').animate({right:-400},350).removeClass('opened');
  //   $('.visitor-add.opened').removeClass('opened');
  // })
};
export const getClock = () => {
  const timeEl = document.querySelector(".time");
  const hrsEl = document.querySelector(".hrs");
  const minEl = document.querySelector(".min");
  const secEl = document.querySelector(".sec");
  const ampmEl = document.querySelector(".ampm");
  // const secondEl = document.querySelector('.second')
  // setTime()
  setInterval(setTime, 1000);

  function setTime() {
    const time = new Date();

    const month = time.getMonth();
    const day = time.getDay();
    const date = time.getDate();
    const hours = time.getHours();
    const hoursForClock1 = hours > 12 ? hours - 12 : hours;
    const hoursForClock =
      hoursForClock1 < 10 ? "0" + hoursForClock1 : hoursForClock1;
    const minutes = time.getMinutes();
    const minutesForClock = minutes < 10 ? "0" + minutes : minutes;
    const seconds = time.getSeconds();
    const secForClock = seconds < 10 ? "0" + seconds : seconds;

    const ampm = hours >= 12 ? "PM" : "AM";
    //
    // hourEl.style.transform = `translate(-50%, -100%) rotate(${(hours / 12) * 360}deg)`
    // minuteEl.style.transform = `translate(-50%, -100%) rotate(${(minutes / 60) * 360}deg)`
    // secondEl.style.transform = `translate(-50%, -100%) rotate(${(seconds / 60) * 360}deg)`

    // timeEl.innerHTML = `<div className="clock-container">${hoursForClock}</div> : <div className="clock-container">${minutesForClock}</div> : <div className="clock-container">${secForClock}</div> : <div className="clock-container"> ${ampm}</div>`
    if (hrsEl != null && minEl != null && secEl != null && ampmEl != null) {
      hrsEl.innerHTML = `${hoursForClock}`;
      minEl.innerHTML = `${minutesForClock}`;
      secEl.innerHTML = `${secForClock}`;
      ampmEl.innerHTML = `${ampm}`;
    }
    // dateEl.innerHTML = `${days[day]}, ${months[month]} <span class="circle">${date}</span>`
  }
};
export const findURL = () => {
  var URL = window.location.pathname;
  var PageName = URL.substring(URL.lastIndexOf("/") + 1);
  $(".menu-tabs > a").each(function () {
    var pageURL = $(this).attr("href");
    if (pageURL !== undefined) {
      if (pageURL === URL) {
        // $(".menu-tabs > a").removeClass("select");
        $(this).addClass("select");
      }
    }
  });
  $(".apps-center .p-menu a,.apps-center .p-panelmenu a").each(function () {
    //replace p-menu-list instead of nav
    var pageURL = $(this).attr("href");
    if (pageURL !== undefined) {
      if (pageURL === PageName) {
        //$(".menu-tabs-container,.menu-tabs a").removeClass("select");
        //$(this).addClass("select");
        var parentClass: any = $(this)
          .parents(".menu-tabs-container")
          .attr("class");
        //var trimClass: any = parentClass.split(" ")[1];
        //$(this).parents(".menu-tabs-container").addClass("select");
        // $(".menu-tabs a[rel=" + trimClass + "]").addClass("select");
        pageHeight();
      }
    }
  });
};
export const maxHeight = () => {
  var maxHeight = 0;
  $(".preview-final .widget-body").each(function () {
    if ($(this).outerHeight(true) > maxHeight) {
      maxHeight = $(this).outerHeight(true) + 30;
    }
  });
  $(".preview-final .widget-body").outerHeight(maxHeight);
};
