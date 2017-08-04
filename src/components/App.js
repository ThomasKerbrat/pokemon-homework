import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Redirect, } from 'react-router-dom';
import './App.css';
import Pokedex from 'pokedex-promise-v2';

const API = new Pokedex();

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="app-container">
          <Route path="/pokemons" component={SearchablePokemonList} />
          <Route path="/pokemons/:pokemonName" component={PokemonDetails} />
          {/* <Redirect from="/" to="/pokemons" /> */}
        </div>
      </BrowserRouter>
    );
  }
}

class PokemonListItem extends Component {
  render() {
    return (
      <li>
        <Link to={`/pokemons/${this.props.pokemon.name}`}>{this.props.pokemon.name}</Link>
      </li>
    );
  }
}

class PokemonList extends Component {
  render() {
    return (
      <ul>
        {this.props.pokemons.map((pokemon) => (
          <PokemonListItem pokemon={pokemon} key={pokemon.name} />
        ))}
      </ul>
    );
  }
}

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleSearchTextInputChange = this.handleSearchTextInputChange.bind(this);
  }

  handleSearchTextInputChange(event) {
    this.props.onSearchTextInput(event.target.value);
  }

  render() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.searchText}
          onChange={this.handleSearchTextInputChange}
        />
      </form>
    );
  }
}

class SearchablePokemonList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      pokemons: [],
      initialPokemonsList: [],
    };

    this.handleSearchTextInput = this.handleSearchTextInput.bind(this);
  }

  componentDidMount() {
    API.getPokemonsList({ limit: 20, offset: 0 }).then(response => {
      this.setState({
        pokemons: response.results,
        initialPokemonsList: response.results,
      })
    })
  }

  handleSearchTextInput(searchText) {
    this.setState(previous => ({
      searchText: searchText,
      pokemons: searchText
        ? previous.initialPokemonsList.filter((pokemon) => pokemon.name.indexOf(searchText) !== -1)
        : previous.initialPokemonsList,
    }));
  }

  render() {
    return (
      <div className="app-pokemon-list">
        <SearchBar
          searchText={this.state.searchText}
          onSearchTextInput={this.handleSearchTextInput}
        />
        <PokemonList pokemons={this.state.pokemons} />
      </div>
    );
  }
}

class PokemonDetails extends Component {
  render() {
    return (
      <div>{this.props.match.params.pokemonName}</div>
    );
  }
}

export default App;
