var storedEncryptedPassword = "c13256c816ad91d87bb3ffeb0ddbb32536f7097620a752bc7616a390b93771b9";

var secretKey = "obviously, no secrect"; // 用于加密和解密的密钥，可以替换为您自己的密钥

async function calculateSHA256(input) {
    // 例子
    // calculateSHA256("password")
    // .then(hash => {
    //     console.log('SHA-256 哈希值:', hash);
    // })
    // .catch(error => {
    //     console.error('计算哈希值时出错:', error);
    // });
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// 验证密码
function checkPassword() {
    var enteredPassword = document.getElementById('password').value;
    //   var encryptedEnteredPassword = CryptoJS.AES.encrypt(enteredPassword, encryptionKey, { iv: fixedIV, salt: fixedSalt }).toString();
    var encryptedEnteredPassword;
    calculateSHA256(enteredPassword).then(result => {
        console.log('异步操作完成:', result);
        encryptedEnteredPassword = result;
        // 请替换为您预先加密并存储的密码（这是极其不安全的示例）
        console.log('SHA-256 哈希值:', encryptedEnteredPassword);
        if (encryptedEnteredPassword === storedEncryptedPassword) {
            alert('你知道了密码，但是我从来不用这个密码存钱!      --Tom Noob');
        } else {
            console.log(encryptedEnteredPassword);
            alert('不对，而且没有提示!      --Tom Noob');
        }
    }).catch(error => {
        console.error('发生错误:', error);
    });
}

function checkPasswordOnLoad() {
    var password = prompt('Enter Password:');
    var enteredPassword = password;

    var encryptedEnteredPassword;
    calculateSHA256(enteredPassword).then(result => {
        console.log('异步操作完成:', result);
        encryptedEnteredPassword = result;
        // 请替换为您预先加密并存储的密码（这是极其不安全的示例）
        console.log('SHA-256 哈希值:', encryptedEnteredPassword);
        if (encryptedEnteredPassword === storedEncryptedPassword) {
            secretKey = password;
            alert('你知道了密码，但是我从来不用这个密码存钱!      --Tom Noob');
        } else {
            console.log(encryptedEnteredPassword);
            alert('不对，而且没有提示!      --Tom Noob');
            window.location.href = 'about:blank'; // 重定向到一个空白页面或其他页面
        }
    }).catch(error => {
        console.error('发生错误:', error);
    });
}

async function readAndEncryptFileContent() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0]; // 获取用户选择的文件

    var reader = new FileReader();

    reader.onload = async function (event) {
        var fileContent = event.target.result; // 获取文件内容
        console.log("Loaded content from file:", fileContent);
        alert("Content loaded from file:\n\n" + fileContent);
        var encryptedContent = await encryptFile(fileContent);
        download(encryptedContent);
        decryptFile(encryptedContent);
    };

    reader.onerror = function (event) {
        console.error("Error loading file:", event.target.error);
        alert("Error loading file!");
    };

    reader.readAsText(file); // 读取文件内容为文本
}

async function encryptFile(originalContent) {
    encryptedContent = CryptoJS.AES.encrypt(originalContent, secretKey).toString();
    console.log("Encrypted Content:", encryptedContent);
    alert("File Encrypted!");
    return encryptedContent;
}

async function decryptFile(encryptedContent) {
    console.log("Encrypted Content:", encryptedContent);
    var decrypted = CryptoJS.AES.decrypt(encryptedContent, secretKey).toString(CryptoJS.enc.Utf8);
    console.log("Decrypted Content:", decrypted);
    openDecryptedContentInNewPage(decrypted);
}

async function openDecryptedContentInNewPage(decryptedContent) {
    // 创建一个新窗口或标签页
    var newWindow = window.open();

    // 将解密后的内容作为新页面的内容加载到新窗口中
    newWindow.document.write(decryptedContent);
}

async function download(encryptedContent) {
    var blob = new Blob([encryptedContent], { type: 'text/plain' });
    // 创建URL对象
    var url = window.URL.createObjectURL(blob);

    // 创建一个下载链接
    var a = document.createElement('a');
    a.href = url;
    a.download = 'encrypted-content.txt'; // 设置文件名
    document.body.appendChild(a);
    a.click(); // 模拟点击下载链接

    // 清理资源
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

async function fetchFileContent(fileURL) {
    try {
        const response = await fetch(fileURL);
        if (response.ok) {
            const fileContent = await response.text();
            return fileContent;
        } else {
            throw new Error('Failed to fetch the file.');
        }
    } catch (error) {
        console.error('Error fetching the file:', error);
        return null;
    }
}

async function decryptFixedEncryptedContent() {
    const fileURL = 'https://raw.githubusercontent.com/zhutianqi/aboutme/master/encrypted-content';
    try {
        const encryptedContent = await fetchFileContent(fileURL);
        if (encryptedContent) {
            decryptFile(encryptedContent);

        } else {
            console.error('Could not fetch the encrypted content.');
        }
    } catch (error) {
        console.error('Error decrypting the file:', error);
    }

}