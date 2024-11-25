import { useEffect, useState } from "react";
import { SensorData } from "../typings/Sensor";
import { useAxiosWithAuth } from "../hooks/useAxiosWithAuth";
import { Settings } from "../typings/Vals";
import Gauge from "../Gauge";

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
    cancel = setInterval(fetchData, 1600) as unknown as number; // Fetch every second ish

    return () => {
      clearInterval(cancel); // Clear interval on unmount
    };
  }, []);

 


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
                data={sensorData.gas1}
                title="MQ-135"
                percentage={`${((sensorData.gas1 / 1000) * 100).toFixed(2)}% (${sensorData.gas1} / 1000)`}
      
                mid={settings.midVal ?? 500}
                high={settings.highVal ?? 900}
              />
              <Card
                data={sensorData.gas2}
                title="MQ-2"
           
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
          <div className="simplecard" style={{
            background: sensorData?.humanDetected?"#FFAA00":undefined,
            color: sensorData?.humanDetected?"black":undefined,
          }}>
            <div className="smallcaps">
              Last human detection state
            </div>
            <div className="big">
              {humanState ?
                new Date(humanState.createdAt).toLocaleString()
                : "Never detected"
              }
              <br/>
           
            </div>
            <div className="smallcaps" style={{paddingTop:16}}>
              CURRENT HUMAN DETECTION
            </div>
            <div className="big">
              {sensorData?.humanDetected ? "Detected" : "Not detected"}
            </div>
          </div>
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
    
     <Gauge value={data}  mid={mid} high={high} /> {/* Render the Gauge */}
    <div className="small">{percentage}</div> {/* Display percentage */}

  </div>
);



