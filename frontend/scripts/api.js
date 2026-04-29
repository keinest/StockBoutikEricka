(function () {
  const API_PREFIX = "/api/v1";

  async function request(path, options = {}) {
    const response = await fetch(`${API_PREFIX}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message =
        typeof data === "object" && data !== null
          ? data.detail || data.message || "Une erreur est survenue."
          : "Une erreur est survenue.";
      throw new Error(message);
    }

    return data;
  }

  window.StockBoutikApi = {
    get(path) {
      return request(path);
    },
    post(path, body) {
      return request(path, {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
  };
})();
