const API_URL = 'http://localhost:3000/notes';

const noteForm = document.getElementById('noteForm');
const noteId = document.getElementById('noteId');
const judulInput = document.getElementById('judul');
const isiInput = document.getElementById('isi');
const notesList = document.getElementById('notesList');
const messageBox = document.getElementById('messageBox');
const cancelButton = document.getElementById('cancelButton');
const refreshButton = document.getElementById('refreshButton');
const saveButton = document.getElementById('saveButton');

function showMessage(text, type = 'success') {
  messageBox.innerHTML = `<div class="message ${type}">${text}</div>`;

  setTimeout(() => {
    messageBox.innerHTML = '';
  }, 2500);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}

function resetForm() {
  noteId.value = '';
  judulInput.value = '';
  isiInput.value = '';
  saveButton.textContent = 'Simpan';
}

async function fetchNotes() {
  try {
    const response = await fetch(API_URL);
    const notes = await response.json();

    notesList.innerHTML = '';

    if (!Array.isArray(notes) || notes.length === 0) {
      notesList.innerHTML = `
        <div class="empty-state">
          Belum ada catatan. Tambahkan catatan pertama kamu.
        </div>
      `;
      return;
    }

    notes.forEach((note) => {
      const card = document.createElement('div');
      card.className = 'note-card';

      const judul = escapeHtml(note.judul);
      const isi = escapeHtml(note.isi);
      const tanggal = new Date(note.tanggal_dibuat).toLocaleString('id-ID');

      card.innerHTML = `
        <h3>${judul}</h3>
        <p>${isi}</p>
        <small class="note-date">Dibuat: ${tanggal}</small>
        <div class="note-actions">
          <button class="edit-btn" data-id="${note.id}">Edit</button>
          <button class="delete-btn" data-id="${note.id}">Hapus</button>
        </div>
      `;

      const editBtn = card.querySelector('.edit-btn');
      const deleteBtn = card.querySelector('.delete-btn');

      editBtn.addEventListener('click', () => {
        fillFormForEdit(note);
      });

      deleteBtn.addEventListener('click', () => {
        deleteNote(note.id);
      });

      notesList.appendChild(card);
    });
  } catch (error) {
    showMessage('Gagal mengambil data dari server', 'error');
  }
}

function fillFormForEdit(note) {
  noteId.value = note.id;
  judulInput.value = note.judul;
  isiInput.value = note.isi;
  saveButton.textContent = 'Update Catatan';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function createNote(data) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return response.json();
}

async function updateNote(id, data) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return response.json();
}

async function deleteNote(id) {
  const yakin = confirm('Yakin ingin menghapus catatan ini?');
  if (!yakin) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (!response.ok) {
      showMessage(result.message || 'Gagal menghapus catatan', 'error');
      return;
    }

    showMessage(result.message || 'Catatan berhasil dihapus');
    fetchNotes();
  } catch (error) {
    showMessage('Terjadi kesalahan saat menghapus catatan', 'error');
  }
}

noteForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const data = {
    judul: judulInput.value.trim(),
    isi: isiInput.value.trim()
  };

  if (!data.judul || !data.isi) {
    showMessage('Judul dan isi wajib diisi', 'error');
    return;
  }

  try {
    let result;
    if (noteId.value) {
      result = await updateNote(noteId.value, data);
      showMessage(result.message || 'Catatan berhasil diupdate');
    } else {
      result = await createNote(data);
      showMessage(result.message || 'Catatan berhasil ditambahkan');
    }

    resetForm();
    fetchNotes();
  } catch (error) {
    showMessage('Terjadi kesalahan saat menyimpan catatan', 'error');
  }
});

cancelButton.addEventListener('click', () => {
  resetForm();
});

refreshButton.addEventListener('click', () => {
  fetchNotes();
});

fetchNotes();