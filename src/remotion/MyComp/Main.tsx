import {
  AbsoluteFill,
  Sequence,
  useVideoConfig
} from "remotion";
import { z } from "zod";
import { CompositionProps } from "../../../types/constants";
import { SceneItem } from "./SceneItem";

export const Main = ({ scenes = [] }: z.infer<typeof CompositionProps>) => {
  const { } = useVideoConfig();

  let currentFrame = 0;

  // If no scenes, show a placeholder content
  if (scenes.length === 0) {
    return (
      <AbsoluteFill className="bg-black items-center justify-center">
        <h1 className="text-white text-4xl font-bold">Initialising Asset Orchestration...</h1>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill className="bg-black">
      {scenes.map((scene, index) => {
        const startFrame = currentFrame;
        const duration = scene.durationFrames || 90;
        currentFrame += duration;

        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={duration}
            layout="none"
          >
            <SceneItem
              script={scene.script}
              assetUrl={scene.assetUrl}
              type={scene.type}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
