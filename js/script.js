document.addEventListener('DOMContentLoaded', () => {
    const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL'; // Ganti dengan URL Google Apps Script Web App kamu

    const addButton = document.getElementById('addButton');
    const dataTableBody = document.querySelector('#dataTable tbody');

    // Fungsi untuk mengambil data dari Google Apps Script
    async function fetchData() {
        try {
            const response = await fetch(`${SCRIPT_URL}?action=read`);
            const data = await response.json();
            renderTable(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Gagal mengambil data. Pastikan URL API benar dan Google Apps Script sudah di-deploy.');
        }
    }

    // Fungsi untuk menampilkan data ke tabel
    function renderTable(data) {
        dataTableBody.innerHTML = ''; // Kosongkan tabel sebelum render ulang
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.ID}</td>
                <td>${row.Nama}</td>
                <td>${row.Deskripsi}</td>
                <td>${row.Status}</td>
                <td>${row.Tanggal}</td>
                <td class="action-buttons">
                    <button class="edit-btn" data-id="${row.ID}">Edit</button>
                    <button class="delete-btn" data-id="${row.ID}">Delete</button>
                </td>
            `;
            dataTableBody.appendChild(tr);
        });

        // Tambahkan event listener untuk tombol edit dan delete
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', handleEdit);
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    }

    // Fungsi untuk menangani penambahan data baru
    addButton.addEventListener('click', async () => {
        const id = document.getElementById('id').value;
        const nama = document.getElementById('nama').value;
        const deskripsi = document.getElementById('deskripsi').value;
        const status = document.getElementById('status').value;
        const tanggal = document.getElementById('tanggal').value;

        if (!id || !nama || !deskripsi || !status || !tanggal) {
            alert('Semua field harus diisi!');
            return;
        }

        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Penting untuk Google Apps Script
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'create',
                    ID: id,
                    Nama: nama,
                    Deskripsi: deskripsi,
                    Status: status,
                    Tanggal: tanggal
                }).toString()
            });
            // Karena mode 'no-cors', response.ok akan selalu false. Kita harus asumsi berhasil jika tidak ada error.
            alert('Data berhasil ditambahkan!');
            // Bersihkan form
            document.getElementById('id').value = '';
            document.getElementById('nama').value = '';
            document.getElementById('deskripsi').value = '';
            document.getElementById('tanggal').value = '';
            fetchData(); // Muat ulang data setelah menambahkan
        } catch (error) {
            console.error('Error adding data:', error);
            alert('Gagal menambahkan data.');
        }
    });

    // Fungsi untuk menangani edit data (masih perlu pengembangan lebih lanjut untuk mengisi form dan update)
    function handleEdit(event) {
        const idToEdit = event.target.dataset.id;
        alert(`Fungsi Edit untuk ID: ${idToEdit} akan datang!`);
        // Di sini kamu perlu menambahkan logika untuk:
        // 1. Mengambil data item berdasarkan ID
        // 2. Mengisi form dengan data item tersebut
        // 3. Mengubah tombol "Tambah" menjadi "Update" atau menambahkan tombol "Update" baru
        // 4. Mengirim permintaan update ke Google Apps Script
    }

    // Fungsi untuk menangani delete data
    async function handleDelete(event) {
        const idToDelete = event.target.dataset.id;
        if (!confirm(`Yakin ingin menghapus data dengan ID: ${idToDelete}?`)) {
            return;
        }

        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Penting untuk Google Apps Script
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'delete',
                    ID: idToDelete
                }).toString()
            });
            alert('Data berhasil dihapus!');
            fetchData(); // Muat ulang data setelah menghapus
        } catch (error) {
            console.error('Error deleting data:', error);
            alert('Gagal menghapus data.');
        }
    }

    // Muat data saat halaman pertama kali dimuat
    fetchData();
});
