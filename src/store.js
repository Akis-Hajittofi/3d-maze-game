import { create } from "zustand";
import Passage from "./Components/Passages";
import Room from "./Components/Room";
import Enemy from "./Components/Enemy";
import { useEffect, useRef } from "react";

let c = "#1a273a";

let roomsConfig = [
  { name: "room1", x: 0, z: 0, size: [100, 50], color: c },
  { name: "room2", x: 0, z: 200, size: [60, 30], color: c },
  { name: "room3", x: -300, z: -150, size: [50, 50], color: c },
  { name: "room4", x: -300, z: 0, size: [100, 70], color: c },
  { name: "room5", x: 0, z: -200, size: [70, 70], color: c },
];

const useStore = create((set, get) => ({
  rooms: roomsConfig.map((r) => (
    <Room x={r.x} z={r.z} size={r.size} key={r.name} color={r.color} />
  )),
  passages: [
    <Passage room1={roomsConfig[2]} room2={roomsConfig[3]} />,
    <Passage room1={roomsConfig[0]} room2={roomsConfig[1]} />,
    <Passage room1={roomsConfig[0]} room2={roomsConfig[3]} />,
    <Passage room1={roomsConfig[0]} room2={roomsConfig[4]} />,
  ],

  die: "",

  enemies: [
    <Enemy x={roomsConfig[0].x} z={roomsConfig[0].z} id={"e1"} color="black" />,
    <Enemy x={roomsConfig[0].x + 10} z={roomsConfig[0].z + 10} id={"e2"} />,
    <Enemy
      x={roomsConfig[0].x + 10}
      z={roomsConfig[0].z - 10}
      id={"e3"}
      color="red"
    />,
  ],

  removeEnemy: (id) => {
    set({
      die: id,
    });
  },
}));

export default useStore;
