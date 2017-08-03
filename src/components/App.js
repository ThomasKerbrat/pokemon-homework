import React, { Component } from 'react';
import { BrowserRouter, Route, Link, } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <SearchablePokemonList />
        </div>
      </BrowserRouter>
    );
  }
}

class PokemonListItem extends Component {
  render() {
    return (
      <li>{this.props.pokemon.name}</li>
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
      pokemons: POKEMONS,
    };

    this.handleSearchTextInput = this.handleSearchTextInput.bind(this);
  }

  handleSearchTextInput(searchText) {
    this.setState({
      searchText: searchText,
      pokemons: searchText
        ? POKEMONS.filter((pokemon) => pokemon.name.indexOf(searchText) !== -1)
        : POKEMONS,
    });
  }

  render() {
    return (
      <div>
        <SearchBar
          searchText={this.state.searchText}
          onSearchTextInput={this.handleSearchTextInput}
        />
        <PokemonList pokemons={this.state.pokemons} />
      </div>
    );
  }
}

const POKEMONS = [
  {
    "url": "http://pokeapi.co/api/v2/pokemon/1/",
    "name": "bulbasaur"
  },
  {
    "url": "http://pokeapi.co/api/v2/pokemon/2/",
    "name": "ivysaur"
  },
  {
    "url": "http://pokeapi.co/api/v2/pokemon/3/",
    "name": "venusaur"
  },
  {
    "url": "http://pokeapi.co/api/v2/pokemon/4/",
    "name": "charmander"
  },
  {
    "url": "http://pokeapi.co/api/v2/pokemon/5/",
    "name": "charmeleon"
  },
  {
    "url": "http://pokeapi.co/api/v2/pokemon/6/",
    "name": "charizard"
  },
  {
    "url": "http://pokeapi.co/api/v2/pokemon/7/",
    "name": "squirtle"
  },
  {
    "url": "http://pokeapi.co/api/v2/pokemon/8/",
    "name": "wartortle"
  },
  {
    "url": "http://pokeapi.co/api/v2/pokemon/9/",
    "name": "blastoise"
  },
  {
    "url": "http://pokeapi.co/api/v2/pokemon/10/",
    "name": "caterpie"
  },
  {
    "url": "http://pokeapi.co/api/v2/pokemon/11/",
    "name": "metapod"
  },
  {
    "url": "http://pokeapi.co/api/v2/pokemon/12/",
    "name": "butterfree"
  },
  {
    "url": "http://pokeapi.co/api/v2/pokemon/13/",
    "name": "weedle"
  },
  {
    "url": "http://pokeapi.co/api/v2/pokemon/14/",
    "name": "kakuna"
  },
  {
    "url": "http://pokeapi.co/api/v2/pokemon/15/",
    "name": "beedrill"
  },
  {
    "url": "http://pokeapi.co/api/v2/pokemon/16/",
    "name": "pidgey"
  },
  {
    "url": "http://pokeapi.co/api/v2/pokemon/17/",
    "name": "pidgeotto"
  },
  {
    "url": "http://pokeapi.co/api/v2/pokemon/18/",
    "name": "pidgeot"
  },
  {
    "url": "http://pokeapi.co/api/v2/pokemon/19/",
    "name": "rattata"
  },
  {
    "url": "http://pokeapi.co/api/v2/pokemon/20/",
    "name": "raticate"
  }
];

export default App;
