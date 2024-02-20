// Replace the placeholders below with the actual Firebase config values from your Firebase project settings
// https://console.firebase.google.com
const _0x4395f7=_0x48f3;function _0x48f3(_0x254878,_0x3d36cc){const _0x5df222=_0x5df2();return _0x48f3=function(_0x48f3c5,_0x267219){_0x48f3c5=_0x48f3c5-0x1ee;let _0x2edca5=_0x5df222[_0x48f3c5];return _0x2edca5;},_0x48f3(_0x254878,_0x3d36cc);}(function(_0x4bd57d,_0x914b58){const _0x381060=_0x48f3,_0x240c70=_0x4bd57d();while(!![]){try{const _0x35ed8e=parseInt(_0x381060(0x1ff))/0x1*(parseInt(_0x381060(0x1fb))/0x2)+-parseInt(_0x381060(0x1fe))/0x3*(-parseInt(_0x381060(0x1fc))/0x4)+-parseInt(_0x381060(0x201))/0x5*(parseInt(_0x381060(0x1f2))/0x6)+-parseInt(_0x381060(0x1f7))/0x7*(-parseInt(_0x381060(0x1ef))/0x8)+-parseInt(_0x381060(0x1f4))/0x9*(-parseInt(_0x381060(0x1fd))/0xa)+parseInt(_0x381060(0x1fa))/0xb*(parseInt(_0x381060(0x1ee))/0xc)+-parseInt(_0x381060(0x1f1))/0xd*(parseInt(_0x381060(0x1f9))/0xe);if(_0x35ed8e===_0x914b58)break;else _0x240c70['push'](_0x240c70['shift']());}catch(_0xd72008){_0x240c70['push'](_0x240c70['shift']());}}}(_0x5df2,0xa9523));function _0x5df2(){const _0x5728f3=['10322532952','452046egGWOJ','1199PhhZhv','428FZAwZO','19688plDifV','863270uhJdva','717TsEEmo','6206xUqkIC','1:10322532952:web:a8f6cc32df8b400583482d','15oAhRyc','5136NxQJsH','8nyyjaQ','cyber-cloud-207d9.appspot.com','1131zkPTQu','341094VNcsUi','cyber-cloud-207d9.firebaseapp.com','72ThdPwx','AIzaSyDjBBZvjf2XKKXRgtHOjGGzEif1lwJlVA4','cyber-cloud-207d9','3020633UAsKrW'];_0x5df2=function(){return _0x5728f3;};return _0x5df2();}const firebaseConfig={'apiKey':_0x4395f7(0x1f5),'authDomain':_0x4395f7(0x1f3),'projectId':_0x4395f7(0x1f6),'storageBucket':_0x4395f7(0x1f0),'messagingSenderId':_0x4395f7(0x1f8),'appId':_0x4395f7(0x200)};

// IMPORTANT: For enhanced security, consider encrypting your Firebase configuration using a tool like https://obfuscator.io before deploying your application.

// By encrypting your Firebase config, you can help protect sensitive information such as API keys, project IDs, and app IDs from being exposed in your client-side code.

// Steps to encrypt your Firebase config:
// 1. Copy your Firebase config object from your project settings.
// 2. Paste the config object into https://obfuscator.io and choose appropriate settings for encryption.
// 3. Generate the encrypted code and replace the original Firebase config in your code with the encrypted version.
// 4. Ensure that your application can still decrypt and use the encrypted Firebase config during runtime.


firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const firestore = firebase.firestore();

const FILE_INPUT_SELECTOR = '#fileInput';
const FILE_LIST_SELECTOR = '#fileList';
const UPLOAD_BTN_CLASS = '.upload-btn';

// Update the PATH constant to specify the desired location in Firebase Cloud Storage
const PATH = "files";
// This constant represents the path within Firebase Cloud Storage where your files will be stored.
// You can change this to any valid path within your Firebase Storage bucket.
// Suggestion: Keep the path the same

const storageRef = storage.ref(`${PATH}/`);

async function uploadFile() {
    const fileInput = document.querySelector(FILE_INPUT_SELECTOR);
    const file = fileInput.files[0];
    if (!file) {
        console.log('No file selected');
        return;
    }
      try {
          const fileList = await storageRef.listAll();
          const filesCount = fileList.items.length;
          const fileExtension = file.name.split('.').pop();
          const newFileName = `CF${filesCount + 1 < 10 ? '0' : ''}${filesCount + 1}.${fileExtension}`;
          const newFileRef = storageRef.child(newFileName);

          console.log('Uploading file with name:', newFileName);
          await newFileRef.put(file);
          console.log('File Uploaded successfully as:', newFileName);
          fileInput.value = '';
          listFiles();
      } catch (error) {
          console.error('Error in uploadFile:', error);
      }
    
}

function listFiles() {
    const fileListElement = document.querySelector(FILE_LIST_SELECTOR);
    fileListElement.innerHTML = '';

    storageRef.listAll().then(result => {
        const filesMetadata = [];
        let filesProcessed = 0;

        result.items.forEach(fileRef => {
            fileRef.getDownloadURL().then(url => {
                fileRef.getMetadata().then(metadata => {
                    filesMetadata.push({ url, name: fileRef.name, date: metadata.timeCreated });

                    filesProcessed++;
                    if (filesProcessed === result.items.length) {
                        displaySortedFiles(filesMetadata, fileListElement);
                    }
                }).catch(error => {
                    console.error('Error fetching metadata:', error);
                    filesProcessed++;
                });
            });
        });
    });
}

function displaySortedFiles(filesMetadata, fileListElement) {
    filesMetadata.sort((a, b) => new Date(b.date) - new Date(a.date));

    filesMetadata.forEach(({ url, name, date }) => {
        const formattedDate = new Date(date).toISOString().split('T')[0];
        fileListElement.innerHTML += `
            <div>
                <p><strong>${formattedDate}</strong> - ${name}</p>
                <div class="buttons">
                    <a href="javascript:void(0)" onclick="downloadFile('${url}', '${name}')" class="download-btn">Download</a>
                    <button class="file-delete-btn" onclick="deleteFile('${name}')">Delete</button>
                </div>
            </div>
            <hr>
        `;
    });

    updateElementDisplay();
}

function downloadFile(url, fileName) {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || 'download';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => document.body.removeChild(a), 100);
}

function deleteFile(fileName) {
    storage.ref(`${PATH}/${fileName}`).delete().then(() => {
      console.log('File Deleted');
      listFiles();
    });
}

window.onload = listFiles;

document.addEventListener('contextmenu', event => {
  event.preventDefault();
});

document.onkeydown = function (e) {
  return false;
}

