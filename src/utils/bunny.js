// Utility functions for Bunny.net Integration

// User provided credentials
const BUNNY_STORAGE_ZONE = "my-storage-everyday"; // From the username in screenshot: my-storage-everyday
const BUNNY_ACCESS_KEY = "74642ccd-9cbe-4ccb-aa478b2de19b-107f-4335"; // The Read-Write Password provided
const BUNNY_PULL_ZONE = "everystorages3.b-cdn.net"; // The CDN domain provided
const BUNNY_REGION = "la"; // Usually storage.bunnycdn.com translates to LA or NY, let's try direct first, then falback
// Note: If the storage API endpoint is not the main one, it needs the region prefix like https://la.storage.bunnycdn.com
// Since the hostname is storage.bunnycdn.com, it's the Falkenstein (FNS) main region

/**
 * Uploads a file to Bunny.net storage
 * @param {File} file The file to upload
 * @param {string} folder Optional folder path (e.g. "products")
 * @returns {Promise<string>} The public URL to access the image via CDN
 */
export const uploadToBunny = async (file, folder = "products") => {
    if (!file) throw new Error("No file provided");

    // Create a unique filename avoiding spaces
    const uniqueFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
    
    // Bunny.net Storage API URL
    // As shown in the dashboard screenshot: storage.bunnycdn.com
    const url = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${folder}/${uniqueFileName}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'AccessKey': BUNNY_ACCESS_KEY,
                'Content-Type': 'application/octet-stream',
            },
            body: file
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Bunny.net upload failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        // Return the public URL using the Pull Zone
        return `https://${BUNNY_PULL_ZONE}/${folder}/${uniqueFileName}`;

    } catch (error) {
        console.error("Error uploading to Bunny.net:", error);
        throw error;
    }
};
