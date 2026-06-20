// joj0hq — interactions

(function () {
  "use strict";

  // ---- a hello for the curious (devtools)
  try {
    console.log("%cjojo.%c  Software Engineer", "color:#FF6A2C;font-size:20px;font-weight:700", "color:#6f665f;font-size:14px");
    console.log("%cYou found me! If our paths cross, let's talk. 👋", "color:#1a1a1a;font-size:13px");
    console.log("%c✉ jotaro.yuza@gmail.com   ⌥ github.com/joj0hq", "color:#9a908a;font-size:12px");
    console.log("%c↑↑↓↓←→←→ B A", "color:#FF6A2C;font-size:11px");
  } catch (e) {}

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

    // ---- time-based greeting (subtle)
    var g = document.querySelector("[data-greeting]");
    if (g) {
      var ja = (document.documentElement.lang || "ja").indexOf("ja") === 0;
      var h = new Date().getHours();
      var emoji, txt;
      if (h >= 5 && h < 11) { emoji = "🌅"; txt = ja ? "おはようございます" : "Good morning"; }
      else if (h >= 11 && h < 18) { emoji = "☀️"; txt = ja ? "こんにちは" : "Good afternoon"; }
      else { emoji = "🌙"; txt = ja ? "こんばんは" : "Good evening"; }
      g.textContent = emoji + " " + txt;
    }

    // ---- konami code -> sauna "ととのう"
    var seq = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65], kp = 0;
    document.addEventListener("keydown", function (e) {
      kp = (e.keyCode === seq[kp]) ? kp + 1 : (e.keyCode === seq[0] ? 1 : 0);
      if (kp === seq.length) { kp = 0; totonou(); }
    });
    function totonou() {
      if (document.querySelector(".sauna-overlay")) return;
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var jp = (document.documentElement.lang || "ja").indexOf("ja") === 0;
      var o = document.createElement("div");
      o.className = "sauna-overlay";
      var steam = reduce ? "" : '<span class="steam"></span><span class="steam"></span><span class="steam"></span><span class="steam"></span><span class="steam"></span>';
      o.innerHTML = steam + '<div class="sauna-msg">🧖 ' + (jp ? "ととのいました…" : "Totonou ✨") + '</div>';
      document.body.appendChild(o);
      setTimeout(function () { o.classList.add("out"); }, 2600);
      setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o); }, 3300);
    }

    // ---- scroll progress bar
    var bar = document.querySelector("[data-scroll-progress]");
    if (bar) {
      var updateBar = function () {
        var st = window.scrollY || document.documentElement.scrollTop || 0;
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? (st / max) * 100 : 0) + "%";
      };
      window.addEventListener("scroll", updateBar, { passive: true });
      window.addEventListener("resize", updateBar);
      updateBar();
    }

    // ---- stats count-up
    var nums = document.querySelectorAll("[data-count]");
    if (nums.length) {
      var reduceN = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var animateCount = function (el) {
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        if (reduceN || !("requestAnimationFrame" in window)) { el.textContent = target; return; }
        var dur = 900, start = null;
        var step = function (t) {
          if (!start) start = t;
          var p = Math.min((t - start) / dur, 1);
          el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };
      if (!("IntersectionObserver" in window)) {
        nums.forEach(function (el) { animateCount(el); });
      } else {
        var io2 = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { animateCount(e.target); io2.unobserve(e.target); }
          });
        }, { threshold: 0.6 });
        nums.forEach(function (el) { el.textContent = "0"; io2.observe(el); });
      }
    }
  });
})();
