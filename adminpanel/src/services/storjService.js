import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const storjClient = new S3Client({
    region: "global",
    endpoint: "https://gateway.storjshare.io",
    credentials: {
        accessKeyId: "jvbfemkjicvhitqmyvnvonpbo7ba",
        secretAccessKey: "jz3dadqgfzbrqgqyfpgf5xvkpxviw5c4xlcluz3oeo3ag6l27o6fk"
    },
    forcePathStyle: true,
    maxAttempts: 3
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const uploadImage = async (file, maxRetries = 3) => {
    let retryCount = 0;
    let lastError;

    while (retryCount < maxRetries) {
        try {
            // Generate a UUID for the filename
            const uuid = crypto.randomUUID();
            const filename = `${uuid}.${file.name.split('.').pop()}`;
            
            const command = new PutObjectCommand({
                Bucket: "foodies-images",
                Key: filename,
                ContentType: file.type,
                ACL: "public-read"
            });

            console.log("Generating signed URL...");
            const signedUrl = await getSignedUrl(storjClient, command, { expiresIn: 3600 });
            console.log("Signed URL generated:", signedUrl);
            
            console.log("Uploading file...");
            const response = await fetch(signedUrl, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type,
                },
            });

            if (response.status === 429) {
                const waitTime = Math.pow(2, retryCount) * 1000;
                console.log(`Rate limited. Waiting ${waitTime}ms before retry...`);
                await delay(waitTime);
                retryCount++;
                continue;
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Upload failed:", {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorText
                });
                throw new Error(`Failed to upload image: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const imageUrl = `https://link.storjshare.io/s/jvbfemkjicvhitqmyvnvonpbo7ba/foodies-images/${filename}`;
            console.log("Upload successful. Image URL:", imageUrl);
            return imageUrl;
        } catch (error) {
            lastError = error;
            console.error("Upload attempt failed:", error);
            
            if (error.message.includes('429') || error.message.includes('net::ERR_INTERNET_DISCONNECTED')) {
                const waitTime = Math.pow(2, retryCount) * 1000;
                console.log(`Connection error. Waiting ${waitTime}ms before retry...`);
                await delay(waitTime);
                retryCount++;
                continue;
            }
            throw error;
        }
    }

    throw new Error(`Failed to upload image after ${maxRetries} retries: ${lastError.message}`);
}; 