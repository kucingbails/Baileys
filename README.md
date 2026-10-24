# WhatsApp Baileys ©®Gunz

<p align="center">
  <img src="https://files.catbox.moe/kkku7t.jpg" alt="WhatsApp Baileys Banner" width="600" />
</p>

<h3 align="center">⚡ A WebSocket-Based WhatsApp Automation Library</h3>

<p align="center"><i>Browserless · Lightweight · Stable · Feature-Rich</i></p>

<p align="center">
  <img src="https://img.shields.io/badge/version-latest-blue?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/node-%3E%3D18-green?style=for-the-badge" alt="Node" />
  <img src="https://img.shields.io/badge/license-MIT-orange?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/status-stable-success?style=for-the-badge" alt="Status" />
</p>

<p align="center">
  Crafted with ❤️ by <a href="https://t.me/Gunzishere"><b>@Gunzishere</b></a>
</p>

---

📑 Table of Contents

# Section
1 About
2 Key Features
3 Installation
4 Additional Functions
5 SendMessage Documentation
 • Group Status V2
 • Album Message
 • Event Message
 • Poll Result
 • Interactive Message
 • Interactive + Native Flow
 • Interactive + Thumbnail
 • Product Message
 • Interactive + Document (Full)
 • Interactive + Document (Simple)
 • Request Payment
6 Why Choose This Library
7 Repository
8 Technical Notes

---

# 🚀About

WhatsApp Baileys is an open-source library designed to build WhatsApp automation and integration solutions efficiently and directly. Powered by WebSocket technology — no browser required — it delivers a powerful feature set covering message management, chat handling, group administration, interactive messages, and action buttons for a fully dynamic user experience.

Actively developed and maintained, the library focuses on improving stability and performance — particularly in the pairing and authentication workflows — ensuring a secure and reliable connection. The pairing process is fully customizable with your own code, making it more resilient and less prone to interruptions.

Perfect for:

· 🤖 Business bots
· 💬 Chat automation systems
· 🎧 Customer service solutions
· 📣 Broadcast & communication platforms
· 🛠️ Any project requiring stable WhatsApp integration

---

# ✨ Key Features

Feature Description
🔐 Custom Pairing Automatic and fully customizable pairing process
🛡️ Stability Fixes Resolves previous pairing failures and disconnections
🎛️ Interactive Messages Buttons, dynamic menus, and action-based UI
🔄 Session Management Efficient automatic session handling
📱 Multi-Device Ready Compatible with the latest WhatsApp multi-device features
⚡ Lightweight Stable, modular, and easy to integrate
🧩 Full Toolset Complete automation & communication capabilities
📚 Rich Documentation Comprehensive examples and guides

---

# 📦 Installation

Install via your preferred package manager, then follow the included configuration guide. Ready-made examples are provided to help you quickly understand each feature. Use session storage and interactive messaging capabilities to build complete, stable solutions tailored to your business needs.

```bash
npm install github:kucingbails/baileys
```

---

# 🔧 Additional Functions

# 📡 Check Channel ID

Retrieve a channel ID from its URL:

```javascript
const id = await sock.newsletterId(url);
```

# 🚫 Check Banned Number

View the status of blocked numbers:

```javascript
const status = await sock.checkWhatsApp(target);
```

---

# 💬 SendMessage Documentation

1. Group Status V2

Send a group status using version 2:

```javascript
await sock.sendMessage(target, {
  groupStatusMessage: {
    text: "Example status text"
  }
});
```

---

2. Album Message

Send multiple images in a single album message:

```javascript
await sock.sendMessage(target, {
  albumMessage: [
    { image: cihuy, caption: "Example caption" },
    { image: { url: "URL_IMAGE" }, caption: "Example caption" }
  ]
}, { quoted: m });
```

---

3. Event Message

Create and send WhatsApp event invitations:

