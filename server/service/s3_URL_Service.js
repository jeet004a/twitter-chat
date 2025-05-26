import dotenv from 'dotenv';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

dotenv.config()


const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.S3_ACCESS, // keep in .env
        secretAccessKey: process.env.AWS_S3_SECRET,
    }
})


export const generateS3UrlProfile = async() => {
    try {
        const key = Date.now().toString()
        const putObejectCommand = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: `/user-profile-image/${key}`,
            ContentType: ["image/png", "image/jpeg", "image/jpg"]
        })
        const signedURL = await getSignedUrl(s3Client, putObejectCommand)
        return { signedURL, ImageUrl: `https://test-bucket031999.s3.ap-south-1.amazonaws.com//user-profile-image/${key}` };
    } catch (error) {
        console.log('Error generating S3 URL', error);
    }
}