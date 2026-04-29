(function () {
  const form = document.getElementById("signup-form");
  const feedback = document.getElementById("signup-feedback");

  if (!form || !feedback || !window.StockBoutikApi) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    feedback.hidden = true;

    const formData = new FormData(form);
    const password = String(formData.get("password") || "");
    const confirmation = String(formData.get("password_confirmation") || "");

    if (password !== confirmation) {
      feedback.textContent = "Les mots de passe ne correspondent pas.";
      feedback.hidden = false;
      return;
    }

    const payload = {
      name: String(formData.get("name") || "").trim(),
      surname: String(formData.get("surname") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone_number: String(formData.get("phone_number") || "").trim(),
      role: String(formData.get("role") || "").trim(),
      town: String(formData.get("town") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      password,
      store_name: String(formData.get("store_name") || "").trim(),
    };

    try {
      const result = await window.StockBoutikApi.post("/auth/register", payload);
      localStorage.setItem("stockboutik.auth", JSON.stringify(result));
      window.location.href = "dashboard.html";
    } catch (error) {
      feedback.textContent = error.message;
      feedback.hidden = false;
    }
  });
})();
