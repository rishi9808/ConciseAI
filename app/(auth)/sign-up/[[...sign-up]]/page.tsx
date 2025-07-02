import BgGradient from "@/components/common/BgGradient";
import { SignUp } from "@clerk/nextjs";
import React from "react";

export default function page() {
  return (
    <div>
      <BgGradient />
      <SignUp />
    </div>
  );
}
