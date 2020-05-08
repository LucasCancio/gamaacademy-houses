async function getDataAsync(uri) {
  let response = await fetch(uri);
  let data = await response.json();
  return data;
}

let quartos = [];

function ListarQuartos() {
  const uri =
    "https://v2-api.sheety.co/45a40658ca522915f0823cb3352a77c5/gamaHouses/houses";

  getDataAsync(uri).then((data) => {
    quartos = data["houses"];

    AcrescentarInformacao();
    loadPagination();
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

ListarQuartos();

//PAGINAÇAO

let quartosPaginados = [];
let currentPage = 1;
let numberPerPage = 6;
let numberOfPages = 1;

function createPagesItem() {
  let lines = "";
  for (let i = 1; i <= numberOfPages; i++) {
    if (i == currentPage) {
      lines += `<li id="page-${i}" class="page-item active"><a class="page-link" onclick="MudarPagina(${i})">${i}</a></li>`;
    } else {
      lines += `<li id="page-${i}" class="page-item"><a class="page-link" onclick="MudarPagina(${i})">${i}</a></li>`;
    }
  }

  return lines;
}

function createPagination() {
  let row = document.createElement("div");
  row.className = "row row-pagination";

  row.innerHTML = `
    <div class="col-md-12">
        <nav>
            <ul class="pagination">
                <li id="previousPage" class="page-item">
                <a class="page-link" onclick="previousPage()" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only">Previous</span>
                </a>
                </li>
                ${createPagesItem()}
                <li id="nextPage" class="page-item">
                <a class="page-link" onclick="nextPage()" aria-label="Next">
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

function loadPagination() {
  numberOfPages = Math.ceil(quartos.length / numberPerPage);
  currentPage = 1;
  loadList();
}

function nextPage() {
  currentPage += 1;
  loadList();
}

function MudarPagina(page) {
  currentPage = page;
  loadList();
}

function previousPage() {
  currentPage -= 1;
  loadList();
}

function loadList() {
  const begin = (currentPage - 1) * numberPerPage;
  const end = begin + numberPerPage;

  quartosPaginados = quartos.slice(begin, end);

  InserirHTML();
  validateButtons();
}

function validateButtons() {
  let previousButton = document.getElementById("previousPage");
  let nextButton = document.getElementById("nextPage");

  console.log(currentPage);
  console.log(numberOfPages);

  if (currentPage == numberOfPages) {
    nextButton.style.display = "none";
  } else {
    nextButton.style.display = "list-item";
    if (currentPage == 1) {
      previousButton.style.display = "none";
    } else {
      previousButton.style.display = "list-item";
    }
  }
}

function InserirHTML() {
  let catalogo = document.getElementById("catalogo");
  let paginacao = document.getElementById("container-paginacao");

  catalogo.innerHTML = "";
  paginacao.innerHTML = "";

  quartosPaginados.forEach((quarto) => {
    let { photo, type, name, price, descricao } = quarto;

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
              <small class="text-muted">${type}</small>
            </div>
          </div>
        `;
  });

  paginacao.appendChild(createPagination());
}

let cordenadasSP=[-23.5639719, -46.6578489];

var mymap = L.map("mapid").setView(cordenadasSP, 13);

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
  {
    maxZoom: 18,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
  }
).addTo(mymap);
