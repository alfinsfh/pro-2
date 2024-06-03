// Ambil kutipan produk dari file JSON
fetch('json/products.json')
  .then(response => response.json())
  .then(data => {
    const products = data;
    let index = 0;
    const quoteContainer = document.getElementById('quoteContainer');

    // Fungsi untuk menampilkan kutipan produk secara bergantian
    function displayNextQuote() {
      // Membuat bubble chat untuk menampilkan kutipan produk
      const bubbleChatHTML = `
            <div class="bubble-chat">
                ${products[index].quote}
                <img src="${products[index].foto}" alt="${products[index].nama}" onerror="this.onerror=null;this.src='https://via.placeholder.com/150';">
            </div>
        `;

      // Tambahkan bubble chat ke quoteContainer menggunakan innerHTML
      quoteContainer.innerHTML = bubbleChatHTML;

      // Perbarui indeks untuk menampilkan kutipan produk selanjutnya
      index = (index + 1) % products.length;
    }

    // Tampilkan kutipan produk pertama kali
    displayNextQuote();

    // Set interval untuk menampilkan kutipan produk secara bergantian
    setInterval(displayNextQuote, 5000); // Ganti 5000 dengan interval yang diinginkan
  });



const searchInput = document.getElementById('searchInput');
const productList = document.getElementById('productList');
const alternateProductList = document.getElementById('alternateProductList');
const productDetails = document.getElementById('productDetails');
const categoryFilter = document.getElementById('categoryFilter'); // Get category filter element

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


// Load products from JSON file
fetch('json/products.json')
  .then(response => response.json())
  .then(data => {
    const products = data;

    shuffleArray(products);

    // Display all products initially
    displayProductsAlternate(products);
    displayProductsByCategory(products);
    displayProductsAlternate(products);
    displayProducts(products);

    // Listen for search input changes
    // Listen for search input changes
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredProducts = products.filter(product =>
        product.nama.toLowerCase().includes(searchTerm) ||
        (product.detail && product.detail.toLowerCase().includes(searchTerm))
      );

      displayProducts(filteredProducts);

      // Generate search recommendations based on input
      const searchRecommendations = generateSearchRecommendations(searchTerm);
      displaySearchRecommendations(searchRecommendations);
    });

    // Function to generate search recommendations
    function generateSearchRecommendations(searchTerm) {
      // Filter products to find namas that match the search term
      const matchingProducts = products.filter(product =>
        product.nama.toLowerCase().includes(searchTerm)
      );

      // Extract unique words from matching product namas
      const words = matchingProducts.flatMap(product =>
        product.nama.toLowerCase().split(' ')
      );
      const uniqueWords = [...new Set(words)];

      return uniqueWords;
    }

    // Function to display search recommendations
    function displaySearchRecommendations(recommendations) {
      const recommendationList = document.getElementById('searchRecommendations');
      recommendationList.innerHTML = '';

      recommendations.forEach(recommendation => {
        const recommendationItem = document.createElement('li');
        recommendationItem.textContent = recommendation;
        recommendationItem.addEventListener('click', () => {
          searchInput.value = recommendation;
          recommendationList.innerHTML = ''; // Clear recommendations
          // Trigger search or other action here
        });
        recommendationList.appendChild(recommendationItem);
      });

      // Show/hide the recommendation list based on content
      if (recommendations.length > 0) {
        recommendationList.style.display = 'block';
      } else {
        recommendationList.style.display = 'none';
      }
    }

    // Listen for clicks outside the search input to clear recommendations
    document.addEventListener('click', (event) => {
      const targetElement = event.target;

      // Check if the click target is outside the search input
      if (!searchInput.contains(targetElement)) {
        clearSearchRecommendations();
      }
    });

    // Function to clear search recommendations
    function clearSearchRecommendations() {
      const recommendationList = document.getElementById('searchRecommendations');
      recommendationList.innerHTML = '';
    }



    // Listen for category filter changes
    categoryFilter.addEventListener('change', () => {
      const selectedCategory = categoryFilter.value;
      const filteredProducts = products.filter(product =>
        (!selectedCategory || product.category === selectedCategory)
      );

      displayProducts(filteredProducts);
    });

    // ...

    // Display products in their respective category sections
    function displayProductsByCategory(products) {
      const categoryContainers = {
        "beef": document.getElementById("beefProducts"),
        "seafood": document.getElementById("seafoodProducts")
        // Tambahkan kategori lainnya jika diperlukan
      };

      // Clear the existing content
      for (const containerId in categoryContainers) {
        categoryContainers[containerId].innerHTML = ``;
      }



      // Populate category sections with products
      products.forEach(product => {
        if (categoryContainers[product.category]) {
          const productItem = document.createElement('div');
          productItem.classList.add('product-ctg');
          productItem.dataset.productId = product.nama;
          productItem.innerHTML = `
          <div class="product-card-ctg">
          <img src="${product.image}" alt="${product.nama}" class="product-image-ctg" onerror="this.onerror=null;this.src='https://via.placeholder.com/150';">
          <h3 class="product-nama-ctg">${product.nama}</h3>
          <p class="product-info-ctg">${product.info}</p>
        </div>
        
          

        
          `;
          categoryContainers[product.category].appendChild(productItem);

          // Add a click event listener to each product item
          productItem.addEventListener('click', () => {
            const selectedProduct = products.find(p => p.nama === productItem.dataset.productId);
            displayProductDetails(selectedProduct);
          });
        }
      });
    }

    // ...

    // Replace this line in your existing code
    displayProducts(products);

    // with
    displayProductsByCategory(products);


    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      const selectedCategory = document.getElementById('categoryFilter').value; // Get selected category value
      const filteredProducts = products.filter(product =>
        (product.nama.toLowerCase().includes(searchTerm) ||
          (product.detail && product.detail.toLowerCase().includes(searchTerm))) &&
        (!selectedCategory || product.category === selectedCategory) // Apply category filter
      );

      displayProducts(filteredProducts);
    });


    // Display product details
    productList.addEventListener('click', event => {
      const productItem = event.target.closest('.product-item');
      if (productItem) {
        const selectedProductId = productItem.dataset.productId;
        const selectedProduct = products.find(product => product.nama === selectedProductId);
        displayProductDetails(selectedProduct);
      }
    });
  });

