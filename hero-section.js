/* ============================================================
   EDITORIAL HERO SECTION — hero-section.js
   ・スクロールで要素をふわっと表示（IntersectionObserver）
   ・背景画像のさりげないパララックス
   ・Shopify / 通常HTML どちらでもそのまま動作します
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function initHero(hero) {
    var img = hero.querySelector(".edt-hero__media img");

    // ---- 表示時のフェードイン（要素が画面に入ったら is-visible を付与）----
    if ("IntersectionObserver" in window && !reduceMotion) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              hero.classList.add("is-visible");
              observer.unobserve(hero);
            }
          });
        },
        { threshold: 0.25 }
      );
      observer.observe(hero);
    } else {
      // Observer非対応 or モーション低減設定時は即表示
      hero.classList.add("is-visible");
    }

    // ---- 背景画像のパララックス ----
    if (img && !reduceMotion) {
      var ticking = false;

      function updateParallax() {
        var rect = hero.getBoundingClientRect();
        var progress = 1 - rect.bottom / (window.innerHeight + rect.height);
        var offset = Math.max(-40, Math.min(40, progress * 60 - 20));
        img.style.transform =
          "scale(1.08) translateY(" + offset.toFixed(1) + "px)";
        ticking = false;
      }

      window.addEventListener(
        "scroll",
        function () {
          if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
          }
        },
        { passive: true }
      );

      updateParallax();
    }
  }

  function init() {
    var heroes = document.querySelectorAll(".edt-hero");
    heroes.forEach(initHero);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Shopifyテーマエディタでセクションが再読み込みされた時の対応
  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener("shopify:section:load", function (event) {
      var hero = event.target.querySelector(".edt-hero");
      if (hero) {
        hero.classList.remove("is-visible");
        initHero(hero);
      }
    });
  }
})();
