import React, { useRef } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, quat, vec3 } from "@react-three/rapier";
import { Vector3 } from "three";

const moveCamera = (player, camera, changeView) => {
  let playerPos = vec3(player.translation());
  let playerQuat = quat(player.rotation());

  let playerOffset = !changeView ? new Vector3(0, 1, 5) : new Vector3(0, 0, 0);
  let alpha = !changeView ? 0.05 : 0.27;

  camera.position.lerp(
    playerOffset.applyQuaternion(playerQuat).add(playerPos),
    alpha
  );
};

const movePlayer = (player, camera, controls) => {
  let { forward, backward, left, right, jump, shift } = controls;
  player.setRotation(camera.quaternion);

  const forwardVector = camera.getWorldDirection(new Vector3());
  const vectorUp = new Vector3(0, 1, 0);
  const sideVector = vectorUp.cross(forwardVector);

  let speed = shift ? 6 : 2;
  // based on camera world direction
  const directionalVector = forwardVector
    .multiplyScalar(-(backward - forward) * speed)
    .add(sideVector.multiplyScalar(-(right - left) * speed));

  player.applyImpulse(
    {
      x: directionalVector.x,
      y: jump ? 3 : 0,
      z: directionalVector.z,
    },
    true
  );
};

const Player = ({ coin }) => {
  const player = useRef();
  const [, get] = useKeyboardControls();

  useFrame((state) => {
    const controls = get();
    if (player?.current) {
      moveCamera(player.current, state.camera, controls.q);
      movePlayer(player.current, state.camera, controls);
    }
  });

  return (
    <>
      <RigidBody
        name="player"
        ref={player}
        colliders={false}
        mass={70}
        type="dynamic"
        lockRotations
        gravityScale={8}
        linearDamping={14}
        userData={"player"}
      >
        <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
          <capsuleGeometry args={[0.5, 1.5]} />
          <meshStandardMaterial color={"royalblue"} />
        </mesh>
        <CapsuleCollider args={[0.75, 0.5]} />
      </RigidBody>
    </>
  );
};

export default Player;
