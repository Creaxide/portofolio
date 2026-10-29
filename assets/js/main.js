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
}());
