export interface Game {
  id: number;
  name: string;
  image: string;
  color: string;
  slug: string;
  alt: string;
}

export const GAMES: Game[] = [
  { id: 1, name: "Bgd Game", slug: "bgd-game", image: "/duner/bgd_game.png", color: "#bfa43a", alt: "Bgd Game Official Prediction Tool Banner" },
  { id: 2, name: "91Club", slug: "91club", image: "/duner/91club.png", color: "#c60200", alt: "91Club Game Prediction App and AI Signals" },
  { id: 3, name: "Jalwa", slug: "jalwa", image: "/duner/jalwa.png", color: "#34a991", alt: "Jalwa Game Real-time Strategy and Predictions" },
  { id: 4, name: "Tashan Win", slug: "tashan-win", image: "/duner/tashan_win.png", color: "linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)", alt: "Tashan Win Premium Game Predictor Dashboard" },
  { id: 5, name: "Jai Club", slug: "jai-club", image: "/duner/jai_club.png", color: "#703a81", alt: "Jai Club Game Signals and AI Analysis" },
  { id: 6, name: "Yarr Win", slug: "yarr-win", image: "/duner/yarr_win.png", color: "#04a853", alt: "Yarr Win Official Game Prediction Interface" },
  { id: 7, name: "Tiranga", slug: "tiranga", image: "/duner/tiranga.png", color: "#1b6fe0", alt: "Tiranga Game Mod APK and Signal Tool" },
  { id: 8, name: "82 Lottery", slug: "82-lottery", image: "/duner/82_lottery.png", color: "#b40302", alt: "82 Lottery Professional Prediction System" },
  { id: 9, name: "Sikkim", slug: "sikkim", image: "/duner/sikkim.png", color: "#004cd5", alt: "Sikkim Game Real-time Signals and Alerts" },
  { id: 10, name: "Raja Game", slug: "raja-game", image: "/duner/raja_game.png", color: "#9f0402", alt: "Raja Game AI Prediction and Trend Analysis" },
  { id: 11, name: "Goa Game", slug: "goa-game", image: "/duner/goa_game.png", color: "#0210b6", alt: "Goa Game Premium Prediction Tool Banner" },
  { id: 12, name: "Bdg Win", slug: "bdg-win", image: "/duner/bdg_win.png", color: "#0c0b0e", alt: "Bdg Win Game Official Signals and Mods" },
];
