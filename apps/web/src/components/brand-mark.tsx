import Image from "next/image";

export function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <Image
      src="/brand/logo-preto-dourado.png"
      alt="Clube das Musas"
      width={size}
      height={size}
      className="rounded-full"
      style={{ width: size, height: size }}
    />
  );
}
