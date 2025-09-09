document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggle");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const apiKey = document.getElementById("apiKey");
    const saveButton = document.getElementById("save");

    // 初期状態の読み込み
    chrome.storage.sync.get(["enabled", "name", "email", "phone", "apiKey"], (data) => {
        toggle.checked = data.enabled ?? false;
        nameInput.value = data.name ?? "";
        emailInput.value = data.email ?? "";
        phoneInput.value = data.phone ?? "";
        apiKey.value = data.apiKey ?? "";
    });

    // 保存ボタン押下で値を保存
    saveButton.addEventListener("click", () => {
        chrome.storage.sync.set({
            enabled: toggle.checked,
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            apiKey: apiKey.value,
        }, () => {
            console.log("設定を保存しました");
            window.close();
        });
    });
});