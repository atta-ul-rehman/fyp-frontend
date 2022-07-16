import React from "react";
import { MotiView } from "@motify/components";
export default function Loading({ size }) {
  return (
    <MotiView
      from={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: -2,
      }}
      animate={{
        width: size + 20,
        height: size + 20,
        borderRadius: (size + 20) / 2,
        borderWidth: size / 10,
      }}
      transition={{ type: "timing", duration: 500, loop: true }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: size / 10,
        borderColor: "black",
      }}
    />
  );
}
