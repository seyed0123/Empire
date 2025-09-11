import { useEffect } from "react";
import * as PIXI from "pixi.js";

export const PixiBackground = () => {
  useEffect(() => {
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      transparent: false,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    } as any);

    app.view.style.position = "fixed";
    app.view.style.top = "0";
    app.view.style.left = "0";
    app.view.style.width = "100%";
    app.view.style.height = "100%";
    app.view.style.zIndex = "-1";
    document.body.appendChild(app.view);

    const background = PIXI.Sprite.from("/pixi_img/castle2.jpg");
background.texture.baseTexture.on("error", (e) => console.error("Background failed to load:", e));
    background.width = app.screen.width;
    background.height = app.screen.height;
    app.stage.addChild(background);

    const depthMap = PIXI.Sprite.from("/pixi_img/castle_depth_map.png");
depthMap.texture.baseTexture.on("error", (e) => console.error("Depth map failed to load:", e));
    depthMap.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    app.stage.addChild(depthMap);

    const displacementFilter = new PIXI.filters.DisplacementFilter(depthMap);
    displacementFilter.scale.set(30, 30);
    background.filters = [displacementFilter];

    const onMouseMove = (e: MouseEvent) => {
      displacementFilter.scale.x = (e.clientX - window.innerWidth / 2) / 20;
      displacementFilter.scale.y = (e.clientY - window.innerHeight / 2) / 20;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
      background.width = app.screen.width;
      background.height = app.screen.height;
    };
    window.addEventListener("resize", onResize);

    return () => {
      app.destroy(true, { children: true, texture: true, baseTexture: true });
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
};
