import { KeyboardControls, Sky } from "@react-three/drei";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useState } from "react";
import { Physics, RigidBody } from "@react-three/rapier";
import Player from "./Components/Player";
import Bullet from "./Components/Bullet";
import Ground from "./Components/Ground";
import useStore from "./store";

// function HealthItem() {
//   let healthItem = useStore((state) => state.healthItem);
//   return healthItem.map((h) => h);
// }

function Coins() {
  let coins = useStore((state) => state.coins);
  return coins.map((c) => c);
}

function Bullets({ bullets, setBullets }) {
  let removeEnemy = useStore((state) => state.removeEnemy);

  const onHit = ({ id: bulletId, name, userData }) => {
    // check if hit enemy
    if (name === "enemy") {
      removeEnemy(userData.id);
    }
    // then remove the bullet
    setBullets((bullets) => [
      ...bullets.filter(({ id }) => id !== bulletId), //10 is the fire-rate
    ]);
  };

  return bullets.map((b) => <Bullet bulletInfo={b} onHit={onHit} />);
}

let Overlay = () => {
  let { health, gameState, retry, enemiesKilled, points } = useStore(
    (state) => state
  );
  return (
    <>
      <div className="absolute top-0 right-0 h-full p-4">
        <div className=" relative z-10  flex  items-center  ">
          {gameState !== "play" && (
            <div
              className=" text-white p-1 ml-2 border rounded-lg cursor-pointer"
              onClick={retry}
            >
              retry
            </div>
          )}

          <div className=" text-white p-2"> health: </div>
          <div
            className="  h-6 border-2 border-white rounded-md"
            style={{ width: 102 }}
          >
            <div
              className={`h-5 bg-white rounded-sm`}
              style={{ width: health }}
            >
              {/* <span className="font-bold italic text-red-600"> {health} </span> */}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 h-full p-4">
        <div className=" relative z-10  flex  items-center  ">
          <div className=" text-white "> Points: {points} </div>
          <div className=" text-white p-2"> | </div>
          <div className=" text-white "> Enemy Killed: {enemiesKilled} </div>
        </div>
      </div>
    </>
  );
};

function App() {
  let gameState = useStore((state) => state.gameState);
  let healthItems = useStore((state) => state.healthItems);
  const [bullets, setBullets] = useState([]);

  const shoot = (bullet) => {
    setBullets((bullets) => [...bullets, bullet]);
    if (bullets.length === 10) {
      setBullets([]);
    }
  };
  return (
    <>
      <Overlay />
      {gameState === "play" && (
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
              <ambientLight intensity={Math.PI / 10} />
              <pointLight
                position={[-10, -10, -10]}
                decay={0}
                intensity={Math.PI}
              />
              <Physics gravity={[0, -9.81, 0]}>
                <Sky sunPosition={[100, 20, 100]} />
                <Ground />
                <MemoCoins />
                {healthItems.map((e) => e)}
                {/* <HealthItem /> */}
                {/* <Room x={50} z={50} size={[60, 50]} /> */}
                <MemoBullet bullets={bullets} setBullets={setBullets} />
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
                {useStore.getState().healthItems}
                {useStore.getState().rooms}
                {useStore.getState().passages}
                {useStore.getState().enemies.map((e) => e)}
                <Player shoot={shoot} />
              </Physics>
            </Canvas>
          </Suspense>
        </KeyboardControls>
      )}
    </>
  );
}
const MemoCoins = React.memo(Coins);
const MemoBullet = React.memo(Bullets);
export default App;
