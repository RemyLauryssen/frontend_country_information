import {useState} from 'react';
import axios from 'axios';
import './App.css';
import worldMap from './assets/world_map.png';
import getContinent from "./helpers/getContinent.js";
import roundToClosestMillion from "./helpers/roundToClosestMillion.js";


function App() {
    const [countries, setCountries] = useState([]);
    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);
    const [countryInfo, setCountryInfo] = useState({});
    const [searchInput, setSearchInput] = useState('');

    async function getCountries() {
        try {
            toggleLoading(true);
            toggleError(false);
            const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,flags,population,region');
            console.log(response.data);
            response.data.sort((a, b) => {
                // Een aflopend inwonersaantal leek mij logischer, ook al stond het andersom in de opdracht
                return b.population - a.population;
            });
            setCountries(response.data);

        } catch (error) {
            console.error(error);
            toggleError(true);
        } finally {
            toggleLoading(false);
        }
    }

    async function handleCountryRequest(e) {
        e.preventDefault();

        try {
            toggleLoading(true);
            toggleError(false);
            const response = await axios.get(`https://restcountries.com/v3.1/name/${searchInput}`);
            const country = response.data[0];
            console.log(country);
            setCountryInfo(country);
            setSearchInput('');
            setCountries([]);

        } catch (error) {
            console.error(error);
            toggleError(true);
        } finally {
            toggleLoading(false);
        }
    }

    function resetCountryDisplay() {
        setCountryInfo(0);
        setSearchInput('');
        setCountries([]);
    }

    return (
        <>
            <header>
                <img src={worldMap} alt="Image of a world map"/>
            </header>
            <main>
                <section>
                    <h2>World Regions</h2>
                    <div className="buttons">
                    <button type="button" onClick={getCountries} disabled={loading}>List of all countries</button>
                    <button type="button" onClick={resetCountryDisplay} disabled={loading}>Reset countries</button>
                    </div>
                    <div>
                        <ul className="outer-container">
                            {countries.map((country) => {
                                return (<li key={country?.name?.official}>
                                    <div className={`country-tiles ${getContinent(country?.region)}`}>
                                        <div className="country-inner-box">
                                        <span><img className="flag" src={country?.flags?.svg}
                                                   alt={country?.flags?.alt}/></span>
                                            <h3 className={getContinent(country?.region)}>{country?.name?.common}</h3>
                                        </div>
                                        <p>Has a population of {country?.population} people.</p>

                                    </div>
                                </li>)
                            })}

                        </ul>
                    </div>
                </section>
                <form onSubmit={handleCountryRequest}>
                    <div>
                    <input
                        type="text"
                        name="search"
                        id="search-bar"
                        placeholder="i.e., France, Malaysia"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button type="submit">Find country</button>
                        <span>{error && <p>Something went wrong. Please try a different search</p>}</span>
                    </div>

                </form>
                {Object.keys(countryInfo).length > 0 &&
                    <section className="info-outer-container">
                        <div className={`info-inner-container ${getContinent(countryInfo?.region)}`}>
                            <span className="country-inner-box">
                              <img src={countryInfo?.flags.svg} alt={`Flag of ${countryInfo?.name?.common}`}
                                   className="flag"/>
                              <h3>{countryInfo?.name?.common}</h3>
                            </span>
                            <p>{countryInfo?.name?.common} is situated in {countryInfo?.subregion} and the capital
                                is {countryInfo?.capital[0]}.</p>
                            <p>It has a population of {roundToClosestMillion(countryInfo?.population)} people and it borders
                                with {countryInfo?.borders?.length} neighboring countries.</p>
                            <p>Websites can be found on <code>{countryInfo?.tld[0]}</code> domains.</p>
                        </div>
                    </section>
                }
            </main>
        </>
    )
}

export default App;