import React from "react";
import { useState, useEffect } from "react";
import bhs from "./bhs.png";
import "./App.css";

function App() {
  const [currentDay, setCurrentDay] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentColor, setCurrentColor] = useState(null);
  const [nextDay, setNextDay] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [nextColor, setNextColor] = useState(null);

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const student = params.get("student");

  const dayPeriods = {
    B: ["1B", "2", "4", "5", "7"],
    G: ["1G", "3", "4", "6", "7"],
    W: ["1W", "2", "3", "5", "6"],
  };
  const getPeriods = (day) => {
    if (day === "B") return dayPeriods.B;
    if (day === "G") return dayPeriods.G;
    if (day === "W") return dayPeriods.W;
    return ""; // default if day is not recognized
  };
  const periodList = getPeriods(currentColor);
  const nextPeriodList = getPeriods(nextColor);

  const studentSchedules = {
    olivia: {
      name: "Olivia Rabern",
      schedule: {
        "1B": { Subject: "Math Strat", Room: "D7", Teacher: "Newell" },
        "1G": { Subject: "(free)", Room: "n/a", Teacher: "n/a" },
        "1W": { Subject: "Math Strat", Room: "D7", Teacher: "Newell" },
        2: { Subject: "Biology 1", Room: "S15", Teacher: "Frye" },
        3: { Subject: "ASL 1", Room: "S16", Teacher: "Howard" },
        4: { Subject: "US History", Room: "C11", Teacher: "Craven" },
        5: { Subject: "Math 2", Room: "C12", Teacher: "Johnson" },
        6: { Subject: "Lit/Comp 2", Room: "S18", Teacher: "Baird" },
        7: { Subject: "Clay", Room: "D1", Teacher: "Lockwood" },
      },
    },
    adisyn: {
      name: "Adisyn Rabern",
      schedule: {
        "1B": { Subject: "Math Strat", Room: "D7", Teacher: "Newell" },
        "1G": { Subject: "(free)", Room: "n/a", Teacher: "n/a" },
        "1W": { Subject: "Math Strat", Room: "D7", Teacher: "Newell" },
        2: { Subject: "Biology 1", Room: "S15", Teacher: "Frye" },
        3: { Subject: "Lit/Comp 2", Room: "S18", Teacher: "Baird" },
        4: { Subject: "Math 2", Room: "D7", Teacher: "Newell" },
        5: { Subject: "US History", Room: "B16", Teacher: "Kurtz-Nicholl" },
        6: { Subject: "Drawing", Room: "D1", Teacher: "Lockwood" },
        7: { Subject: "Health 2", Room: "M6", Teacher: "Kernen" },
      },
    },
  };

  const selectedStudent = studentSchedules[student];

  const startDate = new Date("1/2/2024");
  const endDate = new Date("6/14/2024");

  // array of date strings
  const holidayDateStrings = [
    "1/15/2024",
    "2/2/2024",
    "2/19/2024",
    "3/25/2024",
    "3/26/2024",
    "3/27/2024",
    "3/28/2024",
    "4/12/2024",
    "5/27/2024",
    "6/19/2024",
  ];
  // array to hold Date objects
  const holidayDates = [];
  // loop through the date strings and create Date objects
  for (const dateString of holidayDateStrings) {
    const holiday = new Date(dateString);
    holidayDates.push(holiday);
  }

  function colorDates(startDate, endDate, holidayDateStrings) {
    const result = {};
    const dayColors = ["B", "G", "W"];

    let shiftyDate = new Date(startDate);

    while (shiftyDate <= endDate) {
      const day = shiftyDate.getDay(); // get the day of the week (0 for Sunday, 1 for Monday, ...)

      let dayColor = null; // initialize dayColor

      if (
        day !== 0 &&
        day !== 6 &&
        !holidayDateStrings.includes(shiftyDate.toLocaleDateString("en-US"))
      ) {
        // exclude weekends and holidays
        dayColor = dayColors.shift();
        result[shiftyDate.toDateString()] = dayColor;
        dayColors.push(dayColor); // put the used pattern element back at the end
      }

      shiftyDate.setDate(shiftyDate.getDate() + 1); // move to the next day
    }

    return result;
  }
  const colorMap = colorDates(startDate, endDate, holidayDateStrings);

  const regDays = ["Monday", "Tuesday", "Thursday", "Friday"];

  const timeOut = (day) => {
    return regDays.includes(day) ? "3:45" : day === "Wednesday" ? "2:15" : "";
  };

  const timesForDay = (day) => {
    return regDays.includes(day)
      ? ["8:45", "10:07", "11:24", "1:16", "2:33"]
      : day === "Wednesday"
      ? ["8:45", "9:49", "10:48", "12:22", "1:21"]
      : ["no school", "no school", "no school", "no school", "no school"];
  };

  useEffect(() => {
    const currentDate = new Date();
    const currentDateString = currentDate.toDateString();
    const date = currentDate.toLocaleDateString("en-US");
    const day = currentDate.toLocaleDateString("en-US", { weekday: "long" });
    const time = currentDate.toLocaleTimeString("en-US");
    const currentColor = colorMap[currentDateString] || "none";

    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    const nextDateString = nextDate.toDateString();
    const date2 = nextDate.toLocaleDateString("en-US");
    const day2 = nextDate.toLocaleDateString("en-US", { weekday: "long" });
    const nextColor = colorMap[nextDateString] || "none";

    // setCurrentDateObject(currentDate);
    setCurrentDay(day);
    setNextDay(nextDate);
    setCurrentDate(date);
    setCurrentTime(time);
    setCurrentColor(currentColor);
    setNextDate(date2);
    setNextDay(day2);
    setNextColor(nextColor);

    // update time every second
    const intervalId = setInterval(() => {
      const newTime = new Date().toLocaleTimeString("en-US");
      setCurrentTime(newTime);
    }, 1000);

    // clean up interval when component unmounts
    return () => clearInterval(intervalId);
  }, [colorMap]);

  const backColor = (color) => {
    return color === "B"
      ? "bg-blue-800"
      : color === "G"
      ? "bg-amber-400"
      : color === "W"
      ? "bg-slate-100"
      : "bg-slate-500";
  };
  const hfontColor = (color) => {
    return color === "B"
      ? "text-amber-400"
      : color === "G"
      ? "text-blue-700"
      : color === "W"
      ? "text-slate-600"
      : "text-black";
  };

  const isSchoolDay = ["B", "G", "W"].includes(currentColor);

  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();

  // create a Date object for the next 8:45 AM
  const nextClassStartTime = new Date();
  nextClassStartTime.setHours(8, 45, 0); // Set to 8:45 AM

  // calculate the time difference in minutes
  const timeDiffMinutes = Math.floor((nextClassStartTime - now) / (1000 * 60));

  const showMessage = () => {
    if (
      isSchoolDay &&
      (currentHours < 8 || (currentHours === 8 && currentMinutes <= 45))
    ) {
      return true;
    } else {
      return false;
    }
  };
  console.log("cur", timesForDay(currentDay));
  console.log("next", timesForDay(nextDay));
  return (
    <>
      <div>
        <img src={bhs} alt="BHS Logo" className="mx-2 w-20" />
      </div>
      <div className={`${backColor(currentColor)}`}>
        <div className="bg-gray-300">
          <p className="text-sm mx-2">
            <code>Today = {currentDay}</code>
          </p>
          <p className="text-sm mx-2">
            <code>Now = {currentTime} 2024</code>
          </p>
          {/* <p className="text-sm mx-2">
            <code>Semester 2</code>
          </p> */}
        </div>
        <div className={backColor(currentColor)}>
          <br></br>
          <h1
            className={`text-2xl ${hfontColor(
              currentColor
            )} font-bold text-center`}
          >
            Today's schedule ({currentDate})
          </h1>
          <p
            className={`text-sm ${hfontColor(
              currentColor
            )} font-bold text-center`}
          >
            {selectedStudent["name"]}
          </p>
          <br></br>

          <table className="table-fixed w-full border-collapse">
            <thead>
              <tr className="bg-gray-300 border-b border-gray-400">
                <th className="w-1/12 px-4 py-2 border-r border-gray-400"></th>
                <th className="w-1/8 px-4 py-2 border-r border-gray-400">
                  Time
                </th>
                <th className="w-1/8 px-4 py-2 border-r border-gray-400">
                  Subject
                </th>
                <th className="w-1/16 px-4 py-2 border-r border-gray-400">
                  Room
                </th>
                <th className="w-1/4 px-4 py-2">Teacher</th>
              </tr>
            </thead>
            <tbody>
              {timesForDay(currentDay).map((time, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0 ? "bg-gray-100 h-16" : "bg-white h-16"
                  }
                >
                  <td className="py-2 text-center border-r border-gray-400">
                    {periodList[index]}
                  </td>
                  <td className="py-2 border-r border-gray-400 text-center">
                    {currentColor === "none" ? "no school" : time}
                  </td>
                  <td className="py-2 border-r border-gray-400 text-center">
                    {selectedStudent["schedule"][periodList[index]]
                      ? selectedStudent["schedule"][periodList[index]].Subject
                      : ""}
                  </td>
                  <td className="py-2 border-r border-gray-400 text-center">
                    {selectedStudent["schedule"][periodList[index]]
                      ? selectedStudent["schedule"][periodList[index]].Room
                      : ""}
                  </td>
                  <td className="py-2 text-center">
                    {selectedStudent["schedule"][periodList[index]]
                      ? selectedStudent["schedule"][periodList[index]].Teacher
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showMessage() && (
            <div className="bg-red-500 text-white text-sm py-2 px-4 rounded-lg shadow-md mx-2">
              {timeDiffMinutes} minutes until school!
            </div>
          )}
          <div className="bg-gray-300">
            <p className="mx-2 text-center">
              {currentColor === "none"
                ? "..."
                : `School ends at ${timeOut(currentDay)}`}
            </p>
            <p className="text-sm mx-2"></p>
          </div>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>

          <br></br>
        </div>
      </div>

      <div className={backColor(nextColor)}>
        <h1
          className={`text-2xl ${hfontColor(nextColor)} font-bold text-center`}
        >
          Tomorrow's schedule ({nextDate})
        </h1>

        <br></br>

        <table className="table-fixed w-full border-collapse">
          <thead>
            <tr className="bg-gray-300 border-b border-gray-400">
              <th className="w-1/12 px-4 py-2 border-r border-gray-400"></th>
              <th className="w-1/8 px-4 py-2 border-r border-gray-400">Time</th>
              <th className="w-1/8 px-4 py-2 border-r border-gray-400">
                Subject
              </th>
              <th className="w-1/16 px-4 py-2 border-r border-gray-400">
                Room
              </th>
              <th className="w-1/4 px-4 py-2">Teacher</th>
            </tr>
          </thead>
          <tbody>
            {timesForDay(nextDay).map((time, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0 ? "bg-gray-100 h-16" : "bg-white h-16"
                }
              >
                <td className="py-2 text-center border-r border-gray-400">
                  {nextPeriodList[index]}
                </td>
                <td className="py-2 border-r border-gray-400 text-center">
                  {nextColor === "none" ? "no school" : time}
                </td>
                <td className="py-2 border-r border-gray-400 text-center">
                  {selectedStudent["schedule"][nextPeriodList[index]]
                    ? selectedStudent["schedule"][nextPeriodList[index]].Subject
                    : ""}
                </td>
                <td className="py-2 border-r border-gray-400 text-center">
                  {selectedStudent["schedule"][nextPeriodList[index]]
                    ? selectedStudent["schedule"][nextPeriodList[index]].Room
                    : ""}
                </td>
                <td className="py-2 text-center">
                  {selectedStudent["schedule"][nextPeriodList[index]]
                    ? selectedStudent["schedule"][nextPeriodList[index]].Teacher
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-gray-300">
          <p className="mx-2 text-center">
            {nextColor === "none"
              ? "..."
              : `School ends at ${timeOut(currentDay)}`}
          </p>
          <p className="text-sm mx-2"></p>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
    </>
  );
}

export default App;
