fetch('json/album.json')
  .then(response => response.json())
  .then(albums => {
    const albumListContainer = document.getElementById('albumList');
    const searchInput = document.querySelector('.memories-search');

    // Tampilkan daftar album secara acak
    displayRandomAlbums(albums);

    // Fungsi untuk menampilkan daftar album secara acak
    function displayRandomAlbums(albums) {
      // Acak urutan album
      shuffleArray(albums);

      // Tampilkan album yang sudah diacak
      displayAlbums(albums);
    }

    // Fungsi untuk menampilkan daftar album
    function displayAlbums(albums) {
      albumListContainer.innerHTML = ''; // Kosongkan container sebelum menampilkan album
      albums.forEach(album => {
        const albumItem = document.createElement('div');
        albumItem.classList.add('album-item');
        albumItem.dataset.albumId = album.id;
        albumItem.innerHTML = `
          <div class="album-item-container">
          <img src="${album.cover}" alt="${album.title}" class="album-cover" onerror="this.onerror=null;this.src='https://via.placeholder.com/150';">
          <h3 class="album-title">${album.title}</h3>
          <p class="album-artist">${album.artist}</p>
          <div class="album-crit">
          <p>${album.tanggal}</p>
          </div>
          </div>
        `;
        albumListContainer.appendChild(albumItem);

        // Tambahkan event listener untuk menampilkan detail album saat diklik
        albumItem.addEventListener('click', () => {
          displayAlbumDetails(album);
        });
      });
    }

    // Fungsi untuk menampilkan detail album
    class AlbumDetails {
      constructor(album) {
        this.album = album;
        this.render();
      }

      render() {
        const albumDetailsContainer = document.getElementById('albumDetails');
        albumDetailsContainer.innerHTML = `
        <div class="album-details-container">
        <div class="album-details-button">
        <div id="closeButton">
        <a href="#"><i class="fas fa-chevron-left"></i></a>
      </div>
</div>
        <div class="album-details">
          <h2 class="album-details-title">${this.album.title}</h2>
          <img src="${this.album.cover}" alt="${this.album.title}" class="album-details-cover" onerror="this.onerror=null;this.src='https://via.placeholder.com/150';">
          <p class="album-details-artist">${this.album.artist}</p>
          <p class="album-details-tanggal">Date: ${this.album.tanggal}</p>
          <p class="album-details-Description">${this.album.description}</p>
        </div>
      </div>
        `;

        // Tambahkan event listener untuk tombol close
        const closeButton = document.getElementById('closeButton');
        closeButton.addEventListener('click', () => {
          albumDetailsContainer.innerHTML = ''; // Kosongkan detail album
        });
      }
    }

    // Fungsi untuk menampilkan detail album saat diklik
    function displayAlbumDetails(album) {
      new AlbumDetails(album);
    }

    // Fungsi untuk mengacak array
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

// Kode untuk tombol kategori
const categoryButtonsContainer = document.getElementById('categoryButtons');

// Buat set baru untuk menyimpan tahun-tahun yang unik
const years = new Set(albums.map(album => album.tanggal));

// Tambahkan kategori "All"
years.add('All');

// Tampilkan tombol untuk setiap tahun (kategori)
years.forEach(year => {
  const categoryButton = document.createElement('button');
  categoryButton.textContent = year;
  categoryButton.classList.add('category-button');
  categoryButtonsContainer.appendChild(categoryButton);

  // Tambahkan event listener untuk setiap kategori (tahun)
  categoryButton.addEventListener('click', () => {
    // Hapus kelas 'active' dari semua tombol kategori
    document.querySelectorAll('.category-button').forEach(button => {
      button.classList.remove('active');
    });

    // Tandai tombol yang diklik sebagai aktif
    categoryButton.classList.add('active');

    if (year === 'All') {
      displayAlbums(albums); // Tampilkan semua album jika kategori "All" dipilih
    } else {
      filterAlbumsByCategory(year);
    }
  });
});

// Fungsi untuk memfilter album berdasarkan kategori (tahun)
function filterAlbumsByCategory(year) {
  let filteredAlbums;
  // Filter album berdasarkan tahun
  filteredAlbums = albums.filter(album => album.tanggal === year);
  displayFilteredAlbums(filteredAlbums);
}


    // Fungsi untuk menampilkan album yang sudah difilter
    function displayFilteredAlbums(filteredAlbums) {
      displayAlbums(filteredAlbums);
    }

    // Fungsi untuk mencari album berdasarkan judul
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.trim().toLowerCase();
      const filteredAlbums = albums.filter(album => album.title.toLowerCase().includes(searchTerm));
      displayFilteredAlbums(filteredAlbums);
    });
  });
