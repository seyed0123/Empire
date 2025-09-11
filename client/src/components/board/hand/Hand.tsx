import React from "react";
import { TransitionGroup } from "react-transition-group";
import {
  ICardModel,
  GameContext,
  Moves,
  PlayerState,
} from "../../../domain/entity";
import { scarecrowPlayed } from "../../../domain/game-logic/utils";
import { isMapPhase } from "../../../utils/client";
import { OPACITY } from "../../../utils/constants";
import { CardTransition } from "../../card-transition/CardTransition";
import { DragCard } from "./DragCard";
import styles from "./Hand.module.scss";

export const Hand = (props: {
  state: PlayerState;
  ctx: GameContext;
  moves: Moves;
}) => {
  const { state, moves, ctx } = props;
  const playerId = state.id;
  const model = state.hand || [];
  const handDisabled =
    playerId !== ctx.currentPlayer || scarecrowPlayed(state) || isMapPhase(ctx);

 
  const maxTotalAngle = 70; // degrees total spread (approx)
  const maxAngleStep = 12; // max degrees between adjacent cards
  const spacingPx = 44; // horizontal spacing per card from center (positive/negative)
  const count = model.length;

  
  const angleStep =
    count > 1
      ? Math.min(maxAngleStep, maxTotalAngle / (count - 1))
      : 0;
  const startAngle = -((count - 1) * angleStep) / 2;

  return (
    <div
      className={styles.Container}
      style={handDisabled ? { opacity: OPACITY } : {}}
    >
      {!model.length && <div className={styles.Empty}></div>}

      <TransitionGroup component={null}>
        {model.map((card: ICardModel, index: number) => {
          const angle = startAngle + index * angleStep;
          // offset from center: negative for left side, positive to right
          const offset = (index - (count - 1) / 2) * spacingPx;

         
          const wrapperStyle: React.CSSProperties = {
            zIndex: index + 1,
            
            ["--angle" as any]: `${angle}deg`,
            ["--offset" as any]: `${offset}px`,
          };

          return (
            <CardTransition key={card.id}>
              <div
                className={`${styles.CardWrapper} ${
                  handDisabled ? styles.Disabled : ""
                }`}
                style={wrapperStyle}
              >
                <DragCard
                  card={card}
                  key={card.id}
                  playerId={playerId}
                  moves={moves}
                />
              </div>
            </CardTransition>
          );
        })}
      </TransitionGroup>
    </div>
  );
};
