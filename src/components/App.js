import React, { Component } from 'react'
import { BrowserRouter, Route, } from 'react-router-dom'

import { recoverData } from '../services/recovery'
import { authenticate } from '../services/twitter'

import { SearchablePokemonList } from './SearchablePokemonList'
import { PokemonDetails } from './PokemonDetails'
import './App.css'

import config from '../config.js'
const { key, secret } = config

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pokemons: [],
      baseStatsByTypes: null,
      twitterAuthenticated: false,
    }
  }

  componentDidMount() {
    recoverData()
      .then(results => this.setState(results))
      .catch(error => console.error(error))

    authenticate(key, secret)
      .then(response => this.setState({ twitterAuthenticated: true }))
      .catch(error => console.error(error))
  }

  render() {
    return (
      <BrowserRouter>
        <div className="app-container" style={{ display: 'flex', flexDirection: 'row' }}>
          <Route path="/" render={() => (
            <SearchablePokemonList pokemons={this.state.pokemons} />
          )} />
          <Route path="/:pokemonName" render={({ match }) => {
            const index = this.state.pokemons.findIndex(pokemon => pokemon.identifier === match.params.pokemonName)
            return index !== -1
              ? <PokemonDetails
                  pokemon={this.state.pokemons[index]}
                  baseStatsByTypes={this.state.baseStatsByTypes}
                  twitterAuthenticated={this.state.twitterAuthenticated}
                />
              : null
          }} />
        </div>
      </BrowserRouter>
    )
  }
}

export default App
