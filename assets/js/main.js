// joj0hq — interactions

(function () {
  "use strict";

  // ---- scroll reveal: animate [data-reveal] elements as they enter the viewport
  function initReveal() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.04 });
    els.forEach(function (el) { io.observe(el); });
  }
  if (document.readyState !== "loading") initReveal();
  else document.addEventListener("DOMContentLoaded", initReveal);

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    // ---- scroll to top
    document.querySelectorAll("[data-top]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        try { window.scrollTo({ top: 0, behavior: "smooth" }); }
        catch (e) { window.scrollTo(0, 0); }
      });
    });

    // ---- mobile nav toggle
    var toggle = document.querySelector("[data-nav-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        menu.classList.toggle("open");
      });
      document.addEventListener("click", function (e) {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
          menu.classList.remove("open");
        }
      });
    }

    // ---- work project tabs (toggle pre-rendered panels)
    var workTabs = document.querySelectorAll("[data-work-tab]");
    if (workTabs.length) {
      var workPanels = document.querySelectorAll("[data-work-panel]");
      workTabs.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var idx = btn.getAttribute("data-work-tab");
          workTabs.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
          workPanels.forEach(function (p) {
            p.classList.toggle("is-hidden", p.getAttribute("data-work-panel") !== idx);
          });
        });
      });
    }

    // ---- App Store latest release (live, fetched in the browser each visit)
    document.querySelectorAll("[data-appstore-id]").forEach(function (box) {
      var id = box.getAttribute("data-appstore-id");
      var country = box.getAttribute("data-country") || "us";
      if (!id || !window.fetch) return;
      var pad = function (n) { return n < 10 ? "0" + n : "" + n; };
      fetch("https://itunes.apple.com/lookup?id=" + encodeURIComponent(id) + "&country=" + encodeURIComponent(country))
        .then(function (r) { return r.json(); })
        .then(function (d) {
          var a = d && d.results && d.results[0];
          if (!a) return;
          var ver = box.querySelector("[data-rel-ver]");
          var date = box.querySelector("[data-rel-date]");
          var notes = box.querySelector("[data-rel-notes]");
          if (ver && a.version) ver.textContent = "v" + a.version;
          if (date && a.currentVersionReleaseDate) {
            var t = new Date(a.currentVersionReleaseDate);
            if (!isNaN(t)) date.textContent = t.getFullYear() + "." + pad(t.getMonth() + 1) + "." + pad(t.getDate());
          }
          if (notes && a.releaseNotes) {
            notes.innerHTML = "";
            a.releaseNotes.split("\n").forEach(function (line) {
              line = line.trim();
              if (!line) return;
              var div = document.createElement("div");
              div.textContent = line;
              notes.appendChild(div);
            });
          }
        })
        .catch(function () {});
    });

    // ---- blog category filter
    var chips = document.querySelectorAll("[data-filter]");
    if (chips.length) {
      var rows = document.querySelectorAll("[data-cats]");
      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          var f = chip.getAttribute("data-filter");
          chips.forEach(function (c) { c.classList.toggle("is-active", c === chip); });
          rows.forEach(function (row) {
            var cats = (row.getAttribute("data-cats") || "").split("|");
            var show = f === "*" || cats.indexOf(f) !== -1;
            row.style.display = show ? "" : "none";
          });
        });
      });
    }
  });
})();
