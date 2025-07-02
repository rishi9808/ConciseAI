import BgGradient from "@/components/common/BgGradient";
import { SignIn } from "@clerk/nextjs";
import React from "react";

export default function page() {
  return (
    <div>
      <BgGradient />
      <SignIn />
    </div>
  );
}
