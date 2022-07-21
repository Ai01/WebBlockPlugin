import React, { useState } from "react";

export const FaviconImage = (props) => {
  const { imageList, ...rest } = props || {};
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const placeholderUrl = 'chrome://favicon/';

  return (
    <img
      src={ activeImageIndex === -1 ? placeholderUrl :imageList[activeImageIndex]}
      {...rest}
      onError={() => {
        const nextIndex = activeImageIndex + 1;
        if (nextIndex < imageList.length) {
          setActiveImageIndex(nextIndex);
        } else {
          setActiveImageIndex(-1);
        }
      }}
    />
  );
};
