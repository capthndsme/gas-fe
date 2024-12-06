import { useEffect, useState } from "react";
import { SensorData } from "../typings/Sensor";
import { useAxiosWithAuth } from "../hooks/useAxiosWithAuth";
import { Settings } from "../typings/Vals";
import Gauge from "../Gauge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DateTime } from "luxon";

const HomePage = ({ requestPushPermission }: {
  requestPushPermission: () => void
}) => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [historyData, setHistoryData] = useState<SensorData[]>([]); // New state for history
  const [settings, setSettings] = useState<Settings | null>(null);
  const [humanState, setHumanState] = useState<SensorData | null>(null);
  const axios = useAxiosWithAuth();

  useEffect(() => {
    let cancel: number | null = null;
    let historyCancel: number | null = null;

    const fetchData = async () => {
      try {
        const { data: sensorData } = await axios.get("data-report");
        setSensorData(sensorData);

        const { data: humanData, status } = await axios.get("last-detect");
        if (status === 204) {
          setHumanState(null);
        } else {
          setHumanState(humanData);
        }
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    const fetchSettings = async () => {
      try {
        const { data: settingsData } = await axios.get("settings");
        setSettings(settingsData);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    const fetchHistory = async () => {
      try {
        const { data: historyData }: { data: SensorData[] } = await axios.get("history");
        // make data last 1000 p
        setHistoryData(historyData.reverse());
      } catch (error) {
        console.error("Error fetching history data:", error);
      }
    };

    fetchSettings();
    fetchData();
    fetchHistory();
    cancel = setInterval(fetchData, 1600) as unknown as number;
    historyCancel = setInterval(fetchHistory, 60000 * 10) as unknown as number; // Fetch history every 10 minute

    return () => {
      clearInterval(cancel);
      clearInterval(historyCancel);
    };
  }, []);

 

  return (
    <div>
      <div className="max-width padTop">
        <center>Get alerts when it gets medium and high</center>
        <button className="w-max" onClick={() => requestPushPermission()}>
          Subscribe to notifications
        </button>
      </div>
      <div className="max-width padnormal">
        Sensors
        <div className="threegrid">
          {sensorData && settings && (
            <>
              <Card
                data={sensorData.gas1}
                title="MQ-2"
                percentage={`${((sensorData.gas1 / 1000) * 100).toFixed(2)}% (${sensorData.gas1} / 1000)`}
                mid={settings.midVal ?? 500}
                high={settings.highVal ?? 900}
              />
              <Card
                data={sensorData.gas2}
                title="MQ-135"
                mid={settings.midVal ?? 500}
                high={settings.highVal ?? 900}
                percentage={`${((sensorData.gas2 / 1000) * 100).toFixed(2)}% (${sensorData.gas2} / 1000)`}
              />
              <Card
                data={sensorData.pressure}
                title="Pressure Sensor"
                percentage={`${((sensorData.pressure / 1000) * 100).toFixed(2)}% (${sensorData.pressure} / 1000)`}
                mid={settings.midVal ?? 500}
                high={settings.highVal ?? 900}
              />
            </>
          )}
          <div
            className="simplecard"
            style={{
              background: sensorData?.humanDetected ? "#FFAA00" : undefined,
              color: sensorData?.humanDetected ? "black" : undefined,
            }}
          >
            <div className="smallcaps">Last human detection state</div>
            <div className="big">
              {humanState
                ? new Date(humanState.createdAt).toLocaleString()
                : "Never detected"}
              <br />
            </div>
            <div className="smallcaps" style={{ paddingTop: 16 }}>
              CURRENT HUMAN DETECTION
            </div>
            <div className="big">
              {sensorData?.humanDetected ? "Detected" : "Not detected"}
            </div>
          </div>
        </div>
              {/* Chart Section */}


              <div className="chart-container">
        <h3>Sensor History (Last 7 Days, 5-minute averages)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={historyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="1 4" />
            <XAxis
              dataKey="createdAt"
              tickFormatter={formatChartDate} // Format X-axis ticks
              interval="preserveStartEnd"
              tickCount={10} // Adjust tick count as needed
            />
            <YAxis />
            <Tooltip
            
              formatter={(value, name) => {
                if (name === "createdAt") {
                  return formatDate(value as any);
                }
                return [value, name];
              }}
              labelFormatter={(value) => formatDate(value)}
            />
            John <Legend />
            <Line
              type="monotone"
              dataKey="pressure"
              stroke="#8884d8"
              dot={false} // Remove dots
            />
            <Line type="monotone" dataKey="gas1" stroke="#82ca9d" dot={false} />
            <Line type="monotone" dataKey="gas2" stroke="#ffc658" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      </div>
  
    </div>
  );
};

export default HomePage;

const Card = ({ data, title, percentage, mid, high }: {
  data: number;
  title: string;
  percentage: string;
  mid: number;
  high: number;
}) => (
  <div className="simplecard">
    <div className="smallcaps">{title}</div>
    <Gauge value={data} mid={mid} high={high} />
    <div className="small">{percentage}</div>
  </div>
);

const formatDate = (dateString:string) => {
  const dt = DateTime.fromISO(dateString);
  return dt.toLocaleString(DateTime.DATETIME_SHORT);
};

const formatChartDate = (tickItem:string) => {
  // Group dates into significant intervals (e.g., 4-hour intervals):
  const dt = DateTime.fromISO(tickItem);
  const hour = dt.hour;
  let intervalStart = 0;

  if (hour >= 0 && hour < 4) {
    intervalStart = 0;
  } else if (hour >= 4 && hour < 8) {
    intervalStart = 4;
  } else if (hour >= 8 && hour < 12) {
    intervalStart = 8;
  } else if (hour >= 12 && hour < 16) {
    intervalStart = 12;
  } else if (hour >= 16 && hour < 20) {
    intervalStart = 16;
  } else {
    intervalStart = 20;
  }

  return `${dt.toLocaleString(DateTime.DATE_SHORT)} ${intervalStart}:00`;
};
