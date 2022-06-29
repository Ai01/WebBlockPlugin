import React, { useState, useEffect } from "react";
import { SitesList } from './siteList.jsx';

export const RedirectPanel = () => {
  const [redirectUrl, setRedirectUrl] = useState();
  const [changeResult, setChangeResult] = useState();

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        method: "getRedirectUrl",
      },
      (response) => {
        const { redirectUrl } = response;

        setRedirectUrl(redirectUrl || null);
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
        设置重定向网址：
      </div>
      <div
        style={{
          fontSize: "14px",
          lineHeight: 1.71,
          color: "rgb(166,166,166)",
        }}
      >
        当网页被重定向的时候，该网页会显示
      </div>
      <input
        style={{
          width: "700px",
          outline: "none",
          marginTop: "10px",
          resize: "none",
          padding: "15px",
          border: "1px solid #0170fe",
          borderRadius: "12px",
          boxShadow: "rgb(255,255,255) 0px 0px 3pt 2pt",
        }}
        type="text"
        value={redirectUrl}
        onChange={(e) => {
          const v = e.target.value;
          setChangeResult(null);
          setRedirectUrl(v);
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
        onClick={() => {
          chrome.runtime.sendMessage(
            {
              method: "setRedirectUrl",
              redirectUrl: this.state.redirectUrl,
            },
            (response) => {
              console.log("response for setRedirectUrl", response);
              setChangeResult(response ? response.success : null);
            }
          );
        }}
      >
        保存重定向网站
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
      <SitesList redirect={true} />
    </div>
  );
};
