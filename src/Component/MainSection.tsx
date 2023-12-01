import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import "./MainSection.scss";
import SelectedImageDropDown from "./SelectedImageDropDown";
import { ApiData } from "./typed.ts";
import LoadingEffect from "./LoadingEffect.tsx";
import Summary from "./Summary.tsx";
import * as XLSX from "xlsx";

function MainSection() {
  const icon: string = `${process.env.PUBLIC_URL}/img/eye.png`;
  //   img icon state
  const image_icon: string = `${process.env.PUBLIC_URL}/img/image_icon.png`;
  const [imgIconSize, setimgIconSize] = useState<string>("73px");
  const [nameSize, setNameSize] = useState("36px");
  // container state
  const [expandableHeight, setexpandableHeight] = useState("500px");
  const reset_icon: string = `${process.env.PUBLIC_URL}/img/reset.png`;

  const fileInputRef = useRef() as MutableRefObject<HTMLInputElement>;

  const [isSelectedImages, setisSelectedImages] = useState<boolean>(false);
  const [inputImages, setinputImages] = useState<File[]>([]);

  const abortController = useRef<AbortController>(new AbortController())

  useEffect(() => {
    if (inputImages != null && inputImages.length > 0) {
      setisSelectedImages(true);
    } else {
      setisSelectedImages(false);
    }

    return () => {};
  }, [inputImages]);
  // handle button clicked
  const handleSelectImg = () => {
    fileInputRef.current.click();
  };
  //   handle input change
  const handleInputChange = (event: any) => {
    setinputImages(event.target.files);
  };
  // handle reset button click
  const handleResetClick = () => {
    if (isAnalyzing){
      abortController.current.abort();
    }
    setinputImages([]);
    setisSelectedImages(false);
    setisAnalyzed(false);
    setisAnalyzing(false);
    setanalyzedData([]);
  };
  // toggle effect when uploaded img
  useEffect(() => {
    const temp_img_size = imgIconSize;
    const temp_name_size = nameSize;
    const temp_height = expandableHeight;
    if (isSelectedImages === true) {
      setimgIconSize("48px");
      setNameSize("20px");
      setexpandableHeight("max-content");
    }

    return () => {
      setimgIconSize(temp_img_size);
      setNameSize(temp_name_size);
      setexpandableHeight(temp_height);
    };
  }, [isSelectedImages]);
  //   analyzed state
  // helper function
  type ImageJSON = {
    filename: string;
    content: string;
  };
  type ImagesJsonArray = {
    images: ImageJSON[];
  };
  const [isAnalyzed, setisAnalyzed] = useState(false);
  const [isAnalyzing, setisAnalyzing] = useState(false);
  const apiUrl =
    "https://cbczp2vxvdpf3umb5tybcjdehi0gicgs.lambda-url.ap-southeast-2.on.aws/";
  const FileList2JsonArray = async (filelist: File[]) => {
    let outputArray: ImagesJsonArray = { images: [] };
    for (const file of filelist) {
      outputArray["images"] = [
        ...outputArray["images"],
        { filename: file.name, content: await readIImageAsBase64(file) },
      ];
    }
    return outputArray;
  };

  const readIImageAsBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to read file as based 64."));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const [analyzedData, setanalyzedData] = useState<ApiData>([]);

  const handleAnalyzeButtonClick = async () => {
    const imageBodyRequest = await FileList2JsonArray(inputImages);
    setisAnalyzing(true);
    
    abortController.current = new AbortController()

    fetch(apiUrl, {
      signal: abortController.current.signal,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Origin",
      },
      body: JSON.stringify(imageBodyRequest),
    })
      .then((response) => {
        setisAnalyzing(false);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setanalyzedData(data.data);
        setisAnalyzed(true);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };


  //  iamge delete handle
  const handleDeleteSelectedImage = (index: number) => {
    const origin = [...inputImages];
    origin.splice(index, 1);
    setinputImages(origin);
  };
  // export image
  const [countData, setcountData] = useState<{ [key: string]: number }>({});
  const handleExportXLS = () => {
    const dataToExport = [
      { Date: new Date().toLocaleDateString(), ...countData },
    ];

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

    console.log("writed");
    XLSX.writeFile(wb, "exported_data.xlsx");
  };
  const updateCountData = (count: { [key: string]: number }) => {
    setcountData(count);
  };

  // abort if reset
  

  
  
  // return statement
  return (
    <div className="Main">
      <div
        className="work-section container-md"
        style={{ height: expandableHeight }}
      >
        {/* task icon and task bar */}
        <div
          className={`name d-flex ${
            isSelectedImages
              ? "justify-content-between align-items-center pt-2"
              : "justify-content-center"
          }`}
        >
          <div className="d-flex">
            <img
              src={icon}
              alt="Eye icon"
              className="me-3 ms-3"
              style={{ width: imgIconSize, height: imgIconSize }}
            />
            <span className="main-text mt-auto" style={{ fontSize: nameSize }}>
              Litter Insights
            </span>
          </div>

          {isSelectedImages && (
            <div className="d-flex align-items-center">
              <img
                src={reset_icon}
                alt="reset_icon"
                className="reset_icon"
                style={{ width: "30px", height: "30px" }}
                onClick={handleResetClick}
              ></img>
              {!isAnalyzed && !isAnalyzing && (
                <div
                  className="button ms-4 me-3"
                  onClick={handleAnalyzeButtonClick}
                >
                  Analyze
                </div>
              )}
              {isAnalyzed && (
                <div className="button ms-4 me-3" onClick={handleExportXLS}>
                  Export
                </div>
              )}
              <LoadingEffect show={isAnalyzing ? "33px" : "0"}></LoadingEffect>
            </div>
          )}
        </div>
        {/* Spacer line */}
        {isSelectedImages && <div className="space-line mt-2"></div>}
        {/* img upload section and show case */}
        {
          <div
            className={`img-upload-section d-flex justify-content-center flex-column ${
              isSelectedImages === true ? "d-none" : ""
            }`}
          >
            <img
              src={image_icon}
              alt="img_upload"
              className="ms-auto me-auto"
              style={{ width: "72px", height: "56px" }}
            ></img>
            <p className="text-global mt-3 mb-2">
              Select images to break down litter count
            </p>
            <div className="button" onClick={handleSelectImg}>
              Select images
            </div>
            <input
              type="file"
              accept=".jpg, .jpeg, .png"
              className="input"
              multiple
              ref={fileInputRef}
              onChange={handleInputChange}
            />
          </div>
        }
        {/* add list drop down */}
        <div className="dropdown-list d-flex flex-column mt-5">
          {isAnalyzed && (
            <Summary
              data={analyzedData}
              updateCount={(countdata: { [key: string]: number }) =>
                updateCountData(countdata)
              }
            ></Summary>
          )}

          {inputImages
            ? Array.from(inputImages).map((file, index) => (
                <SelectedImageDropDown
                  key={index}
                  imageUrl={URL.createObjectURL(file)}
                  imageName={file.name}
                  size={file.size}
                  analyzed={isAnalyzed}
                  className="w-75 ms-auto me-auto mt-3"
                  deleteTab={() => handleDeleteSelectedImage(index)}
                  result={analyzedData[index]}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default MainSection;
