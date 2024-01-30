import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import useStore from "../store";
import { Html } from "@react-three/drei";

const Exit = ({ x, z, id }) => {
  let end = useStore((state) => state.end);
  const ref = useRef();
  let collided = false;
  useFrame((state) => {
    if (ref.current) {
      ref.current.setTranslation({
        x: x,
        y: 0.5,
        z: z,
      });
    }
  });

  return (
    <>
      <Html
        as="div" // Wrapping element (default: 'div')
        center // Adds a -50%/-50% css transform (default: false) [ignored in transform mode]
        fullscreen // Aligns to the upper-left corner, fills the screen (default:false) [ignored in transform mode]
        distanceFactor={10} // If set (default: undefined), children will be scaled by this factor, and also by distance to a PerspectiveCamera / zoom by a OrthographicCamera.
        zIndexRange={[100, 0]} // Z-order range (default=[16777271, 0])
        transform // If true, applies matrix3d transformations (default=false)
        sprite // Renders as sprite, but only in transform mode (default=false)
        position={[x, 2, z]}
      >
        <h1 className="text-red-500">Exit</h1>
      </Html>
      <RigidBody
        name="health"
        ref={ref}
        type="fixed"
        colliders={"cuboid"}
        position={[x, 0, z]}
      >
        {/* <pointLight intensity={1} distance={5} decay={1.5} color={"#39ff14"} /> */}
        <mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[1, 0, 0]}>
            <boxGeometry args={[0.25, 0.25, 6]} />
            <meshStandardMaterial
              color={"red"}
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3, 0]}>
            <boxGeometry args={[4, 0.25, 0.25]} />
            <meshStandardMaterial
              color={"red"}
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[-1, 0, 0]}>
            <boxGeometry args={[0.25, 0.25, 6]} />
            <meshStandardMaterial
              color={"red"}
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" name="sensor">
        <CuboidCollider
          onIntersectionEnter={({ other }) => {
            if (
              other.rigidBodyObject &&
              !collided && // used to render once
              other.rigidBodyObject.name === "player"
            ) {
              collided = true;
              end();
            }
          }}
          position={[x, 1.75, z]}
          args={[0.9, 1.75, 0.1]}
          sensor
        />
      </RigidBody>
    </>
  );
};
export default React.memo(Exit);
