import { useState } from "react";

import BarChart from "./bar-chart";
import AreaChart from "./area-chart";
import Wrapper from "../assets/wrappers/charts-container";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChartsContainer = ({ data }: { data: any[] }) => {
  const [barChart, setBarChart] = useState(true);

  return (
    <Wrapper>
      <h4>Monthly Applications</h4>
      <button type="button" onClick={() => setBarChart(!barChart)}>
        {barChart ? "Area Chart" : "Bar Chart"}
      </button>
      {barChart ? <BarChart data={data} /> : <AreaChart data={data} />}
    </Wrapper>
  );
};
export default ChartsContainer;
