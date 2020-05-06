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
    let { photo, type, name, price } = quarto;

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
    let nomeTemTexto = quarto.name.toUpperCase().search(texto) >= 0;
    let tipoTemTexto = quarto.property_type.toUpperCase().search(texto) >= 0;

    return nomeTemTexto || tipoTemTexto;
  });
}

var paginaAtual = 1;
const itensPorPagina = 4;

function Paginar(lista, pagina) {
  let totalPaginas = Math.ceil(lista.length / itensPorPagina);

  if (pagina < 1) pagina = 1;
  if (pagina > totalPaginas) pagina = totalPaginas;

  let inicio = (pagina - 1) * itensPorPagina;
  let final = inicio + itensPorPagina;

  paginaAtual = pagina;

  return quartos.slice(inicio, final);
}

ListarQuartos();
