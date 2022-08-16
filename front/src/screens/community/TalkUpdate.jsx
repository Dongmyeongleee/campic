/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useRef, useState, useEffect } from "react";
import "./TalkUpdate.scss";
import imageCompression from "browser-image-compression";
import { CKEditor } from "ckeditor4-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { updateTalk, getTalkDetail } from "../../apis/talk";

function TalkUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const photoInput = useRef();
  const handleClick = () => {
    photoInput.current.click();
  };
  const [fileImage, setFileImage] = useState(""); // 파일이미지
  const saveFileImage = event => {
    setFileImage(URL.createObjectURL(event.target.files[0]));
  };
  const titleRef = useRef();
  const tagRef = useRef();
  const [talkContent, setTalkContent] = useState({
    content: null
  });
  async function bringTalkInfo() {
    const res = await getTalkDetail(id);
    setTalkContent(res);
  }
  useEffect(() => {
    bringTalkInfo();
  }, []);
  const [titleLength, setTitleLength] = useState(0);
  const getValue = e => {
    setTitleLength(e.target.value.length);
    if (e.target.value.length > 30) {
      console.log("30자를 초과합니다.");
    }
  };
  const submit = async () => {
    // eslint-disable-next-line no-use-before-define
    actionImgCompress(photoInput.current.files[0]);
  };
  /* eslint-disable-next-line no-shadow */
  const actionImgCompress = async fileImage => {
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 720,
      useWebWorker: true
    };
    try {
      const compressedImage = await imageCompression(fileImage, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedImage);
      reader.onloadend = () => {
        const base64data = reader.result;
        // console.log(base64data);
        // eslint-disable-next-line no-use-before-define
        handlingDataForm(base64data);
      };
    } catch (error) {
      console.log(error);
    }
  };
  const handlingDataForm = async dataURI => {
    const byteString = atob(dataURI.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ia], {
      type: "image/jpeg"
    });
    const file = new File([blob], "image.jpg");
    const formData = new FormData();
    formData.append("nickname", "test");
    formData.append("title", titleRef.current.value);
    formData.append("hashtag", tagRef.current.value);
    formData.append("fileName", "baek");
    formData.append("file", file);
    formData.append("contents", talkContent.content);
    // formData.append("talkId", id);
    // eslint-disable-next-line no-restricted-syntax
    try {
      const res = await updateTalk(formData);
      if (res === "success") {
        console.log("success");
      }
      navigate(`/board/talk/detail/${id}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container flex">
      {/* 커뮤니티 네브바 들어가야 함 */}
      <div className="modifyTalk">
        <div className="modifyTalk_title notoBold fs-32">글 수정하기</div>
        <div className="modifyTalk_content flex justify-center">
          {/* 사진 업로드 박스 */}
          {/* eslint-disable no-shadow */}
          <button
            className="modifyTalk_content_img flex align-center justify-center"
            onClick={handleClick}
            type="button"
          >
            {/* {!fileImage && <Camera className="camera" fill="#DBDBDB" />} */}
            {/* {!fileImage && ( */}
            {/* <div className="modifyTalk_content_img_sub fs-28 notoBold"> */}
            {/* Upload */}
            {/* </div> */}
            {/* )} */}
            <div className="modifyTalk_content_img_priv">
              {!fileImage && (
                <img alt="수정이미지" src={[talkContent.blobFile]} />
              )}
              {fileImage && <img alt="수정이미지" src={fileImage} />}
            </div>
            <input
              type="file"
              multiple="multiple"
              encType="multipart/form-data"
              accept="image/jpg, image.jpeg, image.png"
              ref={photoInput}
              style={{ display: "none" }}
              name="imgFile"
              id="imgFile"
              onChange={saveFileImage}
            />
          </button>
        </div>
        <div className="modifyTalk_text flex align-center justify-center">
          <div className="modifyTalk_text_name flex align-center">
            <input
              ref={titleRef}
              type="text"
              className="modifyTalk_text_name_input notoMid fs-24"
              defaultValue={talkContent.title}
              name="title"
              maxLength={30}
              onChange={getValue}
            />
            <div
              className="modifyTalk_text_name_count roReg fs-24"
              // onChange={getValue}
            >
              {titleLength}/30
            </div>
          </div>
          <div className="divide" />
          {/* <h1>테스트1</h1> */}
          <div className="modifyTalk_text_content_box" id="editor">
            {/* <h1>테스트2</h1> */}
            {talkContent.contents != null && (
              <CKEditor
                style={{ borderColor: "#467264" }}
                onReady={editor => {
                  editor.setData(talkContent.content);
                }}
                onChange={e => {
                  const data = e.editor.getData();
                  setTalkContent({
                    ...talkContent,
                    contents: data
                  });
                }}
                config={{
                  readOnly: false,
                  uiColor: "#AADC6E",
                  height: 500,
                  fontSize_sizes: 100,
                  width: 900,
                  resize_enabled: false,
                  toolbar: [
                    // ["Source"],
                    ["Styles", "Format", "Font", "FontSize"],
                    ["Bold", "Italic"],
                    ["Undo", "Redo"],
                    ["EasyImageUpload"]
                    // ["About"]
                  ],
                  extraPlugins: "easyimage",
                  removePlugins: "image, elementspath",
                  cloudServices_uploadUrl:
                    "https://91146.cke-cs.com/easyimage/upload/",
                  cloudServices_tokenUrl:
                    "https://91146.cke-cs.com/token/dev/dhX4bynkAsQH3fJCt5hcTqSXRmjWtPGhgE2f?limit=10"
                }}
              />
            )}
          </div>
          <input
            ref={tagRef}
            type="text"
            defaultValue={talkContent.hashtag}
            className="modifyTalk_text_content_tag notoReg fs-16"
          />
          <div className="divide" />
        </div>
        <div className="modifyTalk_btn flex align-center justify-center">
          <Link to={`/board/talk/detail/${id}`} className="modifyTalk_btn_back notoBold fs-24">
            뒤로가기
          </Link>
          <button
            type="button"
            className="modifyTalk_btn_ok notoBold fs-24"
            onClick={submit}
          >
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default TalkUpdate;