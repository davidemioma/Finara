import { Link } from "@tanstack/react-router";

type Props = {
  size?: "sm" | "lg";
};

const Logo = ({ size = "sm" }: Props) => {
  return (
    <Link to="/">
      <div className="flex items-center gap-2">
        <img
          src="/icons/logo.svg"
          width={size === "sm" ? 30 : 32}
          height={size === "sm" ? 30 : 32}
          alt="logo"
          loading="lazy"
        />

        <span className="text-2xl font-bold">Finara</span>
      </div>
    </Link>
  );
};

export default Logo;