```javascript
await sock.sendMessage(target, {
  eventMessage: {
    isCanceled: false,
    name: "Event Name",
    description: "Event Description",
    location: {
      degreesLatitude: 0,
      degreesLongitude: 0,
      name: "Location Name"
    },
    joinLink: "https://call.whatsapp.com/video/example",
    startTime: "1763019000",
    endTime: "1763026200",
    extraGuestsAllowed: false
  }
}, { quoted: m });
```

---

4. Poll Result

Display poll results with vote counts:

```javascript
await sock.sendMessage(target, {
  pollResultMessage: {
    name: "Poll Name",
    pollVotes: [
      { optionName: "Option 1", optionVoteCount: "112233" },
      { optionName: "Option 2", optionVoteCount: "1" }
    ]
  }
}, { quoted: m });
```

---

5. Interactive Message

Send a basic interactive message with a copy button:

```javascript
await sock.sendMessage(target, {
  interactiveMessage: {
    header: "Header",
    title: "Title",
    footer: "Footer",
    buttons: [
      {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: "Copy Code",
          id: "123456789",
          copy_code: "ABC123XYZ"
        })
      }
    ]
  }
}, { quoted: m });
```

---

6. Interactive + Native Flow

Send an interactive message with buttons, copy actions, and native flow features:

```javascript
await sock.sendMessage(target, {
  interactiveMessage: {
    header: "Header",
    title: "Title",
    footer: "Footer",
    image: { url: "https://example.com/image.jpg" },
    nativeFlowMessage: {
      messageParamsJson: JSON.stringify({
        limited_time_offer: {
          text: "Offer text",
          url: "https://example.com",
          copy_code: "ABC123",
          expiration_time: Date.now() * 999
        },
        bottom_sheet: {
          in_thread_buttons_limit: 2,
          divider_indices: [1, 2, 3, 4, 5, 999],
          list_title: "List Title",
          button_title: "Button Title"
        },
        tap_target_configuration: {
          title: "Title",
          description: "Description",
          canonical_url: "https://example.com",
          domain: "shop.example.com",
          button_index: 0
        }
      }),
      buttons: [
        {
          name: "single_select",
          buttonParamsJson: JSON.stringify({ has_multiple_buttons: true })
        },
        {
          name: "call_permission_request",
          buttonParamsJson: JSON.stringify({ has_multiple_buttons: true })
        },
        {
          name: "single_select",
          buttonParamsJson: JSON.stringify({
            title: "Title",
            sections: [
              {
                title: "Section Title",
                highlight_label: "Label",
                rows: [
                  {
                    title: "Row Name",
                    description: "Row description",
                    id: "row_2"
                  }
                ]
              }
            ],
            has_multiple_buttons: true
          })
        },
        {
          name: "cta_copy",
          buttonParamsJson: JSON.stringify({
            display_text: "Copy Code",
            id: "123456789",
            copy_code: "ABC123XYZ"
          })
        }
      ]
    }
  }
}, { quoted: m });
```

---

7. Interactive + Thumbnail

Send an interactive message with a thumbnail image and copy button:

```javascript
await sock.sendMessage(target, {
  interactiveMessage: {
    header: "Header",
    title: "Title",
    footer: "Footer",
    image: { url: "https://example.com/image.jpg" },
    buttons: [
      {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: "Copy Code",
          id: "123456789",
          copy_code: "ABC123XYZ"
        })
      }
    ]
  }
}, { quoted: m });
```

---

8. Product Message

Send a product catalog message with buttons and merchant information:

```javascript
await sock.sendMessage(target, {
  productMessage: {
    title: "Product Example",
    description: "This is a product description",
    thumbnail: { url: "https://example.com/image.jpg" },
    productId: "PROD001",
    retailerId: "RETAIL001",
    url: "https://example.com/product",
    body: "Product details",
    footer: "Special price",
    priceAmount1000: 50000,
    currencyCode: "USD",
    buttons: [
      {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: "Buy Now",
          url: "https://example.com/buy"
        })
      }
    ]
  }
}, { quoted: m });
```

