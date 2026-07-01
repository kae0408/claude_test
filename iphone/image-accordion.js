/* ==========================================================================
   Image Accordion Section - behavior
   Shopifyセクション／通常HTMLの両方でそのまま動作する vanilla JS
   ========================================================================== */
(function () {
  "use strict";

  function initImageAccordion(root) {
    if (!root || root.dataset.iaInitialized === "true") return;
    root.dataset.iaInitialized = "true";

    var items = Array.prototype.slice.call(
      root.querySelectorAll(".ia-item")
    );
    if (!items.length) return;

    // クリック / キーボードで開閉
    items.forEach(function (item, index) {
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
      item.setAttribute(
        "aria-expanded",
        item.classList.contains("is-active") ? "true" : "false"
      );

      function activate() {
        items.forEach(function (el) {
          var isTarget = el === item;
          el.classList.toggle("is-active", isTarget);
          el.setAttribute("aria-expanded", isTarget ? "true" : "false");
        });
      }

      item.addEventListener("click", activate);
      item.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
        if (e.key === "ArrowRight" && items[index + 1]) {
          items[index + 1].focus();
        }
        if (e.key === "ArrowLeft" && items[index - 1]) {
          items[index - 1].focus();
        }
      });
    });

    // 最初の項目をデフォルトでアクティブに（未指定の場合）
    if (!items.some(function (el) { return el.classList.contains("is-active"); })) {
      items[0].classList.add("is-active");
      items[0].setAttribute("aria-expanded", "true");
    }

    // スクロール連動のスタガーフェードイン
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      items.forEach(function (item, i) {
        item.style.setProperty("--ia-delay", i * 90 + "ms");
        observer.observe(item);
      });
    } else {
      // IntersectionObserver未対応環境は即表示
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
    }
  }

  function initAll() {
    var sections = document.querySelectorAll("[data-image-accordion]");
    sections.forEach(initImageAccordion);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  // Shopifyテーマエディタでセクションが差し替え/再読込された時にも初期化
  document.addEventListener("shopify:section:load", function (e) {
    var section = e.target.querySelector("[data-image-accordion]");
    if (section) initImageAccordion(section);
  });
})();
