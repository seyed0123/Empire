import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { registerNavigate } from "../../utils/navigation";
import { GameMap } from "../map/GameMap";
import { Board } from "../board/Board";
import { MainMenu } from "../main-menu/MainMenu";
import { GameConfig } from "../../utils/game-config";
import { GameLobby } from "../game-lobby/GameLobby";
import { PixiBackground } from "../main-menu/pixiBackground";
import { useEffect, useRef } from "react";

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

  const menuAudioRef = useRef<HTMLAudioElement>(null);
  const battleAudioRef = useRef<HTMLAudioElement>(null);

  const BATTLE_AUDIOS = ["/audio/Warm_Light.mp3", "/audio/Green_Nature.mp3", "/audio/Dark_Castle.mp3",'/audio/BeyondTheStars.mp3','/audio/FantasyAmbience.mp3'];
  const randomBattleAudio = BATTLE_AUDIOS[Math.floor(Math.random() * BATTLE_AUDIOS.length)];
  const rngRef = useRef(mulberry32(Date.now()));

  useEffect(() => {
    const audio = menuAudioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.muted = true; 
    audio.play().catch(() => {});
    
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

  useEffect(() => {
    const menuAudio = menuAudioRef.current;
    const battleAudio = battleAudioRef.current;
  
    const playRandomBattleAudio = () => {
      if (!battleAudio) return; 

      const rng = rngRef.current;
      const pick = () => Math.floor(rng() * BATTLE_AUDIOS.length);
      const randomSrc = BATTLE_AUDIOS[pick()];
      battleAudio.src = randomSrc;
      battleAudio.play().catch(() => {});
    };
  
    if (location.pathname.startsWith("/battle") ) {
      if (menuAudio) {
        menuAudio.pause();
        menuAudio.currentTime = 0;
      }
      if (battleAudio) {
        battleAudio.loop = false;
        battleAudio.muted = false;
        playRandomBattleAudio();
  
        battleAudio.addEventListener("ended", playRandomBattleAudio);
      }
    } else {
      if (battleAudio) {
        battleAudio.pause();
        battleAudio.currentTime = 0;
        battleAudio.removeEventListener("ended", playRandomBattleAudio); 
      }
      if (menuAudio) {
        menuAudio.play().catch(() => {});
      }
    }
  
    return () => {
      if (battleAudio) {
        battleAudio.removeEventListener("ended", playRandomBattleAudio);
      }
    };
  }, [location.pathname, rngRef]);
  

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