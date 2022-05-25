import { readFile } from 'fs-extra'
import path from 'path'
import { Tournament, Zone } from '../mongo'

async function readByCountry(code: string) {
  const filePath = path.join(__dirname, 'zones', code, 'regions.geojson')
  const file = await readFile(filePath, 'utf-8')

  if (!file) {
    throw new Error(`File does not exists at: ${filePath}`)
  }

  return JSON.parse(file)
}

export async function loadZones() {
  await Zone.deleteMany({})
  await Tournament.deleteMany({})

  const bulk = []
  const regions = await readByCountry('fr')

  regions.features.forEach((region) => {
    const name = region.properties.nom
    const coords = region.geometry

    bulk.push({
      name,
      picture: '://anything.png',
      location: coords
    })
  })

  return Zone.create(bulk)
}
