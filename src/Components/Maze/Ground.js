import React from "react";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

function Ground(props) {
  return (
    <RigidBody
      {...props}
      type="fixed"
      colliders={false}
      friction={2}
      name="ground"
    >
      <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1000, 1000]} />
        {/* <meshStandardMaterial color="#38BDF8" /> */}
        <meshStandardMaterial color="#00cdb7" />
      </mesh>
      <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
    </RigidBody>
  );
}

export default React.memo(Ground);
