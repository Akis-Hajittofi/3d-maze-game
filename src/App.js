import { KeyboardControls, PointerLockControls, Sky } from "@react-three/drei";
import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import Player from "./Components/Player";

function Room(props) {
  const ref = useRef();

  return (
    <>
      <RigidBody type="fixed" colliders={"cuboid"}>
        <mesh {...props} ref={ref} position={[-30, 1.5, 0]}>
          <boxGeometry args={[30, 3, 1]} />
          <meshStandardMaterial color={"black"} />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders={"cuboid"}>
        <mesh {...props} ref={ref} position={[0, 1.5, -30]}>
          <boxGeometry args={[30, 3, 1]} />
          <meshStandardMaterial color={"black"} />
        </mesh>
      </RigidBody>
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
      <mesh
        {...props}
        ref={ref}
        scale={clicked ? 1.5 : 1}
        // onClick={(event) => {
        //   console.log(count);
        //   count.current += 1;
        //   if (count.current == 10) {
        //     count.current = 1;
        //   }
        //   click(!clicked);
        // }}
        // onPointerOver={(event) => (event.stopPropagation(), hover(true))}
        // onPointerOut={(event) => hover(false)}
      >
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
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial
          // map={texture}
          // map-repeat={[240, 240]}
          color="green"
        />
      </mesh>
      <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
    </RigidBody>
  );
}
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
          <Ground />
          <Player pc={pc} />
          <Room />
          <Box position={[1, 3, 1]} />
        </Physics>
        <PointerLockControls ref={pc} />
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
