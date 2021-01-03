import chalk from "chalk"
import { prisma } from "../prisma"

const log = (...args) => (colors) => {
  console.log(colors('[SEED]', ...args))
}

const character = (name: string, picture: string) => ({ name, picture })
const characters = [
  character('Banjo & Kazooie', 'https://www.ssbwiki.com/images/1/12/Banjo%26KazooieHeadSSBUWebsite.png'),
  character('Bayonetta', 'https://www.ssbwiki.com/images/2/27/BayonettaHeadSSBUWebsite.png'),
  character('Bowser', 'https://www.ssbwiki.com/images/0/0b/BowserHeadSSBUWebsite.png'),
  character('Bower Jr', 'https://www.ssbwiki.com/images/3/3e/BowserJrHeadSSBUWebsite.png'),
  character('Byleth', 'https://www.ssbwiki.com/images/8/86/BylethHeadSSBUWebsite.png'),
  character('Captain Falcon', 'https://www.ssbwiki.com/images/6/6b/CaptainFalconHeadSSBUWebsite.png'),
  character('Chrom', 'https://www.ssbwiki.com/images/7/70/ChromHeadSSBUWebsite.png'),
  character('Cloud', 'https://www.ssbwiki.com/images/c/cb/CloudHeadSSBUWebsite.png'),
  character('Corrin', 'https://www.ssbwiki.com/images/6/6a/CorrinHeadSSBUWebsite.png'),
  character('Daisy', 'https://www.ssbwiki.com/images/2/2d/DaisyHeadSSBUWebsite.png'),
  character('Dark Pit', 'https://www.ssbwiki.com/images/8/8b/DarkPitHeadSSBUWebsite.png'),
  character('Dark Samus', 'https://www.ssbwiki.com/images/2/24/DarkSamusHeadSSBUWebsite.png'),
  character('Diddy Kong', 'https://www.ssbwiki.com/images/5/5d/DiddyKongHeadSSBUWebsite.png'),
  character('Donkey Kong', 'https://www.ssbwiki.com/images/2/21/DonkeyKongHeadSSBUWebsite.png'),
  character('Dr Mario', 'https://www.ssbwiki.com/images/c/c8/DrMarioHeadSSBUWebsite.png'),
  character('Duck Hunt', 'https://www.ssbwiki.com/images/3/38/DuckHuntHeadSSBUWebsite.png'),
  character('Falco', 'https://www.ssbwiki.com/images/6/6e/FalcoHeadSSBUWebsite.png'),
  character('Fox', 'https://www.ssbwiki.com/images/c/c9/FoxHeadSSBUWebsite.png'),
  character('Ganondorf', 'https://www.ssbwiki.com/images/b/b6/GanondorfHeadSSBUWebsite.png'),
  character('Greninja', 'https://www.ssbwiki.com/images/7/79/GreninjaHeadSSBUWebsite.png'),
  character('Hero', 'https://www.ssbwiki.com/images/1/1e/HeroHeadSSBUWebsite.png'),
  character('Ice Climbers', 'https://www.ssbwiki.com/images/0/0c/IceClimbersHeadSSBUWebsite.png'),
  character('Ike', 'https://www.ssbwiki.com/images/2/25/IkeHeadSSBUWebsite.png'),
  character('Incineroar', 'https://www.ssbwiki.com/images/e/e3/IncineroarHeadSSBUWebsite.png'),
  character('Inkling', 'https://www.ssbwiki.com/images/0/04/InklingHeadSSBUWebsite.png'),
  character('Isabelle', 'https://www.ssbwiki.com/images/2/2e/IsabelleHeadSSBUWebsite.png'),
  character('Jigglypuff', 'https://www.ssbwiki.com/images/9/90/JigglypuffHeadSSBUWebsite.png'),
  character('Joker', 'https://www.ssbwiki.com/images/6/63/JokerHeadSSBUWebsite.png'),
  character('Ken', 'https://www.ssbwiki.com/images/e/ef/KenHeadSSBUWebsite.png'),
  character('King Dedede', 'https://www.ssbwiki.com/images/f/fe/KingDededeHeadSSBUWebsite.png'),
  character('King K Rool', 'https://www.ssbwiki.com/images/3/35/KingKRoolHeadSSBUWebsite.png'),
  character('Kirby', 'https://www.ssbwiki.com/images/1/15/KirbyHeadSSBUWebsite.png'),
  character('Link', 'https://www.ssbwiki.com/images/2/2b/LinkHeadSSBUWebsite.png'),
  character('Little Mac', 'https://www.ssbwiki.com/images/8/87/LittleMacHeadSSBUWebsite.png'),
  character('Lucario', 'https://www.ssbwiki.com/images/2/20/LucarioHeadSSBUWebsite.png'),
  character('Lucas', 'https://www.ssbwiki.com/images/3/31/LucasHeadSSBUWebsite.png'),
  character('Lucina', 'https://www.ssbwiki.com/images/d/d8/LucinaHeadSSBUWebsite.png'),
  character('Luigi', 'https://www.ssbwiki.com/images/9/9d/LuigiHeadSSBUWebsite.png'),
  character('Mario', 'https://www.ssbwiki.com/images/9/9e/MarioHeadSSBUWebsite.png'),
  character('Marth', 'https://www.ssbwiki.com/images/a/ae/MarthHeadSSBUWebsite.png'),
  character('Mega Man', 'https://www.ssbwiki.com/images/2/26/MegaManHeadSSBUWebsite.png'),
  character('Meta Knight', 'https://www.ssbwiki.com/images/3/3d/MetaKnightHeadSSBUWebsite.png'),
  character('Mewtwo', 'https://www.ssbwiki.com/images/7/7e/MewtwoHeadSSBUWebsite.png'),
  character('Mii Fighter', 'https://www.ssbwiki.com/images/c/cf/MiiFighterHeadSSBUWebsite.png'),
  character('Min Min', 'https://www.ssbwiki.com/images/f/fc/MinMinHeadSSBUWebsite.png'),
  character('Mr Game & Watch', 'https://www.ssbwiki.com/images/1/15/MrGame%26WatchHeadSSBUWebsite.png'),
  character('Ness', 'https://www.ssbwiki.com/images/d/d5/NessHeadSSBUWebsite.png'),
  character('Olimar', 'https://www.ssbwiki.com/images/9/97/OlimarHeadSSBUWebsite.png'),
  character('Pac Man', 'https://www.ssbwiki.com/images/3/3d/Pac-ManHeadSSBUWebsite.png'),
  character('Palutena', 'https://www.ssbwiki.com/images/d/d7/PalutenaHeadSSBUWebsite.png'),
  character('Peach', 'https://www.ssbwiki.com/images/1/14/PeachHeadSSBUWebsite.png'),
  character('Pichu', 'https://www.ssbwiki.com/images/5/50/PichuHeadSSBUWebsite.png'),
  character('Pikachu', 'https://www.ssbwiki.com/images/5/52/PikachuHeadSSBUWebsite.png'),
  character('Piranha Plant', 'https://www.ssbwiki.com/images/c/cf/PiranhaPlantHeadSSBUWebsite.png'),
  character('Pit', 'https://www.ssbwiki.com/images/d/d7/PitHeadSSBUWebsite.png'),
  character('Pokémon Trainer', 'https://www.ssbwiki.com/images/2/2c/Pok%C3%A9monTrainerHeadSSBUWebsite.png'),
  character('Richter', 'https://www.ssbwiki.com/images/a/ab/RichterHeadSSBUWebsite.png'),
  character('Ridley', 'https://www.ssbwiki.com/images/7/7c/RidleyHeadSSBUWebsite.png'),
  character('ROB', 'https://www.ssbwiki.com/images/b/be/ROBHeadSSBUWebsite.png'),
  character('Robin', 'https://www.ssbwiki.com/images/4/43/RobinHeadSSBUWebsite.png'),
  character('Rosalina', 'https://www.ssbwiki.com/images/6/63/RosalinaHeadSSBUWebsite.png'),
  character('Roy', 'https://www.ssbwiki.com/images/2/22/RoyHeadSSBUWebsite.png'),
  character('Ryu', 'https://www.ssbwiki.com/images/2/20/RyuHeadSSBUWebsite.png'),
  character('Samus', 'https://www.ssbwiki.com/images/d/d0/SamusHeadSSBUWebsite.png'),
  character('Sephiroth', 'https://www.ssbwiki.com/images/6/64/SephirothHeadSSBUWebsite.png'),
  character('Sheik', 'https://www.ssbwiki.com/images/1/1e/SheikHeadSSBUWebsite.png'),
  character('Shulk', 'https://www.ssbwiki.com/images/b/bf/ShulkHeadSSBUWebsite.png'),
  character('Simon', 'https://www.ssbwiki.com/images/5/52/SimonHeadSSBUWebsite.png'),
  character('Snake', 'https://www.ssbwiki.com/images/9/9f/SnakeHeadSSBUWebsite.png'),
  character('Sonic', 'https://www.ssbwiki.com/images/b/b7/SonicHeadSSBUWebsite.png'),
  character('Steve', 'https://www.ssbwiki.com/images/4/4f/SteveHeadSSBUWebsite.png'),
  character('Terry', 'https://www.ssbwiki.com/images/2/2e/TerryHeadSSBUWebsite.png'),
  character('Toon Link', 'https://www.ssbwiki.com/images/b/bf/ToonLinkHeadSSBUWebsite.png'),
  character('Villager', 'https://www.ssbwiki.com/images/f/f9/VillagerHeadSSBUWebsite.png'),
  character('Wario', 'https://www.ssbwiki.com/images/7/7f/WarioHeadSSBUWebsite.png'),
  character('Wii Fit Trainer', 'https://www.ssbwiki.com/images/f/fc/WiiFitTrainerHeadSSBUWebsite.png'),
  character('Wolf', 'https://www.ssbwiki.com/images/0/06/WolfHeadSSBUWebsite.png'),
  character('Yoshi', 'https://www.ssbwiki.com/images/9/93/YoshiHeadSSBUWebsite.png'),
  character('Young Link', 'https://www.ssbwiki.com/images/c/c0/YoungLinkHeadSSBUWebsite.png'),
  character('Zelda', 'https://www.ssbwiki.com/images/c/c8/ZeldaHeadSSBUWebsite.png'),
  character('Zero Suit Samus', 'https://www.ssbwiki.com/images/5/5a/ZeroSuitSamusHeadSSBUWebsite.png')
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