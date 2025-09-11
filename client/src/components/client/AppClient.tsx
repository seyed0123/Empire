import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { registerNavigate } from "../../utils/navigation";
import { GameMap } from "../map/GameMap";
import { Board } from "../board/Board";
import { MainMenu } from "../main-menu/MainMenu";
import { GameConfig } from "../../utils/game-config";
import { GameLobby } from "../game-lobby/GameLobby";
import { PixiBackground } from "../main-menu/pixiBackground";
import { useEffect, useRef } from "react";

export const AppClient = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  registerNavigate(navigate);

  const menuAudioRef = useRef<HTMLAudioElement>(null);
  const battleAudioRef = useRef<HTMLAudioElement>(null);

  const BATTLE_AUDIOS = ["/audio/Warm_Light.mp3", "/audio/Green_Nature.mp3", "/audio/Dark_Castle.mp3"];
  const randomBattleAudio = BATTLE_AUDIOS[Math.floor(Math.random() * BATTLE_AUDIOS.length)];

  // Play menu music on load
  useEffect(() => {
    const audio = menuAudioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.muted = true; // muted initially to bypass autoplay restrictions
    audio.play().catch(() => {});
    
    // Unmute after first user interaction
    const unmute = () => {
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

  // Switch audio when changing routes
  useEffect(() => {
    const menuAudio = menuAudioRef.current;
    const battleAudio = battleAudioRef.current;

    if (location.pathname.startsWith("/battle")) {
      // Stop menu music
      if (menuAudio) {
        menuAudio.pause();
        menuAudio.currentTime = 0;
      }
      // Start battle music
      if (battleAudio) {
        battleAudio.loop = true;
        battleAudio.muted = false;
        battleAudio.play().catch(() => {});
      }
    } else {
      // Stop battle music
      if (battleAudio) {
        battleAudio.pause();
        battleAudio.currentTime = 0;
      }
      // Start menu music
      if (menuAudio) {
        menuAudio.play().catch(() => {});
      }
    }
  }, [location.pathname]);

  return (
    <>
      <PixiBackground />
      <audio ref={menuAudioRef} src="/audio/Divine_Ascension.mp3" loop autoPlay muted style={{ display: "none" }} />
      <audio ref={battleAudioRef} src={randomBattleAudio} loop autoPlay muted style={{ display: "none" }} />

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