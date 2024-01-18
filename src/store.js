import { create } from "zustand";
import Passage from "./Components/Passages";
import Room from "./Components/Room";

let roomsConfig = [
  { name: "room1", x: 0, z: 0, size: [100, 50], color: "red" },
  { name: "room2", x: 0, z: 200, size: [60, 30], color: "yellow" },
  { name: "room3", x: -300, z: -150, size: [50, 50], color: "lime" },
  { name: "room4", x: -300, z: 0, size: [100, 70], color: "purple" },
  { name: "room5", x: 0, z: -200, size: [70, 70], color: "orange" },
];

const useStore = create((set) => ({
  rooms: roomsConfig.map((r) => (
    <Room x={r.x} z={r.z} size={r.size} key={r.name} color={r.color} />
  )),
  passages: [
    <Passage room1={roomsConfig[2]} room2={roomsConfig[3]} />,
    <Passage room1={roomsConfig[0]} room2={roomsConfig[1]} />,
    <Passage room1={roomsConfig[0]} room2={roomsConfig[3]} />,
    <Passage room1={roomsConfig[0]} room2={roomsConfig[4]} />,
  ],
}));

export default useStore;
