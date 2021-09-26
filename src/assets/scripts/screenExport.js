
chrome.runtime.onMessage.addListener(
    function ({ eventType }, sender, _callback) {
        if (eventType === 'screenExport') {
            getScreenExport().then(result => {
                result && _callback(result);
            });
        }
        return true;
    }
);

function getScreenExport() {
    return new Promise((resolve) => {
        const url = window.location.pathname.split('create/');
        if (url && url.length === 2) {
            const [, screntId] = url;
            const result = fetch('/api/easyv/v3/screen/export?id=' + screntId).then(result => result.json());
            resolve(result)
        } else {
            resolve();
        }
    })
}