// Fungsi untuk menentukan ikon zodiak berdasarkan tanggal lahir
function determineZodiacIcon(birthDateString) {
  const birthDate = new Date(birthDateString);
  const month = birthDate.getMonth() + 1; // Months are zero indexed
  const day = birthDate.getDate();

  // Menentukan zodiak berdasarkan bulan dan tanggal lahir
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Aquarius_symbol_%28bold%29.svg/480px-Aquarius_symbol_%28bold%29.svg.png';
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Pisces_symbol_%28bold%29.svg/480px-Pisces_symbol_%28bold%29.svg.png';
  } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Aries_symbol_%28bold%29.svg/480px-Aries_symbol_%28bold%29.svg.png';
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Taurus_symbol_%28bold%29.svg/40px-Taurus_symbol_%28bold%29.svg.png';
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Gemini_symbol_%28bold%29.svg/480px-Gemini_symbol_%28bold%29.svg.png';
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Cancer_symbol_%28bold%29.svg/480px-Cancer_symbol_%28bold%29.svg.png';
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Leo_symbol_%28bold%29.svg/480px-Leo_symbol_%28bold%29.svg.png';
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Virgo_symbol_%28bold%29.svg/480px-Virgo_symbol_%28bold%29.svg.png';
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Libra_symbol_%28bold%29.svg/480px-Libra_symbol_%28bold%29.svg.png';
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Scorpius_symbol_%28bold%29.svg/480px-Scorpius_symbol_%28bold%29.svg.png';
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Sagittarius_symbol_%28bold%29.svg/480px-Sagittarius_symbol_%28bold%29.svg.png';
  } else { // Capricorn
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Capricorn_symbol_%28bold%29.svg/480px-Capricorn_symbol_%28bold%29.svg.png';
  }
}

