chrome.runtime.onMessage.addListener(
    function ({ key, eventType }, sender, _callback) {
        if (eventType === 'import-data-copy') {
            key && getIndexDB(key).then(result => {
                result && _callback(result);
            });
        }
        return true; //异步要这么写
    }
);

function getIndexDB(key) {
    return new Promise((resolve, reject) => {
        const EasyvLocalDB = window.indexedDB.open('EasyvLocalDB', 4);
        EasyvLocalDB.onsuccess =
            function (ev) {
                const db = ev.target.result;
                const request = db.transaction(['screen']).objectStore('screen').get(key);
                request.onsuccess = function (ev) {
                    resolve(ev.target.result)
                }
                request.onerror = function () {
                    reject()
                }
            }
        EasyvLocalDB.onerror = function () {
            reject();
        }
    })
}