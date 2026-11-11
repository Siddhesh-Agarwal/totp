import { useEffect, useState } from "react";
import { type ClockState, computeClock } from "../lib/clock";
import type { TotpOptions } from "../lib/totp";

export function useTotpClock(
  secret: string | null,
  options: TotpOptions,
): ClockState {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const update = () => setNow(Date.now());
    const interval = window.setInterval(update, 250);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        update();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return computeClock(secret, options, now);
}
