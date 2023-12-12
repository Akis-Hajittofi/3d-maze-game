import { KeyboardControls, PointerLockControls, Sky } from "@react-three/drei";
import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useState, useRef } from "react";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import Player from "./Components/Player";
import Coin from "./Components/Coin";

function Wall({ position, rotation, color = "gray" }) {
  return (
    <RigidBody type="fixed" colliders={"cuboid"}>
      <mesh rotation={rotation} position={position}>
        <boxGeometry args={[31, 15, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
}

function WallWithDoor({ position, rotation, color = "gray" }) {
  const offset = 8.5;
  const width = 12;
  let leftWall = [position[0] - offset, position[1], position[2]];
  let topWall = [position[0], position[1] + 5, position[2]];
  let rightWall = [position[0] + offset, position[1], position[2]];
  return (
    <mesh>
      <RigidBody type="fixed" colliders={"cuboid"}>
        <mesh position={leftWall}>
          <boxGeometry args={[width, 15, 1]} />
          <meshStandardMaterial color={"red"} />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders={"cuboid"}>
        <mesh position={topWall}>
          <boxGeometry args={[5, 5, 1]} />
          <meshStandardMaterial color={"yellow"} />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders={"cuboid"}>
        <mesh position={rightWall}>
          <boxGeometry args={[width, 15, 1]} />
          <meshStandardMaterial color={"green"} />
        </mesh>
      </RigidBody>
    </mesh>
  );
}
function Room({ x, z, doors = [0, 0, 0, 0] }) {
  x += -15;
  z += -15;
  return (
    <>
      <WallWithDoor position={[15 + x, 3, 0 + z]} />
      <Wall position={[0 + x, 3, 15 + z]} rotation={[0, Math.PI / 2, 0]} />
      <Wall position={[15 + x, 3, 30 + z]} />
      <Wall position={[30 + x, 3, 15 + z]} rotation={[0, Math.PI / 2, 0]} />
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
            <Room x={50} z={50} />
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

            <Room z={0} x={0} />
            <mesh receiveShadow position={[0, 0, 0]} rotation-x={Math.PI / 2}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="green" />
            </mesh>
            <Player />
          </Physics>
          <PointerLockControls />
        </Canvas>
      </Suspense>
    </KeyboardControls>
  );
}

export default App;
