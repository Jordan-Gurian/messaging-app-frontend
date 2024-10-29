import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ReactCrop, convertToPixelCrop, makeAspectCrop, centerCrop } from 'react-image-crop';
import setCanvasPreview from './../hooks/setCanvasPreview';
import 'react-image-crop/dist/ReactCrop.css';
import './ImageCropper.css';

export default function ImageCropper({ updateAvatar, closeModal }) {

    const MIN_DIMENSION = 150;
    const ASPECT_RATIO = 1;
    
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [crop, setCrop] = useState({ unit: '%', width: 30, height: 30 });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [sizeError, setSizeError] = useState("");


    function onSelectFile(event) {
        const file = event.target?.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            const imageElement = new Image();
            const imageUrl = reader.result?.toString() || "";
            imageElement.src = imageUrl;
      
            imageElement.onload = (e) => {
              if (sizeError) setSizeError("");
              const { naturalWidth, naturalHeight } = e.currentTarget;
              if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
                setSizeError(`Image must be at least ${MIN_DIMENSION} x ${MIN_DIMENSION} pixels.`);
                console.log(11111)
                return setImgSrc("");
              }
            };
            setImgSrc(imageUrl);
          };
          reader.readAsDataURL(file);
    };

    function onImageLoad(event) {
        const { width, height } = event.currentTarget;
        const cropWidthInPercent = Math.max((MIN_DIMENSION / width) * 100, 75);

        const crop = makeAspectCrop(
          {
              unit: "%",
              width: cropWidthInPercent,
          },
          ASPECT_RATIO,
          width,
          height
        );
        const centeredCrop = centerCrop(crop, width, height);
        setCrop(centeredCrop);
    };

    return (
        <div>
            <label className="crop-image-label">
                <span className="visually-hidden">Choose profile photo</span>
                <input
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                className="crop-image-input" 
                />
                <button className="file-input-button" onClick={() => document.querySelector('.crop-image-input').click()}>
                    Choose File
                </button>
            </label>
            {sizeError && <p className="error-text">{sizeError}</p>}
            {imgSrc && (
                <div className="crop-image-container">
                    <ReactCrop
                        src={imgSrc}
                        crop={crop}
                        onImageLoaded={onImageLoad}
                        onChange={(newCrop) => setCrop(newCrop)}
                        onComplete={(newCrop) => setCompletedCrop(newCrop)}
                        circularCrop
                        keepSelection
                        aspect={ASPECT_RATIO}
                        minWidth={MIN_DIMENSION}
                    >
                        <img
                            ref={imgRef}
                            src={imgSrc}
                            alt="Upload"
                            className="crop-image"
                            onLoad={onImageLoad}
                        />
                    </ReactCrop>
                    <button className="crop-image-button" onClick={() => {
                        setCanvasPreview(
                            imgRef.current, // HTMLImageElement
                            previewCanvasRef.current, // HTMLCanvasElement
                            convertToPixelCrop(
                                crop,
                                imgRef.current.width,
                                imgRef.current.height
                            )
                        );
                        // Use toBlob to create a Blob directly from the canvas
                        previewCanvasRef.current.toBlob(async (blob) => {
                            if (blob) {
                                updateAvatar(blob);
                                closeModal();
                                // Pass the Blob directly to the upload function
                            } else {
                                console.error("Canvas is empty or conversion to Blob failed.");
                            }
                        }, 'image/jpeg');
                        }}
                    >
                        Crop Image
                  </button>
                    <canvas className="hidden-canvas" ref={previewCanvasRef} />
                </div>
            )}
        </div>
    );
};

ImageCropper.propTypes = {
  updateAvatar: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};
