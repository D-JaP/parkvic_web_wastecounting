import React, {
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import "./MainSection.scss";
import SelectedImageDropDown from "./SelectedImageDropDown";
import { ApiData, ImageCount } from "../typed.ts";
import LoadingEffect from "./LoadingEffect.tsx";
import Summary from "./Summary.tsx";
import * as XLSX from "xlsx";
import ErrMsgBox from "./ErrMsgBox.tsx";
import s3Upload from "./s3UpLoad.tsx";
import {core_api_path} from "../../config.js";
import Cookies from "js-cookie";
import { getAccessToken } from "../../Callback/GetAccessToken.tsx";


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

  const abortController = useRef<AbortController>(new AbortController());
  const [errMsg, seterrMsg] = useState("");
  const [isAnalyzed, setisAnalyzed] = useState(false);
  const [isAnalyzing, setisAnalyzing] = useState(false);
  const [analyzedData, setanalyzedData] = useState<ApiData>([]);
  const [processingMsg, setprocessingMsg] = useState("");


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
    if (isAnalyzing) {
      abortController.current.abort();
    }
    fileInputRef.current.value = "";
    setprocessingMsg("");
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

  type ImagesJsonArray = {
    images: string[];
  };

  const apiUrl = core_api_path
  // helper function
  const FileList2JsonArray = (imageUrlList: string[]) => {
    let outputArray: ImagesJsonArray = { images: [] };
    for (const url of imageUrlList) {
      outputArray["images"] = [...outputArray["images"], url];
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


  const handleAnalyzeButtonClick = async () => {
    let access_token = await getAccessToken();
    let Authorization;
    if (!access_token) {
      Authorization = "No auth"
    }
    else {
      Authorization = "Bearer " + access_token
    }
    setisAnalyzing(true);
    
    abortController.current = new AbortController();
    // upload file to S3
    setprocessingMsg("Uploading images");
    const imageUrlLists = await s3Upload(inputImages).catch((error) => {throw new Error(error.message)});
    const imageBodyRequests : ImagesJsonArray[] = imageUrlLists.map(x => FileList2JsonArray([x])) ;
    //
    setprocessingMsg("Analyzing data");
    let numAnalyzed = 0;

    // update numAnalyzed
    const updateNumAnalyzed = () => {
      numAnalyzed++;
      console.log("current status: "+ numAnalyzed+  "/" + inputImages.length);
      if (numAnalyzed === inputImages.length) {
        setisAnalyzed(true);
        setprocessingMsg("Finished");
        setisAnalyzing(false);
      }
    }
    // fetch list image from api
    let combinedData: ApiData = [];

    const insertData = (data:ImageCount, pos:number) => {
      combinedData.splice(pos, 0, data)
    }

    let fetchList: Array<Promise<void>> = [];

    for (let i = 0;i< imageBodyRequests.length;i++){
       fetchList.push(fetch(apiUrl, {
        signal: abortController.current.signal,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": document.location.origin,
          "Authorization": Authorization,
        },
        body: JSON.stringify(imageBodyRequests[i]),
      })
        .then(async (response) => {
          if (response.status === 403) {
            throw new Error("User has used up all credit for today. Maximum 5 images per day. Please try again tomorrow.");
          }
          return response.json();
        })
        .then((data) => {
          // need to put at right pos i
          insertData(data.data[0], i);

          updateNumAnalyzed();
        })
        .catch((error) => {
          console.error(`An error occurred at image :${i}`, error.message);
          setErrMsgBox(error.message);
          setisAnalyzing(false);
          handleResetClick();
        }))
    }
    await Promise.all(fetchList);
    setanalyzedData(combinedData);
    console.log(combinedData);
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

  // Error message
  const [msgBoxElement, setmsgBoxElement] = useState<React.ReactElement | null>(
    null
  );
  const setErrMsgBox = (message: string) => {
    setmsgBoxElement(<ErrMsgBox message={message} kill={killMsgBox} />);
  };
  const killMsgBox = () => {
    setmsgBoxElement(null);
  };

  // return statement
  return (
    <div className="Main">
      <div
        className="work-section container-sm"
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
          {msgBoxElement != null && msgBoxElement}

          <div className="d-flex icon-and-name">
            <img
              src={icon}
              alt="Eye icon"
              className="me-3 ms-3 eye-icon"
              style={{ width: imgIconSize, height: imgIconSize }}
            />
            <span className="main-text mt-auto" style={{ fontSize: nameSize }}>
              Litter Insights
            </span>
          </div>

          {isSelectedImages && (
            <div className="d-flex align-items-center">
              <div className="me-3 processing-message">{processingMsg}</div>
              <img
                src={reset_icon}
                alt="reset_icon"
                className="reset_icon"
                style={{ width: "30px", height: "30px" }}
                onClick={handleResetClick}
              ></img>
              {!isAnalyzed && !isAnalyzing && (
                <div
                  className="button analyze-button ms-4 me-3"
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
            <p className="text-global mt-4 mb-2">
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
            <p className="size-warning">Maximum image size 6MB</p>
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
