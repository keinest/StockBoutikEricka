(function () {
  const auth = localStorage.getItem("stockboutik.auth");
  const header = document.getElementById("dashboard-subtitle");
  const feedback = document.getElementById("dashboard-feedback");
  const refreshButton = document.getElementById("refresh-dashboard");
  const logoutButton = document.getElementById("logout-button");

  const metrics = {
    salesAmount: document.getElementById("metric-sales-amount"),
    averageTicket: document.getElementById("metric-average-ticket"),
    productsCount: document.getElementById("metric-products-count"),
    activeProducts: document.getElementById("metric-active-products"),
    alertsCount: document.getElementById("metric-alerts-count"),
    stockTotal: document.getElementById("metric-stock-total"),
    storesCount: document.getElementById("metric-stores-count"),
    usersLabel: document.getElementById("metric-users-label"),
  };

  const productBody = document.getElementById("products-body");
  const inventoriesBody = document.getElementById("inventories-body");
  const salesList = document.getElementById("sales-list");
  const alertList = document.getElementById("alerts-list");
  const storesGrid = document.getElementById("stores-grid");
  const usersBody = document.getElementById("users-body");

  const charts = {
    sales: document.getElementById("sales-chart"),
    categories: document.getElementById("category-chart"),
    stockByStore: document.getElementById("stock-store-chart"),
    topProducts: document.getElementById("top-products-chart"),
  };

  const selects = {
    inventoryProduct: document.getElementById("inventory-product-select"),
    inventoryStore: document.getElementById("inventory-store-select"),
    saleProduct: document.getElementById("sale-product-select"),
    saleStore: document.getElementById("sale-store-select"),
    saleUser: document.getElementById("sale-user-select"),
    userStore: document.getElementById("user-store-select"),
  };

  const forms = {
    product: {
      element: document.getElementById("product-form"),
      endpoint: "/produits",
      buildPayload(formData) {
        return {
          name: String(formData.get("name") || "").trim(),
          category: String(formData.get("category") || "").trim(),
          sku: String(formData.get("sku") || "").trim() || null,
          description: String(formData.get("description") || "").trim() || null,
          purchase_price: Number(formData.get("purchase_price")),
          sale_price: Number(formData.get("sale_price")),
          is_active: formData.get("is_active") === "on",
        };
      },
    },
    inventory: {
      element: document.getElementById("inventory-form"),
      endpoint: "/stocks",
      buildPayload(formData) {
        return {
          product_id: Number(formData.get("product_id")),
          store_id: Number(formData.get("store_id")),
          quantity: Number(formData.get("quantity")),
          alert_threshold: Number(formData.get("alert_threshold")),
        };
      },
    },
    sale: {
      element: document.getElementById("sale-form"),
      endpoint: "/ventes",
      buildPayload(formData) {
        return {
          product_id: Number(formData.get("product_id")),
          store_id: Number(formData.get("store_id")),
          user_id: Number(formData.get("user_id")),
          customer_name: String(formData.get("customer_name") || "").trim() || null,
          quantity: Number(formData.get("quantity")),
        };
      },
    },
    store: {
      element: document.getElementById("store-form"),
      endpoint: "/boutiques",
      buildPayload(formData) {
        return {
          name: String(formData.get("name") || "").trim(),
          town: String(formData.get("town") || "").trim(),
          address: String(formData.get("address") || "").trim(),
          status: String(formData.get("status") || "").trim(),
        };
      },
    },
    user: {
      element: document.getElementById("user-form"),
      endpoint: "/utilisateurs",
      buildPayload(formData) {
        return {
          name: String(formData.get("name") || "").trim(),
          surname: String(formData.get("surname") || "").trim(),
          email: String(formData.get("email") || "").trim(),
          phone_number: String(formData.get("phone_number") || "").trim(),
          role: String(formData.get("role") || "").trim(),
          town: String(formData.get("town") || "").trim(),
          address: String(formData.get("address") || "").trim(),
          password: String(formData.get("password") || ""),
          store_id: Number(formData.get("store_id")),
        };
      },
    },
  };

  let lastSnapshot = {
    products: [],
    sales: [],
    alerts: [],
    stores: [],
    users: [],
    inventories: [],
  };

  if (!window.StockBoutikApi) {
    return;
  }

  if (!auth) {
    window.location.href = "login.html";
    return;
  }

  function formatCurrency(value) {
    return `${Number(value || 0).toLocaleString("fr-FR")} FCFA`;
  }

  function setText(node, value) {
    if (node) {
      node.textContent = value;
    }
  }

  function showGlobalError(message) {
    if (!feedback) {
      return;
    }
    feedback.textContent = message;
    feedback.hidden = false;
  }

  function clearGlobalError() {
    if (!feedback) {
      return;
    }
    feedback.hidden = true;
    feedback.textContent = "";
  }

  function availabilityPill(quantity, threshold) {
    if (quantity <= threshold) {
      return '<span class="pill pill-danger">Critique</span>';
    }
    if (quantity <= threshold + 5) {
      return '<span class="pill pill-warning">Bas</span>';
    }
    return '<span class="pill pill-success">Stable</span>';
  }

  function getProductName(productsById, id) {
    return productsById.get(id)?.name || `Produit #${id}`;
  }

  function getStoreName(storesById, id) {
    return storesById.get(id)?.name || `Boutique #${id}`;
  }

  function buildOptions(select, items, labelBuilder) {
    if (!select) {
      return;
    }
    select.innerHTML = items.length
      ? ['<option value="">Selectionner</option>']
          .concat(
            items.map((item) => `<option value="${item.id}">${labelBuilder(item)}</option>`),
          )
          .join("")
      : '<option value="">Aucune donnee disponible</option>';
  }

  function renderVerticalBars(container, values, formatter) {
    if (!container) {
      return;
    }
    if (!values.length) {
      container.innerHTML = '<p class="chart-empty">Pas assez de donnees pour afficher ce graphique.</p>';
      return;
    }

    const max = Math.max(...values.map((item) => item.value), 1);
    container.innerHTML = values
      .map(
        (item) => `
          <div class="bar-item">
            <span>${item.label}</span>
            <strong style="height: ${(item.value / max) * 100}%"></strong>
            <small>${formatter(item.value)}</small>
          </div>
        `,
      )
      .join("");
  }

  function renderHorizontalBars(container, values, formatter) {
    if (!container) {
      return;
    }
    if (!values.length) {
      container.innerHTML = '<p class="chart-empty">Pas assez de donnees pour afficher ce graphique.</p>';
      return;
    }

    const max = Math.max(...values.map((item) => item.value), 1);
    container.innerHTML = values
      .map(
        (item) => `
          <div class="horizontal-item">
            <div class="horizontal-meta">
              <strong>${item.label}</strong>
              <span>${formatter(item.value)}</span>
            </div>
            <div class="horizontal-track">
              <span style="width: ${(item.value / max) * 100}%"></span>
            </div>
          </div>
        `,
      )
      .join("");
  }

  function computeWeeklySales(sales) {
    const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const totals = new Array(7).fill(0);

    sales.forEach((sale) => {
      const date = new Date(sale.sold_at);
      const index = (date.getDay() + 6) % 7;
      totals[index] += Number(sale.total_amount || 0);
    });

    return days.map((label, index) => ({ label, value: totals[index] }));
  }

  function computeCategoryStats(products) {
    const counts = new Map();
    products.forEach((product) => {
      const key = product.category || "Sans categorie";
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return [...counts.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }

  function computeStockByStore(inventories, storesById) {
    const totals = new Map();
    inventories.forEach((inventory) => {
      const label = getStoreName(storesById, inventory.store_id);
      totals.set(label, (totals.get(label) || 0) + Number(inventory.quantity || 0));
    });
    return [...totals.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }

  function computeTopProducts(sales, productsById) {
    const totals = new Map();
    sales.forEach((sale) => {
      const label = getProductName(productsById, sale.product_id);
      totals.set(label, (totals.get(label) || 0) + Number(sale.quantity || 0));
    });
    return [...totals.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }

  function renderMetrics(snapshot) {
    const totalSales = snapshot.sales.reduce(
      (sum, sale) => sum + Number(sale.total_amount || 0),
      0,
    );
    const totalStock = snapshot.inventories.reduce(
      (sum, inventory) => sum + Number(inventory.quantity || 0),
      0,
    );
    const activeProducts = snapshot.products.filter((product) => product.is_active).length;
    const averageTicket = snapshot.sales.length ? totalSales / snapshot.sales.length : 0;

    setText(metrics.salesAmount, formatCurrency(totalSales));
    setText(metrics.averageTicket, `Ticket moyen: ${formatCurrency(averageTicket)}`);
    setText(metrics.productsCount, String(snapshot.products.length));
    setText(metrics.activeProducts, `${activeProducts} produits actifs`);
    setText(metrics.alertsCount, String(snapshot.alerts.length));
    setText(metrics.stockTotal, `${totalStock} unites en stock`);
    setText(metrics.storesCount, String(snapshot.stores.length));
    setText(metrics.usersLabel, `${snapshot.users.length} utilisateurs relies`);
    setText(header, "Donnees synchronisees depuis l'API FastAPI.");
  }

  function renderTables(snapshot) {
    const productsById = new Map(snapshot.products.map((product) => [product.id, product]));
    const storesById = new Map(snapshot.stores.map((store) => [store.id, store]));

    if (productBody) {
      productBody.innerHTML = snapshot.products.length
        ? snapshot.products
            .slice(0, 10)
            .map(
              (product) => `
                <tr>
                  <td>${product.sku || "-"}</td>
                  <td>${product.name}</td>
                  <td>${product.category}</td>
                  <td>${formatCurrency(product.sale_price)}</td>
                  <td><span class="pill ${product.is_active ? "pill-success" : "pill-warning"}">${product.is_active ? "Actif" : "Inactif"}</span></td>
                </tr>
              `,
            )
            .join("")
        : '<tr><td colspan="5">Aucun produit disponible pour le moment.</td></tr>';
    }

    if (inventoriesBody) {
      inventoriesBody.innerHTML = snapshot.inventories.length
        ? snapshot.inventories
            .slice(0, 12)
            .map(
              (inventory) => `
                <tr>
                  <td>${getProductName(productsById, inventory.product_id)}</td>
                  <td>${getStoreName(storesById, inventory.store_id)}</td>
                  <td>${inventory.quantity}</td>
                  <td>${inventory.alert_threshold}</td>
                  <td>${availabilityPill(inventory.quantity, inventory.alert_threshold)}</td>
                </tr>
              `,
            )
            .join("")
        : '<tr><td colspan="5">Aucun stock disponible pour le moment.</td></tr>';
    }

    if (salesList) {
      salesList.innerHTML = snapshot.sales.length
        ? snapshot.sales
            .slice(0, 8)
            .map(
              (sale) => `
                <div>
                  <strong>VNT-${sale.id}</strong>
                  <span>${getProductName(productsById, sale.product_id)} - quantite ${sale.quantity}</span>
                  <small>${new Date(sale.sold_at).toLocaleString("fr-FR")} - ${formatCurrency(sale.total_amount)}</small>
                </div>
              `,
            )
            .join("")
        : '<div><strong>Aucune vente</strong><span>Ajoute une vente pour alimenter ce bloc.</span></div>';
    }

    if (alertList) {
      alertList.innerHTML = snapshot.alerts.length
        ? snapshot.alerts
            .slice(0, 6)
            .map(
              (alert) => `
                <div>
                  <strong>${getProductName(productsById, alert.product_id)}</strong>
                  <span>${alert.quantity} unites restantes a ${getStoreName(storesById, alert.store_id)}</span>
                </div>
              `,
            )
            .join("")
        : '<div><strong>Aucune alerte</strong><span>Le stock est au-dessus des seuils critiques.</span></div>';
    }

    if (storesGrid) {
      storesGrid.innerHTML = snapshot.stores.length
        ? snapshot.stores
            .map(
              (store) => `
                <div class="store-card">
                  <strong>${store.name}</strong>
                  <span>${store.town}</span>
                  <small>${store.address}</small>
                </div>
              `,
            )
            .join("")
        : '<div class="store-card"><strong>Aucune boutique</strong><span>Cree d\'abord une boutique.</span></div>';
    }

    if (usersBody) {
      usersBody.innerHTML = snapshot.users.length
        ? snapshot.users
            .map(
              (user) => `
                <tr>
                  <td>${user.name} ${user.surname}</td>
                  <td>${user.role}</td>
                  <td>${getStoreName(storesById, user.store_id)}</td>
                  <td><span class="pill pill-success">Actif</span></td>
                </tr>
              `,
            )
            .join("")
        : '<tr><td colspan="4">Aucun utilisateur disponible.</td></tr>';
    }
  }

  function renderCharts(snapshot) {
    const productsById = new Map(snapshot.products.map((product) => [product.id, product]));
    const storesById = new Map(snapshot.stores.map((store) => [store.id, store]));

    renderVerticalBars(charts.sales, computeWeeklySales(snapshot.sales), formatCurrency);
    renderHorizontalBars(charts.categories, computeCategoryStats(snapshot.products), (value) => `${value} produits`);
    renderHorizontalBars(charts.stockByStore, computeStockByStore(snapshot.inventories, storesById), (value) => `${value} unites`);
    renderHorizontalBars(charts.topProducts, computeTopProducts(snapshot.sales, productsById), (value) => `${value} ventes`);
  }

  function populateSelects(snapshot) {
    buildOptions(selects.inventoryProduct, snapshot.products, (item) => item.name);
    buildOptions(selects.saleProduct, snapshot.products, (item) => item.name);
    buildOptions(selects.inventoryStore, snapshot.stores, (item) => item.name);
    buildOptions(selects.saleStore, snapshot.stores, (item) => item.name);
    buildOptions(selects.userStore, snapshot.stores, (item) => item.name);
    buildOptions(selects.saleUser, snapshot.users, (item) => `${item.name} ${item.surname}`);
  }

  async function fetchSnapshot() {
    const [products, sales, alerts, stores, users, inventories] = await Promise.all([
      window.StockBoutikApi.get("/produits"),
      window.StockBoutikApi.get("/ventes"),
      window.StockBoutikApi.get("/stocks/alertes"),
      window.StockBoutikApi.get("/boutiques"),
      window.StockBoutikApi.get("/utilisateurs"),
      window.StockBoutikApi.get("/stocks"),
    ]);

    return { products, sales, alerts, stores, users, inventories };
  }

  async function loadDashboard() {
    clearGlobalError();
    try {
      lastSnapshot = await fetchSnapshot();
      renderMetrics(lastSnapshot);
      renderTables(lastSnapshot);
      renderCharts(lastSnapshot);
      populateSelects(lastSnapshot);
    } catch (error) {
      showGlobalError(error.message);
    }
  }

  function getStatusNode(form) {
    return form ? form.querySelector("[data-form-status]") : null;
  }

  function setFormStatus(form, message, isError) {
    const statusNode = getStatusNode(form);
    if (!statusNode) {
      return;
    }
    statusNode.hidden = false;
    statusNode.textContent = message;
    statusNode.classList.toggle("is-error", Boolean(isError));
    statusNode.classList.toggle("is-success", !isError);
  }

  function clearFormStatus(form) {
    const statusNode = getStatusNode(form);
    if (!statusNode) {
      return;
    }
    statusNode.hidden = true;
    statusNode.textContent = "";
    statusNode.classList.remove("is-error", "is-success");
  }

  function bindForm(config) {
    if (!config.element) {
      return;
    }

    config.element.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearFormStatus(config.element);

      try {
        const payload = config.buildPayload(new FormData(config.element));
        await window.StockBoutikApi.post(config.endpoint, payload);
        setFormStatus(config.element, "Enregistrement reussi.", false);
        config.element.reset();
        const checkbox = config.element.querySelector('input[type="checkbox"][name="is_active"]');
        if (checkbox) {
          checkbox.checked = true;
        }
        await loadDashboard();
      } catch (error) {
        setFormStatus(config.element, error.message, true);
      }
    });
  }

  Object.values(forms).forEach(bindForm);

  if (refreshButton) {
    refreshButton.addEventListener("click", loadDashboard);
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("stockboutik.auth");
      window.location.href = "login.html";
    });
  }

  loadDashboard();
})();
