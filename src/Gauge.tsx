import GaugeComponent from 'react-gauge-component';

interface GaugeProps {
  value: number;
 
  mid: number;
  high: number;
}

const Gauge: React.FC<GaugeProps> = ({ value, mid, high }) => {




  return (
    <GaugeComponent
      arc={{

        colorArray: ['#5BE12C', '#F5CD19', '#EA4228'],
        width: 0.3,
        padding: 0.003,
        subArcs: [
          { limit: mid, showTick: true, tooltip: {text: "Low"}},
          { limit: high, showTick: true, tooltip: {text: "Mid"} },

          { limit: 1000, showTick: true , tooltip: {text: "High"}}
        ],
      }}
      value={value}
      maxValue={1000}
    />
  );
};

export default Gauge; 
