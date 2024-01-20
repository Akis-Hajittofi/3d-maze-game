import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import React, { useRef } from "react";
import { Euler, MeshBasicMaterial, Vector3 } from "three";

const bulletMaterial = new MeshBasicMaterial({
  color: "hotpink",
  toneMapped: false,
});

bulletMaterial.color.multiplyScalar(42);

function Bullet({ bulletInfo, onHit }) {
  // console.log(bulletInfo);
  let p = new Vector3(0.5, 1, -1)
    .applyQuaternion(bulletInfo.playerQuat)
    .add(bulletInfo.playerPos);
  let r = new Euler().setFromQuaternion(bulletInfo.playerQuat);
  const ref = useRef();

  useFrame(() => {
    if (ref?.current) {
      let forward = new Vector3(0, 0, -1).applyQuaternion(
        bulletInfo.playerQuat
      );
      forward.multiplyScalar(0.05); //speed
      ref.current.applyImpulse(forward, true);
      // ref.current.addForce(forward, true);
    }
  });

  return (
    <RigidBody
      ref={ref}
      name="bullet"
      gravityScale={0}
      sensor
      onIntersectionEnter={({ other }) => {
        if (
          other.rigidBodyObject.name !== "player" &&
          other.rigidBodyObject.name !== "sensor"
        ) {
          console.log(other.rigidBodyObject);
          // will remove the bullet
          onHit(bulletInfo.id);
        }
      }}
    >
      <mesh
        position={[p.x, p.y, p.z]}
        rotation={[r.x, r.y, r.z]}
        material={bulletMaterial}
        castShadow
      >
        <pointLight color={"white"} intensity={10} distance={8} decay={1} />
        <boxGeometry args={[0.1, 0.1, 1.5]} />
      </mesh>
    </RigidBody>
  );
}

export default Bullet;
