import { z } from "zod";

export const COMP_NAME = "MyComp";

export const SceneSchema = z.object({
  type: z.string(),
  script: z.string(),
  assetUrl: z.string().optional(),
  durationFrames: z.number(),
});

export const CompositionProps = z.object({
  title: z.string(),
  scenes: z.array(SceneSchema).optional(),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  title: "AutoStream Marketing // Autonomous Campaign",
  scenes: [
    {
      type: "Intro",
      script: "STOP MANUAL CONTENT CREATION",
      durationFrames: 60,
      assetUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1280&h=720"
    },
    {
      type: "Problem",
      script: "SCALING AD CONTENT IS SLOW AND COSTLY",
      durationFrames: 70,
      assetUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1280&h=720"
    },
    {
      type: "Solution",
      script: "INTRODUCING AUTOSTREAM AGENTIC ORCHESTRA",
      durationFrames: 80,
      assetUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1280&h=720"
    },
    {
      type: "Visual",
      script: "8K CINEMATIC ASSETS GENERATED IN SECONDS",
      durationFrames: 70,
      assetUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1280&h=720"
    },
    {
      type: "Outro",
      script: "VISUALISE YOUR VALUE PROP // GREEN LIGHT NOW",
      durationFrames: 60,
      assetUrl: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1280&h=720"
    }
  ]
};

export const DURATION_IN_FRAMES = 300; // Default, will be overridden by storyboard length
export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;
export const VIDEO_FPS = 30;

// Disaster Recovery Platform - 20 sec video (600 frames at 30fps)
// Note: assetUrl removed - uses built-in gradient backgrounds for network-independent rendering
export const disasterRecoveryProps: z.infer<typeof CompositionProps> = {
  title: "Disaster Recovery Platform // AI-Powered Claims",
  scenes: [
    {
      type: "Intro",
      script: "DISASTER STRIKES // WHAT HAPPENS NEXT?",
      durationFrames: 90
    },
    {
      type: "Problem",
      script: "CLAIMS PROCESSING TAKES WEEKS // NOT ANYMORE",
      durationFrames: 100
    },
    {
      type: "Solution",
      script: "AI-POWERED CLAIM PROCESSING // INSTANT ASSESSMENT",
      durationFrames: 110
    },
    {
      type: "Feature",
      script: "SMART CONTRACTOR MATCHING // REAL-TIME TRACKING",
      durationFrames: 100
    },
    {
      type: "Tech",
      script: "NEXT.JS // FASTAPI // SUPABASE",
      durationFrames: 90
    },
    {
      type: "Outro",
      script: "BUILT FOR AUSTRALIA // HOMEOWNERS • CONTRACTORS • INSURERS",
      durationFrames: 110
    }
  ]
};

// NRPG Platform Features - 19 sec video (570 frames at 30fps)
// Note: assetUrl removed - uses built-in gradient backgrounds for network-independent rendering
export const nrpgPlatformProps: z.infer<typeof CompositionProps> = {
  title: "NRPG Platform // Enterprise Features",
  scenes: [
    {
      type: "Intro",
      script: "NRPG PLATFORM // ENTERPRISE GRADE FEATURES",
      durationFrames: 85
    },
    {
      type: "Feature",
      script: "AWS S3 FILE STORAGE // SECURE & SCALABLE",
      durationFrames: 100
    },
    {
      type: "Realtime",
      script: "REAL-TIME WEBSOCKET UPDATES // INSTANT SYNC",
      durationFrames: 100
    },
    {
      type: "Dashboard",
      script: "CONTRACTOR DASHBOARD // TRACK EARNINGS & JOBS",
      durationFrames: 95
    },
    {
      type: "Notifications",
      script: "EMAIL NOTIFICATIONS // STAY INFORMED 24/7",
      durationFrames: 95
    },
    {
      type: "Outro",
      script: "NRPG // POWERING THE FUTURE OF RECOVERY",
      durationFrames: 95
    }
  ]
};
