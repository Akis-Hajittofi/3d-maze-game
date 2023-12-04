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
  RigidBody,
  useRapier,
} from "@react-three/rapier";
import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";

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
    <RigidBody>
      <mesh
        {...props}
        ref={ref}
        scale={clicked ? 1.5 : 1}
        onClick={(event) => {
          console.log(count);
          count.current += 1;
          if (count.current == 10) {
            count.current = 1;
          }
          click(!clicked);
        }}
        onPointerOver={(event) => (event.stopPropagation(), hover(true))}
        onPointerOut={(event) => hover(false)}
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

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();
const rotation = new THREE.Vector3();

export function Player() {
  const ref = useRef();
  const rapier = useRapier();
  const [, get] = useKeyboardControls();

  useFrame((state) => {
    const { forward, backward, left, right, jump, shift } = get();

    const velocity = ref.current.linvel();

    let p = ref.current.translation();
    // state.camera.position.set(p.x, p.y, p.z);

    // // movement
    frontVector.set(0, 0, backward - forward);
    sideVector.set(left - right, 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(shift ? 10 : 5)
      .applyEuler(state.camera.rotation);
    // console.log(direction, velocity, ref.current);

    ref.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });

    // // // jumping
    // const world = rapier.world.raw();
    // const ray = world.castRay(
    //   new RAPIER.Ray(ref.current.translation(), { x: 0, y: -1, z: 0 })
    // );
    // const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75;
    // if (jump && grounded) ref.current.setLinvel({ x: 0, y: 7.5, z: 0 });
  });
  return (
    <>
      <RigidBody
        ref={ref}
        colliders={false}
        mass={1}
        type="dynamic"
        position={[0, 50, 0]}
        enabledRotations={[false, false, false]}
      >
        <Sphere args={[1]}>
          <meshStandardMaterial color={"hotpink"} />
        </Sphere>

        <BallCollider args={[0.75, 0.5]} />
      </RigidBody>
    </>
  );
}

function App() {
  // let Controls = {
  //   forward: "forward",
  //   back: "back",
  //   left: "left",
  //   right: "right",
  //   jump: "jump",
  // };
  // const map = useMemo(
  //   () => [
  //     { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
  //     { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
  //     { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
  //     { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
  //     { name: Controls.jump, keys: ["Space"] },
  //   ],
  //   []
  // );
  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "w", "W"] },
        { name: "backward", keys: ["ArrowDown", "s", "S"] },
        { name: "left", keys: ["ArrowLeft", "a", "A"] },
        { name: "right", keys: ["ArrowRight", "d", "D"] },
        { name: "shift", keys: ["Shift"] },
      ]}
    >
      <Canvas shadows camera={{ fov: 80, position: [5, 5, 5] }}>
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
          <Box position={[-2, 5, 0]} />
          <Box position={[1, 1, 0]} />
          <Player />
        </Physics>
        {/* <OrbitControls /> */}

        <PointerLockControls />
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
