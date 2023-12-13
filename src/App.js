import { KeyboardControls, PointerLockControls, Sky } from "@react-three/drei";
import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useState, useRef } from "react";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import Player from "./Components/Player";
import Coin from "./Components/Coin";

import { Euler, MeshBasicMaterial, Vector3 } from "three";

function Wall({ position, rotation, color = "#0F172A", l = 30 }) {
  let wallDepth = 0.5;
  return (
    <RigidBody type="fixed" colliders={"cuboid"}>
      <mesh rotation={rotation} position={position}>
        <boxGeometry args={[l + wallDepth, 15, wallDepth]} />
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
function Room({ x, z, size, doors = [0, 0, 0, 0] }) {
  let [xLength, zLength] = size;
  // change the length of the wall based on the size
  x += -15;
  z += -15;
  return (
    <>
      <Wall position={[15 + x, 3, 0 + z]} />
      <Wall position={[0 + x, 3, 15 + z]} rotation={[0, Math.PI / 2, 0]} />
      <Wall position={[15 + x, 3, 30 + z]} />
      <Wall position={[30 + x, 3, 15 + z]} rotation={[0, Math.PI / 2, 0]} />
      <mesh
        receiveShadow
        position={[x + 15, 0, z + 15]}
        rotation-x={Math.PI / 2}
      >
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
const bulletMaterial = new MeshBasicMaterial({
  color: "hotpink",
  toneMapped: false,
});

bulletMaterial.color.multiplyScalar(42);

function Bullet({ bulletInfo, onHit }) {
  // console.log(bulletInfo);
  let p = new Vector3(0.5, 1, -1)
    .applyQuaternion(bulletInfo.playerQuat)
    .add(bulletInfo.playerPos);
  let r = new Euler().setFromQuaternion(bulletInfo.playerQuat);
  const ref = useRef();

  useFrame(() => {
    if (ref?.current) {
      let forward = new Vector3(0, 0, -1).applyQuaternion(
        bulletInfo.playerQuat
      );
      forward.multiplyScalar(0.1); //speed
      ref.current.applyImpulse(forward);
    }
  });

  return (
    <RigidBody
      ref={ref}
      type="dynamic"
      name="bullet"
      colliders={"cuboid"}
      gravityScale={0}
      // sensor
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject.name !== "player") {
          console.log(other.rigidBodyObject);
          onHit(bulletInfo.id);
        }
      }}
    >
      <mesh
        position={[p.x, p.y, p.z]}
        rotation={[r.x, r.y, r.z]}
        material={bulletMaterial}
        castShadow
      >
        <boxGeometry args={[0.1, 0.1, 2]} />
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

  const onHit = (bulletID) => {
    // then remove the bullet
    setBullets((bullets) => [
      ...bullets.filter(({ id }) => id !== bulletID), //10 is the fire-rate
    ]);
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
            <Room x={50} z={50} size={[10, 20]} />
            {bullets.map((b) => (
              <Bullet bulletInfo={b} onHit={onHit} />
            ))}
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
            <Room z={0} x={0} size={[30, 30]} />
            <Player shoot={shoot} />
          </Physics>
        </Canvas>
      </Suspense>
    </KeyboardControls>
  );
}

export default App;
