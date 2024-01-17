import { KeyboardControls, PointerLockControls, Sky } from "@react-three/drei";
import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useState, useRef } from "react";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import Player from "./Components/Player";
import Coin from "./Components/Coin";
import Bullet from "./Components/Bullet";

function Wall({ position, width = 5, height, depth, color = "#0F172A" }) {
  return (
    <RigidBody type="fixed" colliders={"cuboid"}>
      <mesh position={position}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
}


function WallWithDoor({ position, rotation, color = "#0F172A", l = 30 }) {
  const depth = 3;
  const sideWallWidth = (l - 5) / 2 + depth / 2;
  const offset = l / 2 - sideWallWidth / 2 + depth / 2;

  const leftWall = [0 - offset, 0, 0];
  const topWall = [0, 0 + 5, 0];
  const rightWall = [0 + offset, 0, 0];

  return (
    <group rotation={rotation} position={position}>
      <Wall
        position={leftWall}
        width={sideWallWidth}
        height={15}
        depth={depth}
        color={"purple"}
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
        width={sideWallWidth}
        height={15}
        depth={depth}
        color={"lime"}
      />
    </group>
  );
}

function Room({ x, z, size, doors = [0, 0, 0, 0] }) {
  let [xLength, zLength] = size;

  return (
    <>
      <WallWithDoor position={[x, 3, z - zLength / 2]} l={xLength} />
      <WallWithDoor
        position={[x + xLength / 2, 3, z]}
        rotation={[0, Math.PI / 2, 0]}
        l={zLength}
        color={"lime"}
      />
      <WallWithDoor position={[x, 3, z + zLength / 2]} l={xLength} />
      <WallWithDoor
        position={[x - xLength / 2, 3, z]}
        rotation={[0, Math.PI / 2, 0]}
        l={zLength}
        color={"lime"}
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
    <RigidBody
      {...props}
      type="fixed"
      colliders={false}
      friction={2}
      name="ground"
    >
      <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#38BDF8" />
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

function Bullets({ bullets, setBullets }) {
  const onHit = (bulletID) => {
    // then remove the bullet
    setBullets((bullets) => [
      ...bullets.filter(({ id }) => id !== bulletID), //10 is the fire-rate
    ]);
  };

  return bullets.map((b) => <Bullet bulletInfo={b} onHit={onHit} />);
}

function Box(props) {
  return (
    <RigidBody type="dynamic" colliders={"cuboid"} mass={0.3}>
      <mesh {...props}>
        <boxGeometry args={[1, 1, 1]} />

        <meshStandardMaterial color={"orange"} />
      </mesh>
    </RigidBody>
  );
}

function App() {
  // bullet would be created by the bullet
  const [bullets, setBullets] = useState([]);

  // this will be implement by the player
  const shoot = (bullet) => {
    setBullets((bullets) => [...bullets, bullet]);
    if (bullets.length === 10) {
      setBullets([]);
    }
  };

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
        <Canvas
          shadows
          camera={{ position: [0, -0.5, 4] }}
          // onMouseDown={(e) => console.log("1")}
          // onMouseUp={(e) => console.log("2")}
          // onMouseLeave={(e) => console.log("3")}
        >
          <ambientLight intensity={Math.PI / 10} />
          <pointLight
            position={[-10, -10, -10]}
            decay={0}
            intensity={Math.PI}
          />
          <Physics gravity={[0, -9.81, 0]} debug>
            <Sky sunPosition={[100, 20, 100]} />
            <Ground />
            <Coins />
            <Room x={50} z={50} size={[60, 50]} />
            <Bullets bullets={bullets} setBullets={setBullets} />

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
                <meshStandardMaterial color="#fff" />
              </mesh>
            </RigidBody>
            <Room z={0} x={0} size={[40, 40]} />
            <Player shoot={shoot} />
            <Box position={[1, 3, 1]} />

          </Physics>
        </Canvas>
      </Suspense>
    </KeyboardControls>
  );
}

export default App;
