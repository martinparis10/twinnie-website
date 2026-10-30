import SignupHome from "@/components/signup/SignupHome";
import WaitlistHome from "@/components/WaitlistHome";

export const metadata = process.env.NODE_ENV === "development" ? { title: "Twinnie — Your personal shopper" } : {};

export default function Home() {
  // Keep the simulated flow local until real verification is connected.
  return process.env.NODE_ENV === "development" ? <SignupHome /> : <WaitlistHome />;
}
