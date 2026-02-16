import React, { useCallback, useMemo } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export const GoldenParticles = ({ enabled = false }) => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const options = useMemo(() => ({
    fullScreen: { enable: false },
    fpsLimit: 60,
    particles: {
      color: {
        value: ["#FFD700", "#FFA500", "#FF8C00"]
      },
      links: {
        enable: false
      },
      move: {
        enable: true,
        direction: "none",
        outModes: {
          default: "out"
        },
        random: true,
        speed: 1,
        straight: false
      },
      number: {
        value: 50,
        density: {
          enable: true,
          area: 800
        }
      },
      opacity: {
        value: { min: 0.3, max: 0.8 },
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.1,
          sync: false
        }
      },
      shape: {
        type: "circle"
      },
      size: {
        value: { min: 1, max: 4 },
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.5,
          sync: false
        }
      },
      twinkle: {
        particles: {
          enable: true,
          color: "#FFD700",
          frequency: 0.1,
          opacity: 1
        }
      }
    },
    detectRetina: true
  }), []);

  if (!enabled) return null;

  return (
    <Particles
      id="golden-particles"
      init={particlesInit}
      options={options}
      className="absolute inset-0 pointer-events-none"
      data-testid="golden-particles"
    />
  );
};

export default GoldenParticles;
