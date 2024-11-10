export async function urlToBlob(fileUrl) {
    // Fetch the file from the URL
    const response = await fetch(fileUrl);

    // Check if the fetch was successful
    if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // Convert response to blob
    const blob = await response.blob();
    return blob;
}