import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const InfoPage = () => {
  const [cod, setCod] = useState("");
  const [online, setOnline] = useState("");
  const [data, setData] = useState([]);

  async function fetchStats() {
    try {
      const { data } = await axios.get(`${server}/api/stats`, {
        withCredentials: true
      });

      setCod(data.cod);
      setOnline(data.online);
      setData(data.data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  const paymentData = [
    { method: "online", users: online, fill: "#03bafc" },
    { method: "cod", users: cod, fill: "#8c1251" },
  ];

  const paymentChartConfig = {
    users: {
      label: "Users",
    },
    online: {
      label: "Online",
      color: "hls(var(--chart1))",
    },
    cod: {
      label: "COD",
      color: "hls(var(--chart2))",
    },
  };

  const paymentPercentage = paymentData.map((data) => ({
    ...data,
    percentage: parseFloat(((data.users / (cod + online)) * 100).toFixed(2)),
  }));

  return (
    <div className="w-full h-full overflow-auto">
      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 max-w-full">
        {/* Payment Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Payment Methods Pie Chart */}
          <Card className="flex flex-col w-full">
            <CardHeader className="items-center pb-2 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl text-center">
                Payment Methods
              </CardTitle>
              <CardDescription className="text-sm text-center">
                Payment Breakdown
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-2 sm:pb-4">
              <ChartContainer
                config={paymentChartConfig}
                className="mx-auto aspect-square max-h-[200px] sm:max-h-[250px] w-full"
              >
                <PieChart width="100%" height="100%">
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={paymentData}
                    dataKey={"users"}
                    nameKey={"method"}
                    innerRadius={50}
                    outerRadius={80}
                    strokeWidth={3}
                    cx="50%"
                    cy="50%"
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline={"middle"}
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-muted-foreground text-sm sm:text-lg font-bold"
                              >
                                {cod + online} Users
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-xs sm:text-sm pt-0">
              <div className="leading-none text-muted-foreground text-center">
                Showing total users for payment methods
              </div>
            </CardFooter>
          </Card>

          {/* Payment Percentage Pie Chart */}
          <Card className="flex flex-col w-full">
            <CardHeader className="items-center pb-2 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl text-center">
                Payment Percentage
              </CardTitle>
              <CardDescription className="text-sm text-center">
                Payment Breakdown
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-2 sm:pb-4">
              <ChartContainer
                config={paymentChartConfig}
                className="mx-auto aspect-square max-h-[200px] sm:max-h-[250px] w-full"
              >
                <PieChart width="100%" height="100%">
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={paymentPercentage}
                    dataKey={"percentage"}
                    nameKey={"method"}
                    innerRadius={50}
                    outerRadius={80}
                    strokeWidth={3}
                    cx="50%"
                    cy="50%"
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline={"middle"}
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-muted-foreground text-sm sm:text-lg font-bold"
                              >
                                100%
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-xs sm:text-sm pt-0">
              <div className="leading-none text-muted-foreground text-center">
                Displaying percentage distribution of payment methods
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Products Sold Bar Chart - Full Width */}
        <Card className="w-full">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">
              Products Sold
            </CardTitle>
            <CardDescription className="text-sm">
              Units Sold for each product
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 sm:p-6">
            <div className="w-full h-[300px] sm:h-[400px] lg:h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{
                    top: 20,
                    right: 10,
                    left: 10,
                    bottom: 60
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="name.en"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{
                      fontSize: 12,
                      fill: 'currentColor'
                    }}
                    tickFormatter={(value) => {
                      // Truncate long product names for better display
                      return value && value.length > 15 ? `${value.substring(0, 15)}...` : value;
                    }}
                  />
                  <YAxis
                    tick={{
                      fontSize: 12,
                      fill: 'currentColor'
                    }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.1)" }}
                    content={({ payload, label }) => {
                      if (payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-sm max-w-[200px]">
                            <div className="font-semibold truncate" title={data.name?.en}>
                              {data.name?.en}
                            </div>
                            <div className="text-muted-foreground mt-1">
                              Units Sold: <span className="font-medium text-foreground">{data.sold}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="sold"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    className="transition-all duration-200 hover:opacity-80"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2 text-xs sm:text-sm pt-2">
            <div className="leading-none text-muted-foreground text-center">
              Hover over a bar to see the product details
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default InfoPage;