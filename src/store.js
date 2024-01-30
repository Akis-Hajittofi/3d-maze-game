import { create } from "zustand";
import Passage from "./Components/Passages";
import Room from "./Components/Room";
import Enemy from "./Components/Enemy";
import Coin from "./Components/Coin";
import Health from "./Components/Health";

let c = "#1a273a";

let roomsConfig = [
  // { name: "room0", x: 0, z: 0, size: [50, 50], color: c, doors: [1, 0, 1, 1] }, //completely closed maze
  { name: "room0", x: 0, z: 0, size: [50, 50], color: c, doors: [1, 1, 1, 1] }, //
  { name: "room1", x: 0, z: 50, size: [30, 30], color: c, doors: [1, 0, 0, 0] },
  {
    name: "end",
    x: -90,
    z: -70,
    size: [50, 50],
    doors: [0, 1, 1, 0],
    color: "pink",
  },
  {
    name: "room3",
    x: -90,
    z: 0,
    size: [30, 30],
    color: c,
    doors: [1, 1, 0, 0],
  },
  {
    name: "room4",
    x: 0,
    z: -70,
    size: [70, 70],
    color: c,
    doors: [0, 0, 1, 1],
  },
];
let enemies = [
  // in room 0
  <Enemy
    x={roomsConfig[0].x + 10}
    z={roomsConfig[0].z + 10}
    id={"e1"}
    size={[10, 10]}
    color="white"
  />,
  <Enemy
    x={roomsConfig[0].x + 0}
    z={roomsConfig[0].z + 10}
    id={"e2"}
    size={[10, 10]}
    color="white"
  />,
  // in room 1111
  <Enemy
    x={roomsConfig[1].x + 10}
    z={roomsConfig[1].z + 10}
    id={"4"}
    size={[10, 10]}
    color="white"
  />,
  <Enemy
    x={roomsConfig[1].x + 0}
    z={roomsConfig[1].z + 10}
    id={"5"}
    size={[10, 10]}
    color="white"
  />,
  <Enemy
    x={roomsConfig[1].x}
    z={roomsConfig[1].z}
    id={"6"}
    color="green"
    size={roomsConfig[1].size.map((s) => s / 2)}
  />,
  // in room 2
  <Enemy
    x={roomsConfig[2].x - 10}
    z={roomsConfig[2].z - 10}
    id={"6"}
    color="green"
    size={roomsConfig[2].size.map((s) => s / 2)}
  />,
  <Enemy
    x={roomsConfig[2].x + 10}
    z={roomsConfig[2].z + 10}
    id={"7"}
    color="green"
    size={roomsConfig[2].size.map((s) => s / 2)}
  />,
  <Enemy
    x={roomsConfig[2].x - 10}
    z={roomsConfig[2].z + 10}
    id={"8"}
    color="green"
    size={roomsConfig[2].size.map((s) => s / 2)}
  />,
  <Enemy
    x={roomsConfig[2].x}
    z={roomsConfig[2].z}
    id={"e93"}
    color="green"
    size={roomsConfig[2].size.map((s) => s / 2)}
  />,
  <Enemy
    x={roomsConfig[2].x}
    z={roomsConfig[2].z}
    id={"e13"}
    color="green"
    size={roomsConfig[2].size.map((s) => s / 2)}
  />,
  // in room 3
  <Enemy
    x={roomsConfig[3].x + 10}
    z={roomsConfig[3].z + 10}
    id={"e12"}
    size={[10, 10]}
    color="white"
  />,
  <Enemy
    x={roomsConfig[3].x + 0}
    z={roomsConfig[3].z + 10}
    id={"e32"}
    size={[10, 10]}
    color="white"
  />,
  <Enemy
    x={roomsConfig[3].x}
    z={roomsConfig[3].z}
    id={"e34"}
    color="green"
    size={roomsConfig[3].size.map((s) => s / 2)}
  />,
  // room 4
  <Enemy
    x={roomsConfig[4].x - 20}
    z={roomsConfig[4].z + 0}
    id={"e15"}
    size={[10, 10]}
    color="white"
  />,
  <Enemy
    x={roomsConfig[4].x - 20}
    z={roomsConfig[4].z + 10}
    id={"e26"}
    size={[10, 10]}
    color="white"
  />,
  <Enemy
    x={roomsConfig[4].x}
    z={roomsConfig[4].z}
    id={"e31"}
    color="green"
    size={roomsConfig[4].size.map((s) => s / 2)}
  />,
  <Enemy
    x={roomsConfig[4].x - 10}
    z={roomsConfig[4].z + 0}
    id={"e3v1"}
    size={[10, 10]}
    color="white"
  />,
  <Enemy
    x={roomsConfig[4].x + 1}
    z={roomsConfig[4].z + 40}
    id={"e2x"}
    size={[10, 10]}
    color="white"
  />,

  <Enemy
    x={roomsConfig[4].x}
    z={roomsConfig[4].z}
    id={"evc3"}
    color="green"
    size={roomsConfig[4].size.map((s) => s / 2)}
  />,
];

const useStore = create((set, get) => ({
  gameState: "play",
  health: 100,
  points: 0,
  rooms: roomsConfig.map((r) => (
    <Room
      name={r.name}
      x={r.x}
      z={r.z}
      size={r.size}
      key={r.name}
      color={r.color}
      doors={r.doors}
    />
  )),

  passages: [
    <Passage room1={roomsConfig[0]} room2={roomsConfig[1]} color={c} />,
    <Passage room1={roomsConfig[0]} room2={roomsConfig[3]} color={c} />,
    <Passage room1={roomsConfig[0]} room2={roomsConfig[4]} color={c} />,
    <Passage room1={roomsConfig[2]} room2={roomsConfig[3]} color={c} />,
    <Passage room1={roomsConfig[4]} room2={roomsConfig[2]} color={c} />,
  ],

  coins: [],
  addCoin: (coin) => {
    set((state) => ({
      coins: [
        ...state.coins,
        <Coin
          x={coin.x}
          z={coin.z}
          id={get().coins.length}
          key={get().coins.length}
        />,
      ],
    }));
  },

  removeCoin: (id) => {
    set({
      coins: get().coins.filter((coin) => coin.props.id !== id),
      points: get().points + 10,
    });
  },

  enemiesKilled: 0,
  enemyDiedID: "",
  enemies: enemies,

  removeEnemy: (id) => {
    set({
      enemiesKilled: get().enemiesKilled + 1,
      enemyDiedID: id,
      points: get().points + 10,
    });
  },

  healthItem: [],

  increaseHealth: (id) => {
    set((state) => ({
      healthItem: state.healthItem.filter((h) => h.props.id !== id),
      health: 100,
    }));
  },

  addHealthItem: (e) => {
    set((state) => ({
      healthItem: [
        ...state.healthItem,
        <Health
          x={e.x}
          z={e.z}
          id={state.healthItem.length}
          key={state.healthItem.length}
        />,
      ],
    }));
  },

  reduceHealth: () => {
    let health = get().health;

    if (health >= 0) {
      set({
        health: health - 0.5,
      });
    } else {
      console.log(
        "-------------------------- GAME OVER --------------------------"
      );
      set({
        gameState: "playerDead",
      });
    }
  },
  end: () => {
    set({
      gameState: "end",
    });
  },
  retry: () => {
    set({
      gameState: "play",
      health: 100,
      enemiesKilled: 0,
      points: 0,
    });
  },
}));

export default useStore;
