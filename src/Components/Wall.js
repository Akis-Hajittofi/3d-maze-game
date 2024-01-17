import React from "react";
import { RigidBody } from "@react-three/rapier";

function Wall({ position, width = 5, height, depth, color = "#0F172A" }) {
  return (
    <RigidBody type="fixed" colliders={"cuboid"}>
      <mesh position={position}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
}
export default Wall;
