import { KeyboardControls, PointerLockControls, Sky } from "@react-three/drei";
import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { CuboidCollider, Physics, RigidBody, vec3 } from "@react-three/rapier";
import Player from "./Components/Player";

function Coin({ x = 5, z = 5, removeCoin, id }) {
  const ref = useRef();
  console.log("coin");
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.setTranslation({
        x: x,
        y: Math.sin(Date.now() * 0.002) * 0.2 + 1.4,
        z: z,
      });
    }
  });

  return (
    <>
      <RigidBody
        name="coin"
        ref={ref}
        type="fixed"
        colliders={"trimesh"}
        onCollisionEnter={({ manifold, target, other }) => {
          if (other.rigidBodyObject) {
            removeCoin(id);
            console.log(id);
            console.log(
              // this rigid body's Object3D
              target.rigidBodyObject.name,
              " collided with ",
              // the other rigid body's Object3D
              other.rigidBodyObject.name
            );
          }
        }}
        mass={1}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[x, 0, z]}>
          <pointLight intensity={1} distance={5} decay={1.5} color={"gold"} />
          <cylinderGeometry args={[0.2, 0.2, 0.1]} />
          <meshStandardMaterial
            color={"gold"}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
      </RigidBody>
    </>
  );
}
function Box() {
  return (
    <RigidBody type="dynamic" position={[5, 2, 10]}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={"orange"} />
      </mesh>
      <CuboidCollider args={[0.5, 0.5, 0.5]} />
    </RigidBody>
  );
}

function Ground(props) {
  return (
    <RigidBody {...props} type="fixed" colliders={false} friction={2}>
      <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial
          // map={texture}
          // map-repeat={[240, 240]}
          color="springgreen"
        />
      </mesh>
      <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
    </RigidBody>
  );
}
function App() {
  console.log("app is render");
  const [coins, setCoin] = useState([
      <Coin removeCoin={removeCoin} x={1} z={1} key={0} id={0} />,
      <Coin removeCoin={removeCoin} x={1} z={2} key={1} id={1} />,
      <Coin removeCoin={removeCoin} x={1} z={3} key={2} id={2} />,
      <Coin removeCoin={removeCoin} x={1} z={-1} key={3} id={3} />,
      <Coin removeCoin={removeCoin} x={1} z={-2} key={4} id={4} />,
      <Coin removeCoin={removeCoin} x={1} z={-3} key={5} id={5} />,
    ]);

  let removeCoin = (id) => {
    console.log(coins);
    let filterArr = coins.filter((coin) => coin.props.id != id);
    console.log(filterArr, coins);
    // setCoin(filterArr);
  };

  useEffect(() => {
    setCoin();
  }, []);

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
            {coins.map((e) => e)}
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
                <meshStandardMaterial
                  // map={texture}
                  // map-repeat={[240, 240]}
                  color="hotpink"
                />
              </mesh>
            </RigidBody>
            <Player />
            {/* <Coin /> */}
            <Box position={[1, 3, 1]} />
          </Physics>
          <PointerLockControls />
        </Canvas>
      </Suspense>
    </KeyboardControls>
  );
}

export default App;
