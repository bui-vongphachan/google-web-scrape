export default function saveResultInClient(value: string, key: string) {
  const request = window.indexedDB.open("PageSourceDB", 1);

  request.onupgradeneeded = function (event) {
    const db = (event.target as IDBOpenDBRequest).result;
    db.createObjectStore("PageSource", { keyPath: "key" });
  };

  request.onsuccess = function (event) {
    const db = (event.target as IDBOpenDBRequest).result;

    const transaction = db.transaction("PageSource", "readwrite");
    const objectStore = transaction.objectStore("PageSource");

    const requestPut = objectStore.put({ key, value });

    requestPut.onsuccess = function () {
      console.log(`Data saved in IndexedDB for key ${key}`);
    };
  };
}
