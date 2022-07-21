import React, { useState, useEffect } from "react";
import { Input, Button, message } from "antd";
import { SitesList } from "./siteList.jsx";
import { MEHTOD_LIST } from "../common/constants.js";
import { wordList } from "../common/intl/index.js";

export const BlockPanel = (props) => {
  const { languageType } = props || {};

  const [redirectUrl, setRedirectUrl] = useState();
  const [tipText, setTipText] = useState(null);

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        method: MEHTOD_LIST.getBlockMessage.name,
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
        method: MEHTOD_LIST.getRedirectUrl.name,
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
        {wordList.setRewriteText[languageType]}
      </div>
      <div
        style={{
          fontSize: "14px",
          lineHeight: 1.71,
          color: "rgb(166,166,166)",
        }}
      >
        {wordList.tipForRewriteText[languageType]}
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
                method: MEHTOD_LIST.setBlockMessage.name,
                blockMessage: tipText,
              },
              (response) => {
                console.log("response for setBlockMessage", response);
                message.success("拦截文本设置成功");
              }
            );
          }}
        >
          {wordList.saveRewriteText[languageType]}
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
        {wordList.setRedirectUrl[languageType]}
      </div>
      <div
        style={{
          fontSize: "14px",
          lineHeight: 1.71,
          color: "rgb(166,166,166)",
        }}
      >
        {wordList.tipForRedirectUrl[languageType]}
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
                method: MEHTOD_LIST.setRedirectUrl.name,
                redirectUrl: this.state.redirectUrl,
              },
              (response) => {
                console.log("response for setRedirectUrl", response);
                message.success("重定向网址设置成功");
              }
            );
          }}
        >
          {wordList.saveRedirectUrl[languageType]}
        </Button>
      </Input.Group>
      <div style={{ marginTop: "30px" }}>
        <SitesList languageType={languageType} />
      </div>
    </div>
  );
};
