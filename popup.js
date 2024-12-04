// Load jobs from chrome.storage.local
function loadJobs() {
    chrome.storage.local.get(['jobs'], (result) => {
        const jobs = result.jobs || [];
        const jobList = document.getElementById('jobList');
        jobList.innerHTML = ''; // Clear existing jobs

        jobs.forEach((job, index) => {
            const jobItem = document.createElement('div');
            jobItem.classList.add('job-item');
            jobItem.innerHTML = `
                <strong>${job.title}</strong><br>
                <p>${job.description}</p>
                <p class="status-label">Status: ${job.status}</p>
                <p>${job.notes}</p>
                <button class="editJob" data-index="${index}">Edit</button>
                <button class="removeJob" data-index="${index}">Remove</button>
            `;
            jobList.appendChild(jobItem);
        });

        // Add event listeners for editing and removing jobs
        document.querySelectorAll('.removeJob').forEach((button) => {
            button.addEventListener('click', function () {
                const index = button.getAttribute('data-index');
                removeJob(index);
            });
        });

        document.querySelectorAll('.editJob').forEach((button) => {
            button.addEventListener('click', function () {
                const index = button.getAttribute('data-index');
                editJob(index);
            });
        });
    });
}

// Save the job when the form is submitted
document.getElementById('saveJob').addEventListener('click', (event) => {
    const title = document.getElementById('jobTitle').value;
    const description = document.getElementById('jobDescription').value;
    const notes = document.getElementById('jobNotes').value;
    const status = document.getElementById('jobStatus').value;

    if (title && description) {
        const job = { title, description, notes, status };

        // Retrieve existing jobs from chrome.storage.local
        chrome.storage.local.get(['jobs'], (result) => {
            const jobs = result.jobs || [];

            // Check if editing an existing job
            const editIndex = document.getElementById('saveJob').getAttribute('data-edit-index');
            if (editIndex !== null) {
                jobs[editIndex] = job; // Edit the job at the specified index
            } else {
                // Add new job to the array
                jobs.push(job);
            }

            // Save updated jobs array back to chrome.storage.local
            chrome.storage.local.set({ jobs: jobs }, () => {
                console.log('Job saved');
                loadJobs(); // Reload jobs after saving
                resetForm(); // Reset form after save
            });
        });
    }
});

// Remove a job
function removeJob(index) {
    chrome.storage.local.get(['jobs'], (result) => {
        const jobs = result.jobs || [];
        jobs.splice(index, 1); // Remove job at the specified index
        chrome.storage.local.set({ jobs: jobs }, () => {
            console.log('Job removed');
            loadJobs(); // Reload jobs after removal
        });
    });
}

// Edit a job
function editJob(index) {
    chrome.storage.local.get(['jobs'], (result) => {
        const jobs = result.jobs || [];
        const job = jobs[index];

        // Populate the form with the job details for editing
        document.getElementById('jobTitle').value = job.title;
        document.getElementById('jobDescription').value = job.description;
        document.getElementById('jobNotes').value = job.notes;
        document.getElementById('jobStatus').value = job.status;

        // Set the index in the save button to know which job is being edited
        document.getElementById('saveJob').setAttribute('data-edit-index', index);
    });
}

// Reset form after saving or canceling edit
function resetForm() {
    document.getElementById('jobTitle').value = '';
    document.getElementById('jobDescription').value = '';
    document.getElementById('jobNotes').value = '';
    document.getElementById('jobStatus').value = 'Need to Apply';
    document.getElementById('saveJob').removeAttribute('data-edit-index'); // Remove edit index
}

// Load jobs when the popup is opened
document.addEventListener('DOMContentLoaded', loadJobs);
