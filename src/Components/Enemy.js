import { useFrame } from "@react-three/fiber";
import {
  CapsuleCollider,
  CuboidCollider,
  RigidBody,
  vec3,
} from "@react-three/rapier";
import React, { useCallback, useMemo, useRef } from "react";
import { Vector3 } from "three";

let randomPosition = ([sX, sZ], x, z) => {
  return new Vector3(
    +(
      Math.floor(Math.round(Math.random()) * 2 - 1) * Math.random() * sX +
      x
    ).toFixed(3),
    0,
    +(
      Math.floor(Math.round(Math.random()) * 2 - 1) * Math.random() * sZ +
      z
    ).toFixed(3)
  );
};

const onHit = () => {
  console.log("hit - reduce health ");
};

function Enemy({ x = 0, z = 0, size = [5, 5] }) {
  const enemyRef = useRef();
  const playerRef = useRef();

  let enemyMoveTo = useMemo(() => new Vector3(x, 0, z), []);
  let generateRandomPosition = useCallback(
    () => randomPosition(size, x, z),
    []
  );
  const moveEnemy = useCallback((targetPosition) => {
    const speed = 0.01;
    enemyMoveTo.x += speed * Math.sign(targetPosition.x - enemyMoveTo.x);
    enemyMoveTo.z += speed * Math.sign(targetPosition.z - enemyMoveTo.z);
    enemyRef.current.setTranslation(
      new Vector3(enemyMoveTo.x, 1.25, enemyMoveTo.z),
      true
    );
  }, []);

  let enemyGoTo = generateRandomPosition();
  useFrame(() => {
    if (enemyRef?.current) {
      let isDistanceLessThan = (to, lessThan) =>
        vec3(enemyRef.current.translation()).distanceTo(to) <= lessThan;

      if (playerRef?.current) {
        isDistanceLessThan(playerRef.current.position, 0.95)
          ? onHit()
          : moveEnemy(playerRef.current.position);
      } else {
        isDistanceLessThan(enemyGoTo, 1.5)
          ? (enemyGoTo = generateRandomPosition())
          : moveEnemy(enemyGoTo);
      }
    }
  });
  return (
    <>
      <RigidBody
        ref={enemyRef}
        type="dynamic"
        colliders={false}
        mass={70}
        lockRotations
        linearDamping={3}
        name="enemy"
        position={[x, 1.25, z]}
      >
        <mesh rotation={[0, 0, 0]}>
          <capsuleGeometry args={[0.5, 1.5]} />
          <meshStandardMaterial color={"white"} />
        </mesh>
        <CapsuleCollider args={[0.75, 0.5]} />
      </RigidBody>
      <RigidBody type="fixed" name="sensor">
        <CuboidCollider
          position={[x, 2, z]}
          args={[size[0], 1.5, size[1]]}
          sensor
          onIntersectionEnter={({ other }) => {
            if (other.rigidBodyObject.name === "player") {
              playerRef.current = other.rigidBodyObject;
            }
          }}
          onIntersectionExit={({ other }) => {
            if (other.rigidBodyObject.name === "player") {
              playerRef.current = null;
            }
          }}
        />
      </RigidBody>
    </>
  );
}
export default Enemy;
