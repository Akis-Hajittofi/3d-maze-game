import { useFrame } from "@react-three/fiber";
import {
  CapsuleCollider,
  CuboidCollider,
  RigidBody,
  quat,
  vec3,
} from "@react-three/rapier";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Vector3 } from "three";
import useStore from "../store";

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

const Enemy = ({ x = 0, z = 0, size = [5, 5], id, color = "white" }) => {
  let die = useStore((state) => state.die);
  let [isDead, setIsDead] = useState(false);
  let [animateDeath, setAnimateDeath] = useState(false);

  const enemyRef = useRef();
  const playerRef = useRef();

  let enemyInitPosition = useMemo(() => new Vector3(x, 1.25, z), [id]);

  let generateRandomPosition = useCallback(
    () => randomPosition(size, x, z),
    [id]
  );

  const moveEnemyToward = useCallback(
    (targetPosition) => {
      const speed = 0.01;
      enemyInitPosition.x +=
        speed * Math.sign(targetPosition.x - enemyInitPosition.x);
      enemyInitPosition.z +=
        speed * Math.sign(targetPosition.z - enemyInitPosition.z);
      enemyRef.current.setTranslation(
        new Vector3(enemyInitPosition.x, 1.25, enemyInitPosition.z),
        true
      );
    },
    [id]
  );

  let enemyPosition = generateRandomPosition();
  useFrame(() => {
    if (enemyRef?.current && !isDead) {
      if (animateDeath) {
        enemyRef.current.setAngvel(new Vector3(1, 0, 0), true);
      } else {
        let isDistanceLessThan = (to, lessThan) =>
          vec3(enemyRef.current.translation()).distanceTo(to) <= lessThan;

        if (playerRef?.current) {
          isDistanceLessThan(playerRef.current.position, 0.95)
            ? onHit()
            : moveEnemyToward(playerRef.current.position);
        } else {
          isDistanceLessThan(enemyPosition, 1.5)
            ? (enemyPosition = generateRandomPosition())
            : moveEnemyToward(enemyPosition);
        }
      }
    }
  });

  useEffect(() => {
    if (die === id) {
      setAnimateDeath(true);
      setTimeout(() => {
        setIsDead(true);
      }, 1000);
    }
  }, [die]);

  return (
    <>
      {!isDead && (
        <>
          <EnemyBody
            ref={enemyRef}
            position={[x, 1.25, z]}
            color={color}
            userData={{ id }}
          />
          <EnemySensor
            size={size}
            position={[x, 2, z]}
            onPlayerEnter={(player) => (playerRef.current = player)}
            onPlayerExit={() => (playerRef.current = null)}
          />
        </>
      )}
    </>
  );
};

const EnemyBody = React.forwardRef(({ position, color, userData }, ref) => (
  <RigidBody
    ref={ref}
    type="dynamic"
    colliders={false}
    mass={70}
    lockRotations={true}
    linearDamping={3}
    name="enemy"
    position={position}
    userData={userData}
  >
    <mesh rotation={[0, 0, 0]}>
      <capsuleGeometry args={[0.5, 1.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
    <CapsuleCollider args={[0.75, 0.5]} />
  </RigidBody>
));

const EnemySensor = ({ size, position, onPlayerEnter, onPlayerExit }) => (
  <RigidBody type="fixed" name="sensor">
    <CuboidCollider
      position={position}
      args={[size[0], 1.5, size[1]]}
      sensor
      onIntersectionEnter={({ other }) => {
        if (other.rigidBodyObject.name === "player") {
          onPlayerEnter(other.rigidBodyObject);
        }
      }}
      onIntersectionExit={({ other }) => {
        if (other.rigidBodyObject.name === "player") {
          onPlayerExit();
        }
      }}
    />
  </RigidBody>
);
export default Enemy;