---

9. Interactive + Document (Full)

Send an interactive message with a document (buffer), including contextInfo and externalAdReply.

⚠️ Note: Documents only support buffers.

```javascript
await sock.sendMessage(target, {
  interactiveMessage: {
    header: "Header",
    title: "Title",
    footer: "Footer",
    document: fs.readFileSync("./package.json"),
    mimetype: "application/pdf",
    fileName: "example.pdf",
    jpegThumbnail: fs.readFileSync("./document.jpeg"),
    contextInfo: {
      mentionedJid: [target],
      forwardingScore: 777,
      isForwarded: false
    },
    externalAdReply: {
      title: "Title",
      body: "Description",
      mediaType: 3,
      thumbnailUrl: "https://example.com/image.jpg",
      mediaUrl: "https://example.com",
      sourceUrl: "https://example.com",
      showAdAttribution: true,
      renderLargerThumbnail: false
    },
    buttons: [
      {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: "Open Link",
          url: "https://example.com",
          merchant_url: "https://example.com"
        })
      }
    ]
  }
}, { quoted: m });
```

---

10. Interactive + Document (Simple)

Same as above, but without contextInfo and externalAdReply.

⚠️ Note: Documents only support buffers.

```javascript
await sock.sendMessage(target, {
  interactiveMessage: {
    header: "Header",
    title: "Title",
    footer: "Footer",
    document: fs.readFileSync("./package.json"),
    mimetype: "application/pdf",
    fileName: "example.pdf",
    jpegThumbnail: fs.readFileSync("./document.jpeg"),
    buttons: [
      {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: "Open Link",
          url: "https://example.com",
          merchant_url: "https://example.com"
        })
      }
    ]
  }
}, { quoted: m });
```

---

11. Request Payment

Send a payment request message with a custom background and sticker:

```javascript
let quotedType = m.quoted?.mtype || '';
let quotedContent = JSON.stringify({ [quotedType]: m.quoted }, null, 2);

await sock.sendMessage(target, {
  requestPaymentMessage: {
    currency: "IDR",
    amount: 10000000,
    from: m.sender,
    sticker: JSON.parse(quotedContent),
    background: {
      id: "100",
      fileLength: "0",
      width: 1000,
      height: 1000,
      mimetype: "image/webp",
      placeholderArgb: 0xFF00FFFF,
      textArgb: 0xFFFFFFFF,
      subtextArgb: 0xFFAA00FF
    }
  }
}, { quoted: m });
```

---

# 🏆 Why Choose This Library

This library delivers high stability, full features, and a continuously refined pairing process — ideal for developers building professional, secure WhatsApp automation solutions. Native support for the latest WhatsApp features ensures long-term compatibility with platform updates.

Whether you're launching a customer service bot, an e-commerce notifier, or a full-scale automation platform, this library provides the foundation you need to ship confidently.

---

# 🔗 Repository

Resource Link
🐙 GitHub github.com/kucingbails
📦 Clone github:kucingbails/baileys
💬 Contact @Gunzishere

---

# 🛠️ Technical Notes

· ✅ Stable & secure custom pairing codes
· ✅ Fixes for previous pairing and authentication issues
· ✅ Interactive messages and action buttons for dynamic menus
· ✅ Efficient automatic session management for long-term stability
· ✅ Compatible with the latest WhatsApp multi-device features
· ✅ Easy to integrate and customize
· ✅ Perfect for bots, customer service, and communication automation

---

<p align="center">
  <i>For complete documentation, installation guides, and implementation examples, please visit the official repository and community forums. This library is continuously updated and improved to meet the needs of modern WhatsApp automation solutions.</i>
</p>

<p align="center">
  <b>Thank you for choosing WhatsApp Baileys as your WhatsApp automation solution! 🚀</b>
</p>

<p align="center">
  Made with ❤️ by <a href="https://t.me/Gunzishere"><b>@Gunzishere</b></a>
</p>
