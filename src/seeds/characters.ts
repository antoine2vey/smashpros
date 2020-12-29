import chalk from "chalk"
import { prisma } from "../prisma"

const log = (...args) => (colors) => {
  console.log(colors('[SEED]', ...args))
}

const c = (name: string, picture: string) => ({ name, picture })
const characters = [
  c('Banjo & Kazooie', 'https://www.ssbwiki.com/images/1/12/Banjo%26KazooieHeadSSBUWebsite.png'),
  c('Bayonetta', 'https://www.ssbwiki.com/images/2/27/BayonettaHeadSSBUWebsite.png'),
  c('Bowser', 'https://www.ssbwiki.com/images/0/0b/BowserHeadSSBUWebsite.png'),
  c('Bower Jr', 'https://www.ssbwiki.com/images/3/3e/BowserJrHeadSSBUWebsite.png'),
  c('Byleth', 'https://www.ssbwiki.com/images/8/86/BylethHeadSSBUWebsite.png'),
  c('Captain Falcon', 'https://www.ssbwiki.com/images/6/6b/CaptainFalconHeadSSBUWebsite.png'),
  c('Chrom', 'https://www.ssbwiki.com/images/7/70/ChromHeadSSBUWebsite.png'),
  c('Cloud', 'https://www.ssbwiki.com/images/c/cb/CloudHeadSSBUWebsite.png'),
  c('Corrin', 'https://www.ssbwiki.com/images/6/6a/CorrinHeadSSBUWebsite.png'),
  c('Daisy', 'https://www.ssbwiki.com/images/2/2d/DaisyHeadSSBUWebsite.png'),
  c('Dark Pit', 'https://www.ssbwiki.com/images/8/8b/DarkPitHeadSSBUWebsite.png'),
  c('Dark Samus', 'https://www.ssbwiki.com/images/2/24/DarkSamusHeadSSBUWebsite.png'),
  c('Diddy Kong', 'https://www.ssbwiki.com/images/5/5d/DiddyKongHeadSSBUWebsite.png'),
  c('Donkey Kong', 'https://www.ssbwiki.com/images/2/21/DonkeyKongHeadSSBUWebsite.png'),
  c('Dr Mario', 'https://www.ssbwiki.com/images/c/c8/DrMarioHeadSSBUWebsite.png'),
  c('Duck Hunt', 'https://www.ssbwiki.com/images/3/38/DuckHuntHeadSSBUWebsite.png'),
  c('Falco', 'https://www.ssbwiki.com/images/6/6e/FalcoHeadSSBUWebsite.png'),
  c('Fox', 'https://www.ssbwiki.com/images/c/c9/FoxHeadSSBUWebsite.png'),
  c('Ganondorf', 'https://www.ssbwiki.com/images/b/b6/GanondorfHeadSSBUWebsite.png'),
  c('Greninja', 'https://www.ssbwiki.com/images/7/79/GreninjaHeadSSBUWebsite.png'),
  c('Hero', 'https://www.ssbwiki.com/images/1/1e/HeroHeadSSBUWebsite.png'),
  c('Ice Climbers', 'https://www.ssbwiki.com/images/0/0c/IceClimbersHeadSSBUWebsite.png'),
  c('Ike', 'https://www.ssbwiki.com/images/2/25/IkeHeadSSBUWebsite.png'),
  c('Incineroar', 'https://www.ssbwiki.com/images/e/e3/IncineroarHeadSSBUWebsite.png'),
  c('Inkling', 'https://www.ssbwiki.com/images/0/04/InklingHeadSSBUWebsite.png'),
  c('Isabelle', 'https://www.ssbwiki.com/images/2/2e/IsabelleHeadSSBUWebsite.png'),
  c('Jigglypuff', 'https://www.ssbwiki.com/images/9/90/JigglypuffHeadSSBUWebsite.png'),
  c('Joker', 'https://www.ssbwiki.com/images/6/63/JokerHeadSSBUWebsite.png'),
  c('Ken', 'https://www.ssbwiki.com/images/e/ef/KenHeadSSBUWebsite.png'),
  c('King Dedede', 'https://www.ssbwiki.com/images/f/fe/KingDededeHeadSSBUWebsite.png'),
  c('King K Rool', 'https://www.ssbwiki.com/images/3/35/KingKRoolHeadSSBUWebsite.png'),
  c('Kirby', 'https://www.ssbwiki.com/images/1/15/KirbyHeadSSBUWebsite.png'),
  c('Link', 'https://www.ssbwiki.com/images/2/2b/LinkHeadSSBUWebsite.png'),
  c('Little Mac', 'https://www.ssbwiki.com/images/8/87/LittleMacHeadSSBUWebsite.png'),
  c('Lucario', 'https://www.ssbwiki.com/images/2/20/LucarioHeadSSBUWebsite.png'),
  c('Lucas', 'https://www.ssbwiki.com/images/3/31/LucasHeadSSBUWebsite.png'),
  c('Lucina', 'https://www.ssbwiki.com/images/d/d8/LucinaHeadSSBUWebsite.png'),
  c('Luigi', 'https://www.ssbwiki.com/images/9/9d/LuigiHeadSSBUWebsite.png'),
  c('Mario', 'https://www.ssbwiki.com/images/9/9e/MarioHeadSSBUWebsite.png'),
  c('Marth', 'https://www.ssbwiki.com/images/a/ae/MarthHeadSSBUWebsite.png'),
  c('Mega Man', 'https://www.ssbwiki.com/images/2/26/MegaManHeadSSBUWebsite.png'),
  c('Meta Knight', 'https://www.ssbwiki.com/images/3/3d/MetaKnightHeadSSBUWebsite.png'),
  c('Mewtwo', 'https://www.ssbwiki.com/images/7/7e/MewtwoHeadSSBUWebsite.png'),
  c('Mii Fighter', 'https://www.ssbwiki.com/images/c/cf/MiiFighterHeadSSBUWebsite.png'),
  c('Min Min', 'https://www.ssbwiki.com/images/f/fc/MinMinHeadSSBUWebsite.png'),
  c('Mr Game & Watch', 'https://www.ssbwiki.com/images/1/15/MrGame%26WatchHeadSSBUWebsite.png'),
  c('Ness', 'https://www.ssbwiki.com/images/d/d5/NessHeadSSBUWebsite.png'),
  c('Olimar', 'https://www.ssbwiki.com/images/9/97/OlimarHeadSSBUWebsite.png'),
  c('Pac Man', 'https://www.ssbwiki.com/images/3/3d/Pac-ManHeadSSBUWebsite.png'),
  c('Palutena', 'https://www.ssbwiki.com/images/d/d7/PalutenaHeadSSBUWebsite.png'),
  c('Peach', 'https://www.ssbwiki.com/images/1/14/PeachHeadSSBUWebsite.png'),
  c('Pichu', 'https://www.ssbwiki.com/images/5/50/PichuHeadSSBUWebsite.png'),
  c('Pikachu', 'https://www.ssbwiki.com/images/5/52/PikachuHeadSSBUWebsite.png'),
  c('Piranha Plant', 'https://www.ssbwiki.com/images/c/cf/PiranhaPlantHeadSSBUWebsite.png'),
  c('Pit', 'https://www.ssbwiki.com/images/d/d7/PitHeadSSBUWebsite.png'),
  c('Pokémon Trainer', 'https://www.ssbwiki.com/images/2/2c/Pok%C3%A9monTrainerHeadSSBUWebsite.png'),
  c('Richter', 'https://www.ssbwiki.com/images/a/ab/RichterHeadSSBUWebsite.png'),
  c('Ridley', 'https://www.ssbwiki.com/images/7/7c/RidleyHeadSSBUWebsite.png'),
  c('ROB', 'https://www.ssbwiki.com/images/b/be/ROBHeadSSBUWebsite.png'),
  c('Robin', 'https://www.ssbwiki.com/images/4/43/RobinHeadSSBUWebsite.png'),
  c('Rosalina', 'https://www.ssbwiki.com/images/6/63/RosalinaHeadSSBUWebsite.png'),
  c('Roy', 'https://www.ssbwiki.com/images/2/22/RoyHeadSSBUWebsite.png'),
  c('Ryu', 'https://www.ssbwiki.com/images/2/20/RyuHeadSSBUWebsite.png'),
  c('Samus', 'https://www.ssbwiki.com/images/d/d0/SamusHeadSSBUWebsite.png'),
  c('Sephiroth', 'https://www.ssbwiki.com/images/6/64/SephirothHeadSSBUWebsite.png'),
  c('Sheik', 'https://www.ssbwiki.com/images/1/1e/SheikHeadSSBUWebsite.png'),
  c('Shulk', 'https://www.ssbwiki.com/images/b/bf/ShulkHeadSSBUWebsite.png'),
  c('Simon', 'https://www.ssbwiki.com/images/5/52/SimonHeadSSBUWebsite.png'),
  c('Snake', 'https://www.ssbwiki.com/images/9/9f/SnakeHeadSSBUWebsite.png'),
  c('Sonic', 'https://www.ssbwiki.com/images/b/b7/SonicHeadSSBUWebsite.png'),
  c('Steve', 'https://www.ssbwiki.com/images/4/4f/SteveHeadSSBUWebsite.png'),
  c('Terry', 'https://www.ssbwiki.com/images/2/2e/TerryHeadSSBUWebsite.png'),
  c('Toon Link', 'https://www.ssbwiki.com/images/b/bf/ToonLinkHeadSSBUWebsite.png'),
  c('Villager', 'https://www.ssbwiki.com/images/f/f9/VillagerHeadSSBUWebsite.png'),
  c('Wario', 'https://www.ssbwiki.com/images/7/7f/WarioHeadSSBUWebsite.png'),
  c('Wii Fit Trainer', 'https://www.ssbwiki.com/images/f/fc/WiiFitTrainerHeadSSBUWebsite.png'),
  c('Wolf', 'https://www.ssbwiki.com/images/0/06/WolfHeadSSBUWebsite.png'),
  c('Yoshi', 'https://www.ssbwiki.com/images/9/93/YoshiHeadSSBUWebsite.png'),
  c('Young Link', 'https://www.ssbwiki.com/images/c/c0/YoungLinkHeadSSBUWebsite.png'),
  c('Zelda', 'https://www.ssbwiki.com/images/c/c8/ZeldaHeadSSBUWebsite.png'),
  c('Zero Suit Samus', 'https://www.ssbwiki.com/images/5/5a/ZeroSuitSamusHeadSSBUWebsite.png')
]

function loadCharacters() {
  const createCharacters = []

  for (let character of characters) {
    const promise = prisma.character.create({ data: character })
    createCharacters.push(promise)
  }

  return Promise.all(createCharacters)
}

log('Creating characters ...')(chalk.bold)
loadCharacters()
  .then(() => {
    log('Created characters!')(chalk.green.bold)
  })
  .catch(() => {
    log('Error during character creation...')(chalk.red.bold)
  })
  .finally(() => {
    process.exit(0)
  })