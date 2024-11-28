import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Line } from 'recharts';
import { ResponsiveContainer, XAxis, YAxis, LineChart } from 'recharts';

// Define types for the props


const salesData = [
    { month: "Jan", value: 200 },
    { month: "Feb", value: 250 },
    { month: "Mar", value: 300 },
    { month: "Apr", value: 400 },
    { month: "May", value: 500 },
    { month: "Jun", value: 450 },
    { month: "Jul", value: 400 },
    { month: "Aug", value: 350 },
    { month: "Sep", value: 300 },
    { month: "Oct", value: 400 },
    { month: "Nov", value: 450 },
    { month: "Dec", value: 500 },
  ]
const Chart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            sales: {
              label: "Sales",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-sales)"
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

export default Chart;
