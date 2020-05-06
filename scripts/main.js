async function getDataAsync(uri) {
  let response = await fetch(uri);
  let data = await response.json();
  return data;
}

function ListarQuartos() {
  const uri = "https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72";

  getDataAsync(uri).then((quartos) => {
    quartos = Filtrar(quartos, "apartamento".toUpperCase());
    InserirHTML(quartos);
  });
}

function InserirHTML(quartos) {
  let catalogo = document.getElementById("catalogo");

  quartos.forEach((quarto) => {
    let photo = quarto.photo;
    let type = quarto.property_type;
    let name = quarto.name;
    let price = quarto.price;

    catalogo.innerHTML += `
        <div class="card">
            <img src="${photo}" class="card-img-top" alt="..." />
            <div class="card-body">
              <h5 class="card-title">${name}</h5>
              <p class="card-text">
                ${price}
              </p>
            </div>
            <div class="card-footer">
              <small class="text-muted">${type}</small>
            </div>
          </div>
        `;
  });
}

function Filtrar(quartos, texto) {
  return quartos.filter((quarto) => {
    return quarto.name.toUpperCase().search(texto) >= 0 || quarto.property_type.toUpperCase().search(texto) >= 0;
  });
}

ListarQuartos();
