import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: "YOUR_AWS_REGION",
    credentials: {
        accessKeyId: "YOUR_ACCESS_KEY",
        secretAccessKey: "YOUR_SECRET_KEY"
    }
});

export const uploadImage = async (file) => {
    try {
        const filename = `food-images/${Date.now()}-${file.name}`;
        
        const command = new PutObjectCommand({
            Bucket: "YOUR_BUCKET_NAME",
            Key: filename,
            ContentType: file.type,
        });

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        
        // Upload the file using the signed URL
        const response = await fetch(signedUrl, {
            method: "PUT",
            body: file,
            headers: {
                "Content-Type": file.type,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to upload image");
        }

        // Return the public URL of the uploaded image
        return `https://YOUR_BUCKET_NAME.s3.YOUR_AWS_REGION.amazonaws.com/${filename}`;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}; 