import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import { RedirectPanel } from "./redirectPanel.jsx";
import { BlockSetPanel } from './blockSetPanel.jsx';

const { createElement, Component } = React || {};

class SitesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  componentDidMount() {
    chrome.runtime.sendMessage(
      {
        method: "getAllBlockedSites",
      },
      (response) => {
        const { allBlockedSites } = response;

        this.setState({ list: allBlockedSites || [] });
      }
    );
  }

  render() {
    const { list } = this.state;
    const { redirect, overwrite } = this.props;

    const redirectSites = Array.isArray(list)
      ? list
          .filter((i) => {
            if (redirect) {
              return i && !i.overwrite;
            }
            if (overwrite) {
              return i && i.overwrite;
            }
          })
          .map((i) => {
            const { url } = i || {};
            return createElement(
              "div",
              {
                style: {
                  padding: "12px 18px 12px 12px",
                  background: "white",
                  fontSize: "14px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
              },
              [
                createElement(
                  "div",
                  {
                    style: {
                      display: "flex",
                    },
                  },
                  [
                    createElement("img", {
                      src: `chrome://favicon/size/128@1x/${url}`,
                      style: {
                        width: "24px",
                        height: "24px",
                        border: "1px solid rgb(224,224,224)",
                        borderRadius: "4px",
                        padding: "2px",
                      },
                    }),
                    createElement("div", { style: { marginLeft: 10 } }, url),
                  ]
                ),
                createElement("img", {
                  src: "./images/delete.svg",
                  style: { cursor: "pointer" },
                  onClick: () => {
                    chrome.runtime.sendMessage(
                      {
                        method: "removeBlockSite",
                        site: url,
                      },
                      (response) => {
                        const { allBlockedSites } = response;
                        console.log("test", response);

                        this.setState({ list: allBlockedSites || [] });
                      }
                    );
                  },
                }),
              ]
            );
          })
      : [];

    return createElement(
      "div",
      {
        style: {
          border: "1px solid rgb(224,224,224)",
          borderRadius: "12px",
          padding: "8px",
          marginTop: 30,
          maxWidth: 800,
          overflow: "hidden",
        },
      },
      redirectSites.length > 0
        ? redirectSites
        : createElement(
            "div",
            {
              style: {
                color: "black",
                fontSize: "14px",
                fontWeight: "bold",
              },
            },
            "请添加网页"
          )
    );
  }
}

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
  const valueForRedirect = "rewrite";
  const [activeValue, setActiveValue] = useState(valueForBlock);

  const menuList = [
    {
      name: "拦截设置",
      value: valueForBlock,
      cbForClick: (value) => {
        setActiveValue(value);
      },
    },
    {
      name: "重定向设置",
      value: valueForRedirect,
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
          {activeValue === menuList[0].value ? (
            <BlockSetPanel />
          ) : (
            <RedirectPanel />
          )}
        </div>
      </div>
    </div>
  );
};

const domContainer = document.querySelector("#root");

ReactDOM.render(<App />, domContainer);
