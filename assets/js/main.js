(function () {
  "use strict";

  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  var systemQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function storedTheme() {
    try {
      var value = localStorage.getItem("creax-theme");
      return value === "light" || value === "dark" ? value : null;
    } catch (error) {
      return null;
    }
  }

  function updateToggle() {
    if (!toggle) return;
    var dark = root.dataset.theme === "dark";
    toggle.setAttribute("aria-pressed", dark ? "true" : "false");
    toggle.setAttribute(
      "aria-label",
      dark
        ? "Night service is on. Switch to day service."
        : "Day service is on. Switch to night service."
    );
  }

  if (toggle) {
    updateToggle();

    toggle.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem("creax-theme", next);
      } catch (error) {
        /* The theme still changes for this visit. */
      }
      updateToggle();
    });

    var onSystemChange = function (event) {
      if (storedTheme()) return;
      root.dataset.theme = event.matches ? "dark" : "light";
      updateToggle();
    };

    if (systemQuery.addEventListener) {
      systemQuery.addEventListener("change", onSystemChange);
    } else if (systemQuery.addListener) {
      systemQuery.addListener(onSystemChange);
    }
  }

  /* Local time in West Jakarta (UTC+7). */
  var clock = document.getElementById("local-time");
  if (clock && window.Intl) {
    var formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

    var tick = function () {
      clock.textContent = "WIB " + formatter.format(new Date());
    };

    tick();
    window.setInterval(tick, 30000);
  }

  /* Copy the email address, with a fallback for browsers without the async API. */
  var copyButton = document.querySelector("[data-copy]");
  var copyStatus = document.getElementById("copy-status");

  function legacyCopy(text) {
    var field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "readonly");
    field.style.position = "fixed";
    field.style.top = "-1000px";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();

    var copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }

    document.body.removeChild(field);
    return copied;
  }

  if (copyButton && copyStatus) {
    var resetTimer = null;
    var originalLabel = copyButton.textContent;

    copyButton.addEventListener("click", function () {
      var value = copyButton.getAttribute("data-copy") || "";

      function finish(copied) {
        window.clearTimeout(resetTimer);

        if (copied) {
          copyButton.textContent = "Copied";
          copyStatus.textContent = "Email address copied to clipboard.";
        } else {
          copyStatus.textContent = "Copy failed. Select the address above and copy it manually.";
        }

        resetTimer = window.setTimeout(function () {
          copyButton.textContent = originalLabel;
          copyStatus.textContent = "";
        }, 2400);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(function () {
          finish(true);
        }).catch(function () {
          finish(legacyCopy(value));
        });
      } else {
        finish(legacyCopy(value));
      }
    });
  }

  /* Isolate a line when its terminus is hovered or focused. */
  var map = document.getElementById("network-map");
  if (map) {
    var termini = map.querySelectorAll(".terminus");

    Array.prototype.forEach.call(termini, function (link) {
      var line = link.getAttribute("data-line");

      var activate = function () {
        map.setAttribute("data-active", line);
      };

      var deactivate = function () {
        if (map.getAttribute("data-active") === line) {
          map.removeAttribute("data-active");
        }
      };

      link.addEventListener("pointerenter", activate);
      link.addEventListener("pointerleave", deactivate);
      link.addEventListener("focus", activate);
      link.addEventListener("blur", deactivate);
    });
  }

  /* Mark the section currently in view. */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var sections = navLinks.map(function (link) {
    return document.getElementById(link.getAttribute("data-nav"));
  }).filter(Boolean);

  function setCurrent(id) {
    navLinks.forEach(function (link) {
      if (link.getAttribute("data-nav") === id) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  var navTick = false;

  function updateCurrent() {
    navTick = false;

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      setCurrent(sections[sections.length - 1].id);
      return;
    }

    var marker = window.scrollY + 132;
    var current = null;

    sections.forEach(function (section) {
      if (section.offsetTop <= marker) {
        current = section.id;
      }
    });

    if (current) {
      setCurrent(current);
    } else {
      navLinks.forEach(function (link) {
        link.removeAttribute("aria-current");
      });
    }
  }

  function requestCurrent() {
    if (!navTick) {
      navTick = true;
      window.requestAnimationFrame(updateCurrent);
    }
  }

  if (sections.length) {
    window.addEventListener("scroll", requestCurrent, { passive: true });
    window.addEventListener("resize", requestCurrent);
    updateCurrent();
  }

  /* --- anime.js animations --- */
  var anime = window.anime || {};

  // Reveal project cards on scroll with subtle up motion
  if (!('anime' in window)) {
    var animeScript = document.createElement('script');
    animeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
    animeScript.integrity = 'sha512-o7qZRkFc6yZXhI6G9B3bFqVmB3jQ7dFeDh2jR/eteIovnQVx9tnGyfQb6eGa4feG2XeXR2xu/ObR/23iyRaZ5UQ==';
    animeScript.crossOrigin = 'anonymous';
    animeScript.onload = initAnimeAnimations;
    document.head.appendChild(animeScript);
  } else {
    initAnimeAnimations();
  }

  function initAnimeAnimations() {
    // Animate project cards fade-in on load with slight stagger
    var projects = document.querySelectorAll('.project');
    if (projects.length > 0) {
      anime({
        targets: projects,
        opacity: [0, 1],
        translateY: [20, 0],
        easing: 'ease-out',
        duration: 600,
        delay: function(el, i) { return i * 100 },
        complete: function() {
          // Ensure elements stay visible
          projects.forEach(function(el) { el.style.opacity = '1'; });
        }
      });
    }

    // Animate station dots on map with the existing CSS delay pattern but using anime
    var stations = document.querySelectorAll('.station');
    if (stations.length > 0) {
      anime({
        targets: stations,
        opacity: [0, 1],
        easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
        duration: 400,
        delay: function(el, i) { return 300 + (i * 80) }
      });
    }

    // Animate terminus links on hover with scale up
    var termini = document.querySelectorAll('.terminus');
    if (termini.length > 0) {
      Array.prototype.forEach.call(termini, function (link) {
        link.addEventListener('mouseenter', function() {
          anime({
            targets: link.querySelector('.terminus__name'),
            scale: [1, 1.05],
            easing: 'easeOutExpo',
            duration: 150
          });
        });

        link.addEventListener('mouseleave', function() {
          anime({
            targets: link.querySelector('.terminus__name'),
            scale: [1.05, 1],
            easing: 'easeOutExpo',
            duration: 150
          });
        });
      });
    }

    // Animate route stops fade-in with the var(--d) delay pattern
    var routeStops = document.querySelectorAll('.route-stops li');
    if (routeStops.length > 0) {
      anime({
        targets: routeStops,
        opacity: [0, 1],
        translateY: [10, 0],
        easing: 'ease-out',
        duration: 450,
        delay: function(el, i) { return 200 + (i * 50) }
      });
    }

    // Subtle pulse on copy button success
    var copyButtons = document.querySelectorAll('.copy');
    if (copyButtons.length > 0) {
      Array.prototype.forEach.call(copyButtons, function (btn) {
        btn.addEventListener('click', function() {
          var originalBg = btn.style.background;
          anime({
            targets: btn,
            backgroundColor: '#111418',
            easing: 'linear',
            duration: 200,
            complete: function() {
              anime({
                targets: btn,
                backgroundColor: originalBg || '',
                easing: 'easeOutQuad',
                duration: 300
              });
            }
          });
        });
      });
    }

    // Intersection observer for section fade-ins
    var sections = document.querySelectorAll('.section:not(.map-section)');
    if (sections.length > 0) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target,
              opacity: [0, 1],
              translateX: [20, 0],
              easing: 'ease-out',
              duration: 500
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      sections.forEach(function(section) {
        observer.observe(section);
      });
    }
  }
})();