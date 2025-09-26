document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('https://api-proyecto-jsyx.onrender.com/api/products');
    const destinos = await res.json();

    const row = document.querySelector('.row');
    row.innerHTML = '';
    destinos.forEach(destino => {
      const col = document.createElement('div');
      col.className = 'col s12 m6 l4';
      col.innerHTML = `
        <div class="card">
          <div class="card-image">
            <img src="https://api-proyecto-jsyx.onrender.com/uploads/${destino.image}" alt="${destino.name}">
          </div>
          <div class="card-content">
            <span class="card-title">${destino.name}</span>
            <p>${destino.description}</p>
          </div>
        </div>
      `;
      row.appendChild(col);
    });
  } catch (error) {
    console.error('❌ Error al cargar destinos:', error);
  }
});
