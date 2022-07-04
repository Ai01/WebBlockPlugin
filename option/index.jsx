import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";

import { BlockPanel } from "./blockPanel.jsx";

const Header = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "100%",
        padding: "12px",
      }}
    >
      <img src="./images/stop.png" style={{ width: "40px", height: "40px" }} />
      <div style={{ marginLeft: "10px", fontSize: "24px", fontWeight: "bold" }}>
        注意力
      </div>
    </div>
  );
};

const Menu = (props) => {
  const { list, defaultActive } = props;
  const [activeValue, setActiveValue] = useState(defaultActive);

  return (
    <div style={{ padding: "12px" }}>
      {Array.isArray(list)
        ? list.map((i) => {
            const { name, value, cbForClick } = i || {};
            return (
              <div
                onClick={() => {
                  setActiveValue(value);
                  if (typeof cbForClick === "function") {
                    cbForClick(value);
                  }
                }}
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "rgb(33, 33, 33)",
                  height: "48px",
                  lineHeight: "24px",
                  padding: "14px",
                  backgroundColor:
                    activeValue === value
                      ? "rgb(245,245,245)"
                      : "rgb(255,255,255)",
                  borderRadius: activeValue === value ? "8px" : 0,
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                {name}
              </div>
            );
          })
        : null}
    </div>
  );
};

const App = () => {
  const valueForBlock = "block";
  const [activeValue, setActiveValue] = useState(valueForBlock);

  const menuList = [
    {
      name: "拦截设置",
      value: valueForBlock,
      cbForClick: (value) => {
        setActiveValue(value);
      },
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "65px",
          borderBottom: "1px solid rgb(238,238,238)",
        }}
      >
        <Header />
      </div>
      <div
        style={{
          width: "100%",
          flexGrow: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "260px",
            height: "100%",
            background: "rgb(255,255,255)",
            borderRight: "1px solid rgb(238,238,238)",
          }}
        >
          <Menu list={menuList} defaultActive={activeValue} />
        </div>
        <div style={{ width: "100%", height: "100%", padding: "56px" }}>
          {activeValue === menuList[0].value ? <BlockPanel /> : null}
        </div>
      </div>
    </div>
  );
};

const domContainer = document.querySelector("#root");

ReactDOM.render(<App />, domContainer);
