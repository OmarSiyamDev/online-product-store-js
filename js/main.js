import {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "./api.js";

import {
  renderProducts,
  showLoading,
  hideLoading,
  showError,
  hideError,
  populateCategories
} from "./ui.js";

import {
  validateProduct,
  normalizePrice,
  priceToNumber,
  getIdFromURL,
  isEditPage,
  mapApiToAppProduct
} from "./utils.js";

let products = [];

const productContainer = document.querySelector("#productContainer");
const categoryFilter = document.querySelector("#categoryFilter");
const availabilityFilter = document.querySelector("#availabilityFilter");
const loadingEl = document.querySelector("#loading");
const errorEl = document.querySelector("#errorMessage");

const productForm = document.querySelector("#productForm");

if (productContainer) {
  initListingPage();
}

if (productForm) {
  initFormPage();
}


async function initListingPage() {
  showLoading(loadingEl);
  hideError(errorEl);

  try {
    const apiProducts = await fetchProducts();

    products = apiProducts.map(function (p) {
      return mapApiToAppProduct(p);
    });

    populateCategories(products, categoryFilter);
    renderFilteredProducts();
  }
  catch (error) {
    showError(errorEl, "Failed to load products. " + error.message);
  }
  finally {
    hideLoading(loadingEl);
  }

  categoryFilter.addEventListener("change", renderFilteredProducts);
  availabilityFilter.addEventListener("change", renderFilteredProducts);

  productContainer.addEventListener("click", handleDeleteClick);
}

function renderFilteredProducts() {
  let filtered = products.slice();

  const categoryValue = categoryFilter.value;
  const availabilityValue = availabilityFilter.value;

  if (categoryValue !== "all") {
    filtered = filtered.filter(function (p) {
      return p.category === categoryValue;
    });
  }

  if (availabilityValue === "available") {
    filtered = filtered.filter(function (p) {
      return p.available === true;
    });
  } else if (availabilityValue === "unavailable") {
    filtered = filtered.filter(function (p) {
      return p.available === false;
    });
  }

  renderProducts(filtered, productContainer);
}

async function handleDeleteClick(event) {
  if (!event.target.classList.contains("delete-btn")) return;

  const id = event.target.getAttribute("data-id");
  const ok = confirm("Are you sure you want to delete this product?");
  if (!ok) return;

  hideError(errorEl);

  try {
    await deleteProduct(id);

    products = products.filter(function (p) {
      return String(p.id) !== String(id);
    });

    renderFilteredProducts();
    alert("Product deleted successfully.");
  }
  catch (error) {
    showError(errorEl, "Delete failed. " + error.message);
  }
}


async function initFormPage() {
  clearErrors();

  if (isEditPage()) {
    await loadProductToForm();
  }

  productForm.addEventListener("submit", handleSubmit);
}

async function loadProductToForm() {
  const id = getIdFromURL();

  if (!id) {
    alert("Missing product ID in URL.");
    window.location.href = "index.html";
    return;
  }

  try {
    const apiProduct = await fetchProductById(id);
    const product = mapApiToAppProduct(apiProduct);

    document.querySelector("#name").value = product.name;
    document.querySelector("#category").value = product.category;
    document.querySelector("#description").value = product.description;
    document.querySelector("#price").value = normalizePrice(product.price) || "";
    document.querySelector("#available").checked = product.available === true;
  }
  catch (error) {
    alert("Failed to load product. " + error.message);
    window.location.href = "index.html";
  }
}

async function handleSubmit(event) {
  event.preventDefault();

  const name = document.querySelector("#name").value;
  const category = document.querySelector("#category").value;
  const description = document.querySelector("#description").value;
  const priceInput = document.querySelector("#price").value;
  const available = document.querySelector("#available").checked;

  const data = {
    name: name,
    category: category,
    description: description,
    price: priceInput,
    available: available
  };

  const errors = validateProduct(data);

  clearErrors();

  const hasErrors = errors.name || errors.category || errors.description || errors.price;
  if (hasErrors) {
    showFormErrors(errors);
    return;
  }

  const normalized = normalizePrice(data.price);
  data.price = normalized;

  const priceNumber = priceToNumber(data.price);
  const payload = {
    name: data.name,
    category: data.category,
    description: data.description,
    price: data.price,
    available: data.available,

    Name: data.name,
    Category: data.category,
    Description: data.description,
    Price: priceNumber,
    Stock: data.available ? 1 : 0
  };

  try {
    if (isEditPage()) {
      const id = getIdFromURL();
      await updateProduct(id, payload);
      alert("Product updated successfully.");
    } else {
      await createProduct(payload);
      alert("Product created successfully.");
    }

    window.location.href = "index.html";
  }
  catch (error) {
    alert("Operation failed. " + error.message);
  }
}


function clearErrors() {
  const nameError = document.querySelector("#nameError");
  const categoryError = document.querySelector("#categoryError");
  const descriptionError = document.querySelector("#descriptionError");
  const priceError = document.querySelector("#priceError");

  if (nameError) nameError.textContent = "";
  if (categoryError) categoryError.textContent = "";
  if (descriptionError) descriptionError.textContent = "";
  if (priceError) priceError.textContent = "";
}

function showFormErrors(errors) {
  if (errors.name) document.querySelector("#nameError").textContent = errors.name;
  if (errors.category) document.querySelector("#categoryError").textContent = errors.category;
  if (errors.description) document.querySelector("#descriptionError").textContent = errors.description;
  if (errors.price) document.querySelector("#priceError").textContent = errors.price;
}