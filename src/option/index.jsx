import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Menu, Radio, message } from "antd";
import {
  QuestionCircleTwoTone,
  EyeInvisibleTwoTone,
  ChromeFilled,
} from "@ant-design/icons";
import "./index.css";
import { BlockPanel } from "./blockPanel.jsx";
import { AboutPanel } from "./AboutPanel.jsx";
import { wordList, languageOptions } from "../common/intl/index.js";
import { MEHTOD_LIST } from "../common/constants.js";

const Header = (props) => {
  const { languageValue, setLanguageValue } = props;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
        padding: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          height: "100%",
        }}
      >
        <img
          src="./images/stop.png"
          style={{ width: "40px", height: "40px" }}
        />
        <div
          style={{ marginLeft: "10px", fontSize: "24px", fontWeight: "bold" }}
        >
          {wordList.pluginName[languageValue]}
        </div>
      </div>
      <div>
        <Radio.Group
          options={languageOptions}
          value={languageValue}
          onChange={(e) => {
            const checkedValue = e?.target?.value;

            chrome.runtime.sendMessage(
              {
                method: MEHTOD_LIST.changeLanguageType.name,
                languageValue: checkedValue,
              },
              (response) => {
                setLanguageValue(checkedValue);
                message.success(wordList.languageChangeTip[checkedValue]);
              }
            );
          }}
        />
      </div>
    </div>
  );
};

const LeftMenu = (props) => {
  const { items, defaultActive, cbForClick } = props;

  return (
    <Menu
      style={{
        width: 260,
        height: "100vh",
      }}
      defaultSelectedKeys={[defaultActive]}
      mode="inline"
      items={items}
      onClick={(...args) => {
        if (typeof cbForClick === "function") {
          cbForClick(...args);
        }
      }}
    />
  );
};

const App = () => {
  const valueForBlock = "block";
  const valueForAbout = "about";
  const [activeValue, setActiveValue] = useState(valueForBlock);

  const [languageValue, setLanguageValue] = useState(languageOptions[0].value);

  const getItem = (label, key, icon, children) => {
    return {
      key,
      icon,
      children,
      label,
    };
  };

  const items = [
    getItem(
      "拦截设置",
      valueForBlock,
      <EyeInvisibleTwoTone
        style={{ fontSize: 16 }}
        twoToneColor={activeValue === valueForBlock ? "#1fb2aa" : "#1890ff"}
      />
    ),
    getItem(
      "关于",
      valueForAbout,
      <QuestionCircleTwoTone
        style={{ fontSize: 16 }}
        twoToneColor={activeValue === valueForAbout ? "#1fb2aa" : "#1890ff"}
      />
    ),
  ];

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "65px",
          borderBottom: "1px solid rgb(238,238,238)",
        }}
      >
        <Header
          languageValue={languageValue}
          setLanguageValue={setLanguageValue}
        />
      </div>
      <div
        style={{
          width: "100%",
          flexGrow: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            width: "260px",
          }}
          className="left-menu"
        >
          <LeftMenu
            cbForClick={({ key }) => {
              setActiveValue(key);
            }}
            items={items}
            defaultActive={activeValue}
          />
        </div>
        <div
          style={{
            width: "100%",
            padding: "56px",
            borderLeft: "1px solid #f0f0f0",
          }}
        >
          {activeValue === valueForBlock ? <BlockPanel /> : null}
          {activeValue === valueForAbout ? <AboutPanel /> : null}
        </div>
      </div>
    </div>
  );
};

const domContainer = document.querySelector("#root");

ReactDOM.render(<App />, domContainer);
