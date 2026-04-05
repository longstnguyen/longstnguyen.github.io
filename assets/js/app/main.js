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
    $("#navbar a:not(.external)").click(function (event) {
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

  // Latest News: make the list scrollable and show exactly N items.
  // Markup:
  // <div class="latest-news-wrap" data-visible-items="8">
  //   <div class="latest-news-scroll">
  //     <ul class="latest-news-list"> ... </ul>
  //   </div>
  //   <div class="latest-news-fade"></div>
  // </div>
  var initLatestNewsScroll = function () {
    try {
      var wrappers = document.querySelectorAll(".latest-news-wrap");
      var legacyContainers = document.querySelectorAll(".latest-news-scroll");

      var containers =
        wrappers && wrappers.length ? wrappers : legacyContainers;
      if (!containers || !containers.length) return;

      var getScrollEl = function (container) {
        var inner = container.querySelector
          ? container.querySelector(".latest-news-scroll")
          : null;
        return inner || container;
      };

      var parseVisibleItems = function (el) {
        var raw = el.getAttribute("data-visible-items") || "8";
        var n = parseInt(raw, 10);
        return isNaN(n) || n < 1 ? 8 : n;
      };

      var updateFade = function (container, scrollEl) {
        var atTop = scrollEl.scrollTop <= 1;
        var atBottom =
          scrollEl.scrollTop + scrollEl.clientHeight >=
          scrollEl.scrollHeight - 1;
        container.setAttribute("data-at-top", atTop ? "true" : "false");
        container.setAttribute("data-at-bottom", atBottom ? "true" : "false");
      };

      var updateHeight = function (container) {
        var scrollEl = getScrollEl(container);
        var list = scrollEl.querySelector(".latest-news-list");
        if (!list) return;

        var items = list.querySelectorAll("li");
        var visibleItems = parseVisibleItems(container);

        if (!items || items.length <= visibleItems) {
          scrollEl.style.maxHeight = "none";
          container.setAttribute("data-at-top", "true");
          container.setAttribute("data-at-bottom", "true");
          return;
        }

        var target = items[visibleItems - 1];
        if (!target) return;

        var styles = window.getComputedStyle(scrollEl);
        var padBottom = parseFloat(styles.paddingBottom) || 0;

        // Height to fully include the first N items.
        // list.offsetTop accounts for container padding-top.
        var height =
          list.offsetTop + target.offsetTop + target.offsetHeight + padBottom;

        scrollEl.style.maxHeight = Math.ceil(height) + "px";
        updateFade(container, scrollEl);
      };

      var updateAll = function () {
        for (var i = 0; i < containers.length; i++) {
          updateHeight(containers[i]);
        }
      };

      // Initial sizing + listeners
      updateAll();
      window.addEventListener("resize", updateAll);

      for (var j = 0; j < containers.length; j++) {
        (function (container) {
          var scrollEl = getScrollEl(container);
          scrollEl.addEventListener(
            "scroll",
            function () {
              updateFade(container, scrollEl);
            },
            { passive: true },
          );
        })(containers[j]);
      }

      // Recompute once fonts finish loading (prevents off-by-a-few-px wraps).
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready
          .then(function () {
            updateAll();
          })
          .catch(function () {});
      } else {
        setTimeout(updateAll, 300);
      }
    } catch (e) {
      // Fail silently.
    }
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

    // Activate last nav item when scrolled to page bottom
    $(window).on("scroll", function () {
      if (
        $(window).scrollTop() + $(window).height() >=
        $(document).height() - 20
      ) {
        var $last = $section.last();
        if ($last.length) {
          navActive($last.data("section"));
        }
      }
    });
  };

  // Document on load.
  $(function () {
    fullHeight();
    contentWayPoint();
    burgerMenu();
    initThemeToggle();
    initLatestNewsScroll();

    clickMenu();
    // navActive();
    navigationSection();
    // windowScroll();

    mobileMenuOutsideClick();
  });
})();
