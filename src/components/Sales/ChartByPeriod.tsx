import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectItem } from "@radix-ui/react-select";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
const dailySalesData = [
  { date: "Jan 1", value: 35000 },
  { date: "Jan 4", value: 38000 },
  { date: "Jan 7", value: 32000 },
  { date: "Jan 10", value: 34000 },
  { date: "Jan 13", value: 36000 },
  { date: "Jan 16", value: 35000 },
  { date: "Jan 19", value: 34000 },
  { date: "Jan 22", value: 33000 },
  { date: "Jan 25", value: 35000 },
  { date: "Jan 28", value: 32000 },
];
const ChartByPeriod = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Sales</CardTitle>
        <Select defaultValue="daily">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily Sales</SelectItem>
            <SelectItem value="weekly">Weekly Sales</SelectItem>
            <SelectItem value="monthly">Monthly Sales</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            daily: {
              label: "Daily Sales",
              color: "hsl(var(--chart-2))",
            },
          }}
          className=" w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailySalesData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-daily)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartByPeriod;
