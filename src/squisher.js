const fs = require("fs").promises;
var fsp = require("fs/promises");
const zlib = require("zlib");
// const { Schematic } = require('prismarine-schematic');
const nbt = require("prismarine-nbt");
const { promisify } = require("util");

const gzip = promisify(zlib.gzip);

const blockID = 1;

async function squish() {
  const data = await fs.readFile("./Data/In/mapWorking2_in.nbt");
  // const { Schmatic, typeS } = await nbt.parse(data)
  const { parsed, type } = await nbt.parse(data);
  console.log(parsed);
  // console.log('JSON serialized', JSON.stringify(parsed, null, 2))

  const squishData = await fs.readFile("./Data/In/mapart_Squisher.nbt");
  const { parsed: squishParsed, type: squishType } = await nbt.parse(
    squishData
  );
  console.log(squishParsed);

  for (let i = 0; i < squishParsed.value.blocks.value.value.length; i++) {
    if (squishParsed.value.blocks.value.value[i].state.value === blockID) {
      // console.log(squishParsed.value.blocks.value.value[i].pos.value.value[0]);
      const x =
        squishParsed.value.blocks.value.value[i].pos.value.value[0];
      const y =
        squishParsed.value.blocks.value.value[i].pos.value.value[1];
      const z =
        squishParsed.value.blocks.value.value[i].pos.value.value[2];



      //find the index where parsed.value.blocks.value.value.pos[0] === x && parsed.value.blocks.value.value.pos[2] === z && parsed.value.blocks.value.value[blockIndex].state.value != 0
      const blockIndex = parsed.value.blocks.value.value.findIndex(
        (block) =>
          block.pos.value.value[0] === x &&
          block.pos.value.value[2] === z &&
          block.state.value != 0
      );
      

      if (blockIndex === -1) {
        console.log(`Block not found at ${x}, ${y}, ${z}`);
        continue;
      }
      // console.log(blockIndex + " " + x + " " + y + " " + z + " has been found and changed");
      parsed.value.blocks.value.value[blockIndex].pos.value.value[1] = y;
      console.log(`new state: ${parsed.value.blocks.value.value[blockIndex].pos.value.value[0]}, ${parsed.value.blocks.value.value[blockIndex].pos.value.value[1]}, ${parsed.value.blocks.value.value[blockIndex].pos.value.value[2]} with state ${parsed.value.blocks.value.value[blockIndex].state.value}`)
    }
  }
  console.log(parsed.value.blocks.value.value);

  // console.log('JSON serialized', JSON.stringify(squishParsed, null, 2))
  let savedata = await nbt.writeUncompressed(parsed);
  await fs.writeFile("./Data/Out/mapWorking2_out.nbt", savedata);
  console.log("Done");
}

exports.squish = squish;
