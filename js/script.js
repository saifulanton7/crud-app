const API_URL = 'https://script.google.com/macros/s/AKfycbxjpxR5V57fYNUfkDKhCHCCrnh3zjEy34kLXg4LbnI8iTqQVt2WZjfrfsOTDnw-s-Dctg/exec'; // Ganti dengan URL Google Apps Script-mu

async function fetchData() {
  try {
    const response = await fetch(`${API_URL}?action=read`);
    const data = await response.json();
    tampilkanDataKeTabel(data);
  } catch (error) {
    console.error('Gagal mengambil data:', error);
    alert('Gagal mengambil data dari server.');
  }
}

async function tambahData(dataBaru) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'create', data: dataBaru }),
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await response.json();
    if (result.success) {
      clearForm();
      await fetchData();
    } else {
      alert('Gagal menambah data.');
    }
  } catch (error) {
    console.error('Gagal menambah data:', error);
    alert('Gagal menambah data.');
  }
}

async function hapusData(id) {
  if (!confirm('Yakin ingin menghapus data ini?')) return;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'delete', id }),
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await response.json();
    if (result.success) {
      await fetchData();
    } else {
      alert('Gagal menghapus data.');
    }
  } catch (error) {
    console.error('Gagal menghapus data:', error);
    alert('Gagal menghapus data.');
  }
}

async function updateData(id, dataUpdate) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'update', id, data: dataUpdate }),
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await response.json();
    if (result.success) {
      await fetchData();
    } else {
      alert('Gagal mengupdate data.');
    }
  } catch (error) {
    console.error('Gagal mengupdate data:', error);
    alert('Gagal mengupdate data.');
  }
}

function tampilkanDataKeTabel(dataArray) {
  const tbody = document.querySelector('#tabel-crud tbody');
  tbody.innerHTML = ''; 

  dataArray.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.nama}</td>
      <td>${item.deskripsi}</td>
      <td>${item.status}</td>
      <td>${item.tanggal}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editData(${item.id})">Edit</button>
        <button class="action-btn delete-btn" onclick="hapusData(${item.id})">Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

let editMode = false;
let editId = null;

function editData(id) {
  editMode = true;
  editId = id;
  const row = [...document.querySelectorAll('#tabel-crud tbody tr')].find(tr => tr.firstElementChild.textContent == id);
  
  if (!row) return alert('Data tidak ditemukan');

  document.querySelector('#input-nama').value = row.children[1].textContent;
  document.querySelector('#input-deskripsi').value = row.children[2].textContent;
  document.querySelector('#input-status').value = row.children[3].textContent;
  document.querySelector('#input-tanggal').value = row.children[4].textContent;
  document.querySelector('#btn-tambah').textContent = 'Update';
}

function clearForm() {
  document.querySelector('#input-nama').value = '';
  document.querySelector('#input-deskripsi').value = '';
  document.querySelector('#input-status').value = 'Belum Selesai';
  document.querySelector('#input-tanggal').value = '';
  document.querySelector('#btn-tambah').textContent = 'Tambah';
  editMode = false;
  editId = null;
}

document.querySelector('#btn-tambah').addEventListener('click', () => {
  const data = {
    nama: document.querySelector('#input-nama').value.trim(),
    deskripsi: document.querySelector('#input-deskripsi').value.trim(),
    status: document.querySelector('#input-status').value,
    tanggal: document.querySelector('#input-tanggal').value
  };

  if (!data.nama || !data.deskripsi || !data.tanggal) {
    return alert('Silakan isi semua field yang diperlukan.');
  }

  if (editMode) {
    updateData(editId, data);
  } else {
    tambahData(data);
  }
});

fetchData();
