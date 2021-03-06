import React, { useState, useEffect } from "react";
import { InputNumber, Table, Empty, Radio, Checkbox, message } from "antd";
import { FaviconImage } from "./FaviconImage.jsx";
import { MEHTOD_LIST } from "../common/constants.js";

export const SitesList = (props) => {
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
      title: "网址",
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
      title: "短浏览设置",
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
                      message.success("短浏览设置成功");
                    } else {
                      message.success("短浏览关闭");
                    }
                  }
                );
              }}
              checked={shortBrowser}
            >
              短浏览
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

                    message.success("短浏览时间设置成功");
                  }
                );
              }}
              formatter={(value) => {
                console.log("v", value);
                return Math.round(value);
              }}
            />
            分钟
          </div>
        );
      },
    },
    {
      title: "拦截设置",
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
                      message.success("设置重写成功");

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
                      message.success("设置重定向成功");

                      getBlockSites();
                    }
                  }
                );
              }
            }}
            value={overwrite ? overwriteValue : redirectValue}
          >
            <Radio value={overwriteValue}>重写</Radio>
            <Radio value={redirectValue}>重定向</Radio>
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
        <Empty description="请添加网址" />
      )}
    </div>
  );
};