// Fungsi untuk menampilkan daftar produk
function displayProducts(products) {
  productList.innerHTML = '';
  products.forEach(product => {
    const productItem = document.createElement('div');
    productItem.classList.add('product-item');
    productItem.dataset.productId = product.nama;

    // Menggunakan warna hex untuk gender
    const genderColor = product.gender === "Lelaki" ? '#68C7C1' : '#FE8839';
    const zodiacIcon = determineZodiacIcon(product.tanggal_lahir);

    productItem.innerHTML = `
    <div class="shape">
      <div class="product-card">
        <img src="${product.foto}" alt="${product.nama}" style="background-color: ${genderColor};" class="product-image" onerror="this.onerror=null;this.src='https://via.placeholder.com/150';">
        <div class="product-info-container">
          <h3 class="product-nama">${product.nama}</h3>
          <div class="product-info">
            <p>${product.tanggal_lahir}</p>
            <div class="zodIcon"> <img src="${zodiacIcon}" alt="Zodiac Icon"></div>
          </div>
        </div>
      </div>
      </div>
    `;
    productList.appendChild(productItem);
  });
}


// ...

// Display list of products with different class
function displayProductsAlternate(products) {
  alternateProductList.innerHTML = '';

  products.forEach(product => {
    const productItem = document.createElement('div');
    productItem.classList.add('alternate-product-item');
    productItem.dataset.productId = product.nama;
    productItem.innerHTML = `
          <div class="alternate-product-card">
              <img src="${product.image}" alt="${product.nama}" class="alternate-product-image" onerror="this.onerror=null;this.src='https://via.placeholder.com/150';">
              <h2 class="alternate-product-category">${product.category}</h2>
              <div class"alternate-product-dit">
              <h3 class="alternate-product-nama">${product.nama}</h3>
              <p class="alternate-product-info">${product.info}</p>
          </div>
          </div>
      `;
    alternateProductList.appendChild(productItem);

    // Add a click event listener to each alternate product item
    productItem.addEventListener('click', () => {
      const selectedProduct = products.find(p => p.nama === productItem.dataset.productId);
      displayProductDetails(selectedProduct);
    });
  });
}

// ...

// Call the loadProducts function when the page is loaded
window.addEventListener('load', loadProducts);



