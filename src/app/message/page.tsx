import { notFound } from "next/navigation";
import MessageTwinnie from "@/components/signup/MessageTwinnie";

export const metadata = { title: "Message Twinnie" };

export default function MessagePage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <MessageTwinnie />;
}
