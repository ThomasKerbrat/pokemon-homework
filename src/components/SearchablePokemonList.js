import React, { Component } from 'react'

import { SearchBar } from './SearchBar'
import { PokemonList } from './PokemonList'

export class SearchablePokemonList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      resultList: [],
    }

    this.handleSearchTextInput = this.handleSearchTextInput.bind(this)
  }

  handleSearchTextInput(searchText) {
    this.setState({
      searchText: searchText,
      resultList: typeof searchText === 'string' && searchText.length > 1
        ? this.props.pokemons.filter((pokemon) => pokemon.identifier.indexOf(searchText) !== -1)
        : [],
    })
  }

  render() {
    return (
      <div className="app-pokemon-list">
        <SearchBar
          searchText={this.state.searchText}
          onSearchTextInput={this.handleSearchTextInput}
        />
        <PokemonList pokemons={this.state.resultList} />
      </div>
    )
  }
}
