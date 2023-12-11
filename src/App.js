import { KeyboardControls, PointerLockControls, Sky } from "@react-three/drei";
import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import Player from "./Components/Player";

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

function Room({ x, z, doors = [0, 0, 0, 0] }) {
  return (
    <>
      <Wall position={[15 + x, 3, 0 + z]} />
      <Wall position={[0 + x, 3, 15 + z]} rotation={[0, Math.PI / 2, 0]} />
      <Wall position={[15 + x, 3, 30 + z]} />
      <Wall position={[30 + x, 3, 15 + z]} rotation={[0, Math.PI / 2, 0]} />
    </>
  );
}
function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef();
  const count = useRef(0);
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame

  useFrame((state, delta) => (ref.current.rotation.x += delta * count.current));
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <RigidBody type="dynamic">
      <mesh {...props} ref={ref} scale={clicked ? 1.5 : 1}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
      </mesh>
    </RigidBody>
  );
}

function Ground(props) {
  return (
    <RigidBody {...props} type="fixed" colliders={false}>
      <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[500, 1000]} />
        <meshStandardMaterial color="green" />
      </mesh>
      <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
    </RigidBody>
  );
}

// function Roof(props) {
//   return (
//     <RigidBody
//       {...props}
//       type="fixed"
//       colliders={"cuboid"}
//       position={[0, 15, 0]}
//     >
//       <mesh receiveShadow position={[0, 10, 0]} rotation-x={Math.PI / 2}>
//         <boxGeometry args={[1000, 1000, 0.1]} />
//         <meshStandardMaterial color="hotpink" />
//       </mesh>
//     </RigidBody>
//   );
// }

function App() {
  let pc = useRef();
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
      <Canvas shadows camera={{ position: [0, 4, 4] }}>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Physics gravity={[0, -30, 0]} debug>
          <Sky sunPosition={[100, 20, 100]} />
          {/* <Roof /> */}
          <Ground />
          <Player pc={pc} />
          <Room x={1} z={1} />
          <Room x={50} z={50} />

          <Box position={[1, 3, 1]} />
        </Physics>
        <PointerLockControls ref={pc} />
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
