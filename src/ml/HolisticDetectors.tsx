import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import {
  FACEMESH_TESSELATION,
  FACEMESH_RIGHT_EYE,
  FACEMESH_RIGHT_EYEBROW,
  FACEMESH_RIGHT_IRIS,
  FACEMESH_LEFT_EYE,
  FACEMESH_LEFT_EYEBROW,
  FACEMESH_LEFT_IRIS,
  FACEMESH_FACE_OVAL,
  FACEMESH_LIPS,
  HAND_CONNECTIONS,
  Holistic,
  type Results,
} from "@mediapipe/holistic";
import { useEffect, useRef } from "react";
import { Camera } from "@mediapipe/camera_utils";
import { useGestureStore } from "../stores/GestureStore";
import { classifyGesture } from "../func/gestures";
export default function HolisticDetectors() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const setGesture = useGestureStore((state) => state.setGesture);
  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;
    function onResults(results: Results) {
      const canvasElement = canvasRef.current;
      if (!canvasElement) return;
      const canvasCtx = canvasElement.getContext("2d")!;

      canvasCtx.save();
      canvasCtx.clearRect(
        0,
        0,
        canvasElement.clientWidth,
        canvasElement.clientHeight
      );
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.clientWidth,
        canvasElement.clientHeight
      );
      if (results.faceLandmarks) {
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
          color: "#C0C0C070",
          lineWidth: 1,
        });
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYE, {
          color: "#30FF30",
        });
        drawConnectors(
          canvasCtx,
          results.faceLandmarks,
          FACEMESH_RIGHT_EYEBROW,
          {
            color: "#30FF30",
          }
        );
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_IRIS, {
          color: "#30FF30",
        });
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYE, {
          color: "#30FF30",
        });
        drawConnectors(
          canvasCtx,
          results.faceLandmarks,
          FACEMESH_LEFT_EYEBROW,
          {
            color: "#30FF30",
          }
        );
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_IRIS, {
          color: "#30FF30",
        });
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_FACE_OVAL, {
          color: "#E0E0E0",
        });
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LIPS, {
          color: "#E0E0E0",
        });
      }

      if (results.leftHandLandmarks) {
        drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
          color: "#00FF00",

          lineWidth: 5,
        });
        drawLandmarks(canvasCtx, results.leftHandLandmarks, {
          color: "#00FF",
          lineWidth: 2,
        });
      }

      if (results.rightHandLandmarks) {
        drawConnectors(
          canvasCtx,
          results.rightHandLandmarks,
          HAND_CONNECTIONS,
          {
            color: "#00FF00",
            lineWidth: 5,
          }
        );
        drawLandmarks(canvasCtx, results.rightHandLandmarks, {
          color: "#00FF",
          lineWidth: 2,
        });
      }
      const detectedGesture = classifyGesture(results);
      setGesture(detectedGesture);

      canvasCtx.restore();
    }

    const HandsMesh = new Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      },
    });

    HandsMesh.setOptions({
      modelComplexity: 2,
      smoothLandmarks: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    HandsMesh.onResults(onResults);

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await HandsMesh.send({ image: videoRef.current! });
      },
      width: 640,
      height: 480,
    });
    camera.start();

    return () => {
      camera.stop();
      HandsMesh.close();
    };
  }, [setGesture]);
  return (
    <>
      <video ref={videoRef} className="hidden" />

      <canvas
        ref={canvasRef}
        className="rounded-md shrink-0 scale-x-[-1]"
        width={640}
        height={480}
        style={{ width: "640px", height: "480px" }}
      />
    </>
  );
}
