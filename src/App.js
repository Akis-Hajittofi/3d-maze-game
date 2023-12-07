import {
  CameraControls,
  KeyboardControls,
  OrbitControls,
  PointerLockControls,
  Sky,
  Sphere,
  useKeyboardControls,
  useTexture,
} from "@react-three/drei";
import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import {
  BallCollider,
  CapsuleCollider,
  CuboidCollider,
  Physics,
  RapierRigidBody,
  RigidBody,
  quat,
  useRapier,
  vec3,
} from "@react-three/rapier";
import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { radToDeg } from "three/src/math/MathUtils";

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

// let offset = new THREE.Vector3(0, 1, 3)
//   .applyQuaternion(quat(ref.current.rotation()))
//   .add(vec3(ref.current.translation()));

// let lookAt = new THREE.Vector3(0, 0.5, 1)
//   .applyQuaternion(quat(ref.current.rotation()))
//   .add(vec3(ref.current.translation()));

// state.camera.position.copy(offset);
// boxRef.current.position(offset);
// refControl.current.onMouseMove((e) => {
//   console.log("hello");
// });

// useFrame((state, delta) => {
//   const { forward, backward, left, right, jump, shift } = get();

//   // if (boxRef.current) {
//   const cameraDistanceY = window.innerWidth < 1024 ? 16 : 20;
//   const cameraDistanceZ = window.innerWidth < 1024 ? 12 : 16;
//   const playersWorldPos = vec3(ref.current.translation());

//   let radius = 3;
//   x = playersWorldPos.x + radius * Math.sin(state.camera.rotation.y);
//   z = playersWorldPos.z + radius * Math.cos(state.camera.rotation.y);
//   ref.current.setRotation(state.camera.quaternion);
//   // ref.current.setRotation(state.camera.rotation.y);
//   // boxRef.current.setLookAt(
//   //   x,
//   //   1.5,
//   //   z,

//   //   playersWorldPos.x,
//   //   playersWorldPos.y,
//   //   playersWorldPos.z
//   //   // true
//   // );

//   state.camera.position.copy({ x, y: 0, z }).add({ x: 0, y: 3, z: 0 });
//   // state.camera.lookAt(playersWorldPos);
//   // }
//   // movement

// let speed = shift ? 5 : 1;
//   ref.current.applyImpulse(
//     {
//       x: (right - left) * speed,
//       y: jump ? 1 : 0,
//       z: (backward - forward) * speed,
//     },
//     true
//   );
// });

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

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();
const rotation = new THREE.Vector3();

export function Player() {
  const player = useRef();
  const [, get] = useKeyboardControls();

  let moveCamera = (q, state) => {};

  useFrame((state, delta) => {
    const { forward, backward, left, right, jump, shift, q } = get();
    let playerPos = vec3(player.current.translation());
    let playerQuat = quat(player.current.rotation());

    let playerOffset = q
      ? new THREE.Vector3(0, 1, 5)
      : new THREE.Vector3(0, 0, 0);
    let alpha = q ? 0.05 : 0.27;

    // state.camera.position.lerp(
    //   playerOffset.applyQuaternion(playerQuat).add(playerPos),
    //   alpha
    // );

    let followVector = playerOffset.applyQuaternion(playerQuat).add(playerPos);
    state.camera.position.copy(followVector);

    // rotation need to be set before movement
    player.current.setRotation(state.camera.quaternion);

    const forwardVector = state.camera.getWorldDirection(new THREE.Vector3());
    const vectorUp = new THREE.Vector3(0, 1, 0);
    const sideVector = vectorUp.cross(forwardVector);

    let speed = shift ? 5 : 1; // based on camera direction
    const directionalVector = forwardVector
      .multiplyScalar(-(backward - forward) * speed)
      .add(sideVector.multiplyScalar(-(right - left) * speed));

    player.current.applyImpulse(
      {
        x: directionalVector.x,
        y: jump ? 1 : 0,
        z: directionalVector.z,
      },
      true
    );
  });

  return (
    <>
      <RigidBody
        ref={player}
        colliders={false}
        mass={1}
        type="dynamic"
        lockRotations
        position={[0, 0, 0]}
        linearDamping={14}
      >
        <mesh>
          <capsuleGeometry args={[0.5, 1.5]} />
          <meshStandardMaterial color={"lime"} />
        </mesh>
        <CapsuleCollider args={[0.75, 0.5]} />
      </RigidBody>
    </>
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
        <Physics gravity={[0, -30, 0]}>
          <Sky sunPosition={[100, 20, 100]} />
          <Ground />
          <Player pc={pc} />
          <Box position={[1, 3, 1]} />
        </Physics>
        <PointerLockControls ref={pc} />
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
