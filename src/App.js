import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:3000/history");
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
        const result = String(eval(input));
        setInput(result);

        console.log("Sending to backend:", { expression: input, result });

        await axios.post("http://localhost:3000/calculate", {
          expression: input,
          result
        });

        fetchHistory();

      } catch {
        setInput("Error");
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
