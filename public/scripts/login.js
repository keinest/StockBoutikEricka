(function () {
  const form = document.getElementById("login-form");
  const feedback = document.getElementById("login-feedback");

  if (!form || !feedback || !window.StockBoutikApi) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    feedback.hidden = true;

    const formData = new FormData(form);
    const payload = {
      email: String(formData.get("email") || "").trim(),
      password: String(formData.get("password") || ""),
    };

    try {
      const result = await window.StockBoutikApi.post("/auth/login", payload);
      localStorage.setItem("stockboutik.auth", JSON.stringify(result));
      window.location.href = "dashboard.html";
    } catch (error) {
      feedback.textContent = error.message;
      feedback.hidden = false;
    }
  });
})();
