const fs = require("fs").promises;
var fsp = require("fs/promises");
const zlib = require("zlib");
// const { Schematic } = require('prismarine-schematic');
const nbt = require("prismarine-nbt");
const { promisify } = require("util");

const gzip = promisify(zlib.gzip);

const blockID = 1;
const supportingBlock = "minecraft:stone"
async function squish() {
  //find a _in file
  const files = await fsp.readdir("./Data/In");
  let file
  for (let i = 0; i < files.length; i++) {
    if (files[i].includes("_In.nbt")) {
      file = files[i];
    }
  }

  if (!file) {
    console.log("No _In.nbt file found");
    return;
  }
  const data = await fs.readFile(`./Data/In/${file}`);
  const { parsed, type } = await nbt.parse(data);
  console.log(parsed);
  //find a _squisher file
  file = null;
  for (let i = 0; i < files.length; i++) {
    if (files[i].includes("_Squisher.nbt")) {
      file = files[i];
    }
  }

  if (!file) {
    console.log("No _Squisher.nbt file found");
    return;
  }

  const squishData = await fs.readFile(`./Data/In/${file}`);
  const { parsed: squishParsed, type: squishType } = await nbt.parse(
    squishData
  );
  console.log(squishParsed);

  //get the supporting block
  let supportingBlockID = null;
  supportingBlockID = parsed.value.palette.value.value.findIndex(
    (block) => block.Name.value === supportingBlock
  );
  if (supportingBlockID === -1) {
    console.log(`Supporting block ${supportingBlock} not found`);
    // return;
  }


  for (let i = 0; i < squishParsed.value.blocks.value.value.length; i++) {
    if (squishParsed.value.blocks.value.value[i].state.value === blockID) {

      const x = squishParsed.value.blocks.value.value[i].pos.value.value[0];
      const y = squishParsed.value.blocks.value.value[i].pos.value.value[1];
      const z = squishParsed.value.blocks.value.value[i].pos.value.value[2];

      let blockIndex = parsed.value.blocks.value.value.findIndex(
        (block) =>
          block.pos.value.value[0] === x && block.pos.value.value[2] === z
      );

      if (blockIndex === -1) {
        console.log(`Block not found at ${x}, ${y}, ${z}`);
        continue;
      }

      if (parsed.value.blocks.value.value[blockIndex].state.value === supportingBlockID) {
        parsed.value.blocks.value.value[blockIndex].pos.value.value[1] = 1;
        blockIndex = parsed.value.blocks.value.value.findIndex(
          (block) =>
            block.pos.value.value[0] === x && block.pos.value.value[2] === z && block.pos.value.value[1] != 1
        );
        if (blockIndex === -1) {
          console.log(`Block not found at ${x}, ${y}, ${z}`);
          continue;
        }
        parsed.value.blocks.value.value[blockIndex].pos.value.value[1] = 2;
      }
      else{
        parsed.value.blocks.value.value[blockIndex].pos.value.value[1] = 2;
      }
      console.log(
        `new state: ${parsed.value.blocks.value.value[blockIndex].pos.value.value[0]}, ${parsed.value.blocks.value.value[blockIndex].pos.value.value[1]}, ${parsed.value.blocks.value.value[blockIndex].pos.value.value[2]} with state ${parsed.value.blocks.value.value[blockIndex].state.value}`
      );
    }
  }
  console.log(parsed.value.blocks.value.value);


  let savedata = await nbt.writeUncompressed(parsed);
  //new file name
  const newFileName = file.replace("_Squisher.nbt", "_out.nbt");
  await fs.writeFile(`./Data/Out/${newFileName}`, savedata);
  console.log("Done");
}

exports.squish = squish;
