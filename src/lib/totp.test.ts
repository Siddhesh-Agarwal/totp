import * as OTPAuth from "otpauth";
import { describe, expect, it } from "vitest";
import {
  type Algorithm,
  DEFAULT_OPTIONS,
  formatCode,
  generateCode,
  getCounter,
  getRemainingMs,
  normalizeSecret,
} from "./totp";

const seedFor: Record<Algorithm, string> = {
  SHA1: "12345678901234567890",
  SHA256: "12345678901234567890123456789012",
  SHA512: "1234567890123456789012345678901234567890123456789012345678901234",
};

const base32For = (seed: string) => OTPAuth.Secret.fromUTF8(seed).base32;

const vectors: Array<
  [timestamp: number, sha1: string, sha256: string, sha512: string]
> = [
  [59, "94287082", "46119246", "90693936"],
  [1111111109, "07081804", "68084774", "25091201"],
  [1111111111, "14050471", "67062674", "99943326"],
  [1234567890, "89005924", "91819424", "93441116"],
  [2000000000, "69279037", "90698825", "38618901"],
  [20000000000, "65353130", "77737706", "47863826"],
];

describe("normalizeSecret", () => {
  it("treats an empty or whitespace-only input as an idle state", () => {
    expect(normalizeSecret("")).toEqual({ normalized: null, error: null });
    expect(normalizeSecret("   ")).toEqual({ normalized: null, error: null });
  });

  it("normalizes lowercase, whitespace, hyphens, and padding", () => {
    expect(normalizeSecret("  jbsw y3dp-ehpk 3pxp==== ")).toEqual({
      normalized: "JBSWY3DPEHPK3PXP",
      error: null,
    });
  });

  it("rejects characters outside the Base32 alphabet", () => {
    const result = normalizeSecret("JBSWY3DP!");
    expect(result.normalized).toBeNull();
    expect(result.error).toMatch(/Base32/i);
  });

  it("rejects non-ASCII characters that uppercase to Base32 letters", () => {
    const result = normalizeSecret("JBSWY3DPſ");
    expect(result.normalized).toBeNull();
    expect(result.error).toMatch(/Base32/i);
  });
});

describe("time math", () => {
  it("computes the time-step counter at 30 and 60 second boundaries", () => {
    expect(getCounter(59_999, 30)).toBe(1);
    expect(getCounter(60_000, 30)).toBe(2);
    expect(getCounter(59_999, 60)).toBe(0);
    expect(getCounter(60_000, 60)).toBe(1);
  });

  it("computes remaining milliseconds without hitting zero at a boundary", () => {
    expect(getRemainingMs(59_000, 30)).toBe(1_000);
    expect(getRemainingMs(60_000, 30)).toBe(30_000);
    expect(getRemainingMs(60_000, 60)).toBe(60_000);
  });
});

describe("formatCode", () => {
  it("splits digit groups without changing the code", () => {
    expect(formatCode("123456")).toBe("123 456");
    expect(formatCode("1234567")).toBe("123 4567");
    expect(formatCode("12345678")).toBe("1234 5678");
  });
});

describe("generateCode RFC 6238 known answers", () => {
  for (const [timestamp, sha1, sha256, sha512] of vectors) {
    it(`matches the published vectors at t=${timestamp}`, () => {
      expect(
        generateCode(
          base32For(seedFor.SHA1),
          { ...DEFAULT_OPTIONS, digits: 8 },
          timestamp * 1000,
        ),
      ).toBe(sha1);
      expect(
        generateCode(
          base32For(seedFor.SHA256),
          { ...DEFAULT_OPTIONS, digits: 8, algorithm: "SHA256" },
          timestamp * 1000,
        ),
      ).toBe(sha256);
      expect(
        generateCode(
          base32For(seedFor.SHA512),
          { ...DEFAULT_OPTIONS, digits: 8, algorithm: "SHA512" },
          timestamp * 1000,
        ),
      ).toBe(sha512);
    });
  }
});

describe("generateCode period wiring", () => {
  it("uses the 60-second counter instead of the 30-second counter", () => {
    const options = {
      ...DEFAULT_OPTIONS,
      digits: 8 as const,
      period: 60 as const,
    };

    expect(generateCode(base32For(seedFor.SHA1), options, 30_000)).toBe(
      "84755224",
    );
    expect(generateCode(base32For(seedFor.SHA1), options, 45_000)).toBe(
      "84755224",
    );
    expect(generateCode(base32For(seedFor.SHA1), options, 60_000)).toBe(
      "94287082",
    );
    expect(
      generateCode(base32For(seedFor.SHA1), { ...options, period: 30 }, 30_000),
    ).toBe("94287082");
  });
});

describe("generateCode digit lengths", () => {
  it.each([
    [6, "081804"],
    [7, "7081804"],
    [8, "07081804"],
  ] as const)(
    "generates %i digits with leading zeroes preserved",
    (digits, expected) => {
      const code = generateCode(
        base32For(seedFor.SHA1),
        { ...DEFAULT_OPTIONS, digits },
        1_111_111_109_000,
      );
      expect(code).toBe(expected);
      expect(code).toHaveLength(digits);
    },
  );
});
