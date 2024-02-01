import { KeyboardControls, Sky } from "@react-three/drei";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import { Physics, RigidBody } from "@react-three/rapier";
import Player from "./Components/Player";
import Ground from "./Components/Maze/Ground";
import useStore from "./store";
import { controls } from "./utils";

function HealthItem() {
  return useStore((state) => state.healthItems).map((h) => h);
}

function Coins() {
  return useStore((state) => state.coins).map((c) => c);
}

function Bullets() {
  return useStore((state) => state.bullets).map((b) => b);
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
let Light = () => (
  <RigidBody type="fixed" colliders={"cuboid"}>
    <mesh receiveShadow position={[10, 5, 10]} rotation-x={Math.PI / 2}>
      <pointLight color={"white"} intensity={10} distance={8} decay={1} />
      <boxGeometry args={[5, 5, 0.1]} />
      <meshStandardMaterial color="#fff" />
    </mesh>
  </RigidBody>
);

const MemoCoins = React.memo(Coins);
const MemoBullet = React.memo(Bullets);
const MemoHealthItem = React.memo(HealthItem);

let Items = () => (
  <>
    <MemoCoins />
    <MemoHealthItem />
    <MemoBullet />
    <Light />
  </>
);

let Maze = () => (
  <>
    <Sky sunPosition={[100, 20, 100]} />
    <ambientLight intensity={Math.PI / 10} />
    <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
    <Ground />
    {useStore.getState().rooms}
    {useStore.getState().passages}
    {useStore.getState().enemies.map((e) => e)}
  </>
);

function App() {
  let gameState = useStore((state) => state.gameState);

  return (
    <>
      <Overlay />
      {gameState === "play" && (
        <KeyboardControls map={controls}>
          <Suspense>
            <Canvas shadows camera={{ position: [0, -0.5, 4] }}>
              <Physics gravity={[0, -9.81, 0]}>
                <Items />
                <Maze />
                <Player />
              </Physics>
            </Canvas>
          </Suspense>
        </KeyboardControls>
      )}
    </>
  );
}

export default App;
