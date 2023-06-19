import dynamic from "next/dynamic";

const ImageEditor=dynamic(
  ()=>import("../components/ImageEditor/ImageMapEditor"), {ssr: false});

export default function Editor() {
  return (
    <ImageEditor />
  );
}
