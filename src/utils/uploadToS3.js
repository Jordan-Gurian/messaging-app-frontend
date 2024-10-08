import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export default async function useUploadToS3(file, key) {

    const credentials = {
        accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY,
        secretAccessKey: import.meta.env.VITE_S3_SECRET_KEY,
    }

    const config = {
        region: import.meta.env.VITE_S3_REGION,
        credentials,
    }

    const s3 = new S3Client(config);
    const BUCKET = import.meta.env.VITE_S3_BUCKET_NAME;
    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: file, // this ain't it
    });

    try {
        await s3.send(command);
    } catch (error) {
        console.log(error)
        return { error }
    }
   
    
}