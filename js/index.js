const getCountries = async () => {
    const url = 'https://restcountries.com/v3.1/all';
    const resp = await fetch( url );
    const data = await resp.json();


    const countries = data.map( country => {
        return {
            name: country.name.official,
            capital: country.capital,
            region: country.region,
            languages: country.languages,
            population: country.population,
            flag: country.flags.png
        };
    });

    return countries;
};

const getInfoFromwikipedia = async (country) => {
   
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${country} `;
    const resp = await fetch( url );
    const data = await resp.json();

    return data;
};

const buildRows = ()=>{
    getCountries().then( data => {
        const countriesOrdeByName = data.sort((a, b) => a.name.localeCompare(b.name));
        countriesOrdeByName.map( country => {
        let tr = document.createElement("tr");
        
        let td = document.createElement("td");
        td.className = "countryName";
        td.innerText = country.name;
        tr.appendChild(td);
        
        let tdCapital = document.createElement("td");
        td.className = "countryCapital";
        tdCapital.innerText = country.capital;
        tr.appendChild(tdCapital);

        let tdRegion= document.createElement("td");
        tdRegion.innerText = country.region;
        tr.appendChild(tdRegion);

        let tdLanguages = document.createElement("td");
        let linkLanguages = document.createElement("a");
        linkLanguages.innerText = 'View Languages';
        linkLanguages.href = '#';
        tdLanguages.appendChild(linkLanguages);
        tr.appendChild(tdLanguages);
        linkLanguages.addEventListener('click', () => {
            languagesInfo(country.languages)
        });
        

        let tdPopulation  = document.createElement("td");
        tdPopulation.innerText = country.population; 
        tr.appendChild(tdPopulation);

        let tdFlag  = document.createElement("td");
        let imgFlag = document.createElement("img");
        imgFlag.src = country.flag;
        tdFlag.append(imgFlag);
        tr.appendChild(tdFlag);

        let body = document.querySelector("#bodyTable");
        body.append(tr);

        td.addEventListener("click", () => {
            loadCountryInformation(country.name)
        });

        tdCapital.addEventListener("click", () => {
            loadCountryInformation(country.name)
        });

        tdRegion.addEventListener("click", () => {
            loadCountryInformation(country.name)
        });

        tdPopulation.addEventListener("click", () => {
            loadCountryInformation(country.name)
        });

        tdFlag.addEventListener("click", () => {
            loadCountryInformation(country.name)
        });
        // console.log(country);
        })
    })
}

const loadCountryInformation = ( name )=>{
    getInfoFromwikipedia(name).then( country => {
        // console.log(country.extract_html);
        $(document).ready(function () {
                var dialog = bootbox.dialog({
                    title: 'Country Information',
                    message: country.extract_html
                });
            });
    });
}

const languagesInfo = ( languages ) => {
    if(languages){
        let lang = '<ul>';
        Object.entries(languages).sort().forEach(([key, value]) => {
            lang += '<li>'+ value + '</li>'; 
          });
          lang += '</li>';
          $(document).ready(function () {
                var dialog = bootbox.dialog({
                    title: 'Country Information',
                    message: lang
                });
            });
    }else{
    $(document).ready(function () {
        var dialog = bootbox.dialog({
            title: 'Country Information',
            message: "Sin Lenguajes"
        });
    });
    }
}

buildRows();


let options = {
    numberPerPage:50,
    constNumberPerPage:50,
    numberOfPages:5,
    goBar:false,
    pageCounter:true,
    hasPagination:true,
};

let filterOptions = {
    el:'#searchBox'
};

paginate.init('.myTable',options,filterOptions);

input = document.querySelector('#myinput');
table = document.querySelector('#myTable');


function filterTable() {
    let filter = input.value.toUpperCase();
    rows = table.getElementsByTagName("TR");
    let flag = false;
  
    for (let row of rows) {
      let cells = row.getElementsByTagName("TD");
      for (let cell of cells) {
          if(cell.className === 'countryCapital'){
            if (cell.textContent.toUpperCase().indexOf(filter) > -1) {
                flag = true;
                break;
              }
          }
      }
      if (flag) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
  
      flag = false;
    }
  }

  

  input.addEventListener('keyup', function(event) {
    filterTable();
  });