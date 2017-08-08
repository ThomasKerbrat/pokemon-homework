import React, { Component } from 'react'

export class PokemonDetails extends Component {
  getSpriteUrl(pokemon) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
  }

  render() {
    const pokemon = this.props.pokemon
    return (
      <div style={{ height: '100px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <img src={this.getSpriteUrl(pokemon)} alt={`${pokemon.identifier} sprite`} />
        <h1>{pokemon.identifier}</h1>
      </div>
    )
  }
}
