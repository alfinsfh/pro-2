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



fetch('json/products.json')
  .then(response => response.json())
  .then(data => {
    let products = data;

    // Fungsi untuk menampilkan list card produk secara acak
    function displayRandomProductCards() {
      const container = document.getElementById('productContainer');
      container.innerHTML = ''; // Bersihkan container sebelum menambahkan card baru

      // Acak urutan produk
      products = shuffleArray(products);

      products.forEach(product => {
        const productCardHTML = `
          <div class="twi-card">
            <div class="twi-card-header">
              <img src="${product.foto}" alt="${product.nama}" class="twi-card-avatar" onerror="this.onerror=null;this.src='https://via.placeholder.com/150';">
              <h3 class="twi-card-username">${product.nama}</h3>
            </div>
            <div class="twi-card-body">
              <p class="twi-card-quote">${product.quote}</p>
            </div>
          </div>
        `;
        container.innerHTML += productCardHTML; // Tambahkan card baru ke container
      });
    }

    // Tampilkan list card produk secara acak pertama kali
    displayRandomProductCards();

    // Tambahkan event listener untuk menampilkan detail produk ketika card diklik
    document.getElementById('productContainer').addEventListener('click', event => {
      const card = event.target.closest('.twi-card');
      if (card) {
        const productName = card.querySelector('.twi-card-username').textContent;
        const selectedProduct = products.find(product => product.nama === productName);
        displayProductDetails(selectedProduct);
      }
    });
  })
  .catch(error => {
    console.error('Error fetching products:', error);
  });

// Fungsi untuk mengacak array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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

      <div class="rang">
      <img src="${product.foto}" alt="${product.nama}" alt="Profile Picture" class="profile-pic" onerror="this.onerror=null;this.src='https://via.placeholder.com/150';">
      <div class="profile-info">
      <h3>${product.nama}</h3>
      <p>${product.deskripsi}</p>
      </div>
      <div class="birthday-container">
      <div class="birthday-left">
          <h2>GEMINI</h2>
          <div class="birthday-star-id">
              <span class="birthday-star">★</span>
              <span class="birthday-id">1${product.tanggal_lahir}</span>
          </div>
      </div>
      <div class="gar"></div>
      <div class="birthday-right">
          <span class="birthday-date">Tanggal</span>
          <p>${product.alamat.kota}, ${product.alamat.provinsi},</p>
      </div>
  </div>

  </div>
  <div class="tabis-container">
  <div class="tabis active" onclick="openTab('tab1', this)"><i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
    <path d="M2 18C2 16.4596 2 15.6893 2.34673 15.1235C2.54074 14.8069 2.80693 14.5407 3.12353 14.3467C3.68934 14 4.45956 14 6 14C7.54044 14 8.31066 14 8.87647 14.3467C9.19307 14.5407 9.45926 14.8069 9.65327 15.1235C10 15.6893 10 16.4596 10 18C10 19.5404 10 20.3107 9.65327 20.8765C9.45926 21.1931 9.19307 21.4593 8.87647 21.6533C8.31066 22 7.54044 22 6 22C4.45956 22 3.68934 22 3.12353 21.6533C2.80693 21.4593 2.54074 21.1931 2.34673 20.8765C2 20.3107 2 19.5404 2 18Z" stroke="currentColor" stroke-width="1.5" />
    <path d="M14 18C14 16.4596 14 15.6893 14.3467 15.1235C14.5407 14.8069 14.8069 14.5407 15.1235 14.3467C15.6893 14 16.4596 14 18 14C19.5404 14 20.3107 14 20.8765 14.3467C21.1931 14.5407 21.4593 14.8069 21.6533 15.1235C22 15.6893 22 16.4596 22 18C22 19.5404 22 20.3107 21.6533 20.8765C21.4593 21.1931 21.1931 21.4593 20.8765 21.6533C20.3107 22 19.5404 22 18 22C16.4596 22 15.6893 22 15.1235 21.6533C14.8069 21.4593 14.5407 21.1931 14.3467 20.8765C14 20.3107 14 19.5404 14 18Z" stroke="currentColor" stroke-width="1.5" />
    <path d="M2 6C2 4.45956 2 3.68934 2.34673 3.12353C2.54074 2.80693 2.80693 2.54074 3.12353 2.34673C3.68934 2 4.45956 2 6 2C7.54044 2 8.31066 2 8.87647 2.34673C9.19307 2.54074 9.45926 2.80693 9.65327 3.12353C10 3.68934 10 4.45956 10 6C10 7.54044 10 8.31066 9.65327 8.87647C9.45926 9.19307 9.19307 9.45926 8.87647 9.65327C8.31066 10 7.54044 10 6 10C4.45956 10 3.68934 10 3.12353 9.65327C2.80693 9.45926 2.54074 9.19307 2.34673 8.87647C2 8.31066 2 7.54044 2 6Z" stroke="currentColor" stroke-width="1.5" />
    <path d="M14 6C14 4.45956 14 3.68934 14.3467 3.12353C14.5407 2.80693 14.8069 2.54074 15.1235 2.34673C15.6893 2 16.4596 2 18 2C19.5404 2 20.3107 2 20.8765 2.34673C21.1931 2.54074 21.4593 2.80693 21.6533 3.12353C22 3.68934 22 4.45956 22 6C22 7.54044 22 8.31066 21.6533 8.87647C21.4593 9.19307 21.1931 9.45926 20.8765 9.65327C20.3107 10 19.5404 10 18 10C16.4596 10 15.6893 10 15.1235 9.65327C14.8069 9.45926 14.5407 9.19307 14.3467 8.87647C14 8.31066 14 7.54044 14 6Z" stroke="currentColor" stroke-width="1.5" />
