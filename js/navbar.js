document.addEventListener('DOMContentLoaded', function() {

  var elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems);

  const navbar = document.getElementById("navbar");
  const mobileMenu = document.getElementById("mobile-menu");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  let navContent = '';
  if (token && user) {
    navContent = `
      <li><a href="./index2.html">INICIO</a></li>
      <li><a href="./destinos2.html">DESTINOS</a></li>
      <li><a href="./contacto2.html">CONTACTO</a></li>
      <li><a href="#">👤 ${user.name}</a></li>
      <li><a href="#" id="logoutBtn">Cerrar sesión</a></li>
    `;
     if (user.isAdmin) {
      navContent += `<li><a href="./admin.html">Panel Admin</a></li>`;
    }
  } else {
    navContent = `
      <li><a href="./login.html">Login</a></li>
      <li><a href="./registro.html">Registro</a></li>
    `;
  }

  if(navbar) navbar.innerHTML = navContent;
  if(mobileMenu) mobileMenu.innerHTML = navContent;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function(e) {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "./index2.html";
    });
  }
});
