import React, { useState, useEffect } from "react";
import { Table, Empty, Radio, Checkbox, message } from "antd";

export const SitesList = (props) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        method: "getAllBlockedSites",
      },
      (response) => {
        const { allBlockedSites } = response;
        setList(allBlockedSites || []);
      }
    );
  }, []);

  const columns = [
    {
      title: "网址",
      dataIndex: "url",
      key: "url",
      render: (url) => {
        return (
          <div style={{ display: "flex" }}>
            <img
              src={`chrome://favicon/size/128@1x/${url}`}
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
        const { overwrite, redirect } = record || {};

        const overwriteValue = "overwrite";
        const redirectValue = "redirect";

        return (
          <Radio.Group
            onChange={(value) => {
              // todo: 改变重定向和重写

              if (value === overwriteValue) {
              }
              if (value === redirectValue) {
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
