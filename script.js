// Mengambil elemen-elemen yang diperlukan
const inputForm = document.getElementById('inputBook');
const inputTitle = document.getElementById('inputBookTitle');
const inputAuthor = document.getElementById('inputBookAuthor');
const inputYear = document.getElementById('inputBookYear');
const inputIsComplete = document.getElementById('inputBookIsComplete');
const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
const completeBookshelfList = document.getElementById('completeBookshelfList');
const searchForm = document.getElementById('searchBook');
const searchTitle = document.getElementById('searchBookTitle');

// Menginisialisasi variabel buku
let books = [];

// Mengambil data buku dari local storage jika ada
if (localStorage.getItem('books')) {
  books = JSON.parse(localStorage.getItem('books'));
  displayBooks();
}

// Menambahkan event listener pada form input buku
inputForm.addEventListener('submit', function(event) {
  event.preventDefault();

  // Mengambil data dari input form
  const title = inputTitle.value;
  const author = inputAuthor.value;
  const year = parseInt(inputYear.value);
  const isComplete = inputIsComplete.checked;

  // Generate unique ID using timestamp
  const id = generateId(); // Function to generate unique ID using timestamp

  // Menambahkan data buku ke array dengan struktur yang tepat
  books.push({ id, title, author, year, isComplete });

  // Menyimpan data buku ke local storage
  localStorage.setItem('books', JSON.stringify(books));

  // Mengosongkan input form
  inputTitle.value = '';
  inputAuthor.value = '';
  inputYear.value = '';
  inputIsComplete.checked = false;

  // Menampilkan data buku
  displayBooks();
});

// Generate unique ID using timestamp
function generateId() {
  return new Date().getTime();
}

// Menampilkan data buku ke dalam elemen HTML
function displayBooks(filteredBooks = books) { // Parameter opsional untuk menampilkan data filteredBooks
  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';

  filteredBooks.forEach(book => {
    const bookItem = document.createElement('article');
    bookItem.classList.add('book_item');

    const title = document.createElement('h3');
    title.textContent = book.title;
    bookItem.appendChild(title);

    const author = document.createElement('p');
    author.textContent = `Penulis: ${book.author}`;
    bookItem.appendChild(author);

    const year = document.createElement('p');
    year.textContent = `Tahun: ${book.year}`;
    bookItem.appendChild(year);

    const action = document.createElement('div');
    action.classList.add('action');

    const moveButton = document.createElement('button');
    moveButton.classList.add(book.isComplete ? 'red' : 'green'); // Ubah warna tombol berdasarkan status selesai
    moveButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
    moveButton.addEventListener('click', function() {
      book.isComplete = !book.isComplete;
      localStorage.setItem('books', JSON.stringify(books));
      displayBooks();
    });
    action.appendChild(moveButton);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red');
    deleteButton.textContent = 'Hapus buku';
    deleteButton.addEventListener('click', function() {
      const index = books.findIndex(b => b.id === book.id);
      books.splice(index, 1);
      localStorage.setItem('books', JSON.stringify(books));
      displayBooks();
    });
    action.appendChild(deleteButton);

    bookItem.appendChild(action);

    if (book.isComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }
  });
}

// Search functionality
searchForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const searchTitleValue = searchTitle.value.toLowerCase();

  const filteredBooks = books.filter(book => {
    return book.title.toLowerCase().includes(searchTitleValue);
  });

  displayBooks(filteredBooks);
});
