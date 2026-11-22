import type { Metadata } from "next";
import { RoyaleInvitation } from "@/components/sites/royale/invitation";
import "./royale.css";

export const metadata: Metadata = {
  title: "Royale - Wedding Invitation",
};

export default function RoyalePage() {
  return <RoyaleInvitation />;
}
