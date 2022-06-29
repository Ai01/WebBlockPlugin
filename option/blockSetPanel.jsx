import React, { useState, useEffect } from "react";
import { SitesList } from './siteList.jsx';

export const BlockSetPanel = () => {
  const [tipText, setTipText] = useState(null);
  const [changeResult, setChangeResult] = useState(null);

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        method: "getBlockMessage",
      },
      (response) => {
        const { blockMessage } = response;
        setTipText(blockMessage);
        setChangeResult(null);
      }
    );
  }, []);

  return (
    <div>
      <div
        style={{
          fontSize: "24px",
          lineHeight: 1.71,
          fontWeight: "bold",
          color: "rgb(38,38,38)",
          minWidth: "109px",
        }}
      >
        设置拦截文本：
      </div>
      <div
        style={{
          fontSize: "14px",
          lineHeight: 1.71,
          color: "rgb(166,166,166)",
        }}
      >
        该文本会在网页被拦截的时候显示，作为提示
      </div>
      <textarea
        style={{
          width: "700px",
          height: "100px",
          outline: "none",
          marginTop: "10px",
          resize: "none",
          padding: "15px",
          border: "1px solid #0170fe",
          borderRadius: "12px",
          boxShadow: "rgb(255,255,255) 0px 0px 3pt 2pt",
        }}
        row={4}
        cols={50}
        value={tipText}
        onChange={() => {
          const v = e.target.value;
          setTipText(v);
          setChangeResult(null);
        }}
      />
      <div
        style={{
          background: "rgb(60,193,150)",
          fontSize: "14px",
          fontWeight: "bold",
          marginTop: "10px",
          color: "white",
          display: "block",
          padding: "12px 24px",
          borderRadius: "8px",
          width: "fit-content",
          cursor: "pointer",
        }}
        onChange={() => {
          chrome.runtime.sendMessage(
            {
              method: "setBlockMessage",
              blockMessage: tipText,
            },
            (response) => {
              console.log("response for setBlockMessage", response);
              setChangeResult(response ? response.success : null);
            }
          );
        }}
      >
        保存拦截文本
      </div>
      <div
        style={{
          color: "#faad14",
          fontSize: "12px",
          marginTop: "10px",
        }}
      >
        {changeResult ? "修改成功" : null}
      </div>
      <SitesList overwrite />
    </div>
  );
};
