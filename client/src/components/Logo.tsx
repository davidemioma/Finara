const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/icons/logo.svg"
        width={30}
        height={30}
        alt="logo"
        loading="lazy"
      />

      <span className="text-2xl font-bold">Finara</span>
    </div>
  );
};

export default Logo;
