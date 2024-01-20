import { KeyboardControls, PointerLockControls, Sky } from "@react-three/drei";
import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useState, useRef } from "react";
import {
  CapsuleCollider,
  CuboidCollider,
  Physics,
  RigidBody,
} from "@react-three/rapier";
import Player from "./Components/Player";
import Coin from "./Components/Coin";
import Bullet from "./Components/Bullet";
import Ground from "./Components/Ground";
import Room from "./Components/Room";
import Passage from "./Components/Passages";
import useStore from "./store";

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

function Enemy(props) {
  const refE = useRef();
  const refR = useRef();
  useFrame(() => {
    if (refE?.current) {
      console.log(refE.current.translation(), refR.current.rawSet);
    }
  });
  return (
    <>
      <RigidBody
        ref={refE}
        type="dynamic"
        colliders={false}
        mass={70}
        lockRotations
        linearDamping={3}
        name="enemy"
      >
        {/* <mesh position={[1, 3, 1]}>
        <boxGeometry args={[1, 1, 1]} />

        <meshStandardMaterial color={"orange"} />
      </mesh> */}

        <mesh rotation={[0, 0, 0]} position={[8, 3, 1]}>
          <capsuleGeometry args={[0.5, 1.5]} />
          <meshStandardMaterial color={"white"} />
        </mesh>
        <CapsuleCollider args={[0.75, 0.5]} position={[8, 3, 1]} />
      </RigidBody>
      <RigidBody type="fixed" name="sensor" ref={refR}>
        <CuboidCollider
          position={[8, 2, 1]}
          args={[5, 1.5, 5]}
          sensor
          onIntersectionEnter={() => console.log("Goal!")}
        />
      </RigidBody>
    </>
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

  console.log(useStore.getState().passages);
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
            {/* <Room x={50} z={50} size={[60, 50]} /> */}
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

            {useStore.getState().rooms}
            {useStore.getState().passages}

            <Player shoot={shoot} />
            <Enemy />
          </Physics>
        </Canvas>
      </Suspense>
    </KeyboardControls>
  );
}

export default App;
