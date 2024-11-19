import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useDropzone } from 'react-dropzone';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FileIcon from '../assets/video-file.png';
import './upload.scss';

const UploadVideo = () => {
  const navigate = useNavigate();
  const [noVideo, setNoVideo] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
  });
  const [passkey, setPasskey] = useState('');
  const [passkeyError, setPasskeyError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive, isFocused, isDragAccept, isDragReject } = useDropzone({ accept: { 'video/*': [] } });

  let classes = useMemo(() => (
    'upload-box' +
    (isFocused ? ' focused-style' : '') +
    (isDragAccept ? ' accept-style' : '') +
    (isDragReject ? ' reject-style' : '')
  ), [isFocused, isDragAccept, isDragReject]);

  async function handleUpload(e) {
    e.preventDefault();
    console.log(acceptedFiles);

    if (acceptedFiles.length === 0) {
      setNoVideo(true);
    } else {
      if (passkey === '0000') {
        setPasskeyError('');
        setNoVideo(false);

        const formDataToSend = new FormData();
        const fileName = `${localStorage.getItem('email')}_${formData.title}_${Date.now()}.mp4`;
        formDataToSend.append('video', acceptedFiles[0], fileName);
        formDataToSend.append('title', formData.title);
        formDataToSend.append('desc', formData.desc);
        formDataToSend.append('fileName', fileName);
        formDataToSend.append('name', localStorage.getItem('name'));

        const response = await axios.post("http://localhost:3000/video/upload", formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.status === 201) {
          setFormData({ title: '', desc: '' });
          setPasskey('');
          setIsSuccess(true);
        }
      } else {
        if (!passkey) {
          setPasskeyError('No Passkey Inputted');
        } else {
          setPasskeyError('Upload Restricted');
        }
      }
    }
  }

  useEffect(() => {
    if (acceptedFiles.length !== 0) {
      setNoVideo(false);
    }
  }, [acceptedFiles])

  return (
    <>
      <Header />

      <form onSubmit={handleUpload}>
        <div {...getRootProps({ className: classes })}>
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p>Drop the video here ...</p> :
              noVideo ?
                <p className="red-alert">Select a video to upload! Drag & drop a video here, or click to select a video</p> :
                <p>Drag & drop a video here, or click to select a video</p>
          }
        </div>

        <section className="video-details d-flex flex-column ">
          {acceptedFiles.map(file => (
            <div className="card" key={file.path}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center ">
                  <img src={FileIcon} alt="file icon" />
                  <h6 className="card-title">{file.path}</h6>
                </div>
                <h6 className="card-text">size: {(file.size / (1024 * 1024)).toFixed(2)} mb</h6>
              </div>
            </div>
          ))}

          <div className="input-group input-group-md mb-4 mt-4">
            <label className="input-group-text" htmlFor="title">CODE</label>
            <select
              className="form-select"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            >
              <option value="" disabled>Select an option</option>
              <option value="DATABASE TECHNOLOGIES (DBT)">MDS-270</option>
              <option value="FULL STACK WEB DEVELOPMENT (FSWD)">MDS-271</option>
              <option value="INFERENTIAL STATISTICS USING R (ISR)">MDS-272</option>
            </select>
          </div>

          <div className="input-group input-group-md mb-5">
            <label className="input-group-text" htmlFor="description">Description</label>
            <input
              type="text"
              className="form-control"
              id="description"
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              required
            />
          </div>

          <div className="input-group input-group-md mb-4 mt-4">
            <label className="input-group-text" htmlFor="passkey">Passkey</label>
            <input
              type="password"
              className={`form-control ${passkeyError ? 'is-invalid' : ''}`}
              id="passkey"
              value={passkey}
              onChange={(e) => {
                setPasskey(e.target.value);
                setPasskeyError('');
              }}
              required
            />
            {passkeyError && <div className="invalid-feedback">{passkeyError}</div>}
          </div>

          <button type="submit" className="btn btn-primary py-3 fw-bold">Upload</button>

          {isSuccess && (
            <div className="alert alert-success mt-4" role="alert">
              Video uploaded successfully! <a href="/myvideos">Go to My Videos &#8594;</a>
            </div>
          )}
        </section>
      </form>
      <Footer />
    </>
  );
}

export default UploadVideo;
