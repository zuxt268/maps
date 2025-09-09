chrome.storage.sync.get(["enabled", "name", "email", "phone", "apiKey"], (data) => {
    if (data.enabled) {
        // ローディング表示
        showLoading();

        // クラスを利用する例
        const browser = new Browser(data.name, data.email, data.phone);
        browser.fillForm(() => {
            // フォーム入力完了後、ローディングを非表示
            hideLoading();
        });
    }
});

// ローディング表示関数
function showLoading() {
    // 既存のローディングがあれば削除
    const existingLoader = document.getElementById('form-filler-loader');
    if (existingLoader) {
        existingLoader.remove();
    }

    // ローディングオーバーレイを作成
    const overlay = document.createElement('div');
    overlay.id = 'form-filler-loader';
    overlay.innerHTML = `
        <div class="overlay">
            <div class="spinner-container">
                <div class="spinner"></div>
                <div class="loading-text">フォームに自動入力中...</div>
            </div>
        </div>
    `;

    // スタイルを追加
    overlay.innerHTML += `
        <style>
            #form-filler-loader .overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.6);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            #form-filler-loader .spinner-container {
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                text-align: center;
            }

            #form-filler-loader .spinner {
                width: 50px;
                height: 50px;
                border: 5px solid #f3f3f3;
                border-top: 5px solid #4CAF50;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }

            #form-filler-loader .loading-text {
                font-size: 16px;
                color: #333;
                font-weight: 500;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;

    document.body.appendChild(overlay);
}

// ローディング非表示関数
function hideLoading() {
    const loader = document.getElementById('form-filler-loader');
    if (loader) {
        loader.remove();
    }
}

class Browser {
    constructor(name, email, phone) {
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    // ページ上の問い合わせフォームに入力
    fillForm(callback) {
        this.callback = callback;
        // 最初にページを下までスクロールしてReactコンポーネントを全て読み込む
        console.log('Scrolling to bottom to load all components...');
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

        // スクロール完了を待つ
        setTimeout(() => {
            console.log('Scroll completed, starting form fill...');
            this.startFormFill();
        }, 2000);
    }

    startFormFill() {
        // 名前フィールドを探して入力（WordPress + Wix対応）
        const nameInput = document.querySelector(`
            input[name='name'], 
            input[name='your-name'], 
            input[placeholder*='名前'], 
            input[placeholder*='お名前'], 
            input[id*='name'],
            input[data-testid*='name'],
            input[class*='name'],
            input[aria-label*='名前'],
            input[aria-label*='お名前'],
            input[aria-label*='Name']
        `);
        if (nameInput) {
            nameInput.value = this.name;
            nameInput.dispatchEvent(new Event('input', { bubbles: true }));
            nameInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // メールフィールドを探して入力（WordPress + Wix対応）
        const emailInput = document.querySelector(`
            input[name='email'], 
            input[name='your-email'], 
            input[type='email'], 
            input[placeholder*='メール'], 
            input[placeholder*='Email'],
            input[id*='email'],
            input[data-testid*='email'],
            input[class*='email'],
            input[aria-label*='メール'],
            input[aria-label*='Email']
        `);
        if (emailInput) {
            emailInput.value = this.email;
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
            emailInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // 電話番号フィールドを探して入力（WordPress + Wix対応）
        const phoneInput = document.querySelector(`
            input[name='phone'], 
            input[name='tel'], 
            input[type='tel'], 
            input[placeholder*='電話'], 
            input[placeholder*='TEL'],
            input[placeholder*='Phone'],
            input[id*='phone'], 
            input[id*='tel'],
            input[data-testid*='phone'],
            input[data-testid*='tel'],
            input[class*='phone'],
            input[class*='tel'],
            input[aria-label*='電話'],
            input[aria-label*='Phone']
        `);
        if (phoneInput) {
            phoneInput.value = this.phone || "090-1234-5678";
            phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
            phoneInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // お問い合わせ内容フィールドを探して入力（WordPress + Wix対応）
        let messageInput = document.querySelector(`
            textarea[name='message'], 
            textarea[name='your-message'], 
            textarea[placeholder*='お問い合わせ'], 
            textarea[placeholder*='メッセージ'],
            textarea[placeholder*='Message'],
            textarea[id*='message'],
            textarea[data-testid*='message'],
            textarea[class*='message'],
            textarea[aria-label*='メッセージ'],
            textarea[aria-label*='お問い合わせ'],
            textarea[aria-label*='Message'],
            div[contenteditable='true'][data-testid*='message'],
            div[contenteditable='true'][class*='message']
        `);

        // 見つからない場合は、より広範囲で検索
        if (!messageInput) {
            messageInput = document.querySelector('textarea') ||
                document.querySelector('div[contenteditable="true"]');
        }

        console.log('Found message input:', messageInput);

        if (messageInput) {
            console.log('Element tagName:', messageInput.tagName);
            console.log('Element type:', messageInput.type);
            console.log('Element id:', messageInput.id);
            console.log('Element class:', messageInput.className);

            // まず既存の値を確認
            const existingValue = messageInput.value || '';
            console.log('BEFORE - existing value:', existingValue);
            console.log('BEFORE - value length:', existingValue.length);

            // 値を設定
            if (existingValue.trim()) {
                console.log('Adding to existing content');
                messageInput.value = existingValue + '\n\n' + template;
            } else {
                console.log('Setting new content');
                messageInput.value = template;
            }

            // 設定後の値を確認
            console.log('AFTER - new value:', messageInput.value);
            console.log('AFTER - value length:', messageInput.value.length);

            // イベント発火
            messageInput.dispatchEvent(new Event('input', { bubbles: true }));
            messageInput.dispatchEvent(new Event('change', { bubbles: true }));

        } else {
            console.log('No message input found');
        }

        // フォーム入力完了後、コールバックを呼び出し
        if (this.callback) {
            console.log('Form filling completed, calling callback...');
            setTimeout(() => {
                this.callback();
            }, 1000); // 1秒後にコールバック実行
        }
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

const template = `突然のご連絡失礼いたします。

月額4,000円・国内最安値でサブスクホームページ制作を運営しておりますホームページスタンダードの〇〇です。

現在のホームページの月額料金を今より大幅にコストダウンすることができるためご連絡を差し上げました。

▼ホームページの大幅刷新を行いたい
▼月額料金のコストダウンを行いたい
▼既存会社のサポート体制に不満がある

上記に当てはまるようであれば、ぜひご挨拶も兼ねて無料でデザイン案からご提案させていただけませんでしょうか？

▼お打ち合わせ日程ご調整フォーム
https://hp-standard.youcanbook.me/

▼ホームページスタンダードの特徴
当社ではご契約を頂く前に無料でデザイン案を作成する【お試しホームページ】を提供しております。
デザイン案を確認いただいた後、ご契約の判断ができるサービスとなっております。

ご導入後は月額4,000円でページ追加・ページ修正無制限で対応、
もちろんドメイン・サーバー費込となっております。

サブスク型のホームページをご利用の多数の事業者様よりお乗り換えをいただいておりましたので、まずはオンラインでご説明をさせていただき無料のデザイン案をぜひご確認いただければと考えております。

▼お打ち合わせ日程ご調整フォーム
https://hp-standard.youcanbook.me/

▼サービスページ
https://hp-standard.jp/triallp

貴社のお乗り換えのご相談をお待ちしております。`;