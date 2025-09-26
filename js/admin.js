document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    window.location.href = './login.html';
    return;
  }

  const modalElems = document.querySelectorAll('.modal');
  M.Modal.init(modalElems);
  const modalInstance = M.Modal.getInstance(document.getElementById('productModal'));

  const productTable = document.getElementById('productTableBody');
  const form = document.getElementById('productForm');
  const btnAdd = document.getElementById('btnAdd');

  let isEditing = false;

  const API_URL = 'https://api-proyecto-jsyx.onrender.com/api/products';

  function clearImagePreview() {
    const preview = document.getElementById('previewImage');
    const fileInput = document.getElementById('productImage');

    if (preview) {
        preview.src = '';
        preview.style.display = 'none';
    }

    if (fileInput) {
       const newInput = fileInput.cloneNode(true);
       fileInput.parentNode.replaceChild(newInput, fileInput);
    }
  }

  // Cargar productos
  async function loadProducts() {
    try {
      clearImagePreview();
      const res = await fetch(API_URL);
      const products = await res.json();
      productTable.innerHTML = '';
      products.forEach(product => {
        productTable.innerHTML += `
          <tr>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>$${product.price}</td>
            <td><img src="https://api-proyecto-jsyx.onrender.com/uploads/${product.image || './imagenes/default.jpg'}" alt="${product.name}" width="80"></td>
            <td>
              <a href="#!" class="btn-small blue" style="min-width: 100px;" onclick="editProduct('${product._id}')">Editar</a>
              <a href="#!" class="btn-small red" style="min-width: 100px;" onclick="deleteProduct('${product._id}')">Eliminar</a>
            </td>
          </tr>
        `;
      });
    } catch (err) {
      console.error('Error al cargar productos', err);
    }
  }
  async function loadContacts() {
    try {
      const res = await fetch('https://api-proyecto-jsyx.onrender.com/api/contact');
      const contactos = await res.json();
      const contactTable = document.getElementById('contactTableBody');
      contactTable.innerHTML = '';

      contactos.forEach(contacto => {
        contactTable.innerHTML += `
          <tr>
            <td>${contacto.name}</td>
            <td>${contacto.email}</td>
            <td>${contacto.message}</td>
            <td>${new Date(contacto.createdAt).toLocaleString()}</td>
          </tr>
        `;
      });
    } catch (err) {
      console.error('Error al cargar contactos', err);
    }
  }

  window.editProduct = async (id) => {
    try {
      clearImagePreview();
      const res = await fetch(`${API_URL}/${id}`);
      const product = await res.json();

      document.getElementById('productId').value = product._id;
      document.getElementById('productName').value = product.name;
      document.getElementById('productDescription').value = product.description;
      document.getElementById('productPrice').value = product.price;
      const preview = document.getElementById('previewImage');
      if (product.image) {
        preview.src = `https://api-proyecto-jsyx.onrender.com/uploads/${product.image}`; // Asegúrate de tener el prefijo correcto
        preview.style.display = "";
      } else {
        preview.style.display = "none";
      }
      M.updateTextFields(); // Actualiza etiquetas Materialize
      isEditing = true;
      document.getElementById('modalTitle').innerText = 'Editar Producto';
      modalInstance.open();
    } catch (err) {
      console.error('Error al obtener producto', err);
    }
  };

  window.deleteProduct = async (id) => {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        loadProducts();
      } catch (err) {
        console.error('Error al eliminar producto', err);
      }
    }
  };

  btnAdd.addEventListener('click', () => {
    clearImagePreview();
    isEditing = false;
    form.reset();
    document.getElementById('productId').value = '';
    document.getElementById('modalTitle').innerText = 'Agregar Producto';
    modalInstance.open();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const price = document.getElementById('productPrice').value;
    const imageFile = document.getElementById('productImage').files[0];

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    if (imageFile) formData.append('image', imageFile);

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${API_URL}/${id}` : API_URL;

      await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      clearImagePreview();
      loadProducts();
    } catch (err) {
      console.error('Error al guardar producto', err);
    }
  });

  loadProducts();
  loadContacts();
  document.getElementById('productImage').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const preview = document.getElementById('previewImage');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
        preview.src = event.target.result;
        preview.style.display = '';
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = '';
        preview.style.display = 'none';
    }
  });

});
