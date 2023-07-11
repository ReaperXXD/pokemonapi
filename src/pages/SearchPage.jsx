import React, { useContext, useState, useEffect } from "react";
import { CardPokemon } from "../components";
import { PokemonContext } from "../context/PokemonContext";
import { debounce } from "../context/debounce";

export const SearchPage = () => {
  const { getPokemonBySearch } = useContext(PokemonContext);

  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const debouncedSearch = debounce(async (searchValue) => {
    const results = await getPokemonBySearch(searchValue);
    setSearchResults(results);
  }, 2000);

  useEffect(() => {
    debouncedSearch(searchInput);
  }, [searchInput, debouncedSearch]);

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="container">
      <input
        type="text"
        value={searchInput}
        onChange={handleInputChange}
        placeholder="Search Pokémon"
      />
      <div className="card-list-pokemon container">
        {searchResults.map((pokemon) => (
          <CardPokemon pokemon={pokemon} key={pokemon.id} />
        ))}
      </div>
    </div>
  );
};
