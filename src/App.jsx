import React from "react";
import { useState, useEffect } from "react";
import bhs from "./bhs.png";
import "./App.css";

function App() {
  const [currentDay, setCurrentDay] = useState("");
  // const [currentDateObject, setCurrentDateObject] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentColor, setCurrentColor] = useState(null);

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

  const student1 = "Olivia Rabern";
  const oliviaSchedule = {
    "1B": { Subject: "Math Strat", Room: "D7", Teacher: "Newell" },
    "1G": { Subject: "(free)", Room: "n/a", Teacher: "n/a" },
    "1W": { Subject: "Math Strategies 2", Room: "D7", Teacher: "Newell" },
    2: { Subject: "Biology 1", Room: "S15", Teacher: "Frye" },
    3: { Subject: "ASL 1", Room: "S16", Teacher: "Howard" },
    4: { Subject: "US History", Room: "C11", Teacher: "Craven" },
    5: { Subject: "Math 2", Room: "C12", Teacher: "Johnson" },
    6: { Subject: "Lit/Comp 2", Room: "S18", Teacher: "Baird" },
    7: { Subject: "Health 2", Room: "M6", Teacher: "Kernen" },
  };

  const startDate = new Date("9/7/2023");
  const endDate = new Date("12/15/2023");

  // array of date strings
  const holidayDateStrings = [
    "11/10/2023",
    "11/20/2023",
    "11/21/2023",
    "11/22/2023",
    "11/23/2023",
    "11/24/2023",
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

  const times = regDays.includes(currentDay)
    ? ["8:45", "10:07", "11:24", "1:16", "2:33"]
    : currentDay === "Wednesday"
    ? ["8:45", "9:49", "10:48", "12:22", "1:21"]
    : [];

  useEffect(() => {
    const currentDate = new Date();
    const currentDateString = currentDate.toDateString();
    const date = currentDate.toLocaleDateString("en-US");
    const day = currentDate.toLocaleDateString("en-US", { weekday: "long" });
    const time = currentDate.toLocaleTimeString("en-US");
    const currentColor = colorMap[currentDateString] || "none";

    // setCurrentDateObject(currentDate);
    setCurrentDay(day);
    setCurrentDate(date);
    setCurrentTime(time);
    setCurrentColor(currentColor);

    // update time every second
    const intervalId = setInterval(() => {
      const newTime = new Date().toLocaleTimeString("en-US");
      setCurrentTime(newTime);
    }, 1000);

    // clean up interval when component unmounts
    return () => clearInterval(intervalId);
  }, [colorMap]);

  const backgroundColor =
    currentColor === "B"
      ? "bg-blue-800"
      : currentColor === "G"
      ? "bg-amber-400"
      : currentColor === "W"
      ? "bg-slate-100"
      : "bg-slate-500";

  const headingFontColor =
    currentColor === "B"
      ? "text-amber-400"
      : currentColor === "G"
      ? "text-blue-700"
      : currentColor === "W"
      ? "text-slate-600"
      : "text-black";

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

  return (
    <>
      <div>
        <img src={bhs} alt="BHS Logo" className="mx-2 w-20" />
      </div>
      <div className={`h-screen ${backgroundColor}`}>
        <div className="bg-gray-300">
          <p className="mx-2">
            <code>Today is {currentDay}</code>
          </p>
          <p className="text-sm mx-2">
            <code>Current time is {currentTime}</code>
          </p>
        </div>
        <div className={backgroundColor}>
          <br></br>
          <h1 className={`text-2xl ${headingFontColor} font-bold text-center`}>
            Schedule for {currentDate}
          </h1>
          <p className={`text-sm ${headingFontColor} font-bold text-center`}>
            {student1}
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
              {times.map((time, index) => (
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
                    {oliviaSchedule[periodList[index]]
                      ? oliviaSchedule[periodList[index]].Subject
                      : ""}
                  </td>
                  <td className="py-2 border-r border-gray-400 text-center">
                    {oliviaSchedule[periodList[index]]
                      ? oliviaSchedule[periodList[index]].Room
                      : ""}
                  </td>
                  <td className="py-2 text-center">
                    {oliviaSchedule[periodList[index]]
                      ? oliviaSchedule[periodList[index]].Teacher
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
          <br></br>
        </div>
      </div>
    </>
  );
}

export default App;
