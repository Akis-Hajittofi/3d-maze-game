import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import React, { useCallback, useMemo, useRef } from "react";
import { Euler, MeshBasicMaterial, Vector3 } from "three";
import useStore from "../../store";

const bulletMaterial = new MeshBasicMaterial({
  color: "red",
  toneMapped: false,
});

bulletMaterial.color.multiplyScalar(42);

const calculateBulletPosition = (bulletInfo) => {
  return new Vector3(0.5, 1, -1)
    .applyQuaternion(bulletInfo.playerQuat)
    .add(bulletInfo.playerPos);
};

const calculateBulletRotation = (bulletInfo) => {
  return new Euler().setFromQuaternion(bulletInfo.playerQuat);
};

function Bullet({ bulletInfo }) {
  let onHit = useStore((state) => state.onHit);

  const ref = useRef();

  const bulletPosition = useMemo(
    () => calculateBulletPosition(bulletInfo),
    [bulletInfo]
  );
  const bulletRotation = useMemo(
    () => calculateBulletRotation(bulletInfo),
    [bulletInfo]
  );

  let handelIntersection = useCallback(
    ({ other }) => {
      if (
        other.rigidBodyObject.name !== "player" &&
        other.rigidBodyObject.name !== "sensor"
      ) {
        const { name, userData } = other.rigidBodyObject;
        onHit(bulletInfo.id, name, userData);
      }
    },
    [onHit, bulletInfo.id]
  );

  useFrame(() => {
    if (ref?.current) {
      let forward = new Vector3(0, 0, -1).applyQuaternion(
        bulletInfo.playerQuat
      );
      forward.multiplyScalar(0.05); //speed
      ref.current.applyImpulse(forward, true);
    }
  });

  return (
    <RigidBody
      ref={ref}
      name="bullet"
      gravityScale={0}
      sensor
      onIntersectionEnter={handelIntersection}
    >
      <mesh
        position={bulletPosition}
        rotation={bulletRotation}
        material={bulletMaterial}
        castShadow
      >
        <pointLight color={"red"} intensity={10} distance={8} decay={1} />
        <boxGeometry args={[0.1, 0.1, 1.5]} />
      </mesh>
    </RigidBody>
  );
}

export default React.memo(Bullet);
