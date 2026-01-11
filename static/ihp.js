document.addEventListener("DOMContentLoaded", function() {
  console.log("iHP modal controller loaded ✅");

  // 支持多个弹窗（未来可扩展）
  const modals = document.querySelectorAll(".ihp-modal");
  const triggers = document.querySelectorAll(".ihp-trigger");

  // 为每个按钮绑定事件
  triggers.forEach((btn) => {
    btn.addEventListener("click", function() {
      const targetId = btn.getAttribute("data-target");
      const modal = document.querySelector(targetId);
      const content = modal.querySelector(".modal-content");

      if (!modal) {
        console.warn("⚠️ Modal not found for target:", targetId);
        return;
      }

      modal.style.display = "flex";
      content.style.animation = "modalFadeIn 0.6s ease both";
    });
  });

  // 为所有关闭按钮绑定事件
  modals.forEach((modal) => {
    const content = modal.querySelector(".modal-content");
    const closeBtn = modal.querySelector(".close-modal");

    closeBtn.addEventListener("click", () => {
      content.style.animation = "modalFadeOut 0.4s ease both";
      setTimeout(() => modal.style.display = "none", 350);
    });

    // 点击背景关闭
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        content.style.animation = "modalFadeOut 0.4s ease both";
        setTimeout(() => modal.style.display = "none", 350);
      }
    });
  });
});
