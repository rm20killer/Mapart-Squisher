const nbt = require('nbt-js');
var zlib  = require('zlib');
const fs = require('fs');
const { parseNBT, writeNBT } = require('@minecraft-js/nbt');

const state = 2;
async function squish() {
    const data = await fs.readFileSync('./Data/In/mapWorking2_in.nbt');
    console.log(data)
    const schematic = parseNBT(data);

    console.log(schematic)
    const Squishdata = fs.readFileSync('./Data/In/mapart_Squisher.nbt');
    const Squishschematic = await parseNBT(Squishdata);

    for (let i = 0; i < Squishschematic.payload[""].blocks.length; i++) {
        if (Squishschematic.payload[""].blocks[i].state === state) {
            const x = Squishschematic.payload[""].blocks[i].pos[0];
            const y = Squishschematic.payload[""].blocks[i].pos[1];
            const z = Squishschematic.payload[""].blocks[i].pos[2];

            const blockIndex = schematic.payload[""].blocks.findIndex((block) => block.pos[0] === x && block.pos[2] === z);
            if (blockIndex === -1) {
                console.log(`Block not found at ${x}, ${y}, ${z}`);
                continue;
            }


            schematic.payload[""].blocks[blockIndex].pos[1] = 0;
        }
    }
    console.log(schematic.payload[""]);

    //save
    let saveSchematic = nbt.write(schematic.payload[""]);
    await fs.writeFileSync('./Data/Out/mapWorking3_out.nbt', saveSchematic);
    console.log('Done');

}

exports.squish = squish;