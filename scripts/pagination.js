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
  redirecionar();
}

function mudarPagina(page) {
  paginaAtual = page;
  carregarLista();
  redirecionar();
}

function voltarPagina() {
  paginaAtual -= 1;
  carregarLista();
  redirecionar();
}

function redirecionar() {
  window.location.href = "#index";
}

function carregarLista() {
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const final = inicio + itensPorPagina;

  listaPaginada = lista.slice(inicio, final);

  atualizarQuartos(listaPaginada);
  validarBotoes();
  carregarMapa();
}

function validarBotoes() {
  let previousButton = document.getElementById("previousPage");
  let nextButton = document.getElementById("nextPage");

  nextButton.style.display = "none";
  previousButton.style.display = "none";

  if (paginaAtual != totalDePaginas) {
    nextButton.style.display = "list-item";
  }
  if (paginaAtual != 1) {
    previousButton.style.display = "list-item";
  }
}
