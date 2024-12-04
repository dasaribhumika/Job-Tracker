chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getJobDetails') {
        sendResponse({ jobTitle: 'Software Engineer', jobDescription: 'Develop software' });
    }
});
