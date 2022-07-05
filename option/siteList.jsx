import React, { useState, useEffect } from "react";
import { Table, Empty, Radio, Checkbox, message } from "antd";
import { FaviconImage } from "./FaviconImage.jsx";

export const SitesList = (props) => {
  const [list, setList] = useState([]);

  const getBlockSites = () => {
    chrome.runtime.sendMessage(
      {
        method: "getAllBlockedSites",
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
        const { url, belling } = record;
        // todo: 改为时间设置，实现不同网站短浏览时间不同

        return (
          <div>
            <Checkbox
              onChange={(e) => {
                const isShortBrowser = e?.target?.checked;
                chrome.runtime.sendMessage(
                  {
                    method: isShortBrowser
                      ? "bellBlockSite"
                      : "noBellBlockSite",
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
              checked={belling}
            >
              短浏览5分钟
            </Checkbox>
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
              debugger;
              if (value === overwriteValue) {
                chrome.runtime.sendMessage(
                  {
                    method: "changeSiteBlock",
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
                    method: "changeSiteRedirect",
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
