import React, { useState } from "react";
import axios from "axios";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

	const onFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	};
  
	const onFileUpload = () => {
		const formData = new FormData();
		formData.append(
			"myFile",
			selectedFile,
			selectedFile.name
		);
		console.log(selectedFile);
		axios.post("api/uploadfile", formData);
	};

	const fileData = () => {
		if (selectedFile) {
			return (
				<div>
					<h2>File Details:</h2>
					<p>File Name: {selectedFile.name}</p>
					<p>File Type: {selectedFile.type}</p>
					<p>
						Last Modified: {selectedFile.lastModifiedDate.toDateString()}
					</p>
				</div>
			);
		} else {
			return (
				<div>
					<br />
					<h4>Choose before Pressing the Upload button</h4>
				</div>
			);
		}
	};

	return (
		<div>
			<h3>Upload .ttf File Here</h3>
			<div>
				<input type="file" onChange={onFileChange} />
				<button onClick={onFileUpload}>Upload</button>
			</div>
			{fileData()}
		</div>
	);
};

export default Upload;
