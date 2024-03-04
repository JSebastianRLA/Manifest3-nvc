document.addEventListener("DOMContentLoaded", function () {
  const fetchDataButton = document.getElementById("fetchDataButton");
  const tableBody = document.getElementById("tableBody");
  const userField = document.getElementById("user");
  const passField = document.getElementById("pass");

  // Cargar los datos del localStorage cuando la página se carga
  const storedUser = localStorage.getItem("user");
  const storedPass = localStorage.getItem("pass");
  if (storedUser) userField.value = storedUser;
  if (storedPass) passField.value = storedPass;

  // Definir la función fetchData
  function fetchData() {
    const user = userField.value;
    const pass = passField.value;

    // Almacenar el usuario y la contraseña en el localStorage
    localStorage.setItem("user", user);
    localStorage.setItem("pass", pass);

    // Construir la URL de la API con los valores del usuario y la contraseña
    const url = `http://192.168.0.158/pandora_console/include/api.php?op=get&op2=events&return_type=json&apipass=1234&user=${user}&pass=${pass}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Filtrar los registros que cumplen con los criterios especificados
        const filteredData = data.data.filter((evento) =>
          (evento.event_type === "going_up_warning" ||
           evento.event_type === "going_up_critical") &&
          evento.estado === "0"
        );

        // Construir la tabla con los datos filtrados
        const tableRows = filteredData.map(
          (evento) => `
          <tr>
            <td>${evento.evento}</td>
            <td>${evento.id_evento}</td>
            <td>${evento.id_agente}</td>
            <td>${evento.timestamp}</td>
          </tr>
        `
        );

        // Mostrar la tabla en el contenedor
        tableBody.innerHTML = tableRows.join("");
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
        tableBody.innerHTML =
          '<tr><td colspan="4">Error al obtener los datos</td></tr>';
      });
  }

  // Llamar a fetchData automáticamente al abrir la extensión
  fetchData();
  
  // Agregar un evento de clic al botón para llamar a fetchData manualmente
  fetchDataButton.addEventListener("click", fetchData);
});
