let quartos = [];
let categorias = new Set();

const uriAPI =
  "https://v2-api.sheety.co/45a40658ca522915f0823cb3352a77c5/gamaHouses/houses";

function carregarQuartos() {
  getDataAsync(uriAPI).then((data) => {
    quartos = data["houses"];
    lista = quartos;

    acrescentarInformacao();
    carregarPaginacao();
    carregarLista();

    let tipos = [];
    quartos.forEach((quarto) => {
      tipos.push(quarto.propertyType);
    });

    categorias = new Set(tipos);

    carregarCategorias();
  });
}

function acrescentarInformacao() {
  function gerarDescricao() {
    let numerosAleatorios = [];
    for (let i = 0; i < 4; i++) {
      let numeroAleatorio = Math.floor(Math.random() * 10);
      while (numeroAleatorio == 0) {
        numeroAleatorio = Math.floor(Math.random() * 10);
      }

      numerosAleatorios.push(numeroAleatorio);
    }
    let [hospedes, quartos, camas, banheiros] = numerosAleatorios;

    return `${hospedes} hóspede(s) · ${quartos} quarto(s) · ${camas} cama(s) · ${banheiros} banheiro(s)`;
  }

  quartos.forEach((quarto) => {
    quarto.descricao = gerarDescricao();
  });

  return quartos;
}

function atualizarQuartos(quartos) {
  let catalogo = document.getElementById("catalogo");
  let paginacao = document.getElementById("paginacao");

  catalogo.innerHTML = "";
  paginacao.innerHTML = "";

  quartos.forEach((quarto) => {
    let { photo, propertyType, name, price, descricao, star } = quarto;

    catalogo.innerHTML += `
        <div class="card quarto">
            <img src="${photo}" class="card-img-top" alt="..." />
            <div class="card-body">
              <h5 class="card-title">${name}</h5>
              <p class="card-text">
              <span>R$${price}</span>
              <span>Descrição ${descricao}</span>
              <span>${star}estrelas</span>         
              </p>
            </div>
            <div class="card-footer">
              <small class="text-muted">${propertyType}</small>
            </div>
          </div>
        `;
  });

  paginacao.appendChild(criarPaginacao());

  carregarMapa();
}

carregarQuartos();

//CATEGORIA

function carregarCategorias() {
  let divCategorias = document.getElementById("categorias");

  divCategorias.innerHTML = `
  <option value=''>
      Todas
    </option>
  `;

  categorias.forEach((categoria) => {
    divCategorias.innerHTML += `
        <option value='${categoria}'>
            ${categoria}
          </option>
        `;
  });
}

//FILTRO E ORDENAÇÃO

function filtrarPorCategoria(object) {
  let categoria = object.value;

  if (categoria == "") {
    lista = quartos;
  } else {
    lista = quartos.filter((quarto) => {
      let temCategoria =
        quarto.propertyType.toUpperCase() == categoria.toUpperCase();
      return temCategoria;
    });
  }

  carregarPaginacao();
  carregarLista();
}

function ordenarPorPreco() {
  lista = quartos.sort(function (quarto1, quarto2) {
    return quarto1.price - quarto2.price;
  });

  carregarPaginacao();
  carregarLista();
}

function ordenarPorEstrela() {
  lista = quartos.sort(function (quarto1, quarto2) {
    return quarto1.star - quarto2.star;
  });

  carregarPaginacao();
  carregarLista();
  
}

// REQUEST HTTP

async function getDataAsync(uri) {
  let response = await fetch(uri);
  let data = await response.json();
  return data;
}

//PAGINAÇAO

let lista = [];
let listaPaginada = [];
let paginaAtual = 1;
let itensPorPagina = 6;
let totalDePaginas = 1;

function criarIndicesPagina() {
  let lines = "";
  for (let i = 1; i <= totalDePaginas; i++) {
    if (i == paginaAtual) {
      lines += `<li id="page-${i}" class="page-item active"><a class="page-link" onclick="mudarPagina(${i})">${i}</a></li>`;
    } else {
      lines += `<li id="page-${i}" class="page-item"><a class="page-link" onclick="mudarPagina(${i})">${i}</a></li>`;
    }
  }

  return lines;
}

function criarPaginacao() {
  let row = document.createElement("div");
  row.className = "row row-pagination";

  row.innerHTML = `
    <div class="col-md-12">
        <nav>
            <ul class="pagination">
                <li id="previousPage" class="page-item">
                <a class="page-link" onclick="voltarPagina()" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only">Previous</span>
                </a>
                </li>
                ${criarIndicesPagina()}
                <li id="nextPage" class="page-item">
                <a class="page-link" onclick="avancarPagina()" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                    <span class="sr-only">Next</span>
                </a>
                </li>
            </ul>
        </nav>
    </div>
  `;

  return row;
}

function carregarPaginacao() {
  totalDePaginas = Math.ceil(lista.length / itensPorPagina);
  paginaAtual = 1;
}

function avancarPagina() {
  paginaAtual += 1;
  carregarLista();
}

function mudarPagina(page) {
  paginaAtual = page;
  carregarLista();
}

function voltarPagina() {
  paginaAtual -= 1;
  carregarLista();
}

function carregarLista() {
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const final = inicio + itensPorPagina;

  listaPaginada = lista.slice(inicio, final);

  atualizarQuartos(listaPaginada);
  validarBotoes();
}

function validarBotoes() {
  let previousButton = document.getElementById("previousPage");
  let nextButton = document.getElementById("nextPage");

  nextButton.style.display = "none";
  previousButton.style.display = "none";

  console.log("pagina atual: ", paginaAtual);
  console.log("total: ", totalDePaginas);

  if (paginaAtual != totalDePaginas) {
    nextButton.style.display = "list-item";
  }
  if (paginaAtual != 1) {
    previousButton.style.display = "list-item";
  }
}

//MAP

const cordenadasSP = [-46.63018217699323, -23.5379366687732]; //long,lat

function carregarMapa() {
  let searchBox = document.getElementById("search-box");
  searchBox.innerHTML = "";

  mapboxgl.accessToken =
    "pk.eyJ1Ijoic29sZGFkb3NzaiIsImEiOiJjazl5OXoxOWkwdDNjM21wczByZ201Y2lpIn0.AFfGNmlfd_6YKdXkQz3dOw";
  let map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: cordenadasSP,
    zoom: 13,
  });

  let geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
  });

  searchBox.appendChild(geocoder.onAdd(map));
  carregarMarcadores(map);
}

function carregarMarcadores(map) {
  listaPaginada.forEach((quarto) => {
    let marcador = new mapboxgl.Marker()
      .setLngLat([quarto.longitude, quarto.latitude])
      .addTo(map);
  });
}
