import React, { Component } from 'react'

import './PokemonStats.css'

export class PokemonStats extends Component {
  render() {
    // As per the following calculation, the max base stat is hard-coded here:
    // pokemons.map(p => p.stats.map(s => s.base_stat).sort((a, b) => b - a)[0]).sort((a, b) => b - a)[0]
    const maxStatValue = 255

    return (
      <div className='app-pokemon-stats'>
        <h2>{this.props.heading}</h2>
        {this.props.stats.map(stat => {
          const stat_value = 'base_stat' in stat ? stat.base_stat : Math.round(stat.average)
          return (
            <div key={stat.stat.id} style={{
              width: `${maxStatValue}px`,
              position: 'relative',
              marginBottom: '4px',
            }}>
              <span>{stat_value}</span>
              &nbsp;
              <span>{stat.stat.identifier}</span>
              <div style={{
                width: `${stat_value}`,
                position: 'absolute',
                left: '0px',
                bottom: '0px',
                border: '1px solid black',
              }}></div>
            </div>
          )
        })}
      </div>
    )
  }
}
