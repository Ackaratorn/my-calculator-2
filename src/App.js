import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);

  
  const backendURL = "https://my-calculator-2.onrender.com"; // <-- ประกาศนี้สำคัญ


  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/history`)
      setHistory(res.data);
    } catch (err) {
      console.error("Fetch history error:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClick = async (value) => {
    if (value === "AC") {
      setInput("");
    } else if (value === "DE") {
      setInput(input.slice(0, -1));
    } else if (value === "=") {
      if (!input) return;
      try {
        const res = await axios.post(`${backendURL}/api/calculate`, { expression: input });
        setInput(String(res.data.result));
        fetchHistory();
      } catch (err) {
        console.error(err);
        // ไม่ลบ input เดิม ให้ user แก้ไขได้
      }
    } else {
      setInput(input + value);
    }
  };

  const buttons = [
    "AC", "DE", ".", "/",
    "7", "8", "9", "*",
    "4", "5", "6", "+",
    "1", "2", "3", "-",
    "00", "0", "="
  ];

  return (
    <div className="calculator">
      <div className="display">{input || "0"}</div>
      <div className="buttons">
        {buttons.map(btn => (
          <button
            key={btn}
            className={btn === "=" ? "equal" : ""}
            onClick={() => handleClick(btn)}
          >
            {btn}
          </button>
        ))}
      </div>
      <div className="history">
        <h3>History</h3>
        {history.map(h => (
          <div key={h.id}>{h.expression} = {h.result}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
