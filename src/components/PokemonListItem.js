import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export class PokemonListItem extends Component {
  render() {
    return (
      <li>
        <Link to={`/pokemons/${this.props.pokemon.identifier}`}>{this.props.pokemon.identifier}</Link>
      </li>
    )
  }
}
