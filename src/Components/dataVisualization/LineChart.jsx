import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { mockDataLineChart as data } from "../Data/mockData";

/* Line Chart Representation */
const LineChart = () => {
  const theme = useTheme();
  const colours = tokens(theme.palette.mode);

  return (
    <ResponsiveLine
      data={data}
      /* Set Style*/
      colors={{ scheme: "nivo" }}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colours.grey[100],
            },
          },
          legend: {
            text: {
              fill: colours.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colours.redAccent[100],
              strokeWidth: 1,
            },
            text: {
              fill: colours.redAccent[100],
            },
          },
        },
        legends: {
          text: {
            fill: colours.redAccent[100],
          },
        },
        tooltip: {
          container: {
            color: colours.primary[500],
          },
        },
      }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Number of Hackathon Created",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;
