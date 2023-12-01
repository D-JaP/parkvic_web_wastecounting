import "./ImageList.scss";

import React, { useState } from "react";
import { ImageCount } from "./typed";
import OverLayImage from "./OverLayImage";

function ImageList({ data }: { data: ImageCount }) {
  const img_name = Object.keys(data)[0];
  const labels = Object.keys(data[img_name]);
  const img_src = labels.map((label) => data[img_name][label]["path"]);

  const [imgView, setimgView] = useState("");
  const [isViewing, setisViewing] = useState(false);
  const handleImageClicked = (event: any) => {
    const src = event.target.src;
    setimgView(src);
    setisViewing(true);
  };

  const handleCloseBtnClick = () => {
    setisViewing(false)
    setimgView("")
  }

  const img_html = (label: string, src: string, key: number) => (
    <div className="img-output" key={key}>
      <p className="category">{label}</p>
      <img
        src={src}
        alt="img-preview"
        className="image-preview"
        onClick={(e) => handleImageClicked(e)}
      />
    </div>
  );

  return (
    <div className="img-list d-flex ">
      {labels.map((label, index) => img_html(label, img_src[index], index))}
      {isViewing && <OverLayImage src={imgView} handleCloseBtnClick={() => handleCloseBtnClick()}></OverLayImage>}
    </div>
  );
}

export default ImageList;
