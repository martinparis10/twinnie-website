import { notFound } from "next/navigation";
import PhoneSignIn from "@/components/signup/PhoneSignIn";

export const metadata = { title: "Sign in to Twinnie" };

export default function SignInPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <PhoneSignIn />;
}
