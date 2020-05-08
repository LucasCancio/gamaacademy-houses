
let quartos = [];

function ListarQuartos() {
  const uri =
    "https://v2-api.sheety.co/45a40658ca522915f0823cb3352a77c5/gamaHouses/houses";

  getDataAsync(uri).then((data) => {
    quartos = data["houses"];

    AcrescentarInformacao();
    carregarPaginacao();
    carregarMapa();
    //quartos = Filtrar(quartos, "apartamento".toUpperCase());
  });
}

function Filtrar(texto) {
  return quartos.filter((quarto) => {
    let nomeTemTexto = quarto.name.toUpperCase().search(texto) >= 0;
    let tipoTemTexto = quarto.property_type.toUpperCase().search(texto) >= 0;

    return nomeTemTexto || tipoTemTexto;
  });
}

function AcrescentarInformacao() {
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

function InserirHTML() {
  let catalogo = document.getElementById("catalogo");
  let paginacao = document.getElementById("paginacao");

  catalogo.innerHTML = "";
  paginacao.innerHTML = "";

  quartosPaginados.forEach((quarto) => {
    let { photo, propertyType, name, price, descricao } = quarto;

    catalogo.innerHTML += `
        <div class="card">
            <img src="${photo}" class="card-img-top" alt="..." />
            <div class="card-body">
              <h5 class="card-title">${name}</h5>
              <p class="card-text">
                ${price} Descrição ${descricao}
              </p>
            </div>
            <div class="card-footer">
              <small class="text-muted">${propertyType}</small>
            </div>
          </div>
        `;
  });

  paginacao.appendChild(criarPaginacao());
}

ListarQuartos();

// REQUEST HTTP

async function getDataAsync(uri) {
  let response = await fetch(uri);
  let data = await response.json();
  return data;
}


//PAGINAÇAO

let quartosPaginados = [];
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
  totalDePaginas = Math.ceil(quartos.length / itensPorPagina);
  paginaAtual = 1;
  carregarLista();
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
  const final = begin + itensPorPagina;

  quartosPaginados = quartos.slice(inicio, final);

  InserirHTML();
  validarBotoes();
}

function validarBotoes() {
  let previousButton = document.getElementById("previousPage");
  let nextButton = document.getElementById("nextPage");

  console.log(paginaAtual);
  console.log(totalDePaginas);

  if (paginaAtual == totalDePaginas) {
    nextButton.style.display = "none";
  } else {
    nextButton.style.display = "list-item";
    if (paginaAtual == 1) {
      previousButton.style.display = "none";
    } else {
      previousButton.style.display = "list-item";
    }
  }
}

//MAP

let cordenadasSP = [-46.63018217699323, -23.5379366687732]; //long,lat

function carregarMapa() {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoic29sZGFkb3NzaiIsImEiOiJjazl5OXoxOWkwdDNjM21wczByZ201Y2lpIn0.AFfGNmlfd_6YKdXkQz3dOw";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: cordenadasSP,
    zoom: 13,
  });

  var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
  });

  document.getElementById("geocoder").appendChild(geocoder.onAdd(map));
  carregarMarcadores(map);
}

function carregarMarcadores(map) {
  quartos.forEach((quarto) => {
    var marcador = new mapboxgl.Marker()
      .setLngLat([quarto.longitude, quarto.latitude])
      .addTo(map);
  });
}
