import { formatPriceForUI } from "./utils.js";

export function showLoading(el) {
  el.classList.remove("hidden");
}

export function hideLoading(el) {
  el.classList.add("hidden");
}

export function showError(el, message) {
  el.textContent = message;
  el.classList.remove("hidden");
}

export function hideError(el) {
  el.textContent = "";
  el.classList.add("hidden");
}

export function populateCategories(products, select) {
  while (select.options.length > 1) {
    select.remove(1);
  }

  const categories = [];

  for (const p of products) {
    const cat = p && p.category ? String(p.category).trim() : "";
    if (cat !== "" && !categories.includes(cat)) {
      categories.push(cat);
    }
  }

  for (const c of categories) {
    const option = document.createElement("option");
    option.value = c;
    option.textContent = c;
    select.appendChild(option);
  }
}

export function renderProducts(products, container) {
  container.innerHTML = "";

  if (!products.length) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }

  for (const product of products) {
    const card = document.createElement("div");
    card.classList.add("product-card");

    const name = document.createElement("h2");
    name.textContent = product && product.name ? product.name : "Unnamed Product";

    const category = document.createElement("span");
    category.classList.add("product-category");
    category.textContent = product && product.category ? product.category : "N/A";

    const description = document.createElement("p");
    description.classList.add("product-description");
    description.textContent = product && product.description ? product.description : "No description";

    const price = document.createElement("p");
    price.classList.add("product-price");
    price.textContent = formatPriceForUI(product ? product.price : null);

    const status = document.createElement("span");
    status.classList.add("status-badge");

    if (product && product.available === true) {
      status.textContent = "In Stock";
      status.classList.add("status-in");
    } else {
      status.textContent = "Out of Stock";
      status.classList.add("status-out");
    }

    const actions = document.createElement("div");
    actions.classList.add("card-actions");

    const editBtn = document.createElement("a");
    editBtn.classList.add("btn", "edit-btn");
    editBtn.textContent = "Edit";
    editBtn.href = `edit-product.html?id=${product.id}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.classList.add("btn", "delete-btn");
    deleteBtn.textContent = "Delete";

    deleteBtn.setAttribute("data-id", product.id);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(name);
    card.appendChild(category);
    card.appendChild(description);
    card.appendChild(price);
    card.appendChild(status);
    card.appendChild(actions);

    container.appendChild(card);
  }
}