import React, { useState, useEffect } from "react";
import { InputNumber, Table, Empty, Radio, Checkbox, message } from "antd";
import { FaviconImage } from "./FaviconImage.jsx";
import { MEHTOD_LIST } from "../common/constants.js";
import { wordList } from "../common/intl/index.js";

export const SitesList = (props) => {
  const { languageType } = props || {};

  const [list, setList] = useState([]);

  const getBlockSites = () => {
    chrome.runtime.sendMessage(
      {
        method: MEHTOD_LIST.getAllBlockedSites.name,
      },
      (response) => {
        const { allBlockedSites } = response;
        setList(allBlockedSites || []);
      }
    );
  };

  useEffect(() => {
    getBlockSites();
  }, []);

  const columns = [
    {
      title: wordList.url[languageType],
      dataIndex: "url",
      key: "url",
      render: (url) => {
        // https://superuser.com/questions/157925/how-to-download-favicon-from-website
        return (
          <div style={{ display: "flex" }}>
            <FaviconImage
              imageList={[
                `http://www.google.com/s2/favicons?domain=${url}&sz=128`,
                `http://www.google.com/s2/favicons?domain=${url}&sz=16`,
                `${url}/favicon.ico`,
                `chrome://favicon/size/128@1x/${url}`,
              ]}
              style={{
                width: "24px",
                height: "24px",
                border: "1px solid rgb(224,224,224)",
                borderRadius: "4px",
                padding: "2px",
              }}
            />
            <div style={{ marginLeft: 10 }}>{url}</div>
          </div>
        );
      },
    },
    {
      title: wordList.shortBrowserSetting[languageType],
      key: "operation",
      render: (text, record) => {
        const { url, shortBrowser, shortBrowserTime } = record;
        // todo: 改为时间设置，实现不同网站短浏览时间不同

        return (
          <div>
            <Checkbox
              onChange={(e) => {
                const isShortBrowser = e?.target?.checked;
                chrome.runtime.sendMessage(
                  {
                    method: isShortBrowser
                      ? MEHTOD_LIST.bellBlockSite.name
                      : MEHTOD_LIST.noBellBlockSite.name,
                    site: url,
                  },
                  (response) => {
                    const { allBlockedSites } = response;
                    setList(allBlockedSites || []);

                    if (isShortBrowser) {
                      message.success(
                        wordList.successTipForShortBrowserSet[languageType]
                      );
                    } else {
                      message.success(
                        wordList.closeTipForShortBrowser[languageType]
                      );
                    }
                  }
                );
              }}
              checked={shortBrowser}
            >
              {wordList.shortBrowser[languageType]}
            </Checkbox>
            <InputNumber
              style={{ width: 60 }}
              min={1}
              max={30}
              defaultValue={shortBrowserTime ? Number(shortBrowserTime) : 5}
              onChange={(value) => {
                chrome.runtime.sendMessage(
                  {
                    method: MEHTOD_LIST.changeShortBrowserTime.name,
                    site: url,
                    time: value,
                  },
                  (response) => {
                    const { allBlockedSites } = response;
                    setList(allBlockedSites || []);

                    message.success(
                      wordList.shortBrowserTimeSettingTip[languageType]
                    );
                  }
                );
              }}
              formatter={(value) => {
                console.log("v", value);
                return Math.round(value);
              }}
            />
            {wordList.minute[languageType]}
          </div>
        );
      },
    },
    {
      title: wordList.blockSetting[languageType],
      key: "blockset",
      render: (text, record) => {
        const { overwrite, redirect, url } = record || {};

        const overwriteValue = "overwrite";
        const redirectValue = "redirect";

        return (
          <Radio.Group
            onChange={(e) => {
              const value = e?.target?.value;
              if (value === overwriteValue) {
                chrome.runtime.sendMessage(
                  {
                    method: MEHTOD_LIST.changeSiteBlock.name,
                    site: url,
                  },
                  (response) => {
                    const { success } = response;
                    if (success) {
                      message.success(wordList.setRewriteSuccess[languageType]);

                      getBlockSites();
                    }
                  }
                );
              }

              if (value === redirectValue) {
                chrome.runtime.sendMessage(
                  {
                    method: MEHTOD_LIST.changeSiteRedirect.name,
                    site: url,
                  },
                  (response) => {
                    const { success } = response;
                    if (success) {
                      message.success(wordList.setRedirectSuccess[languageType]);

                      getBlockSites();
                    }
                  }
                );
              }
            }}
            value={overwrite ? overwriteValue : redirectValue}
          >
            <Radio value={overwriteValue}>
              {wordList.rewrite[languageType]}
            </Radio>
            <Radio value={redirectValue}>
              {wordList.redirect[languageType]}
            </Radio>
          </Radio.Group>
        );
      },
    },
  ];

  return (
    <div>
      {Array.isArray(list) && list.length > 0 ? (
        <Table
          size="small"
          bordered
          pagination={false}
          columns={columns}
          dataSource={list}
        />
      ) : (
        <Empty description={wordList.tipForAdd[languageType]} />
      )}
    </div>
  );
};
