const BASE_URL = "https://hitham.co/api/products";

export async function fetchProducts() {
  try {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return await response.json();
  }
  catch (error) {
    throw error;
  }
}

export async function fetchProductById(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Product not found");
    }

    return await response.json();
  }
  catch (error) {
    throw error;
  }
}

export async function createProduct(data) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Failed to create product");
    }

    return await response.json();
  }
  catch (error) {
    throw error;
  }
}

export async function updateProduct(id, data) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error("Failed to update product");
    }

    return await response.json();
  }
  catch (error) {
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    return true;
  }
  catch (error) {
    throw error;
  }
}