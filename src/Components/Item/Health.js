import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { RigidBody } from "@react-three/rapier";
import useStore from "../../store";
import { Html } from "@react-three/drei";

const Health = ({ x, z, id }) => {
  let increaseHealth = useStore((state) => state.increaseHealth);
  const ref = useRef();
  let collided = false;
  useFrame((state) => {
    if (ref.current) {
      ref.current.setTranslation({
        x: x,
        y: Math.sin(state.clock.elapsedTime * 2.5) * 0.1 + 1.4,
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
        <h1 className="text-green-500">Health</h1>
      </Html>
      <RigidBody
        name="health"
        ref={ref}
        type="fixed"
        colliders={"trimesh"}
        onCollisionEnter={({ other }) => {
          if (
            other.rigidBodyObject &&
            !collided && // used to render once
            other.rigidBodyObject.name === "player"
          ) {
            collided = true;
            setTimeout(() => {
              increaseHealth(id);
            }, 20); // creates a bumping effect
          }
        }}
        position={[x, 0, z]}
      >
        {/* <pointLight intensity={1} distance={5} decay={1.5} color={"#39ff14"} /> */}
        <group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.2, 0.2, 0.4]} />
            <meshStandardMaterial
              color={"#39ff14"}
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial
              color={"#39ff14"}
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>
        </group>
      </RigidBody>
    </>
  );
};
export default React.memo(Health);
