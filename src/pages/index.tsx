import dynamic from "next/dynamic";

const ImageEditor=dynamic(
  ()=>import("../legacy-editor/ImageEditor/ImageMapEditor"), {ssr: false});

export default function Editor() {
  return (
    <ImageEditor />
  );
}
