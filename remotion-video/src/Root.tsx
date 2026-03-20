import React from 'react';
import { Composition, Sequence, Audio, staticFile } from 'remotion';

import { IntroScene } from './scenes/IntroScene';
import { AboutScene } from './scenes/AboutScene';
import { ServicesScene } from './scenes/ServicesScene';
import { ProcessScene } from './scenes/ProcessScene';
import { ExperienceScene } from './scenes/ExperienceScene';
import { SkillsScene } from './scenes/SkillsScene';
import { ProjectsScene } from './scenes/ProjectsScene';
import { AchievementsScene } from './scenes/AchievementsScene';
import { TestimonialsScene } from './scenes/TestimonialsScene';
import { ContactScene } from './scenes/ContactScene';
import { OutroScene } from './scenes/OutroScene';

// ── Scene timing config (frames @ 30fps) ──
// Durations are set to match actual audio file lengths (ceiled to next second)
const FPS = 30;
const SCENES = [
  { id: 'intro',         Component: IntroScene,         duration: 240,  audio: 'audio/Scene1.mp3'  },  // 8s   (audio: 7.2s)
  { id: 'about',         Component: AboutScene,          duration: 360,  audio: 'audio/Scene2.mp3'  },  // 12s  (audio: 11.6s)
  { id: 'services',      Component: ServicesScene,       duration: 270,  audio: 'audio/Scene3.mp3'  },  // 9s   (audio: 8.4s)
  { id: 'process',       Component: ProcessScene,        duration: 360,  audio: 'audio/Scene4.mp3'  },  // 12s  (audio: 11.4s)
  { id: 'experience',    Component: ExperienceScene,     duration: 450,  audio: 'audio/Scene5.mp3'  },  // 15s  (audio: 13.7s)
  { id: 'skills',        Component: SkillsScene,         duration: 510,  audio: 'audio/Scene6.mp3'  },  // 17s  (audio: 16.5s)
  { id: 'projects',      Component: ProjectsScene,       duration: 720,  audio: 'audio/Scene7.mp3'  },  // 24s  (audio: 22.9s)
  { id: 'achievements',  Component: AchievementsScene,   duration: 390,  audio: 'audio/Scene8.mp3'  },  // 13s  (audio: 12.0s)
  { id: 'testimonials',  Component: TestimonialsScene,   duration: 210,  audio: 'audio/Scene9.mp3'  },  // 7s   (audio: 6.2s)
  { id: 'contact',       Component: ContactScene,        duration: 150,  audio: 'audio/Scene10.mp3' },  // 5s   (audio: 4.4s)
  { id: 'outro',         Component: OutroScene,          duration: 180                              },  // 6s   (no audio)
];                                                                         // Total: 128s

const TOTAL_FRAMES = SCENES.reduce((sum, s) => sum + s.duration, 0);

/**
 * SafeAudio: gracefully handles missing audio files.
 */
const SafeAudio: React.FC<{ src: string; volume?: number }> = ({ src, volume = 1 }) => {
  try {
    const url = staticFile(src);
    return <Audio src={url} volume={volume} />;
  } catch {
    return null;
  }
};

// Full composition
const PortfolioVideoComposition: React.FC = () => {
  let offset = 0;
  return (
    <>
      {/* Background music — 15% volume so voiceover is dominant */}
      <SafeAudio src="audio/bgm.mp3" volume={0.15} />

      {SCENES.map((scene) => {
        const from = offset;
        offset += scene.duration;
        return (
          <Sequence key={scene.id} from={from} durationInFrames={scene.duration} name={scene.id}>
            <scene.Component />
            {/* Per-scene voiceover */}
            {scene.audio && <SafeAudio src={scene.audio} />}
          </Sequence>
        );
      })}
    </>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Full video composition */}
      <Composition
        id="PortfolioVideo"
        component={PortfolioVideoComposition}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* Individual scene previews */}
      {SCENES.map((scene) => (
        <Composition
          key={scene.id}
          id={scene.id}
          component={scene.Component}
          durationInFrames={scene.duration}
          fps={FPS}
          width={1920}
          height={1080}
        />
      ))}
    </>
  );
};
