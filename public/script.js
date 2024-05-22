const fetchButton = document.getElementById('fetchButton');
const bucketInput = document.getElementById('bucketInput');
const keyInput = document.getElementById('keyInput');
const output = document.getElementById('output');
const uploadButton = document.getElementById('uploadButton');
const uploadInput = document.getElementById('uploadInput');
const downloadButton = document.getElementById('downloadButton');
const downloadLink = document.getElementById('downloadLink');

fetchButton.addEventListener('click', async () => {
    const bucket = bucketInput.value;
    const key = keyInput.value;

    try {
        const response = await fetch(`/s3/${bucket}/${key}`);
        const text = await response.text();
        output.textContent = text;
    } catch (error) {
        output.textContent = `Error: ${error.message}`;
    }
});

uploadButton.addEventListener('click', async () => {
    const bucket = bucketInput.value;
    const key = keyInput.value;
    const file = uploadInput.files[0];

    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`/s3/upload/${bucket}/${key}`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            output.textContent = 'File uploaded successfully!';
        } else {
            output.textContent = 'Upload failed.';
        }
    } catch (error) {
        output.textContent = `Error: ${error.message}`;
    }
});

downloadButton.addEventListener('click', async () => {
    const bucket = bucketInput.value;
    const key = keyInput.value;

    try {
        const response = await fetch(`/s3/download/${bucket}/${key}`);

        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = key; // Set the download filename
            downloadLink.click();
        } else {
            output.textContent = 'Download failed.';
        }
    } catch (error) {
        output.textContent = `Error: ${error.message}`;
    }
});