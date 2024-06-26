import CountUp from "react-countup";

type Props = {
  amount: number;
  prefix: "$" | "£" | "EUR";
  duration?: number;
};

const AnimatedCounter = ({ amount, prefix, duration = 5 }: Props) => {
  return (
    <div className="w-full">
      <CountUp
        decimals={2}
        decimal=","
        prefix={prefix}
        end={amount}
        duration={duration}
      />
    </div>
  );
};

export default AnimatedCounter;
