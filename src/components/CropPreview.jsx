import { useEffect, useRef } from 'react';

import setCanvasPreview from './../hooks/setCanvasPreview';

export default function CropPreview({ img, crop }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!crop?.width || !crop?.height || !img || !canvasRef.current) {
            return;
        }

        setCanvasPreview(img, canvasRef.current, crop, 1, 0);
    }, [img, crop]);

    if (!!crop && !!img) {
        return <canvas ref={canvasRef} />;
    }
}