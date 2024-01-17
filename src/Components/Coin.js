import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { RigidBody } from "@react-three/rapier";

const Coin = ({ x = 5, z = 5, setCoins, id }) => {
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
              setCoins((coins) => coins.filter((coin) => coin.props.id !== id));
            }, 20); // creates a bumping effect
          }
        }}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[x, 0, z]}>
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
export default Coin;
