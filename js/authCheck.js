document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem("token");
  const content = document.getElementById("content");
  const noAuthMsg = document.getElementById("noAuthMsg");

  if (token) {
    // Mostrar contenido protegido
    content.style.display = "block";
    noAuthMsg.style.display = "none";
  } else {
    // Mostrar mensaje de no autorizado
    content.style.display = "none";
    noAuthMsg.style.display = "block";
  }
});
