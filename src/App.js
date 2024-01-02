import { KeyboardControls, PointerLockControls, Sky } from "@react-three/drei";
import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useState, useRef } from "react";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import Player from "./Components/Player";
import Coin from "./Components/Coin";

function Wall({ position, width = 5, height, depth, color = "black" }) {
  const wall = (
    <RigidBody type={"fixed"} colliders={"cuboid"}>
      <mesh position={position}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
  // console.log(wall.getWorldPosition());
  return <>{wall}</>;
}

function Passage({
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
        position={[0 + offset, 3, 0]}
        width={width}
        height={15}
        depth={depth}
        color={"black"}
      />

      <Wall
        position={[0 + offset, 3, 10]}
        width={width}
        height={15}
        depth={depth}
        color={"orange"}
      />
    </group>
  );
}

// A function that renders the passage based on the position from room1 to room2
const GeneratePassage = ({
  room1 = { x: 0, z: 0, size: [80, 80] },
  room2 = { x: 200, z: 0, size: [80, 80] },
}) => {
  const depth = 3;
  const length =
    room2.x - room1.x - room2.size[0] / 2 - room1.size[0] / 2 - depth;

  return (
    <Passage
      position={[room1.x, 0, room1.z - 5]}
      l={length}
      offset={(length + room1.size[0] + depth) / 2}
      depth={depth}
    />
  );
};

function WallWithDoor({ position, rotation, color = "black", l = 30 }) {
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
        color={"red"}
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

function Room({ x, z, size, doors = [0, 0, 0, 0] }) {
  let [xLength, zLength] = size;

  return (
    <>
      <WallWithDoor
        position={[x, 3, z - zLength / 2]}
        rotation={[0, (6 * Math.PI) / 2, 0]}
        l={xLength}
        color={"yellow"}
      />
      <WallWithDoor
        position={[x + xLength / 2, 3, z]}
        rotation={[0, Math.PI / 2, 0]}
        l={zLength}
        color={"lime"}
      />
      <WallWithDoor
        position={[x, 3, z + zLength / 2]}
        l={xLength}
        color={"blue"}
      />
      <WallWithDoor
        position={[x - xLength / 2, 3, z]}
        rotation={[0, (3 * Math.PI) / 2, 0]}
        l={zLength}
        color={"white"}
      />

      <mesh receiveShadow position={[0, 0, 0]} rotation-x={Math.PI / 2}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </>
  );
}

function Ground(props) {
  return (
    <RigidBody {...props} type="fixed" colliders={false} friction={2}>
      <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="springgreen" />
      </mesh>
      <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
    </RigidBody>
  );
}

function Coins() {
  const [coins, setCoins] = useState([]);
  useEffect(() => {
    setCoins([
      <Coin setCoins={setCoins} x={1} z={1} key={0} id={0} />,
      <Coin setCoins={setCoins} x={1} z={2} key={1} id={1} />,
      <Coin setCoins={setCoins} x={1} z={3} key={2} id={2} />,
      <Coin setCoins={setCoins} x={1} z={-1} key={3} id={3} />,
      <Coin setCoins={setCoins} x={1} z={-2} key={4} id={4} />,
      <Coin setCoins={setCoins} x={1} z={-3} key={5} id={5} />,
    ]);
  }, []);
  return coins.map((coin) => coin);
}

function App() {
  const room1 = { x: 0, z: 0, size: [80, 80] };
  const room2 = { x: 200, z: 0, size: [30, 30] };
  const room3 = { x: -300, z: 0, size: [50, 50] };
  const room4 = { x: -150, z: 0, size: [70, 70] };

  const rooms = [room1, room2, room3, room4];

  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "w", "W"] },
        { name: "backward", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "a", "A"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "jump", keys: ["Space"] },
        { name: "shift", keys: ["Shift"] },
        { name: "q", keys: ["q", "Q"] },
      ]}
    >
      <Suspense>
        <Canvas shadows camera={{ position: [0, -0.5, 4] }}>
          <ambientLight intensity={Math.PI / 2} />
          <pointLight
            position={[-10, -10, -10]}
            decay={0}
            intensity={Math.PI}
          />
          <Physics gravity={[0, -9.81, 0]} debug>
            <Sky sunPosition={[100, 20, 100]} />
            <Ground />
            <Coins />
            <RigidBody type="fixed" colliders={"cuboid"}>
              <mesh
                receiveShadow
                position={[10, 5, 10]}
                rotation-x={Math.PI / 2}
              >
                <pointLight
                  color={"white"}
                  intensity={10}
                  distance={8}
                  decay={1}
                />
                <boxGeometry args={[5, 5, 0.1]} />
                <meshStandardMaterial color="hotpink" />
              </mesh>
            </RigidBody>

            {rooms.map((room, index) => (
              <Room x={room.x} z={room.z} size={room.size} key={index} />
            ))}
            <GeneratePassage room1={room1} room2={room2} />
            <GeneratePassage room1={room3} room2={room4} />

            <Player />
          </Physics>
          <PointerLockControls />
        </Canvas>
      </Suspense>
    </KeyboardControls>
  );
}

export default App;
