import React, { Component } from 'react'

import './PokemonStats.css'

export class PokemonStats extends Component {
  render() {
    return (
      <div className='app-pokemon-stats'>
        <h2>{this.props.heading}</h2>
        {this.props.stats.map(stat => (
          <div key={stat.stat.id}>
            <span>{stat.stat.identifier}</span>
            <span>{'base_stat' in stat ? stat.base_stat : Math.round(stat.average)}</span>
          </div>
        ))}
      </div>
    )
  }
}
