import { readFile } from 'fs-extra'
import path from 'path'
import fs from 'fs-extra'
import { Polygon, Tournament, Zone } from '../mongo'

const keys = {
  BE: 'NAME_1',
  FR: 'nom',
  US: 'name'
}

async function readByCountry(code: string) {
  const filePath = path.join(__dirname, 'zones', code, 'regions.geojson')
  const file = await readFile(filePath, 'utf-8')

  if (!file) {
    throw new Error(`File does not exists at: ${filePath}`)
  }

  return JSON.parse(file)
}

export async function loadZones() {
  await Zone.deleteMany({})
  await Tournament.deleteMany({})
  await Polygon.deleteMany({})

  const countryCodes = await fs.readdir(path.join(__dirname, 'zones'))

  countryCodes.forEach(async (countryCode) => {
    const { features } = await readByCountry(countryCode)

    features.forEach(async ({ properties, geometry }) => {
      const name = properties[keys[countryCode]]
      const polygons = []

      const zone = await Zone.create({
        name,
        picture: '',
        country_code: countryCode.toUpperCase()
      })

      if (geometry.type === 'Polygon') {
        polygons.push({
          coordinates: geometry.coordinates,
          vertices: geometry.coordinates[0].length
        })
      }

      if (geometry.type === 'MultiPolygon') {
        geometry.coordinates.forEach((polygon) => {
          // If we have subpolygons, only the first one is the real area, the n+1 are holes
          if (polygon.length > 1) {
            const poly = polygon[0]

            polygons.push({
              coordinates: polygon,
              vertices: poly.length
            })
          } else {
            polygons.push({
              coordinates: polygon,
              vertices: polygon[0].length
            })
          }
        })
      }

      Polygon.create(
        polygons.map((polygon) => ({
          type: 'Polygon',
          coordinates: polygon.coordinates,
          vertices: polygon.vertices,
          zone: zone.id
        }))
      )
    })
  })
}