// Display product details
function displayProductDetails(product) {


  productDetails.innerHTML = `
<div class="container-details">


  <div class="con-details">
    <div class="header-details">
      <div id="closeButton" class="left">
        <a href="#"><i class="fas fa-chevron-left"></i></a>
      </div>
      <div class="right">
        <a id="showPopupButton"><i class="fas fa-ellipsis-h"></i></a>
      </div>
    </div>

    <div class="product-details-new">
      <article>


      <div class="profile-container">
      <div class="banner" style="background-image: url('${product.foto}');">
      <div class="banner-tit">
              <h2>${product.nama}</h2>
              <p>${product.kelas} ${product.jurusan}</p>
            </div>
            <section>
            <div class="scroll text1">
               <div>
                    Special Offer!<span> Blah Blah Blah Blah! </span>Special Offer!<span> Blah Blah Blah Blah! Blah!</span>
               </div>
               <div>
                    Special Offer!<span> Blah Blah Blah Blah! </span>Special Offer!<span>Blah Blah Blah Blah! Blah! </span>
               </div>
            </div>
        <div class="scroll text2">
               <div>
                    Special Offer!<span> Blah Blah Blah Blah! Blah!</span>Special Offer!<span> Blah Blah Blah Blah! Blah!</span>
               </div>
               <div>
                    Special Offer!<span> Blah Blah Blah Blah! Blah!</span>Special Offer!<span>Blah Blah Blah Blah! Blah!</span>
               </div>
            </div>
          </section>
      </div>
      <img src="${product.foto}" alt="${product.nama}" alt="Profile Picture" class="profile-pic" onerror="this.onerror=null;this.src='https://via.placeholder.com/150';">
      <div class="profile-info">
      <h3>${product.nama}</h3>
      <p>${product.deskripsi}</p>
      <div class="con-share">
      <button class="share-button">
          <i class="fas fa-share"></i> Share
      </button>
  </div>

  </div>
     
          </div>
          <div class="main">
          <div class="container-row">
          </div>
          <div class="container-row">
            <div class="row">
              <h2> Tanggal Lahir</h2>
              <p>${product.tanggal_lahir}</p>
            </div>
            <div class="row">
              <h2> Alamat</h2>
              <p>${product.alamat.jalan}, ${product.alamat.kota}, ${product.alamat.provinsi}, ${product.alamat.kode_pos}</p>
            </div>
          </div>
          <div class="container-row">
            <div class="row">
              <h2>Prestasi</h2>
              <ul>
                ${product.prestasi.map(prestasi => `<li>${prestasi.judul} (${prestasi.tahun})</li>`).join('')}
              </ul>
            </div>
            <div class="row">
              <h2>Kegiatan</h2>
              <ul>
                ${product.kegiatan.map(kegiatan => `<li>${kegiatan}</li>`).join('')}
              </ul>
            </div>
          </div>
          <div class="container-row">
            <div class="row">
              <h2>Barcode</h2>
              <img src="barcode.png" alt="" srcset="">
            </div>
          </div>
        </div>
      </div>
  </div>
 
         
      </article>
      <div class="container-code">
        <div class="button-container">
        <ul id="imageList"></ul>
        </div>
        <div class="zodiac-icon-container">
        <img id="zodiacIcon" src="" alt="Zodiac Icon">
      </div>
      </div>
    </div>
  </div>
</div>


`;

  const zodiacIcon = determineZodiacIcon(product.tanggal_lahir);
  const zodiacIconElement = document.getElementById('zodiacIcon');
  zodiacIconElement.src = zodiacIcon;
  zodiacIconElement.alt = "Zodiac Icon";


  const imageList = document.getElementById('imageList');

  if (product.extra && product.extra.angkatan) {
    addImageToList(imageList, "angkatan.png"); // Ganti dengan path gambar osis
  }
  if (product.extra && product.extra.sekolah) {
    addImageToList(imageList, "Pletia.png"); // Ganti dengan path gambar osis
  }
  if (product.extra && product.extra.osis) {
    addImageToList(imageList, "osis.png"); // Ganti dengan path gambar osis
  }
  if (product.extra && product.extra.pramuka) {
    addImageToList(imageList, "Pletia.png"); // Ganti dengan path gambar pramuka
  }
  if (product.extra && product.extra.pmr) {
    addImageToList(imageList, "logokls.png"); // Ganti dengan path gambar pmr
  }

  // Menambahkan event listener untuk tombol "Close"
  const closeButton = document.getElementById('closeButton');
  closeButton.addEventListener('click', () => {
    productDetails.innerHTML = ''; // Kosongkan konten detail produk
  });


  // Menambahkan event listener untuk tombol "Tampilkan Popup"
  const showPopupButton = document.getElementById('showPopupButton');
  showPopupButton.addEventListener('click', () => {
    // Panggil fungsi untuk menampilkan popup saat tombol diklik
    showPopup();
  });



  // Fungsi untuk menampilkan popup
  function showPopup() {
    // Buat elemen popup
    const popupElement = document.createElement('div');
    popupElement.classList.add('popup');
    popupElement.innerHTML = `
    <div class="popup-content">
      <div class="concert-ticket"> 
        <span id="closePopupButton" class="close-popup">&times;</span> 
        <div class="ticket-header">
          <h2>Social<b>Ticket</b></h2>
        </div>
        <div class="logot">
          <img src="${product.foto}" alt="Concert Logo"> <!-- Ganti URL logo sesuai kebutuhan -->
        </div>
        <div class="ticket-nick">
          <h1>${product.nama}</h1>
        </div>
        <div class="ticket-desk">
          <p>${product.quote}</p>
        </div>
        <div class="ticket-details">
        <ul id="imageListPopup"></ul> <!-- Tambahkan imageList di sini -->
        </div>
        <div class="barcodee">
          <img src="barcode.png" alt="Barcode"> <!-- Ganti URL barcode sesuai kebutuhan -->
        </div>
      </div>
    </div>
  `;

    // Tambahkan elemen popup ke dalam body dokumen
    document.body.appendChild(popupElement);

    // Tambahkan event listener untuk tombol "Close" pada popup
    const closePopupButton = popupElement.querySelector('#closePopupButton');
    closePopupButton.addEventListener('click', () => {
      // Hapus elemen popup saat tombol "Close" diklik
      document.body.removeChild(popupElement);
    });

    // Tambahkan gambar tambahan ke dalam imageListPopup
    const imageListPopup = popupElement.querySelector('#imageListPopup');
    if (product.extra) {
      if (product.extra.angkatan) {
        addImageToList(imageListPopup, "angkatan.png"); // Ganti dengan path gambar angkatan
      }
      if (product.extra.sekolah) {
        addImageToList(imageListPopup, "Pletia.png"); // Ganti dengan path gambar sekolah
      }
      if (product.extra.osis) {
        addImageToList(imageListPopup, "osis.png"); // Ganti dengan path gambar osis
      }
      if (product.extra.pramuka) {
        addImageToList(imageListPopup, "Pletia.png"); // Ganti dengan path gambar pramuka
      }
      if (product.extra.pmr) {
        addImageToList(imageListPopup, "logokls.png"); // Ganti dengan path gambar pmr
      }
    }
  }


  // Hitung umur dan tampilkan
  const age = calculateAge(product.tanggal_lahir);
  document.getElementById('umur').textContent = `Umur: ${age} tahun`;



}




