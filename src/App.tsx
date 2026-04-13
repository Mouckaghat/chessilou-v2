import { Analytics } from "@vercel/analytics/react";
import ChessilouV2 from "./ChessilouV2";

export default function App() {
  return (
    <>
      <ChessilouV2 />
      <Analytics />
    </>
  );
}