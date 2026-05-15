import { Metadata } from "next";
import MinesClient from "../MinesClient";

export const metadata: Metadata = {
  title: "Mines Predictor | Wingo Signal",
  description: "Advanced Mines predictor tool for 5x5 grids. Get highly accurate predictions for safe boxes.",
};

export default function MinesPage() {
  return <MinesClient />;
}
