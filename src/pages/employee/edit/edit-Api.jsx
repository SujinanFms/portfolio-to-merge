import axios from "axios";
import React, { useState } from "react";

const EEditApi = () => {
  const [file, setFile] = useState(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    var data = new FormData();
    data.append("employee_id", "1");
    data.append("education_id", "1");
    data.append("file", file);

    var config = {
      method: "post",
      url: "https://portfolio.blackphoenix.digital/uploadImage",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <form>
        <input
          id="pic"
          type="file"
          accept=".jpg, .png"
          onChange={handleFileSelect}
        />
        <button onClick={handleUpload} disabled={!file}>
          Upload
        </button>
      </form>
    </>
  );
};

export default EEditApi;
