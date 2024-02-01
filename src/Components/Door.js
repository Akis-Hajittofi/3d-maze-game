import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import React from "react";
import { useRef } from "react";

const Door = ({ color }) => {
  let ref = useRef();
  useFrame(() => {});
  return (
    <>
      <RigidBody
        ref={ref}
        type="fixed"
        colliders={"cuboid"}
        position={[0, 0, 2]}
      >
        <mesh>
          <boxGeometry args={[5, 6, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" name="sensor">
        <CuboidCollider
          position={[0, 0, 1]}
          args={[3, 3, 5]}
          sensor
          onIntersectionEnter={({ other }) => {
            if (other.rigidBodyObject.name === "player") {
              console.log("hello");
              let t = ref.current.translation();
              t.y = 9;
              ref.current.setTranslation(t, true);
            }
          }}
          onIntersectionExit={({ other }) => {
            if (other.rigidBodyObject.name === "player") {
              console.log("bye");
              let t = ref.current.translation();
              t.y = 3;
              ref.current.setTranslation(t, true);
            }
          }}
        />
      </RigidBody>
    </>
  );
};

export default React.memo(Door);
