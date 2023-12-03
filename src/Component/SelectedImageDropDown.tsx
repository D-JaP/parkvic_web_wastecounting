import React, { useState } from "react";
import "./SelectedImageDropDown.scss";
import { ImageCount } from "./typed";
import { Bar } from "react-chartjs-2";
import BarChart from "./BarChart";
import ImageList from "./ImageList";

function SelectedImageDropDown({
  imageUrl,
  imageName,
  size,
  analyzed,
  className,
  deleteTab,
  result,
}: {
  imageUrl: string;
  imageName: string;
  size: number;
  analyzed: boolean;
  className: string;
  deleteTab: any;
  result: ImageCount;
}) {
  const icon: string = `${process.env.PUBLIC_URL}/img/dots-nine.svg`;
  const dropIcon: string = `${process.env.PUBLIC_URL}/img/arrow.svg`;
  const deleteIcon: string = `${process.env.PUBLIC_URL}/img/x.svg`;

  const byteConverse = (size: number) => {
    if (size / 1024 / 1024 > 1) {
      return Math.round(size / 1024 / 1024) + " Mb";
    } else {
      return Math.round(size / 1024) + " Kb";
    }
  };
  const sizeInByteMultiple = byteConverse(size);
  const [dropdown, setdropdown] = useState(false);
  const toggleDropdown = () => {
    if (dropdown) {
      setdropdown(false);
    } else {
      setdropdown(true);
    }
  };

  return (
    <div
      className={`dropdown_tab d-flex align-items-center flex-wrap ${className}`}
    >
      <img
        src={icon}
        alt="icon"
        className="ms-4 me-5 dot-nine"
        style={{ width: "11px", height: "17px" }}
      />
      <img src={imageUrl} alt="img preview" className="img-preview me-4"></img>
      <div className="data">
        <p className="name">{imageName}</p>
        <p className="size">{sizeInByteMultiple}</p>
      </div>
      {analyzed && (
        <img
          src={dropIcon}
          alt="drop icon"
          className={`control-icon drop-icon ${dropdown?"rotated":""}`}
          onClick={toggleDropdown}
        />
      )}
      {!analyzed && (
        <img
          src={deleteIcon}
          onClick={deleteTab}
          alt="delete icon"
          className="control-icon"
        />
      )}
      <div className={`d-flex flex-wrap dropdown ${dropdown?"visible":""}`}>
        <div className="spacing"></div>
        {analyzed && <BarChart data={result}></BarChart>}
        {analyzed && <ImageList data={result}></ImageList>}
      </div>
    </div>
  );
}

export default SelectedImageDropDown;
