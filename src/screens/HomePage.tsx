import { useEffect, useState } from "react";
import { SensorData } from "../typings/Sensor";
import { useAxiosWithAuth } from "../hooks/useAxiosWithAuth";



const HomePage = () => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const axios = useAxiosWithAuth();
  useEffect(() => {
    let cancel: number | null = null;
    const d = async () => {
      const { data } = await axios.get("data-report")
      console.log("Got data", data)
      setSensorData(data)
    };
    d()
      .finally(() => {
        console.log("finally -> reexec")
        cancel = setTimeout(d, 1000)
      })
    return () => {
      cancel && clearTimeout(cancel)
    }
  }, []);

  return (<div>
    <div className="simplenav ">
      <div className=" max-width">
        Gas Sensor
      </div>
    </div>

    <div className="max-width padTop">
      <button className="w-max" onClick={() => alert("Coming up soon.")}>Subscribe to notifications</button>
    </div>
    <div className="max-width padnormal">
      Sensors
      <div className="threegrid">
        {
          sensorData && (<>
            <Card data={sensorData.gas1 + ""} title="Gas sensor 1"/>
            <Card data={sensorData.gas2 + ""} title="Gas sensor 2"/>
            <Card data={sensorData.pressure + ""} title="Pressure Sensor"/>
    
          </>)
        }
      </div>
    </div>

    <div className="max-width padnormal">
      Video Stream
      <div style={{
        background: "#333",
        lineHeight: "200px",
        textAlign:"center",
        marginTop: 16,
        borderRadius: 16
      }}>
        Failed to play video: Response failure
      </div>
    </div>



  </div>)
}

export default HomePage;



const Card = ({data, title}: {
  data: string,
  title: string
}) => (<div className="simplecard">
  <div className="big">{data}/1000</div>
  <div>{title}</div>
 
</div>)