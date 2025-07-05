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

export const getDataPrivate = async (url) => {
  let token = await jwtStorage.retrieveToken();
  return fetch(REACT_APP_API_URL + url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) =>
      response.status >= 200 &&
      response.status <= 299 &&
      response.status !== 204
        ? response.json()
        : response,
    )
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw err;
    });
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

// Produk
export const getProducts = async () => {
  const res = await fetch('/api/v1/product/read', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error('Gagal mengambil produk');
  const data = await res.json();
  return data.datas || [];
};

export const getProductById = async (id) => {
  const res = await fetch(`/api/v1/product/read/${id}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error('Gagal mengambil detail produk');
  const data = await res.json();
  return data.datas?.[0] || null;
};

export const createProduct = async (formData) => {
  const res = await fetch('/api/v1/product/create', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: formData,
  });
  if (!res.ok) throw new Error('Gagal menambah produk');
  return await res.json();
};

export const updateProduct = async (id, formData) => {
  const res = await fetch(`/api/v1/product/update/${id}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: formData,
  });
  if (!res.ok) throw new Error('Gagal mengupdate produk');
  return await res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch(`/api/v1/product/delete/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  });
  if (!res.ok) throw new Error('Gagal menghapus produk');
  return await res.json();
};

// Rental (Pesanan)
export const getRentals = async () => {
  const res = await fetch('/api/v1/rental/read', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error('Gagal mengambil data pesanan');
  const data = await res.json();
  return data.datas || [];
};

export const updateRental = async (id, formData) => {
  const res = await fetch(`/api/v1/rental/update/${id}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: formData,
  });
  if (!res.ok) throw new Error('Gagal mengupdate pesanan');
  return await res.json();
};

export const deleteRental = async (id) => {
  const res = await fetch(`/api/v1/rental/delete/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
  });
  if (!res.ok) throw new Error('Gagal menghapus pesanan');
  return await res.json();
};

export const getRentalItemsByRentalId = async (rentalId) => {
  const res = await fetch(`/api/v1/rental_item/read?rental_id=${rentalId}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  if (!res.ok) throw new Error('Gagal mengambil detail pesanan');
  const data = await res.json();
  return data.datas || [];
};

export async function getPlaylists() {
  const res = await fetch('/api/v1/playlist/');
  const data = await res.json();
  return data.datas || [];
}

export async function createPlaylist(formData) {
  const res = await fetch('/api/v1/playlist/', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Gagal menambah playlist');
  return res.json();
}

export async function deletePlaylist(id) {
  const res = await fetch(`/api/v1/playlist/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Gagal menghapus playlist');
  return res.json();
}
