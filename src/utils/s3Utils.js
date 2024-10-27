import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
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
        ContentType: 'image/jpeg',
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

export async function deleteS3Objects(s3Client, key=null, folderPath=null) {
    if (key) {
        const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: key });
        try {
            await s3Client.send(command);
        } catch (error) {
            console.log(error)
            return { error }
        }
    } else if (folderPath) {
        try {
            const getCommand =  new ListObjectsV2Command({ Bucket: BUCKET, Prefix: folderPath });
            // Step 1: List all objects in the bucket
            const listedObjects = await s3Client.send(getCommand);
            if (!listedObjects || listedObjects.KeyCount === 0) {
              console.log('No objects found in the bucket.');
              return;
            }
        
            // Step 2: Prepare the objects for deletion
            const objectsToDelete = listedObjects.Contents.map((object) => ({ Key: object.Key }));
            const deleteCommand = new DeleteObjectsCommand({ Bucket: BUCKET, Delete: { Objects: objectsToDelete } });
            // Step 3: Delete the objects
            await s3Client.send(deleteCommand)

            console.log('All objects deleted successfully.');
        
            // If there are more objects, repeat the process
            if (listedObjects.IsTruncated) {
              await deleteS3Objects(s3Client, null, folderPath); // Recursive call to delete more objects
            }
    
        } catch (error) {
            console.error('Error deleting objects:', error);
        }
    }
    
}
