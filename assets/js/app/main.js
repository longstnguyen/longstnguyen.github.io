(function () {
  "use strict";

  // Light/Dark theme toggle (default: light)
  // Uses: <html data-theme="light|dark"> and persists via localStorage key "theme".
  var initThemeToggle = function () {
    try {
      var root = document.documentElement;
      var saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") {
        root.setAttribute("data-theme", saved);
      } else if (!root.getAttribute("data-theme")) {
        root.setAttribute("data-theme", "light");
      }

      var btn = document.getElementById("themeToggle");
      if (!btn) return;

      var label = btn.querySelector(".theme-label");
      var syncLabel = function () {
        if (!label) return;
        var isDark = root.getAttribute("data-theme") === "dark";
        // Label indicates the mode user can switch to.
        label.textContent = isDark ? "Light" : "Dark";
      };
      syncLabel();

      btn.addEventListener("click", function () {
        var isDark = root.getAttribute("data-theme") === "dark";
        var next = isDark ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        syncLabel();
      });
    } catch (e) {
      // If storage is blocked, keep default and fail silently.
    }
  };

  var isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    },
  };

  var fullHeight = function () {
    if (!isMobile.any()) {
      // Only apply JS-driven full-height to non-sidebar elements.
      // The sidebar (#colorlib-aside) uses CSS + fixed positioning and should
      // not get an inline height injected (it causes footer/toggle layout bugs).
      $(".js-fullheight")
        .not("#colorlib-aside")
        .css("height", $(window).height());
      $(window).resize(function () {
        $(".js-fullheight")
          .not("#colorlib-aside")
          .css("height", $(window).height());
      });
    }
  };

  // Animations
  var contentWayPoint = function () {
    var i = 0;
    $(".animate-box").waypoint(
      function (direction) {
        if (direction === "down" && !$(this.element).hasClass("animated")) {
          i++;

          $(this.element).addClass("item-animate");
          setTimeout(function () {
            $("body .animate-box.item-animate").each(function (k) {
              var el = $(this);
              setTimeout(function () {
                var effect = el.data("animate-effect");
                if (effect === "fadeIn") {
                  el.addClass("fadeIn animated");
                } else if (effect === "fadeInLeft") {
                  el.addClass("fadeInLeft animated");
                } else if (effect === "fadeInRight") {
                  el.addClass("fadeInRight animated");
                } else {
                  el.addClass("fadeInUp animated");
                }

                el.removeClass("item-animate");
              }, k * 200);
            });
          }, 100);
        }
      },
      { offset: "85%" },
    );
  };

  var burgerMenu = function () {
    $(".js-colorlib-nav-toggle").on("click", function (event) {
      event.preventDefault();
      var $this = $(this);

      if ($("body").hasClass("offcanvas")) {
        $this.removeClass("active");
        $("body").removeClass("offcanvas");
      } else {
        $this.addClass("active");
        $("body").addClass("offcanvas");
      }
    });
  };

  // Click outside of offcanvass
  var mobileMenuOutsideClick = function () {
    $(document).click(function (e) {
      var container = $("#colorlib-aside, .js-colorlib-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($("body").hasClass("offcanvas")) {
          $("body").removeClass("offcanvas");
          $(".js-colorlib-nav-toggle").removeClass("active");
        }
      }
    });

    $(window).scroll(function () {
      if ($("body").hasClass("offcanvas")) {
        $("body").removeClass("offcanvas");
        $(".js-colorlib-nav-toggle").removeClass("active");
      }
    });
  };

  var clickMenu = function () {
    $('#navbar a:not([class="external"])').click(function (event) {
      var section = $(this).data("nav-section"),
        navbar = $("#navbar");

      var $target = $('[data-section="' + section + '"]');
      if ($target.length) {
        var scrollToTarget = function () {
          var targetScrollTop = $target.offset().top - 55;
          var maxScrollTop = $(document).height() - $(window).height();
          targetScrollTop = Math.max(
            0,
            Math.min(targetScrollTop, maxScrollTop),
          );

          $("html, body").stop(true).animate(
            {
              scrollTop: targetScrollTop,
            },
            500,
          );
        };

        // On mobile, close the offcanvas first so offsets are computed correctly.
        if ($("body").hasClass("offcanvas")) {
          $("body").removeClass("offcanvas");
          $(".js-colorlib-nav-toggle").removeClass("active");
          setTimeout(scrollToTarget, 20);
        } else {
          scrollToTarget();
        }
      }

      if (navbar.is(":visible")) {
        navbar.removeClass("in");
        navbar.attr("aria-expanded", "false");
        $(".js-colorlib-nav-toggle").removeClass("active");
      }

      event.preventDefault();
      return false;
    });
  };

  // Reflect scrolling in navigation
  var navActive = function (section) {
    var $el = $("#navbar > ul");
    $el.find("li").removeClass("active");
    $el.each(function () {
      $(this)
        .find('a[data-nav-section="' + section + '"]')
        .closest("li")
        .addClass("active");
    });
  };

  var navigationSection = function () {
    var $section = $("section[data-section]");

    $section.waypoint(
      function (direction) {
        if (direction === "down") {
          navActive($(this.element).data("section"));
        }
      },
      {
        offset: "150px",
      },
    );

    $section.waypoint(
      function (direction) {
        if (direction === "up") {
          navActive($(this.element).data("section"));
        }
      },
      {
        offset: function () {
          return -$(this.element).height() + 155;
        },
      },
    );
  };

  // Document on load.
  $(function () {
    fullHeight();
    contentWayPoint();
    burgerMenu();
    initThemeToggle();

    clickMenu();
    // navActive();
    navigationSection();
    // windowScroll();

    mobileMenuOutsideClick();
  });
})();
