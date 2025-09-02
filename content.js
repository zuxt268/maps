chrome.storage.sync.get(["enabled", "name", "email", "apiKey"], (data) => {
    if (data.enabled) {
        const d = `${data.email} ${data.name} ${data.apiKey}`;
        window.alert(d);

        // クラスを利用する例
        const browser = new Browser(data.name, data.email);
        browser.fillForm();

        const chatgpt = new ChatGpt(data.apiKey);
        chatgpt.generateText("自己紹介文を書いてください")
            .then(text => {
                console.log("AI応答:", text);
                browser.fillTextarea(text);
            });
    }
});

class Browser {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    // ページ上の問い合わせフォームに入力
    fillForm() {
        const nameInput = document.querySelector("input[name='name'], input[type='text']");
        const emailInput = document.querySelector("input[name='email'], input[type='email']");

        if (nameInput) nameInput.value = this.name;
        if (emailInput) emailInput.value = this.email;
    }

    // テキストエリアにAIの文章を入力
    fillTextarea(text) {
        const textarea = document.querySelector("textarea");
        if (textarea) textarea.value = text;
    }
}

class ChatGpt {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.endpoint = "https://api.openai.com/v1/chat/completions";
    }

    async generateText(prompt) {
        try {
            const resp = await fetch(this.endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }]
                })
            });

            const json = await resp.json();
            return json.choices?.[0]?.message?.content ?? "";
        } catch (err) {
            console.error("ChatGPT呼び出し失敗:", err);
            return "";
        }
    }
}
