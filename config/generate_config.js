const fs = require('fs')
const path = require('path')

const arg = process.argv[2]

if (['dev', 'prod'].indexOf(arg) < 0) {
    throw new Error('Invalid argument. generate-config.js must be called with "dev" or "prod"')
}

const configPath = path.resolve(__dirname, './config.' + arg + '.js')
const configString = fs.readFileSync(configPath)
fs.writeFileSync(path.resolve(__dirname, '../src/config.js'), configString)
