let apiKey: string = "195f02c6";
let apiUrl: string = "https://www.omdbapi.com/?apikey=" + apiKey;

interface movieInterface {
  Year: string;
  Actors: string;
  Country: string;
  Runtime: string;
}

type myCountryType = {
  currencies: { name: string; symbol: string }[];
  population: number;
  name: { common: string };
  cca2: string;
}[];

const btn = document.querySelector("button");

const fetchMovies = (movie: string): Promise<movieInterface> =>
  fetch(apiUrl + "&t=" + movie).then((res) => res.json());

const fetchCountries = (country: string): Promise<myCountryType> =>
  fetch("https://restcountries.com/v3.1/name/" + country).then((res) =>
    res.json()
  );

async function getTotalPopulation(country: string): Promise<number> {
  let mydata = await fetchCountries(country);

  return mydata.filter((i) => i.name.common === country)[0].population;
}

function addImage(country: string): void {
  var img: HTMLImageElement = document.createElement("img");
  img.src = "https://flagpedia.net/data/flags/icon/36x27/" + country + ".png";
  document
    ?.getElementById("menuSix")
    ?.appendChild(createMenuItem(""))
    .appendChild(img);
}

function createMenuItem(name: string): HTMLLIElement {
  let li: HTMLLIElement = document.createElement("li");
  li.textContent = name;
  return li;
}

function extractFirstName(names: string): string {
  const arr: string[] = names
    .split(",")
    .map((element) => element.trim().split(" ")[0]);
  return arr.toString();
}

function calculateTotal(
  movieOne: movieInterface,
  movieTwo: movieInterface,
  movieThree: movieInterface
): string {
  let runtimeOne: number = Number(movieOne.Runtime.split(" ")[0]);
  let runtimeTwo: number = Number(movieTwo.Runtime.split(" ")[0]);
  let runtimeThree: number = Number(movieThree.Runtime.split(" ")[0]);
  console.log(
    "Movie 1 length: " +
      runtimeOne +
      ", Movie 2 length: " +
      runtimeTwo +
      ", Movie 3 length: " +
      runtimeThree
  );
  return String(runtimeOne + runtimeTwo + runtimeThree);
}

btn?.addEventListener("click", function () {
  async function getMultiMovie() {
    const inputs: NodeListOf<HTMLInputElement> =
      document.querySelectorAll("input");
    const res = await Promise.all([
      fetchMovies(inputs[0].value),
      fetchMovies(inputs[1].value),
      fetchMovies(inputs[2].value),
    ])
      .then((data) => {
        console.log("these are the movies: ");
        console.log(data);
        document
          ?.querySelector("#totalRuntime")
          ?.appendChild(
            createMenuItem(calculateTotal(data[0], data[1], data[2]))
          );

        const countrrr: string[][] = [];
        data.forEach((movie: movieInterface) => {
          countrrr.push(
            movie.Country.split(",").map(
              (element) => element.trim().split(",")[0]
            )
          );
        });

        return countrrr;
      })
      .then((data) => {
        console.log(
          "these are the countries in which the corresponding movie was made"
        );
        console.log(data);

        let uniqueCountries: Array<string> = [];
        data.flat().forEach((c) => {
          if (!uniqueCountries.includes(c)) {
            uniqueCountries.push(c);
          }
        });

        console.log(
          "And this is the complete list of the countries (unique values)"
        );
        console.log(uniqueCountries);

        function test() {
          const promises: Promise<number>[] = [];

          for (let i = 0; i < uniqueCountries.length; i++) {
            promises.push(getTotalPopulation(uniqueCountries[i]));
          }

          Promise.all(promises)
            .then((results) => {
              const initialValue: number = 0;
              const sumWithInitial: number = results.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                initialValue
              );
              console.log("All done - corresponding populations", results);
              console.log(
                "So if we sum up these values - it's " + sumWithInitial
              );
              document
                ?.querySelector("#totalPopulation")
                ?.appendChild(createMenuItem(String(sumWithInitial)));
            })
            .catch((e) => {
              // Handle errors here - lazy to do it now XD
            });
        }
        test();
      });
  }
  getMultiMovie();
});
