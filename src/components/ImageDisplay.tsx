import { useGestureStore } from "../stores/GestureStore";
import { gestureToImage } from "../func/gestures";

export default function ImageDisplay() {
  const currentGesture = useGestureStore((state) => state.currentGesture);

  const imageSrc = currentGesture
    ? gestureToImage[currentGesture]
    : "/MonkeyFacer/images/ahhh.png";
  return (
    <div className="w-[640px] h-[480px] shrink-0">
      <img
        src={imageSrc}
        alt="Gesture Representation"
        className="w-full h-full object-cover rounded-md"
      />
    </div>
  );
}
