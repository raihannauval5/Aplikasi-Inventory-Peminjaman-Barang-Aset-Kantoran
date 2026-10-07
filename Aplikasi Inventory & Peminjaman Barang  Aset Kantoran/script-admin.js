const STORAGE_KEY = 'DATA_INVENTORY_LEND_APP';

const tabelAdminBody = document.getElementById('tabel-admin-body');
const filterSearch = document.getElementById('filter-search');
const filterStatus = document.getElementById('filter-status');

window.addEventListener('DOMContentLoaded', () => {
  renderTabelAdmin();
});

function renderTabelAdmin() {
  const listData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  updateKpi(listData);

  const querySearch = filterSearch.value.toLowerCase();
  const selectedStatus = filterStatus.value;

  const filteredData = listData.filter(item => {
    const matchText = item.resi.toLowerCase().includes(querySearch) ||
                      item.peminjam.toLowerCase().includes(querySearch) ||
                      item.barang.toLowerCase().includes(querySearch);
    const matchStatus = selectedStatus === 'semua' || item.status === selectedStatus;
    return matchText && matchStatus;
  });

  tabelAdminBody.innerHTML = '';

  if (filteredData.length === 0) {
    tabelAdminBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-cell">Tidak ada data peminjaman yang cocok.</td>
      </tr>
    `;
    return;
  }

  filteredData.forEach(item => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>
        <span class="badge-resi">${item.resi}</span><br>
        <strong>${item.peminjam}</strong>
      </td>
      <td>
        <strong>${item.barang}</strong><br>
        <span class="sub-text">${item.tglPinjam} s/d ${item.tglKembali}</span>
      </td>
      <td>
        <span class="note-text">"${item.keperluan}"</span>
      </td>
      <td>
        <select class="select-inline" onchange="updateStatusPeminjaman('${item.id}', this.value)">
          <option value="Pending" ${item.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Disetujui" ${item.status === 'Disetujui' ? 'selected' : ''}>Disetujui</option>
          <option value="Dikembalikan" ${item.status === 'Dikembalikan' ? 'selected' : ''}>Dikembalikan</option>
          <option value="Ditolak" ${item.status === 'Ditolak' ? 'selected' : ''}>Ditolak</option>
        </select>
      </td>
      <td>
        <div class="inline-action">
          <input type="text" id="note-input-${item.id}" placeholder="Kondisi barang/catatan..." value="${item.catatanAdmin !== 'Pengajuan sedang ditinjau oleh pengelola inventaris.' ? item.catatanAdmin : ''}">
          <button class="btn-save" onclick="simpanCatatanAdmin('${item.id}')">Simpan</button>
        </div>
      </td>
    `;
    tabelAdminBody.appendChild(tr);
  });
}

function updateKpi(data) {
  document.getElementById('kpi-total').innerText = data.length;
  document.getElementById('kpi-pending').innerText = data.filter(d => d.status === 'Pending').length;
  document.getElementById('kpi-disetujui').innerText = data.filter(d => d.status === 'Disetujui').length;
  document.getElementById('kpi-dikembalikan').innerText = data.filter(d => d.status === 'Dikembalikan').length;
}

window.updateStatusPeminjaman = function(id, statusBaru) {
  let listData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const idx = listData.findIndex(d => d.id === id);

  if (idx !== -1) {
    listData[idx].status = statusBaru;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listData));
    renderTabelAdmin();
  }
};

window.simpanCatatanAdmin = function(id) {
  const inputEl = document.getElementById(`note-input-${id}`);
  const txtNote = inputEl.value.trim();

  if (!txtNote) {
    alert('Masukkan catatan sebelum menyimpan!');
    return;
  }

  let listData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  const idx = listData.findIndex(d => d.id === id);

  if (idx !== -1) {
    listData[idx].catatanAdmin = txtNote;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listData));
    alert('Catatan admin berhasil disimpan!');
    renderTabelAdmin();
  }
};

window.resetDataAdmin = function() {
  if (confirm('Apakah Anda yakin ingin menghapus seluruh data peminjaman?')) {
    localStorage.removeItem(STORAGE_KEY);
    renderTabelAdmin();
  }
};