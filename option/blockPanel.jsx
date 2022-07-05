import React, { useState, useEffect } from "react";
import { Input, Button, message } from "antd";
import { SitesList } from "./siteList.jsx";

export const BlockPanel = () => {
  const [redirectUrl, setRedirectUrl] = useState();
  const [tipText, setTipText] = useState(null);

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        method: "getBlockMessage",
      },
      (response) => {
        const { blockMessage } = response;
        setTipText(blockMessage);
      }
    );
  }, []);

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        method: "getRedirectUrl",
      },
      (response) => {
        const { redirectUrl } = response;
        setRedirectUrl(redirectUrl || null);
      }
    );
  }, []);

  return (
    <div>
      <div
        style={{
          fontSize: "20px",
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
      <Input.Group compact>
        <Input
          style={{
            width: "400px",
          }}
          row={4}
          cols={50}
          value={tipText}
          onChange={(e) => {
            const v = e.target.value;
            setTipText(v);
          }}
        />
        <Button
          type="primary"
          onClick={() => {
            chrome.runtime.sendMessage(
              {
                method: "setBlockMessage",
                blockMessage: tipText,
              },
              (response) => {
                console.log("response for setBlockMessage", response);
                message.success("拦截文本设置成功");
              }
            );
          }}
        >
          保存拦截文本
        </Button>
      </Input.Group>

      <div
        style={{
          fontSize: "20px",
          lineHeight: 1.71,
          fontWeight: "bold",
          color: "rgb(38,38,38)",
          minWidth: "109px",
          marginTop: 10,
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
      <Input.Group compact>
        <Input
          style={{ width: "400px" }}
          type="text"
          value={redirectUrl}
          onChange={(e) => {
            const v = e.target.value;
            setRedirectUrl(v);
          }}
        />
        <Button
          type="primary"
          onClick={() => {
            chrome.runtime.sendMessage(
              {
                method: "setRedirectUrl",
                redirectUrl: this.state.redirectUrl,
              },
              (response) => {
                console.log("response for setRedirectUrl", response);
                message.success("重定向网址设置成功");
              }
            );
          }}
        >
          保存重定向网站
        </Button>
      </Input.Group>
      <div style={{ marginTop: "30px" }}>
        <SitesList />
      </div>
    </div>
  );
};
