document.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.getElementById("dropArea");
    const fileInput = document.getElementById("fileInput");
    const browseButton = document.getElementById("browseButton");

    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropArea.addEventListener(eventName, (e) => e.preventDefault());
        dropArea.addEventListener(eventName, (e) => e.stopPropagation());
    });

    dropArea.addEventListener("dragover", () => {
        dropArea.classList.add("highlight");
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("highlight");
    });

    dropArea.addEventListener("drop", (e) => {
        dropArea.classList.remove("highlight");
        const files = e.dataTransfer.files;
        handleFile(files[0]);
    });

    browseButton.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", (e) => {
        const files = e.target.files;
        handleFile(files[0]);
    });

    function handleFile(file) {
        const apiUrl = "https://file-to-pdf-api.onrender.com/convert";

        if (!file) return;

        const allowedTypes = [
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/rtf",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "image/jpeg",
            "image/png",
            "image/jfif",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/plain",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Unsupported file type. Please upload a valid file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        const loader = document.createElement("div");
        loader.className = "loader";
        dropArea.appendChild(loader);

        fetch(apiUrl, {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }
                return response.blob();
            })
            .then((blob) => {
                loader.remove();
                const blobUrl = URL.createObjectURL(blob);
                window.open(blobUrl, "_blank");
            })
            .catch((error) => {
                loader.remove();
                console.error("Error uploading file:", error);
                alert(`Failed to upload file: ${error.message}`);
            });
    }
});
