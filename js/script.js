const API_URL = 'https://script.google.com/macros/s/AKfycbxjpxR5V57fYNUfkDKhCHCCrnh3zjEy34kLXg4LbnI8iTqQVt2WZjfrfsOTDnw-s-Dctg/exec';  // Ganti dengan URL Web App Google Apps Script-mu

// Fungsi untuk fetch data (Read)
async function fetchData() {
  try {
    const response = await fetch(`${API_URL}?action=read`);
    const data = await response.json();
    tampilkanDataKeTabel(data);
  } catch (error) {
    console.error('Gagal mengambil data:', error);
  }
}

// Fungsi untuk tambah data (Create)
async function tambahData(dataBaru) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({action: 'create', data: dataBaru}),
      headers: {'Content-Type': 'application/json'}
    });
    const result = await response.json();
    if (result.success) {
      await fetchData(); // refresh data tabel setelah tambah
    }
  } catch (error) {
    console.error('Gagal menambah data:', error);
  }
}

// Fungsi untuk update data (Update)
async function updateData(id, dataUpdate) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({action: 'update', id: id, data: dataUpdate}),
      headers: {'Content-Type': 'application/json'}
    });
    const result = await response.json();
    if (result.success) {
      await fetchData(); // refresh data tabel setelah update
    }
  } catch (error) {
    console.error('Gagal mengupdate data:', error);
  }
}

// Fungsi untuk hapus data (Delete)
async function hapusData(id) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({action: 'delete', id: id}),
      headers: {'Content-Type': 'application/json'}
    });
    const result = await response.json();
    if (result.success) {
      await fetchData(); // refresh data tabel setelah hapus
    }
  } catch (error) {
    console.error('Gagal menghapus data:', error);
  }
}

// Fungsi menampilkan data ke tabel HTML (contoh sederhana)
function tampilkanDataKeTabel(dataArray) {
  const tbody = document.querySelector('#tabel-crud tbody');
  tbody.innerHTML = ''; // kosongkan dulu

  dataArray.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.nama}</td>
      <td>${item.deskripsi}</td>
      <td>${item.status}</td>
      <td>${item.tanggal}</td>
      <td>
        <button onclick="editData(${item.id})">Edit</button>
        <button onclick="hapusData(${item.id})">Hapus</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

// Contoh handler button tambah data
document.querySelector('#btn-tambah').addEventListener('click', () => {
  const dataBaru = {
    nama: document.querySelector('#input-nama').value,
    deskripsi: document.querySelector('#input-deskripsi').value,
    status: document.querySelector('#input-status').value,
    tanggal: document.querySelector('#input-tanggal').value
  };
  tambahData(dataBaru);
});
