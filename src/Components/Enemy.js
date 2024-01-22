import { useFrame } from "@react-three/fiber";
import {
  CapsuleCollider,
  CuboidCollider,
  RigidBody,
  vec3,
} from "@react-three/rapier";
import React, { useRef } from "react";
import { Vector3 } from "three";

let randomPosition = (x, z) => {
  return new Vector3(
    +(
      Math.floor(Math.round(Math.random()) * 2 - 1) *
      Math.random() *
      x
    ).toFixed(3),
    0,
    +(
      Math.floor(Math.round(Math.random()) * 2 - 1) *
      Math.random() *
      z
    ).toFixed(3)
  );
};

function Enemy(props) {
  const refE = useRef();
  const refPlayer = useRef();

  let x = 0,
    z = 0;
  let size = 5;
  let goTo = randomPosition(size, size);
  let movingTo = new Vector3();

  useFrame(() => {
    if (refE?.current) {
      const currentPosition = vec3(refE.current.translation());

      // if the player is inside the region,
      // then we want to chance the player

      if (currentPosition.x.toFixed(2) !== goTo.x.toFixed(2)) {
        movingTo.x =
          movingTo.x + 0.01 * (goTo.x - currentPosition.x >= 0 ? 1 : -1);
        movingTo.z =
          movingTo.z + 0.01 * (goTo.z - currentPosition.z >= 0 ? 1 : -1);

        refE.current.setTranslation(
          new Vector3(movingTo.x, currentPosition.y, movingTo.z),
          true
        );
      } else {
        goTo = randomPosition(size, size);
      }
    }
    if (refPlayer?.current) {
    }
  });
  return (
    <>
      <RigidBody
        ref={refE}
        type="dynamic"
        colliders={false}
        mass={70}
        lockRotations
        linearDamping={3}
        name="enemy"
      >
        <mesh rotation={[0, 0, 0]} position={[x, 3, z]}>
          <capsuleGeometry args={[0.5, 1.5]} />
          <meshStandardMaterial color={"white"} />
        </mesh>
        <CapsuleCollider args={[0.75, 0.5]} position={[x, 3, z]} />
      </RigidBody>
      <RigidBody type="fixed" name="sensor">
        <CuboidCollider
          position={[x, 2, z]}
          args={[size, 1.5, size]}
          sensor
          onIntersectionEnter={({ other }) => {
            if (other.rigidBodyObject.name === "player") {
              refPlayer.current = other.rigidBodyObject;
            }
          }}
          onIntersectionExit={({ other }) => {
            if (other.rigidBodyObject.name === "player") {
              refPlayer.current = null;
            }
          }}
        />
      </RigidBody>
    </>
  );
}
export default Enemy;
