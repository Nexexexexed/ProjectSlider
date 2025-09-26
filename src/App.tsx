import React from "react";
import TimeSegmentBlock from "./components/TimeSegmentBlock/TimeSegmentBlock";
import { timeSegmentsData } from "./data/timeSegments";
import "./styles/global.scss";

const App: React.FC = () => {
  return (
    <div className="app">
      <TimeSegmentBlock data={timeSegmentsData} />
    </div>
  );
};

export default App;
