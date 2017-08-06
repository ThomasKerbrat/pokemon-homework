import React, { Component } from 'react';
import { BrowserRouter, Route, Link, } from 'react-router-dom';
import './App.css';

let POKEMONS, STATS_BY_TYPES;

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
        <Link to={`/pokemons/${this.props.pokemon.identifier}`}>{this.props.pokemon.identifier}</Link>
      </li>
    );
  }
}

class PokemonList extends Component {
  render() {
    return (
      <ul>
        {this.props.pokemons.map((pokemon) => (
          <PokemonListItem pokemon={pokemon} key={pokemon.identifier} />
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
    };

    this.handleSearchTextInput = this.handleSearchTextInput.bind(this);
  }

  componentDidMount() {
    Promise.all([
      fetch('/json/pokemon.json').then(response => response.json()),
      fetch('/json/stats.json').then(response => response.json()),
      fetch('/json/pokemon_stats.json').then(response => response.json()),
      fetch('/json/types.json').then(response => response.json()),
      fetch('/json/pokemon_types.json').then(response => response.json()),
    ]).then(response => {
      const [
        pokemons, // id, identifier, species_id, height, weight, base_experience, order, is_default,
        stats, // id, damage_class_id, identifier, is_battle_only, game_index,
        pokemon_stats, // pokemon_id, stat_id, base_stat, effort,
        types, // id, identifier, generation_id, damage_class_id,
        pokemon_types, // pokemon_id, type_id, slot,
      ] = response;

      const pokemonsMap = new Map(pokemons.map(obj => [obj.id, obj]));
      const statsMap = new Map(stats.map(obj => [obj.id, obj]));
      const typesMap = new Map(types.map(obj => [obj.id, obj]));

      const baseStatsByTypes = new Map(); // Map<type_id, Map<stat_id, { values: base_stat[], average: number }>>

      // console.time('computations');

      pokemon_types.forEach(record => {
        const pokemon = pokemonsMap.get(record.pokemon_id);
        const type = typesMap.get(record.type_id);

        if (!Array.isArray(pokemon.types)) {
          pokemon.types = [];
        }

        if (!baseStatsByTypes.has(record.type_id)) {
          baseStatsByTypes.set(record.type_id, new Map());
        }

        pokemon.types.push({
          type: type,
          slot: record.slot,
        });
      });

      pokemon_stats.forEach(record => {
        const pokemon = pokemonsMap.get(record.pokemon_id);
        const stat = statsMap.get(record.stat_id);

        if (!Array.isArray(pokemon.stats)) {
          pokemon.stats = [];
        }

        pokemon.types.forEach(type => {
          const typeMap = baseStatsByTypes.get(type.type.id);

          if (!typeMap.has(record.stat_id)) {
            typeMap.set(record.stat_id, { values: [], average: -1 });
          }

          typeMap.get(record.stat_id).values.push(record.base_stat);
        });

        pokemon.stats.push({
          stat: stat,
          base_stat: record.base_stat,
          effort: record.effort,
        });
      });

      baseStatsByTypes.forEach((baseStatsMap, typeKey) => {
        baseStatsMap.forEach((baseStats, statKey) => {
          const values = baseStats.values;
          baseStats.average = values.reduce((sum, stat) => sum + stat, 0) / values.length;
          delete baseStats.values;
        });
      });

      // console.timeEnd('computations');
      window.pokemons = pokemons

      POKEMONS = pokemons
      STATS_BY_TYPES = baseStatsByTypes
    })
      .catch(error => console.error(error))
  }

  handleSearchTextInput(searchText) {
    this.setState({
      searchText: searchText,
      pokemons: typeof searchText === 'string' && searchText.length > 1
        ? POKEMONS.filter((pokemon) => pokemon.identifier.indexOf(searchText) !== -1)
        : [],
    });
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
  constructor(props) {
    super(props);
    this.state = {
      pokemon: POKEMONS.find(pokemon => pokemon.identifier === props.match.params.pokemonName),
    }
  }

  getSpriteUrl(pokemon) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  }

  render() {
    return (
      <div style={{ height: '100px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <img src={this.getSpriteUrl(this.state.pokemon)} />
        <h1>{this.state.pokemon.identifier}</h1>
      </div>
    );
  }
}

export default App;