// Fungsi untuk menentukan ikon zodiak berdasarkan tanggal lahir
function determineZodiacIcon(birthDateString) {
  const birthDate = new Date(birthDateString);
  const month = birthDate.getMonth() + 1; // Months are zero indexed
  const day = birthDate.getDate();

  // Menentukan zodiak berdasarkan bulan dan tanggal lahir
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Aquarius_symbol_%28bold%29.svg/480px-Aquarius_symbol_%28bold%29.svg.png';
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Pisces_symbol_%28bold%29.svg/480px-Pisces_symbol_%28bold%29.svg.png';
  } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Aries_symbol_%28bold%29.svg/480px-Aries_symbol_%28bold%29.svg.png';
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Taurus_symbol_%28bold%29.svg/40px-Taurus_symbol_%28bold%29.svg.png';
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Gemini_symbol_%28bold%29.svg/480px-Gemini_symbol_%28bold%29.svg.png';
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Cancer_symbol_%28bold%29.svg/480px-Cancer_symbol_%28bold%29.svg.png';
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Leo_symbol_%28bold%29.svg/480px-Leo_symbol_%28bold%29.svg.png';
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Virgo_symbol_%28bold%29.svg/480px-Virgo_symbol_%28bold%29.svg.png';
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Libra_symbol_%28bold%29.svg/480px-Libra_symbol_%28bold%29.svg.png';
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Scorpius_symbol_%28bold%29.svg/480px-Scorpius_symbol_%28bold%29.svg.png';
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Sagittarius_symbol_%28bold%29.svg/480px-Sagittarius_symbol_%28bold%29.svg.png';
  } else { // Capricorn
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Sagittarius_symbol_%28bold%29.svg/480px-Sagittarius_symbol_%28bold%29.svg.png';
  }
}

function addImageToList(list, imagePath) {
  const imageItem = document.createElement('li');
  const image = document.createElement('img');
  image.src = imagePath;
  image.alt = "Product Image";
  imageItem.appendChild(image);
  list.appendChild(imageItem);
}

// Ambil data dari file JSON
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // Lakukan sesuatu dengan data JSON
    const person = data;

    // Hitung umur berdasarkan tanggal lahir
    const age = calculateAge(person.tanggal_lahir);
    // Tampilkan umur pada elemen dengan id "umur"
    document.getElementById('umur').textContent = `Umur: ${age} tahun`;

    // Tentukan ikon zodiak berdasarkan tanggal lahir
    const zodiacIcon = determineZodiacIcon(person.tanggal_lahir);
    // Tampilkan ikon zodiak pada elemen dengan id "zodiacIcon"
    document.getElementById('zodiacIcon').src = zodiacIcon;
  });

// Fungsi untuk menghitung umur berdasarkan tanggal lahir
function calculateAge(birthDateString) {
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}
