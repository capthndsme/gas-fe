import { useEffect, useState } from "react";
import { SensorData } from "../typings/Sensor";
import { useAxiosWithAuth } from "../hooks/useAxiosWithAuth";
import { Settings } from "../typings/Vals";

const HomePage = ({ requestPushPermission }: {
  requestPushPermission: () => void
}) => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [humanState, setHumanState] = useState<SensorData | null>(null)
  const axios = useAxiosWithAuth();

  useEffect(() => {
    let cancel: number | null = null;

    const fetchData = async () => {
      try {
        const { data: sensorData } = await axios.get("data-report");
        setSensorData(sensorData);

        const {data: humanData, status} = await axios.get("last-detect")
        if (status === 204) {
 
          setHumanState(null)
        } else {
          setHumanState(humanData)
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

    fetchSettings(); // Fetch settings once

    fetchData(); // Initial fetch
    cancel = setInterval(fetchData, 1000) as unknown as number; // Fetch every second

    return () => {
      clearInterval(cancel); // Clear interval on unmount
    };
  }, []);


  const getLevel = (value: number): string => {
    if (!settings) return "N/A"; // Handle case where settings are not yet loaded

    if (value >= settings.highVal!) return "High";
    if (value >= settings.midVal!) return "Med";
    if (value >= settings.lowVal!) return "Low";  // Assuming lowVal is always defined or has a default
    return "Very low"; // Default to LOW if below all thresholds or settings aren't loaded
  };


  return (
    <div>
      <div className="max-width padTop">
        <center>
          Get alerts when it gets medium and high
        </center>
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
                data={getLevel(sensorData.gas1)}
                title="Gas sensor 1"
                percentage={`${((sensorData.gas1 / 1000) * 100).toFixed(2)}% (${sensorData.gas1} / 1000)`}
              />
              <Card
                data={getLevel(sensorData.gas2)}
                title="Gas sensor 2"
                percentage={`${((sensorData.gas2 / 1000) * 100).toFixed(2)}% (${sensorData.gas2} / 1000)`}
              />
              <Card
                data={getLevel(sensorData.pressure)}
                title="Pressure Sensor"
                percentage={`${((sensorData.pressure / 1000) * 100).toFixed(2)}% (${sensorData.pressure} / 1000)`}
              />
            </>
          )}
          <div className="simplecard">
            <div className="smallcaps">
              Last human detection state
            </div>
            <div className="big">
              {humanState ?
                new Date(humanState.timestamp).toUTCString()
                : "Never detected"
              }
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;



const Card = ({ data, title, percentage }: {
  data: string;
  title: string;
  percentage: string;
}) => (
  <div className="simplecard">
    <div className="smallcaps">{title}</div>
    <div className="big">{data}</div>
    <div className="small">{percentage}</div> {/* Display percentage */}

  </div>
);



