import type { Metadata } from "next";
import AlphaFlow from "@/components/alpha/AlphaFlow";
import "./alpha.css";
export const metadata: Metadata = {
  title: "Twinnie · Alpha preview",
  robots: { index: false, follow: false },
};
export default function AlphaPage() {
  return <AlphaFlow />;
}
