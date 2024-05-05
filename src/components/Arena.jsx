import React from "react";

import BasicTabs from "./common/Tabs";
import GymCalendar from "./GymCalendar";
import MyInfo from "./MyInfo";

export default function Arena() {
  return (
    <>
      <BasicTabs tabs={{ Calendar: <GymCalendar />, "My Info": <MyInfo /> }} />
    </>
  );
}
