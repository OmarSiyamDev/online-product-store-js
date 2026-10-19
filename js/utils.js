export function isEditPage() {
  return window.location.href.indexOf("edit-product.html") !== -1;
}

export function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

export function normalizePrice(input) {
  if (input === undefined || input === null) return null;

  let s = String(input).trim();
  if (s === "") return null;

  if (s.charAt(0) === "$") {
    s = s.slice(1).trim();
  }

  if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;

  const n = Number(s);
  if (isNaN(n)) return null;

  return "$" + n.toFixed(2);
}

export function priceToNumber(input) {
  const normalized = normalizePrice(input);
  if (normalized === null) return null;

  const s = normalized.slice(1);
  const n = Number(s);
  if (isNaN(n)) return null;

  return n;
}

export function formatPriceForUI(price) {
  const normalized = normalizePrice(price);
  if (normalized === null) return "N/A";
  return normalized;
}

export function validateProduct(data) {
  const errors = {};

  const name = data.name ? String(data.name) : "";
  const category = data.category ? String(data.category) : "";
  const description = data.description ? String(data.description) : "";
  const price = data.price ? String(data.price) : "";

  if (name.trim() === "") errors.name = "Product name is required";
  if (category.trim() === "") errors.category = "Category is required";
  if (description.trim() === "") errors.description = "Description is required";

  if (price.trim() === "") {
    errors.price = "Price is required";
  } else {
    if (normalizePrice(price) === null) {
      errors.price = "Price must be like $1200.00 or 1200.00";
    }
  }

  return errors;
}

export function mapApiToAppProduct(apiProduct) {
  const id = apiProduct.id !== undefined ? apiProduct.id : apiProduct.Id;
  const name = apiProduct.name !== undefined ? apiProduct.name : apiProduct.Name;
  const categoryRaw = apiProduct.category !== undefined ? apiProduct.category : apiProduct.Category;
  const description = apiProduct.description !== undefined ? apiProduct.description : (apiProduct.Description || "");

  const price = apiProduct.price !== undefined ? apiProduct.price : apiProduct.Price;

  let available = false;

  if (apiProduct.available !== undefined) {
    available = apiProduct.available === true;
  } else if (apiProduct.Stock !== undefined) {
    available = Number(apiProduct.Stock) > 0;
  }

  const category = categoryRaw ? String(categoryRaw).trim().toLowerCase() : "";

  return {
    id: id,
    name: name || "",
    category: category,
    description: description || "",
    price: price,
    available: available
  };
}