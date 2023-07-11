import React, { useEffect, useState } from "react";
import { useForm } from "../hook/useForm";
import { PokemonContext } from "./PokemonContext";
import { debounce } from "../context/debounce";

export const PokemonProvider = ({ children }) => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [globalPokemons, setGlobalPokemons] = useState([]);
  const [offset, setOffset] = useState(0);

  // Utilizar CustomHook - useForm
  const { valueSearch, onInputChange, onResetForm } = useForm({
    valueSearch: "",
  });

  // Estados para la aplicación simples
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);

  // Llamar 50 pokemones a la API
  const getAllPokemons = async (limit = 50) => {
    const baseURL = "https://pokeapi.co/api/v2/";

    const res = await fetch(
      `${baseURL}pokemon?limit=${limit}&offset=${offset}`
    );
    const data = await res.json();

    const promises = data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      const data = await res.json();
      return data;
    });
    const results = await Promise.all(promises);

    setAllPokemons((prevPokemons) => [...prevPokemons, ...results]);
    setLoading(false);
  };

  // Llamar todos los pokemones
  const getGlobalPokemons = async () => {
    const baseURL = "https://pokeapi.co/api/v2/";

    const res = await fetch(`${baseURL}pokemon?limit=100000&offset=0`);
    const data = await res.json();

    const promises = data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      const data = await res.json();
      return data;
    });
    const results = await Promise.all(promises);

    setGlobalPokemons(results);
    setLoading(false);
  };

  // Llamar a un pokemon por ID
  const getPokemonByID = async (id) => {
    const baseURL = "https://pokeapi.co/api/v2/";

    const res = await fetch(`${baseURL}pokemon/${id}`);
    const data = await res.json();
    return data;
  };

  // Search Pokémon by name
  const getPokemonBySearch = async (searchValue) => {
    const baseURL = "https://pokeapi.co/api/v2/";
    const res = await fetch(`${baseURL}pokemon?limit=100000&offset=0`);
    const data = await res.json();

    const filteredResults = data.results.filter((pokemon) =>
      pokemon.name.includes(searchValue.toLowerCase())
    );

    const promises = filteredResults.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      const data = await res.json();
      return data;
    });

    const results = await Promise.all(promises);
    return results;
  };

  // BTN CARGAR
  const onClickLoadMore = () => {
    setOffset((prevOffset) => prevOffset + 50);
  };

  // Filter Function + State
  const [typeSelected, setTypeSelected] = useState({
    grass: false,
    normal: false,
    fighting: false,
    flying: false,
    poison: false,
    ground: false,
    rock: false,
    bug: false,
    ghost: false,
    steel: false,
    fire: false,
    water: false,
    electric: false,
    psychic: false,
    ice: false,
    dragon: false,
    dark: false,
    fairy: false,
    unknow: false,
    shadow: false,
  });

  const [filteredPokemons, setFilteredPokemons] = useState([]);

  const handleCheckbox = (e) => {
    setTypeSelected((prevTypeSelected) => ({
      ...prevTypeSelected,
      [e.target.name]: e.target.checked,
    }));

    if (e.target.checked) {
      const filteredResults = globalPokemons.filter((pokemon) =>
        pokemon.types.map((type) => type.type.name).includes(e.target.name)
      );
      setFilteredPokemons((prevFilteredPokemons) => [
        ...prevFilteredPokemons,
        ...filteredResults,
      ]);
    } else {
      const filteredResults = filteredPokemons.filter(
        (pokemon) =>
          !pokemon.types.map((type) => type.type.name).includes(e.target.name)
      );
      setFilteredPokemons((prevFilteredPokemons) => [...filteredResults]);
    }
  };

  // Debounced search function
  const debouncedSearch = debounce(async (searchValue) => {
    const results = await getPokemonBySearch(searchValue);
    setFilteredPokemons(results);
  }, 2000);

  const [searchInput, setSearchInput] = useState("");

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchInput(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    getAllPokemons();
  }, [offset]);

  useEffect(() => {
    getGlobalPokemons();
  }, []);

  useEffect(() => {
    debouncedSearch(valueSearch);
  }, [valueSearch]);

  const value = {
    valueSearch,
    onInputChange,
    onResetForm,
    allPokemons,
    globalPokemons,
    getPokemonByID,
    onClickLoadMore,
    loading,
    setLoading,
    active,
    setActive,
    handleCheckbox,
    filteredPokemons,
    searchInput,
    handleInputChange,
  };

  return (
    <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>
  );
};
