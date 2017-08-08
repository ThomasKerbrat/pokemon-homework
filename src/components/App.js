import React, { Component } from 'react'
import { BrowserRouter, Route, } from 'react-router-dom'

import './App.css'

import { SearchablePokemonList } from './SearchablePokemonList'
import { PokemonDetails } from './PokemonDetails'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pokemons: [],
    }
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
      ] = response

      const pokemonsMap = new Map(pokemons.map(obj => [obj.id, obj]))
      const statsMap = new Map(stats.map(obj => [obj.id, obj]))
      const typesMap = new Map(types.map(obj => [obj.id, obj]))

      const baseStatsByTypes = new Map() // Map<type_id, Map<stat_id, { values: base_stat[], average: number }>>

      // console.time('computations')

      pokemon_types.forEach(record => {
        const pokemon = pokemonsMap.get(record.pokemon_id)
        const type = typesMap.get(record.type_id)

        if (!Array.isArray(pokemon.types)) {
          pokemon.types = []
        }

        if (!baseStatsByTypes.has(record.type_id)) {
          baseStatsByTypes.set(record.type_id, new Map())
        }

        pokemon.types.push({
          type: type,
          slot: record.slot,
        })
      })

      pokemon_stats.forEach(record => {
        const pokemon = pokemonsMap.get(record.pokemon_id)
        const stat = statsMap.get(record.stat_id)

        if (!Array.isArray(pokemon.stats)) {
          pokemon.stats = []
        }

        pokemon.types.forEach(type => {
          const typeMap = baseStatsByTypes.get(type.type.id)

          if (!typeMap.has(record.stat_id)) {
            typeMap.set(record.stat_id, { values: [], average: -1 })
          }

          typeMap.get(record.stat_id).values.push(record.base_stat)
        })

        pokemon.stats.push({
          stat: stat,
          base_stat: record.base_stat,
          effort: record.effort,
        })
      })

      baseStatsByTypes.forEach((baseStatsMap, typeKey) => {
        baseStatsMap.forEach((baseStats, statKey) => {
          const values = baseStats.values
          baseStats.average = values.reduce((sum, stat) => sum + stat, 0) / values.length
          delete baseStats.values
        })
      })

      // console.timeEnd('computations')
      window.pokemons = pokemons

      this.setState({
        pokemons: pokemons,
      })
      // TODO: baseStatsByTypes
    }).catch(error => console.error(error))
  }

  render() {
    let pokemon = null

    return (
      <BrowserRouter>
        <div className="app-container">
          <Route path="/pokemons" render={() => (
            <SearchablePokemonList pokemons={this.state.pokemons} />
          )} />
          <Route path="/pokemons/:pokemonName" render={({ match }) => (
            this.state.pokemons.findIndex(pokemon => pokemon.identifier === match.params.pokemonName) > -1
              ? <PokemonDetails pokemon={
                this.state.pokemons.find(pokemon => pokemon.identifier === match.params.pokemonName)
              } />
              : null
          )} />
          {/* <Redirect from="/" to="/pokemons" /> */}
        </div>
      </BrowserRouter>
    )
  }
}

export default App
