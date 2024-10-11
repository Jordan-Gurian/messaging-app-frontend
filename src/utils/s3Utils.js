import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ACCESS_KEY = import.meta.env.VITE_S3_ACCESS_KEY;
const SECRET_KEY = import.meta.env.VITE_S3_SECRET_KEY;
const BUCKET = import.meta.env.VITE_S3_BUCKET_NAME;
const REGION = import.meta.env.VITE_S3_REGION;

export function createS3Client() {
    const credentials = {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY,
    }

    const config = {
        region: REGION,
        credentials,
    }

    return new S3Client(config);
}

export async function uploadToS3(s3Client, file, key) {    
    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: file,
    });

    try {
        await s3Client.send(command);
    } catch (error) {
        console.log(error)
        return { error }
    }
}

export async function getUserPresignedUrl(s3Client, key) {
    try {
        const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 }); // default
        return presignedUrl;
    } catch (error) {
      console.log(error);
      return { error };
    }
};