</svg></i> Profile</div>
  <div class="tabis" onclick="openTab('tab2', this)"><i><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
    <path d="M22 14V10C22 6.22876 22 4.34315 20.8284 3.17157C19.6569 2 17.7712 2 14 2H12C8.22876 2 6.34315 2 5.17157 3.17157C4 4.34315 4 6.22876 4 10V14C4 17.7712 4 19.6569 5.17157 20.8284C6.34315 22 8.22876 22 12 22H14C17.7712 22 19.6569 22 20.8284 20.8284C22 19.6569 22 17.7712 22 14Z" stroke="currentColor" stroke-width="1.5" />
    <path d="M5 6L2 6M5 12H2M5 18H2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M17.5 7L13.5 7M15.5 11H13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M9 22L9 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg></i> Photos</div>
</div>

<div id="tab1" class="tab-content active">
  <div class="main">
  <div class="container-row">
  </div>
  <div class="container-row">
    <div class="row">
      <h2>Lahir</h2>
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
</div><div class="container-code">
<div class="button-container">
<ul id="imageList"></ul>
</div>
<div class="zodiac-icon-container">
<img id="zodiacIcon" src="" alt="Zodiac Icon">
</div>
</div>
</div>
</div>

 
</article>

</div>
</div>

<div id="tab2" class="tab-content">
<div id="extra-show"></div>

</div>

<div id="tab3" class="tab-content">
  <h2>Videos Content</h2>
  <p>Ini adalah konten video-video.</p>
</div>
          </div>
        
  </div>
</div>


`;

  // Check if extra property exists and it's an object
  if (product.extra && typeof product.extra === 'object') {
    // Loop through each key-value pair in the extra object
    for (const [key, value] of Object.entries(product.extra)) {
      // If the value is true, display the corresponding extra card
      if (value === true) {
        displayExtraCard(key);
      }
    }
  }

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


// Function to display extra card based on the key
function displayExtraCard(key) {
  // Define the card content based on the key
  let cardContent = '';
  switch (key) {
    case 'angkatan':
      cardContent = `
      <div class="org-card">
        <div class="org-icon">
          <img src="barcode.png" alt="Organization Background">
          <div class="org-profile">
            <img src="barcode.png" alt="Organization Profile">
          </div>
        </div>
        <div class="org-content">
          <h2 class="org-name">Nama Organisasi</h2>
          <p class="org-description">Deskripsi Organisasi Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>

`;
      break;
    case 'sekolah':
      cardContent = '<div class="extra-card">Sekolah Card</div>';
      break;
    case 'osis':
      cardContent = '<div class="extra-card">Osis Card</div>';
      break;
    case 'pramuka':
      cardContent = '<div class="extra-card">Pramuka Card</div>';
      break;
    case 'pmr':
      cardContent = '<div class="extra-card">PMR Card</div>';
      break;
    default:
      // Do nothing for unknown keys
      break;
  }

  // Append the card content to the specified container
  const extraShowContainer = document.getElementById('extra-show');
  extraShowContainer.insertAdjacentHTML('beforeend', cardContent);
}

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


function openTab(tabId, tab) {
  var tabContents = document.getElementsByClassName("tab-content");
  for (var i = 0; i < tabContents.length; i++) {
    tabContents[i].classList.remove("active");
  }
  var tabs = document.getElementsByClassName("tabis");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");
  }
  document.getElementById(tabId).classList.add("active");
  tab.classList.add("active");
}