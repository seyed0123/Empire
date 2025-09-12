import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { registerNavigate } from "../../utils/navigation";
import { GameMap } from "../map/GameMap";
import { Board } from "../board/Board";
import { MainMenu } from "../main-menu/MainMenu";
import { GameConfig } from "../../utils/game-config";
import { GameLobby } from "../game-lobby/GameLobby";
import { PixiBackground } from "../main-menu/pixiBackground";
import { useEffect, useRef } from "react";
import AudioManager from "../../utils/AudioManager";

// RNG helper
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const AppClient = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  registerNavigate(navigate);

  const rngRef = useRef(mulberry32(Date.now()));

  const MENU_AUDIO = "/audio/Divine_Ascension.mp3";
  const BATTLE_AUDIOS = [
    "/audio/Warm_Light.mp3",
    "/audio/Green_Nature.mp3",
    "/audio/Dark_Castle.mp3",
    "/audio/BeyondTheStars.mp3",
    "/audio/FantasyAmbience.mp3",
  ];

  useEffect(() => {
    AudioManager.play(MENU_AUDIO, true, 0.5);
    const unmute = () => {
      const audio = (AudioManager as any).audio as HTMLAudioElement | null;
      if (audio) {
        audio.muted = false;
        audio.play().catch(() => {});
      }
      window.removeEventListener("click", unmute);
      window.removeEventListener("keydown", unmute);
    };
    window.addEventListener("click", unmute);
    window.addEventListener("keydown", unmute);

    return () => {
      window.removeEventListener("click", unmute);
      window.removeEventListener("keydown", unmute);
    };
  }, []);
useEffect(() => {
  const rng = rngRef.current;
  const pickRandomBattleAudio = () => {
    const idx = Math.floor(rng() * BATTLE_AUDIOS.length);
    return BATTLE_AUDIOS[idx];
  };

  if (location.pathname.startsWith("/battle")) {
    AudioManager.stop();
    const src = pickRandomBattleAudio();
    AudioManager.play(src, false, 0.5);

    const audio = AudioManager.element;
    if (audio) {
      const handler = () => {
        AudioManager.stop();
        AudioManager.play(pickRandomBattleAudio(), false, 0.5);
      };
      audio.addEventListener("ended", handler);
      return () => {
        audio.removeEventListener("ended", handler);
      };
    }
  } else {
    AudioManager.pause();
    AudioManager.play(MENU_AUDIO, true, 0.5); 
  }
}, [location.pathname]);


  return (
    <>
      <PixiBackground />
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route
          path="/map"
          element={(() => {
            if (!GameConfig.isInitialized) return <Navigate to="/" />;
            const GameMapComponent = GameMap();
            return <GameMapComponent playerID="0" />;
          })()}
        />
        <Route
          path="/battle"
          element={(() => {
            if (!GameConfig.isInitialized) return <Navigate to="/" />;
            const BoardComponent = Board();
            return <BoardComponent playerID="0" />;
          })()}
        />
        <Route path="/multiplayer" element={<GameLobby />} />
      </Routes>
    </>
  );
};
