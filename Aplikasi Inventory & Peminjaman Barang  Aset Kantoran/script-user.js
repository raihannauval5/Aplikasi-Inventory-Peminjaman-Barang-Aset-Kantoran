const STORAGE_KEY = 'DATA_INVENTORY_LEND_APP';

const formPinjam = document.getElementById('form-pinjam');
const tabelUserBody = document.getElementById('tabel-user-body');

window.addEventListener('DOMContentLoaded', () => {
  renderTabelUser();
});

formPinjam.addEventListener('submit', function(e) {
  e.preventDefault();

  const namaPeminjam = document.getElementById('namaPeminjam').value.trim();
  const barang = document.getElementById('pilihanBarang').value;
  const tglPinjam = document.getElementById('tglPinjam').value;
  const tglKembali = document.getElementById('tglKembali').value;
  const keperluan = document.getElementById('keperluan').value.trim();

  // Generate Kode Resi Unik (Contoh: LEND-7392)
  const kodeResi = 'LEND-' + Math.floor(1000 + Math.random() * 9000);

  const dataBaru = {
    id: Date.now().toString(),
    resi: kodeResi,
    peminjam: namaPeminjam,
    barang: barang,
    tglPinjam: tglPinjam,
    tglKembali: tglKembali,
    keperluan: keperluan,
    status: 'Pending',
    catatanAdmin: 'Pengajuan sedang ditinjau oleh pengelola inventaris.',
    createdAt: new Date().toLocaleDateString('id-ID')
  };

  const listData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  listData.unshift(dataBaru);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listData));

  alert(`Pengajuan berhasil terkirim! Kode Resi Anda: ${kodeResi}`);
  formPinjam.reset();
  renderTabelUser();
});

function renderTabelUser() {
  const listData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  tabelUserBody.innerHTML = '';

  if (listData.length === 0) {
    tabelUserBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-cell">Belum ada riwayat peminjaman aset.</td>
      </tr>
    `;
    return;
  }

  listData.forEach(item => {
    const tr = document.createElement('tr');
    
    // Class status untuk styling badge
    const statusClass = item.status.toLowerCase().replace(/\s+/g, '-');

    tr.innerHTML = `
      <td><span class="badge-resi">${item.resi}</span></td>
      <td>
        <strong>${item.barang}</strong><br>
        <span class="sub-text">${item.peminjam}</span>
      </td>
      <td>
        <span class="date-text">${item.tglPinjam} s/d ${item.tglKembali}</span>
      </td>
      <td><span class="status-pill status-${statusClass}">${item.status}</span></td>
      <td><span class="note-text">${item.catatanAdmin}</span></td>
    `;
    tabelUserBody.appendChild(tr);
  });
}