import React, { Component } from 'react'

import { PokemonStats } from './PokemonStats'

export class PokemonDetails extends Component {
  getSpriteUrl(pokemon) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
  }

  render() {
    const pokemon = this.props.pokemon
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, margin: '0px 20px' }}>

        <div style={{ height: '100px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <img src={this.getSpriteUrl(pokemon)} alt={`${pokemon.identifier} sprite`} />
          <h1>{pokemon.identifier}</h1>
        </div>

        <div>
          <h2>Types:</h2>
          <ol>
            {pokemon.types.sort((a, b) => a.slot - b.slot).map(type => (
              <li key={type.type.id}>
                {type.type.identifier}
              </li>
            ))}
          </ol>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', flexFlow: 'row wrap' }}>
          <PokemonStats heading='Base Stats:' stats={pokemon.stats} />
          {pokemon.types.sort((a, b) => a.slot - b.slot).map(type => (
            <PokemonStats
              key={type.type.id}
              heading={`Average ${type.type.identifier} Stats:`}
              stats={this.props.baseStatsByTypes.get(type.type.id)}
            />
          ))}
        </div>

      </div>
    )
  }
}
