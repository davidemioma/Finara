import { AccountProps } from "../types";
import { getRandomHexColor } from "@/lib/utils";
import { Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type configObject = {
  [key: string]: {
    label: string;
    color?: string;
  };
};

const PriceChart = ({ accounts }: { accounts: AccountProps[] }) => {
  const chartData = accounts.map((acc) => ({
    name: acc.name,
    balance: acc.currentBalance,
    fill: getRandomHexColor(),
  }));

  const chartConfig: configObject = {} satisfies ChartConfig;

  for (const data of chartData) {
    if (!chartConfig[data.name]) {
      chartConfig[data.name] = {
        label: data.name,
        color: getRandomHexColor(),
      };
    }
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px] w-full"
    >
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent format />} />

        <Pie
          data={chartData}
          dataKey="balance"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
          activeIndex={0}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <Sector {...props} outerRadius={outerRadius + 10} />
          )}
        />
      </PieChart>
    </ChartContainer>
  );
};

export default PriceChart;
