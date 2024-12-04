chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getJobDetails') {
        sendResponse({ jobTitle: 'Software Engineer', jobDescription: 'Develop software' });
    }
});
