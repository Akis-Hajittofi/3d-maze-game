import React from "react";
import Wall from "./Wall";

function WallWithDoor({ position, rotation, color, l = 30 }) {
  const depth = 3;
  const roomWidth = (l - 5) / 2 + depth / 2;
  const offset = l / 2 - roomWidth / 2 + depth / 2;

  const leftWall = [0 - offset, 0, 0];
  const topWall = [0, 5, 0];
  const rightWall = [0 + offset, 0, 0];

  return (
    <group rotation={rotation} position={position}>
      <Wall
        position={leftWall}
        width={roomWidth}
        height={15}
        depth={depth}
        color={color}
      />
      <Wall
        position={topWall}
        width={5}
        height={5}
        depth={depth}
        color={color}
      />
      <Wall
        position={rightWall}
        width={roomWidth}
        height={15}
        depth={depth}
        color={color}
      />
    </group>
  );
}

function Room({ x, z, size, doors = [1, 1, 1, 1], color }) {
  let [xLength, zLength] = size;

  return (
    <group color={color}>
      {doors[0] ? (
        <WallWithDoor
          position={[x, 3, z - zLength / 2]}
          rotation={[0, (6 * Math.PI) / 2, 0]}
          l={xLength}
          color={color}
        />
      ) : (
        <Wall
          position={[x, 3, z - zLength / 2]}
          color={color}
          depth={3}
          width={zLength}
          height={15}
        />
      )}
      {doors[1] ? (
        <WallWithDoor
          position={[x + xLength / 2, 3, z]}
          rotation={[0, Math.PI / 2, 0]}
          l={zLength}
          color={color}
        />
      ) : (
        <Wall
          position={[x + xLength / 2, 3, z]}
          color={color}
          // color={"red"}
          depth={zLength + 3}
          width={3}
          height={15}
        />
      )}
      {doors[2] ? (
        <WallWithDoor
          position={[x, 3, z + zLength / 2]}
          l={xLength}
          color={color}
        />
      ) : (
        <Wall
          position={[x, 3, z + zLength / 2]}
          color={color}
          depth={3}
          width={xLength}
          height={15}
        />
      )}
      {doors[3] ? (
        <WallWithDoor
          position={[x - xLength / 2, 3, z]}
          rotation={[0, (3 * Math.PI) / 2, 0]}
          l={zLength}
          color={color}
        />
      ) : (
        <Wall
          position={[x - xLength / 2, 3, z]}
          // color={"red"}
          color={color}
          depth={zLength + 3}
          width={3}
          height={15}
        />
      )}
      <mesh receiveShadow position={[x, 0, z]} rotation-x={Math.PI / 2}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Wall
        position={[x, 11.5, z]}
        width={xLength + 3}
        depth={zLength + 3}
        height={2}
        color={color}
      />
    </group>
  );
}

export default React.memo(Room);
