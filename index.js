// Récupération des éléments HTML
const countriesContainer = document.querySelector(".countries-container");
const inputSearch = document.getElementById("inputSearch");
const inputRange = document.getElementById("inputRange");
const rangeValue = document.getElementById("rangeValue");
const btnSort = document.querySelectorAll(".btnSort");
const populationTotalElement = document.createElement("p");
populationTotalElement.style.color = "white";
populationTotalElement.style.marginTop = "10px";


// Initialisation des variables
let countriesData = [];
let sortMethod = "maxToMin";

// Fonction pour récupérer les données des pays depuis l'API
async function fetchCountries() {
  await fetch("https://restcountries.com/v3.1/all")
    .then((res) => res.json())
    .then((data) => (countriesData = data));

  countriesDisplay();
}

// Fonction pour afficher les pays
function countriesDisplay() {
  const displayedCountries = countriesData
    .filter((country) =>
      country.translations.fra.common.toLowerCase().includes(inputSearch.value.toLowerCase())
    )
    .sort((a, b) => {
      if (sortMethod === "maxToMin") {
        return b.population - a.population;
      } else if (sortMethod === "minToMax") {
        return a.population - b.population;
      } else if (sortMethod === "alpha") {
        return a.translations.fra.common.localeCompare(b.translations.fra.common);
      }
    })
    .slice(0, inputRange.value);

  // Calcul de la population totale
  let populationTotal = 0;
  for (let i = 0; i < displayedCountries.length; i++) {
    populationTotal += displayedCountries[i].population;
  }

  populationTotalElement.textContent = `Population totale des pays affichés : ${populationTotal.toLocaleString()}`;

  // Génération des cartes de pays
  countriesContainer.innerHTML = displayedCountries
    .map(
      (country) => `
          <div class="card">
            <img src=${country.flags.svg} alt="drapeau ${country.translations.fra.common}">
            <h2>${country.translations.fra.common}</h2>
            <h4>${country.capital}</h4>
            <p>Population : ${country.population.toLocaleString()}</p>
          </div>
        `
    )
    .join("");
}

// Événements
window.addEventListener("load", fetchCountries);

inputSearch.addEventListener("input", countriesDisplay);

inputRange.addEventListener("input", () => {
  countriesDisplay();
  rangeValue.textContent = inputRange.value;
});

btnSort.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    sortMethod = e.target.id;
    countriesDisplay();
  });
});

// Ajout de l'élément pour afficher la population totale
populationTotalElement.id = "populationTotal";
document.querySelector(".filter-container").appendChild(populationTotalElement);
