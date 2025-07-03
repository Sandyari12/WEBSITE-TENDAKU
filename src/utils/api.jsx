const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const getData = async (endpoint) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data");
  }

  return await response.json();
};

export const createData = async (endpoint, data) => {
  const isFormData = data instanceof FormData;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: isFormData ? {} : { "Content-Type": "application/json" },
    body: isFormData ? data : JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gagal menambahkan data: ${err}`);
  }

  return await response.json();
};

export const updateData = async (endpoint, data) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT", // HARUS PUT, bukan POST
    body: data, // Jangan stringify kalau FormData
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gagal memperbarui data: ${err}`);
  }

  return await response.json();
};



export const deleteData = async (endpoint) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Gagal menghapus data");
  }

  return await response.json();
};
