import ImageDisplay from "./components/ImageDisplay";
import HolisticDetectors from "./ml/HolisticDetectors";

export default function App() {
  return (
    <div className="flex flex-col justify-center items-center gap-6 h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800">
        Make by{" "}
        <a
          href="https://github.com/Raulmora22"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black-600 hover:text-black-800 underline"
        >
          Raul Mora
        </a>{" "}
        with love ❤️
      </h1>
      <div className="flex justify-center items-center gap-3">
        <HolisticDetectors />
        <ImageDisplay />
      </div>
    </div>
  );
}
