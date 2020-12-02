"use strict";

window.onload = function () {
  // Openning menu while using mobil device
  var mobile_menu_toggle = document.getElementById('mobile-menu-toggle');
  var mobile_menu = document.getElementById('mobile-header-menu');

  mobile_menu_toggle.onclick = function () {
    mobile_menu.classList.toggle('active');
  }; // Auto Toc


  var auto_toc = document.getElementById('toc-auto');
  var post = document.getElementsByClassName('post')[0];
  var rect = post.getBoundingClientRect(); // Attach the toc to the right of post content

  auto_toc.style.left = "".concat(rect.left + rect.width + 20, "px");
  auto_toc.style.maxWidth = "".concat(rect.left - 20, "px");
  auto_toc.style.visibility = "visible";
  window.addEventListener('resize', function () {
    var currentRect = post.getBoundingClientRect(); // Attach the toc to the right of post content

    auto_toc.style.left = "".concat(currentRect.left + currentRect.width + 20, "px");
    auto_toc.style.maxWidth = "".concat(currentRect.left - 20, "px");
    auto_toc.style.visibility = "visible";
  }, false); // Keep toc follow the content

  var headerHeight = document.getElementById('header-desktop').offsetHeight;
  var footerTop = document.getElementById('post-footer').offsetTop;
  var topSpacing = 20 + headerHeight;
  var minTocTop = auto_toc.offsetTop;
  var minScrollTop = minTocTop - topSpacing;
  var maxTocTop = footerTop - auto_toc.getBoundingClientRect().height;
  var maxScrollTop = maxTocTop - topSpacing;
  window.addEventListener('scroll', function () {
    var currentScrollTop = document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;

    if (currentScrollTop < minScrollTop) {
      auto_toc.style.position = 'absolute';
      auto_toc.style.top = "".concat(minTocTop, "px");
    } else if (currentScrollTop > maxScrollTop) {
      auto_toc.style.position = 'absolute';
      auto_toc.style.top = "".concat(maxTocTop, "px");
    } else {
      auto_toc.style.position = 'fixed';
      auto_toc.style.top = "".concat(topSpacing, "px");
    }
  }, false);
};