import { Form, Input } from "reactstrap";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

import Modal from "../Modal";
import { AppContext } from "../../store/AppContext";
import { getSignedUrlForUpload, uploadVideoToS3, saveMetaData, getSignedUrlForThumbnail } from "../../Services";

import "./addNewRecord.scss";

const AddNewRecord = (props) => {
  const [title, setTitle] = useState("");
  const [uploadedFile, setFile] = useState('');
  const [fileName, setFileName]= useState('');
  const [isSearch, setSearchStatus] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [description, setDescription] = useState("");
  const [isModalOpen, setModalStatus] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailName, setThumbnailName] = useState('');
  const [uploadInprogress, setProgress] = useState(false);
  const [researchId, setResearchId] = useState('');
  const { categories } = useContext(AppContext);
  
  const [selectedCategory, setCategory] = useState(categories[0] || '');

  const onChange = (value, updatedField) => {
    updatedField(value);
  };

  const handleFileSelection = (e) => {
    const reader = new FileReader();
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }

    reader.onload = (renderEvent) =>  {
      setVideoPreview(renderEvent.target.result)
    }

    let fileName = e.target.value.split('\\');
    let length = fileName.length;
    fileName = length > 0 ? fileName[length - 1] : fileName[0];
    fileName = fileName.length > 20 ? fileName.slice(fileName.length - 21, fileName.length) : fileName;
    setFileName(fileName);
    setFile(e.target.files[0]);
    setShowVideo(true);
  };

  const getSnapModalContent = () => {
    return <>
        <video id="my-video" src={videoPreview} type="video/mp4" controls></video>
        <div id="snapshot">
            <div className="help">Click on "Snap" button to generate a thumbnail for your uploaded record. And click on "Confirm" button to continue.</div>
        </div>
    </>
  };

  const getModalContent = () => {
    return (
      <Form className="add-new">
        <Input
          type="text"
          name="title"
          id="Tile"
          placeholder="Title"
          value={title}
          plaintext={false}
          onChange={(e) => onChange(e.target.value, setTitle)}
        />
        <Input
          type="textarea"
          name="description"
          id="Description"
          placeholder="Description"
          value={description}
          plaintext={false}
          onChange={(e) => onChange(e.target.value, setDescription)}
        />
        <Input
          placeholder="Select Category"
          name="select"
          type="select"
          onChange={(e) => onChange(e.target.value, setCategory)}
        >
          {categories.map((item) => (
            <option>{item}</option>
          ))}
        </Input>
        <Input
          type="text"
          name="researchId"
          id="researchId"
          placeholder="Research Id (Optional)"
          value={researchId}
          onChange={(e) => onChange(e.target.value, setResearchId)}
        />
        <Input
          type="file"
          name="uploadFile"
          id="uploadFile"
          onChange={handleFileSelection}
        />
      </Form>
    );
  };

  const onConfirm = async() => {
    setProgress(true);
    let signedDetails = {};
    let tumbnailDetails = {};
    let formData = new FormData();
    let thumbnailData = new FormData();

    signedDetails = await getSignedUrlForUpload({name: fileName});
    if (signedDetails?.error) {
        setProgress(false);
        return;
    }

    tumbnailDetails = await getSignedUrlForThumbnail({ name: thumbnailName });
    if (tumbnailDetails?.error) {
        setProgress(false);
        return;
    }
    
    { // Video block
      formData.append("bucket", signedDetails.response.fields.bucket);
      formData.append("X-Amz-Algorithm", signedDetails.response.fields["X-Amz-Algorithm"]);
      formData.append("X-Amz-Credential", signedDetails.response.fields["X-Amz-Credential"]);
      formData.append("X-Amz-Date", signedDetails.response.fields["X-Amz-Date"]);
      formData.append("key", signedDetails.response.fields.key);
      formData.append("Policy", signedDetails.response.fields.Policy);
      formData.append("X-Amz-Signature", signedDetails.response.fields["X-Amz-Signature"]);
      formData.append("Content-Type", signedDetails.response.fields["Content-Type"])
      formData.append("success_action_status", signedDetails.response.fields.success_action_status);
      formData.append("file", uploadedFile);
      let response = await axios.post(signedDetails.response.url, formData);
      if (response.error) {
        setProgress(false);
        return;
      }
    }

    { // Thumbnail block
      

      const base64Response = await fetch(thumbnail);
      const blob = await base64Response.blob();
      
      thumbnailData.append("bucket", tumbnailDetails.response.fields.bucket);
      thumbnailData.append("X-Amz-Algorithm", tumbnailDetails.response.fields["X-Amz-Algorithm"]);
      thumbnailData.append("X-Amz-Credential", tumbnailDetails.response.fields["X-Amz-Credential"]);
      thumbnailData.append("X-Amz-Date", tumbnailDetails.response.fields["X-Amz-Date"]);
      thumbnailData.append("key", tumbnailDetails.response.fields.key);
      thumbnailData.append("Policy", tumbnailDetails.response.fields.Policy);
      thumbnailData.append("X-Amz-Signature", tumbnailDetails.response.fields["X-Amz-Signature"]);
      thumbnailData.append("Content-Type", tumbnailDetails.response.fields["Content-Type"])
      thumbnailData.append("success_action_status", tumbnailDetails.response.fields.success_action_status);
      thumbnailData.append("file", blob);
      let response = await axios.post(tumbnailDetails.response.url,thumbnailData);
      if (response.error) {
        setProgress(false);
        return;
      }
    }

    let savePayload = {
      videoName: title,
      videoKey: signedDetails.response.fields.key,
      imageKey: tumbnailDetails.response.fields.key,
      description: description,
      category: selectedCategory,
      ...(researchId !== '' ? {researchId: researchId} : {})
    };
    
    await saveMetaData(savePayload);
    setProgress(false);
    props.close();
  };

  const onClose = () => {
    setFile(null);
    setFileName('');
    setThumbnail(null);
    setThumbnailName('');
    setModalStatus(false);
    setShowVideo(false);
    setProgress(false);
    props.close();
  };

  const snapClickHandler = () => {
    let imgElement = new Image();
    let canvas = document.createElement('canvas');
    let output = document.getElementById('snapshot');
    let video = document.getElementById('my-video');

    // canvas.width = 340;
    // canvas.height = 460;

    let ctx = canvas.getContext('2d');
    ctx.drawImage( video, 0, 0, canvas.width, canvas.height );

    let image = canvas.toDataURL('image/jpeg');
    imgElement.src = image;
    if (output.getElementsByTagName("img").length > 0) {
        // Remove Img tag, if already a screenshot is taken.
        output.getElementsByTagName("img")[0].remove();
    }
    output.appendChild(imgElement);
    setThumbnail(canvas.toDataURL('image/jpeg'));

    { // Block to set, thumbnail name.
        let name = fileName.split(".")[0];
        name = name.length > 15 ? name.slice(0, 15) : name;
        setThumbnailName(`${name}.jpeg`);
    }
  };

  return (
    <>
        <Modal
        className="add-new-modal"
        title="Add new record"
        content={getModalContent()}
        primary="Submit"
        secondary="Cancel"
        primaryClick={onConfirm}
        secondaryClick={onClose}
        isLoading={uploadInprogress}
        onClose={onClose}
        />
        {
            showVideo && (
            <Modal
                className='snap-for-thumbnail'
                title="Take a snap for video Thumbnail"
                content={getSnapModalContent()}
                primary="Confirm"
                primaryClick={() => setShowVideo(false)}
                secondary="Snap"
                secondaryClick={snapClickHandler}
                isPrimaryButtonDisabled={!thumbnail}
                primaryButtonDisabledContent="Please take a Snap for the uploaded video, before proceeding further"
                onClose={() => setShowVideo(false)}
                onLoad={() => {
                  setThumbnail(null);
                  setThumbnailName('');
                }}
            />
            )
        }
    </>
  );
};

export default AddNewRecord;
