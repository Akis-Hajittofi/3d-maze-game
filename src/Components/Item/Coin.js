import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { RigidBody } from "@react-three/rapier";
import useStore from "../../store";
import { Html } from "@react-three/drei";

const Coin = ({ x, z, id }) => {
  let removeCoin = useStore((state) => state.removeCoin);
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
        <h1 className="text-yellow-500">Coin</h1>
      </Html>
      <RigidBody
        name="coin"
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
              removeCoin(id);
            }, 20); // creates a bumping effect
          }
        }}
        position={[x, 0, z]}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <pointLight
            intensity={1}
            distance={5}
            decay={1.5}
            color={"#F4BF50"}
          />
          <cylinderGeometry args={[0.2, 0.2, 0.1]} />
          <meshStandardMaterial
            color={"#F4BF50"}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
      </RigidBody>
    </>
  );
};
export default React.memo(Coin);
