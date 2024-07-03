type Props = {
  title: string;
  subtitle: string;
  user?: string;
  type: "title" | "greeting";
};

const Heading = ({ title, subtitle, user, type = "title" }: Props) => {
  return (
    <header className="flex flex-col gap-1">
      <h1 className="text-xl font-semibold text-gray-900 sm:text-[24px] lg:text-[30px]">
        {title}
        {type === "greeting" && user && (
          <span className="text-bankGradient">&nbsp;{user}</span>
        )}
      </h1>

      <p className="text-[14px] font-normal leading-4 text-gray-600 lg:text-[16px] lg:leading-5">
        {subtitle}
      </p>
    </header>
  );
};

export default Heading;
