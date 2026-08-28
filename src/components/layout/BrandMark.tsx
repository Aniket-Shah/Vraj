import Image from "next/image";

/**
 * Official V/C monogram with flute baseline and peacock feather. The artwork is white
 * line-work on black, so it sits on a black tile — a light tile shows the logo's own
 * dark ground as a box inside it.
 */
export function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <Image
      src="/logo.png"
      alt="Vraj Chem Impex LLP logo"
      width={size}
      height={size}
      priority
      className="rounded bg-black object-contain"
      style={{ width: size, height: size }}
    />
  );
}
