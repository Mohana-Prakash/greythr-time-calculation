import React from "react";
import moment from "moment";
import "./App.css";

const App = () => {
  const [text, setText] = React.useState("");
  const [totalHours, setTotalHours] = React.useState("0");
  const [breakHours, setBreakHours] = React.useState("0");

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const calculateTimeDifference = (time1, time2) => {
    const date1 = new Date(`1970-01-01T${time1}Z`);
    const date2 = new Date(`1970-01-01T${time2}Z`);

    const diffInMs = date2 - date1;
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

    return {
      hours,
      minutes,
      seconds,
      formatted: `${hours}:${minutes}:${seconds}`,
    };
  };

  const handleCalculate = () => {
    const today = moment().format("DD MMM YYYY");
    const currentDate = new Date();
    const matches = text.match(/\b\d{1,2}:\d{2}:\d{2}\b/g) || [];
    const isToday = text.includes(today);

    const startTime = matches[0];
    const endTime =
      matches.length > 1 && !isToday
        ? matches[matches.length - 1]
        : `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

    if (startTime) {
      const { hours, minutes, seconds } = calculateTimeDifference(
        startTime,
        endTime
      );
      updateTotalHours(hours, minutes, seconds);
    }

    calculateBreakTime(matches);
  };

  const updateTotalHours = (hours, minutes, seconds) => {
    if (seconds < 0) {
      seconds += 60;
      minutes -= 1;
    }
    if (minutes < 0) {
      minutes += 60;
      hours -= 1;
    }
    setTotalHours(`${hours}:${minutes}:${seconds}`);
  };

  const calculateBreakTime = (timestamps) => {
    let totalBreakTime = { hours: 0, minutes: 0, seconds: 0 };

    for (let i = 1; i < timestamps.length - 1; i += 2) {
      const { hours, minutes, seconds } = calculateTimeDifference(
        timestamps[i],
        timestamps[i + 1]
      );
      totalBreakTime.hours += hours;
      totalBreakTime.minutes += minutes;
      totalBreakTime.seconds += seconds;
    }

    totalBreakTime.minutes += Math.floor(totalBreakTime.seconds / 60);
    totalBreakTime.seconds %= 60;
    totalBreakTime.hours += Math.floor(totalBreakTime.minutes / 60);
    totalBreakTime.minutes %= 60;

    setBreakHours(
      `${totalBreakTime.hours}:${totalBreakTime.minutes}:${totalBreakTime.seconds}`
    );
  };

  const calculateWorkingHours = () => {
    if (
      !totalHours ||
      !breakHours ||
      totalHours === "0" ||
      breakHours === "0"
    ) {
      return "0:0:0";
    }

    const [totalH, totalM, totalS] = totalHours.split(":").map(Number);
    const [breakH, breakM, breakS] = breakHours.split(":").map(Number);

    let workingHours = totalH - breakH;
    let workingMinutes = totalM - breakM;
    let workingSeconds = totalS - breakS;

    if (workingSeconds < 0) {
      workingSeconds += 60;
      workingMinutes -= 1;
    }
    if (workingMinutes < 0) {
      workingMinutes += 60;
      workingHours -= 1;
    }

    return `${workingHours}:${workingMinutes}:${workingSeconds}`;
  };

  return (
    <div className="parent_div">
      <div style={{ width: "70%" }}>
        <textarea
          onChange={handleTextChange}
          value={text}
          placeholder="Enter Your Swipe Time Here"
        />
        <button onClick={handleCalculate}>Calculate</button>
      </div>
      <div className="box_div">
        <div className="box">
          <p>Your Total Hours :</p>
          <p>
            <span>{totalHours}</span>
          </p>
        </div>
        <div className="box">
          <p>Your Working Hours :</p>
          <p>
            <span>{calculateWorkingHours()}</span>
          </p>
        </div>
        <div className="box">
          <p>Your Break Hours :</p>
          <p>
            <span>{breakHours}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
