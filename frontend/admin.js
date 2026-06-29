// ===========================================
// Helply Admin Dashboard
// ===========================================

const API = "http://127.0.0.1:8000";
let allDocuments = [];
let toastTimer = null;


// ===========================================
// HTML Elements
// ===========================================

const documentTable =
    document.getElementById("documentTable");

const documentCount =
    document.getElementById("documentCount");

const chunkCount =
    document.getElementById("chunkCount");

const pdfFile =
    document.getElementById("pdfFile");

const uploadButton =
    document.getElementById("uploadButton");

const searchBox =
    document.getElementById("searchBox");

const toast =
    document.getElementById("toast");


// ===========================================
// Load Documents
// ===========================================

async function loadDocuments() {

    try {

        const response = await fetch(`${API}/documents`);

        const result = await response.json();

        allDocuments = result.data;

        renderDocuments(allDocuments);

    }

    catch(error){

        console.log(error);

    }

}


// ===========================================
// Render Table
// ===========================================

function renderDocuments(documents){

    documentTable.innerHTML = "";

    if(documents.length === 0){

        documentTable.innerHTML = `

<tr>

<td colspan="4" style="text-align:center;padding:40px;">

<h3>No Documents Found</h3>

<p>Upload your first PDF.</p>

</td>

</tr>

`;

        return;

    }

    documents.forEach(doc => {

        documentTable.innerHTML += `

<tr>

<td>${doc.filename}</td>

<td>${doc.upload_date}</td>

<td>${doc.chunk_count}</td>

<td>

<span class="ready">

Ready

</span>

</td>

<td>

<button
class="deleteButton"
data-file="${doc.filename}">

🗑 Delete

</button>

</td>

</tr>

`;

    });

    const buttons =
    document.querySelectorAll(".deleteButton");

    buttons.forEach(button=>{

        button.addEventListener("click",async ()=>{

            const filename=button.dataset.file;

            if(!confirm(`Delete ${filename}?`))
                return;

            await deleteDocument(filename);

        });

    });

}

// ===========================================
// Load Dashboard Stats
// ===========================================

async function loadStats() {

    try {

        const response = await fetch(

            `${API}/stats`

        );

        const result = await response.json();

        documentCount.textContent =
        result.data.documents;

        chunkCount.textContent =
        result.data.chunks;

    }

    catch(error){

        console.log(error);

    }

}


// ===========================================
// Upload PDF
// ===========================================

async function uploadPDF() {

    if (pdfFile.files.length === 0) {

        showToast("Please choose a PDF.");

        return;

    }

    const formData = new FormData();

    uploadButton.disabled = true;

    uploadButton.textContent = "Uploading...";

    formData.append(
        "file",
        pdfFile.files[0]
    );

    try {

        const response = await fetch(

            `${API}/upload`,

            {
                method: "POST",
                body: formData
            }

        );

        const result = await response.json();

        showToast(result.message);

        if (!result.success) {

            uploadButton.disabled = false;
            uploadButton.textContent = "Upload";

            return;

        }

        pdfFile.value = "";

        await loadDocuments();

        await loadStats();

        uploadButton.disabled = false;

        uploadButton.textContent = "Upload";

    }

    catch(error){

        console.log(error);

        uploadButton.disabled = false;

        uploadButton.textContent = "Upload";

    }

}


// ===========================================
// Delete PDF
// ===========================================

async function deleteDocument(filename){

    try{

        const response = await fetch(

            `${API}/documents/${encodeURIComponent(filename)}`,

            {

                method:"DELETE"

            }

        );

        const result = await response.json();

        showToast(result.message);

        await new Promise(resolve => setTimeout(resolve,1500));

        await loadDocuments();

        await loadStats();

    }

    catch(error){

        console.log(error);

    }

}

//===============================

searchBox.addEventListener("keyup", () => {

    const keyword = searchBox.value.toLowerCase();

    const filtered = allDocuments.filter(doc =>

        doc.filename.toLowerCase().includes(keyword)

    );

    renderDocuments(filtered);

});


//================================
//==========TOAST=================
//================================


function showToast(message){

    clearTimeout(toastTimer);

    toast.textContent = message;

    toast.classList.remove("show");

    void toast.offsetWidth;

    toast.classList.add("show");

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    },3000);

}
// ===========================================
// Start
// ===========================================

loadDocuments();

loadStats();

uploadButton.addEventListener(

    "click",

    uploadPDF

);

