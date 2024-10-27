import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ReactCrop, convertToPixelCrop, makeAspectCrop, centerCrop } from 'react-image-crop';
import setCanvasPreview from './../hooks/setCanvasPreview';
import 'react-image-crop/dist/ReactCrop.css';

export default function ImageCropper({ updateAvatar, closeModal }) {

    const MIN_DIMENSION = 150;
    const ASPECT_RATIO = 1;
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [crop, setCrop] = useState({ unit: '%', width: 30, height: 30 });
    const [completedCrop, setCompletedCrop] = useState(null);

    function onSelectFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => setImgSrc(reader.result);
        reader.readAsDataURL(file);
    };

    function onImageLoad(event) {
        const { width, height } = event.currentTarget;
        const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

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
            <input type="file" accept="image/*" onChange={onSelectFile} />
            {imgSrc && (
                <div>
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
                            className="react-crop"
                            onLoad={onImageLoad}
                        />
                    </ReactCrop>
                    <button onClick={() => {
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
                    <canvas ref={previewCanvasRef} style={{ display: 'none' }} />
                </div>
            )}
        </div>
    );
};

ImageCropper.propTypes = {
  updateAvatar: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};
