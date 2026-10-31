import { useThree } from "@react-three/fiber";
import React, { useLayoutEffect, useMemo } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { CameraMovement } from "../schemas/storyboard";

export interface CameraWaypoint {
  fromFrame: number;
  toFrame: number;
  startPos: [number, number, number];
  endPos: [number, number, number];
  startLookAt: [number, number, number];
  endLookAt: [number, number, number];
  movement?: CameraMovement;
  fov?: number;
  easing?: (t: number) => number;
}

function lerpVec3(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

export const CinematicCameraDirector: React.FC<{
  waypoints: CameraWaypoint[];
  fallbackPos?: [number, number, number];
  fallbackLookAt?: [number, number, number];
}> = ({
  waypoints,
  fallbackPos = [0, 0, 5],
  fallbackLookAt = [0, 0, 0],
}) => {
  const frame = useCurrentFrame();
  const { camera } = useThree();

  const state = useMemo(() => {
    // Find active waypoint
    const active = waypoints.find(
      (w) => frame >= w.fromFrame && frame < w.toFrame
    );

    if (!active) {
      // Find latest passed or first
      const past = waypoints.filter((w) => frame >= w.toFrame);
      if (past.length > 0) {
        const last = past[past.length - 1];
        return {
          pos: last.endPos,
          lookAt: last.endLookAt,
          fov: last.fov || 45,
        };
      }
      return {
        pos: fallbackPos,
        lookAt: fallbackLookAt,
        fov: 45,
      };
    }

    const defaultEasing = Easing.bezier(0.25, 1, 0.5, 1);
    const easeFn = active.easing || defaultEasing;

    const progress = interpolate(
      frame,
      [active.fromFrame, active.toFrame],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeFn,
      }
    );

    const pos = lerpVec3(active.startPos, active.endPos, progress);
    const lookAt = lerpVec3(active.startLookAt, active.endLookAt, progress);

    return {
      pos,
      lookAt,
      fov: active.fov || 45,
    };
  }, [frame, waypoints, fallbackPos, fallbackLookAt]);

  useLayoutEffect(() => {
    camera.position.set(state.pos[0], state.pos[1], state.pos[2]);
    camera.lookAt(new THREE.Vector3(state.lookAt[0], state.lookAt[1], state.lookAt[2]));
    if ("fov" in camera && typeof camera.fov === "number" && camera.fov !== state.fov) {
      camera.fov = state.fov;
      camera.updateProjectionMatrix();
    }
  }, [camera, state]);

  return null;
};

