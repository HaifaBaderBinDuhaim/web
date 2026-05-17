document.addEventListener("DOMContentLoaded", function () {
  const style = document.createElement("style");

  style.textContent = `
    .keyboard-focus,
    a:focus,
    button:focus,
    input:focus,
    select:focus,
    textarea:focus,
    .item:focus {
      outline: 2px solid #ec6f09 !important;
      box-shadow: 0 0 10px #ec6f09 !important;
      border-radius: 10px;
      transition: 0.2s;
    }

    .keyboard-focus {
      background: #2a2a2a !important;
      transform: translateX(3px);
    }
  `;

  document.head.appendChild(style);

  function getFocusableElements() {
    return Array.from(
      document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex="0"], .sidebar .item',
      ),
    ).filter((element) => {
      return (
        !element.disabled &&
        element.offsetParent !== null &&
        getComputedStyle(element).visibility !== "hidden"
      );
    });
  }

  let focusableElements = getFocusableElements();
  let currentIndex = 0;

  focusableElements.forEach((element, index) => {
    if (!element.hasAttribute("tabindex")) {
      element.setAttribute("tabindex", "0");
    }

    element.addEventListener("focus", () => {
      focusableElements = getFocusableElements();
      currentIndex = focusableElements.indexOf(element);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (
      e.key !== "ArrowDown" &&
      e.key !== "ArrowUp" &&
      e.key !== "ArrowRight" &&
      e.key !== "ArrowLeft" &&
      e.key !== "Enter"
    ) {
      return;
    }

    focusableElements = getFocusableElements();

    if (focusableElements.length === 0) return;

    if (e.key === "Enter") {
      const active = document.activeElement;

      if (active && typeof active.click === "function") {
        active.click();
      }

      return;
    }

    e.preventDefault();

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      currentIndex++;

      if (currentIndex >= focusableElements.length) {
        currentIndex = 0;
      }
    }

    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      currentIndex--;

      if (currentIndex < 0) {
        currentIndex = focusableElements.length - 1;
      }
    }

    focusableElements[currentIndex].focus();
  });
});
