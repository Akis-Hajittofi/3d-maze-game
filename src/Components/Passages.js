import React from "react";
import Wall from "./Wall";

function PassageComponent({
  position,
  rotation,
  offset = 0,
  color = "white",
  l = 70,
  depth,
}) {
  const width = l;
  return (
    // <group rotation={rotation} position={[0, 0, l / 2 + depth / 2]}>
    <group rotation={rotation} position={position}>
      <Wall
        position={[0 + offset, 3, -4]}
        width={width}
        height={15}
        depth={depth}
        color={"orange"}
      />

      <Wall
        position={[0 + offset, 3, 4]}
        width={width}
        height={15}
        depth={depth}
        color={"orange"}
      />
    </group>
  );
}

// A function that renders the passage based on the position from room1 to room2
const Passage = ({ room1, room2 }) => {
  // const room1 = { x: 0, z: 0, size: [80, 80] };
  // const room2 = { x: 200, z: 0, size: [30, 30] };
  const depth = 3;
  let roomDifference;
  let startingPositionX = room2.x;
  let startingPositionZ = room1.z;
  let roomSize;
  let length;
  let rotation;

  if (room1.z === room2.z) {
    if (room1.x < room2.x) {
      roomDifference = room2.x - room1.x;
      startingPositionX = room1.x;
      roomSize = room1.size[0];
      length = roomDifference - room2.size[0] / 2 - room1.size[0] / 2 - depth;
    } else if (room1.x > room2.x) {
      roomDifference = room1.x - room2.x;
      startingPositionX = room2.x;
      roomSize = room2.size[0];
      length = roomDifference - room2.size[0] / 2 - room1.size[0] / 2 - depth;
    }
  } else if (room1.x === room2.x) {
    if (room1.z < room2.z) {
      roomDifference = room2.z - room1.z;
      startingPositionZ = room1.z;
      roomSize = room1.size[1];
      length = roomDifference - room2.size[1] / 2 - room1.size[1] / 2 - depth;
    } else if (room1.z > room2.z) {
      roomDifference = room1.z - room2.z;
      startingPositionZ = room2.z;
      roomSize = room2.size[1];
      length = roomDifference - room2.size[1] / 2 - room1.size[1] / 2 - depth;
    }
    rotation = [0, (3 * Math.PI) / 2, 0];
  }

  // length = roomDifference - room2.size[0] / 2 - room1.size[0] / 2 - depth;

  return (
    <PassageComponent
      position={[startingPositionX, 0, startingPositionZ]}
      l={length}
      offset={(length + roomSize + depth) / 2}
      depth={depth}
      rotation={rotation}
    />
  );
};

// const GeneratePassage = ({ room1, room2 }) => {
//   // const room1 = { x: 200, z: 0, size: [80, 80] };
//   // const room2 = { x: 0, z: 0, size: [30, 30] };

//   const depth = 3;
//   const length =
//     room1.x - room2.x - room2.size[0] / 2 - room1.size[0] / 2 - depth;

//   return (
//     <Passage
//       position={[room2.x, 0, room1.z - 5]}
//       l={length}
//       offset={(length + room2.size[0] + depth) / 2}
//       depth={depth}
//     />
//   );
// };

export default Passage;
