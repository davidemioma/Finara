type Props = {
  title: string;
  subtitle: string;
  user?: string;
  type: "title" | "greeting";
};

const Heading = ({ title, subtitle, user, type = "title" }: Props) => {
  return (
    <header className="flex flex-col gap-1">
      <h1 className="text-24 lg:text-30 font-semibold text-gray-900">
        {title}
        {type === "greeting" && user && (
          <span className="text-bankGradient">&nbsp;{user}</span>
        )}
      </h1>

      <p className="text-14 lg:text-16 font-normal text-gray-600">{subtitle}</p>
    </header>
  );
};

export default Heading;
