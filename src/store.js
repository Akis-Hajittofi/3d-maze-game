import { create } from "zustand";
import Room from "./Components/Room";
import Coin from "./Components/Coin";
import Health from "./Components/Health";
import { enemies, passages, roomsConfig } from "./utils";

const useStore = create((set, get) => ({
  // triggers and variables
  gameState: "play",
  health: 100,
  points: 0,
  enemiesKilled: 0,
  enemyDiedID: "",

  // maze component
  passages: passages,
  coins: [],
  enemies: enemies,
  healthItems: [],
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

  // actions
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
  removeEnemy: (id) => {
    set({
      enemiesKilled: get().enemiesKilled + 1,
      enemyDiedID: id,
      points: get().points + 10,
    });
  },
  addHealthItem: (e) => {
    set((state) => ({
      healthItems: [
        ...state.healthItems,
        <Health
          x={e.x}
          z={e.z}
          id={state.healthItems.length}
          key={state.healthItems.length}
        />,
      ],
    }));
  },
  increaseHealth: (id) => {
    set((state) => ({
      healthItems: state.healthItems.filter((h) => h.props.id !== id),
      health: 100,
    }));
  },
  reduceHealth: () => {
    let health = get().health;
    if (health >= 0) {
      set({
        health: health - 0.5,
      });
    } else {
      set({
        gameState: "playerDead",
      });
    }
  },
  retry: () => {
    set({
      gameState: "play",
      health: 100,
      enemiesKilled: 0,
      points: 0,
    });
  },
  end: () => {
    set({
      gameState: "end",
    });
  },
}));

export default useStore;
