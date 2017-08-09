import config from '../config.js'
const { baseUrl } = config

function _url(uri) {
  return baseUrl + uri
}

export function recoverData() {
  return new Promise(function (resolve, reject) {
    Promise.all([
      fetch(_url('/json/pokemon.json')).then(response => response.json()),
      fetch(_url('/json/stats.json')).then(response => response.json()),
      fetch(_url('/json/pokemon_stats.json')).then(response => response.json()),
      fetch(_url('/json/types.json')).then(response => response.json()),
      fetch(_url('/json/pokemon_types.json')).then(response => response.json()),
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

      // Map<type_id, { values: number[], average: number, stat: { id: number, identifier: string } }[]>
      const baseStatsByTypes = new Map()

      // console.time('computations')

      pokemon_types.forEach(record => {
        const pokemon = pokemonsMap.get(record.pokemon_id)
        const type = typesMap.get(record.type_id)

        if (!Array.isArray(pokemon.types)) {
          pokemon.types = []
        }

        if (!baseStatsByTypes.has(record.type_id)) {
          baseStatsByTypes.set(record.type_id, [])
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
          const statsArray = baseStatsByTypes.get(type.type.id)
          let index = statsArray.findIndex(stat => stat.stat.id === record.stat_id)

          if (index === -1) {
            statsArray.push({ values: [], average: -1, stat: stat })
            index = statsArray.length - 1
          }

          statsArray[index].values.push(record.base_stat)
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
      window.baseStatsByTypes = baseStatsByTypes

      resolve({
        pokemons: pokemons,
        baseStatsByTypes: baseStatsByTypes,
      })
    }).catch(reject)
  })
}
