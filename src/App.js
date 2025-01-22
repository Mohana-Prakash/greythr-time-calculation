import React from "react";
import moment from "moment";
import "./App.css";

const App = () => {
  const [text, onChangeText] = React.useState("");
  const [totalHours, setTotalHours] = React.useState("0");
  const [breakHours, setbreakHours] = React.useState("0");

  const timeStampHandler = (text) => {
    onChangeText(text.target.value);
  };

  const calculateHandler = () => {
    let today = new Date();

    let date_check =
      text.match(/(\d{1,2}\s[A-Za-z]+\s\d{4})/)[0] ===
      moment(today).format("DD MMM YYYY");
    let myArray = text.match(/\b\d{1,2}:\d{2}:\d{2}\b/g) || [];

    let d = new Date(); // for now
    d.getHours(); // => 9
    d.getMinutes(); // =>  30
    d.getSeconds(); // => 51
    // alert(d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
    let startH = Object.values(myArray)[0].split(":")[0];
    let startM = Object.values(myArray)[0].split(":")[1];
    let startS = Object.values(myArray)[0].split(":")[2];
    let EndH =
      Object.values(myArray).length <= 1 || date_check
        ? d.getHours()
        : Object.values(myArray).pop().split(":")[0];
    let EndM =
      Object.values(myArray).length <= 1 || date_check
        ? d.getMinutes()
        : Object.values(myArray).pop().split(":")[1];
    let EndS =
      Object.values(myArray).length <= 1 || date_check
        ? d.getSeconds()
        : Object.values(myArray).pop().split(":")[2];
    let Hours = EndH - startH;
    let Minutes = EndM - startM;
    let Seconds = EndS - startS;

    time_Calculation(Hours, Minutes, Seconds);

    function getTimeDifference(time1, time2) {
      // Convert time strings to Date objects
      const date1 = new Date("1970-01-01T" + time1 + "Z");
      const date2 = new Date("1970-01-01T" + time2 + "Z");

      // Calculate the difference in milliseconds
      const timeDiff = date2 - date1;
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      // Format the time as "hours:minutes:seconds"
      const formattedTime = `${hours}:${minutes}:${seconds}`;

      return {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        formattedTime: formattedTime,
      };
    }

    const times = Object.values(myArray);

    let totalHours = 0;
    let totalMinutes = 0;
    let totalSeconds = 0;

    const timings = [];

    for (let i = 1; i < times.length - 1; i = i + 2) {
      const time1 = times[i];
      const time2 = times[i + 1];
      const difference = getTimeDifference(time1, time2);

      // Accumulate the total values
      totalHours += difference.hours;
      totalMinutes += difference.minutes;
      totalSeconds += difference.seconds;

      // Push the formatted time string to the 'timings' array
      timings.push(difference.formattedTime);
    }

    // Convert excess minutes and seconds
    totalMinutes += Math.floor(totalSeconds / 60);
    totalSeconds %= 60;
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;

    console.log(
      "Total Time Difference (Sum of Timings):",
      totalHours +
        " hours, " +
        totalMinutes +
        " minutes, " +
        totalSeconds +
        " seconds"
    );
    console.log("Array of timings:", timings);
    setbreakHours(totalHours + ":" + totalMinutes + ":" + totalSeconds);
  };

  const time_Calculation = (Hours, Minutes, Seconds) => {
    if (Seconds < 0) {
      // alert(Hours + ':' + (Minutes - 1) + ':' + (Seconds + 60));
      setTotalHours(Hours + ":" + (Minutes - 1) + ":" + (Seconds + 60));
      if (Minutes - 1 < 0) {
        // alert(Hours - 1 + ':' + (Minutes - 1 + 60) + ':' + (Seconds + 60));
        setTotalHours(
          Hours - 1 + ":" + (Minutes - 1 + 60) + ":" + (Seconds + 60)
        );
      }
    } else if (Minutes < 0) {
      // alert('checking' + (Hours - 1) + ':' + (Minutes + 60) + ':' + Seconds);
      setTotalHours(Hours - 1 + ":" + (Minutes + 60) + ":" + Seconds);
    } else {
      // alert(Hours + ':' + Minutes + ':' + Seconds);
      setTotalHours(Hours + ":" + Minutes + ":" + Seconds);
    }
  };
  const Present_cal = (totalHours, breakHours) => {
    let TotalH = totalHours.split(":")[0];
    let TotalM = totalHours.split(":")[1];
    let TotalS = totalHours.split(":")[2];

    let BreakH = breakHours.split(":")[0];
    let BreakM = breakHours.split(":")[1];
    let BreakS = breakHours.split(":")[2];

    let WHours = TotalH - BreakH;
    let WMinutes = TotalM - BreakM;
    let WSeconds = TotalS - BreakS;
    console.log(WHours, WMinutes, WSeconds);
    if (WHours === 0 || WMinutes === 0 || WSeconds === 0) {
      return 0;
    } else if (WSeconds < 0) {
      if (WMinutes - 1 < 0) {
        return WHours - 1 + ":" + (WMinutes - 1 + 60) + ":" + (WSeconds + 60);
      }
      return WHours + ":" + (WMinutes - 1) + ":" + (WSeconds + 60);
    } else if (WMinutes < 0) {
      return WHours - 1 + ":" + (WMinutes + 60) + ":" + WSeconds;
    } else {
      return WHours + ":" + WMinutes + ":" + WSeconds;
    }
  };

  return (
    <div style={{ width: "80%", margin: "3rem auto" }}>
      <textarea
        className="time_stamp_input"
        onChange={timeStampHandler}
        value={text}
        placeholder="Enter Your Swipe Time Here"
      />
      <button onClick={calculateHandler}>Calculate</button>
      <div className="box_div">
        <div className="box">
          <p>Your Total Hours :</p>
          <p>
            <span>{totalHours}</span>
          </p>
        </div>
        <div className="box">
          <p>Your Working Hours : </p>{" "}
          <p>
            <span>{Present_cal(totalHours, breakHours)}</span>
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
