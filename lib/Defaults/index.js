"use strict";

var __importDefault = this && this.__importDefault || function (a) {
    return a && a.__esModule ? a : { "default": a }
};

Object.defineProperty(exports, "__esModule", { value: !0 });

exports.DEFAULT_CACHE_TTLS =
    exports.INITIAL_PREKEY_COUNT =
    exports.MIN_PREKEY_COUNT =
    exports.MEDIA_KEYS =
    exports.MEDIA_HKDF_KEY_MAPPING =
    exports.MEDIA_PATH_MAP =
    exports.DEFAULT_CONNECTION_CONFIG =
    exports.PROCESSABLE_HISTORY_TYPES =
    exports.WA_CERT_DETAILS =
    exports.URL_REGEX =
    exports.NOISE_WA_HEADER =
    exports.KEY_BUNDLE_TYPE =
    exports.DICT_VERSION =
    exports.NOISE_MODE =
    exports.WA_DEFAULT_EPHEMERAL =
    exports.PHONE_CONNECTION_CB =
    exports.DEF_TAG_PREFIX =
    exports.DEF_CALLBACK_PREFIX =
    exports.DEFAULT_ORIGIN =
    exports.UNAUTHORIZED_CODES =
    void 0;

const fs = require("fs");
const path = require("path");
const https = require("https");
const crypto_1 = require("crypto");
const { proto } = require("../../WAProto"),
    libsignal_1 = require("../Signal/libsignal"),
    Utils_1 = require("../Utils"),
    logger_1 = __importDefault(require("../Utils/logger")),
    phonenumber_mcc_json_1 = __importDefault(require("./phonenumber-mcc.json"));

const VERSION_CACHE_FILE = path.join(
    process.env.HOME || process.env.USERPROFILE || __dirname,
    ".kucingbails-wa-version.json"
);
const BROWSER_CACHE_FILE = path.join(
    process.env.HOME || process.env.USERPROFILE || __dirname,
    ".kucingbails-browser.json"
);
const WA_VERSION_URL =
    "https://web.whatsapp.com/check-update?version=1&platform=web";
const VERSION_CACHE_TTL_MS = 60 * 60 * 1000;

function fetchLatestWAVersionSync() {
    const { execFileSync } = require("child_process");
    try {
        const raw = execFileSync(
            process.execPath,
            [
                "-e",
                `
                const https = require("https");
                https.get("${WA_VERSION_URL}", { timeout: 8000 }, (res) => {
                    let raw = "";
                    res.on("data", (c) => raw += c);
                    res.on("end", () => {
                        try {
                            const j = JSON.parse(raw);
                            const cv = j.currentVersion || j.version;
                            if (!cv) process.exit(1);
                            const p = cv.split(".").map((n) => parseInt(n, 10));
                            if (p.length < 3 || p.some(isNaN)) process.exit(1);
                            process.stdout.write(JSON.stringify({ version: p, waVersion: cv }));
                        } catch { process.exit(1); }
                    });
                }).on("error", () => process.exit(1))
                  .on("timeout", function() { this.destroy(); process.exit(1); });
                `,
            ],
            { timeout: 15000, encoding: "utf8" }
        );
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function readVersionCache() {
    try {
        if (!fs.existsSync(VERSION_CACHE_FILE)) return null;
        const stat = fs.statSync(VERSION_CACHE_FILE);
        if (Date.now() - stat.mtimeMs > VERSION_CACHE_TTL_MS) return null;
        const data = JSON.parse(fs.readFileSync(VERSION_CACHE_FILE, "utf8"));
        if (
            Array.isArray(data.version) &&
            data.version.length >= 3 &&
            typeof data.waVersion === "string"
        ) {
            return data;
        }
        return null;
    } catch {
        return null;
    }
}

function writeVersionCache(data) {
    try {
        fs.writeFileSync(VERSION_CACHE_FILE, JSON.stringify(data));
    } catch {
    }
}

let resolved = readVersionCache();
if (!resolved) {
    resolved = fetchLatestWAVersionSync();
    if (resolved) {
        writeVersionCache(resolved);
    }
}
if (!resolved) {
    throw new Error(
        "[kucingbails] Gagal mendapatkan versi WhatsApp terbaru. " +
        "Periksa koneksi internet atau endpoint " + WA_VERSION_URL
    );
}

const INITIAL_VERSION = resolved.version;
const INITIAL_WA_VERSION = resolved.waVersion;

fetchLatestWAVersionSync();

const BROWSER_POOL = [
    ["Ubuntu", "Chrome", "22.04"],
    ["Ubuntu", "Chrome", "20.04"],
    ["Ubuntu", "Firefox", "121.0"],
    ["Ubuntu", "Firefox", "115.0"],
    ["Debian", "Chrome", "12"],
    ["Debian", "Firefox", "121.0"],
    ["Windows", "Chrome", "10.0"],
    ["Windows", "Firefox", "121.0"],
    ["Windows", "Edge", "120.0"],
    ["macOS", "Chrome", "10.15"],
    ["macOS", "Firefox", "121.0"],
    ["macOS", "Safari", "17.0"],
    ["Linux", "Chrome", "22.04"],
    ["Linux", "Firefox", "121.0"]
];

const BROWSER_CACHE_MIN_MS = 1 * 60 * 60 * 1000;
const BROWSER_CACHE_MAX_MS = 6 * 60 * 60 * 1000;

function pickRandomBrowser() {
    return BROWSER_POOL[Math.floor(Math.random() * BROWSER_POOL.length)].slice();
}

function readBrowserCache() {
    try {
        if (!fs.existsSync(BROWSER_CACHE_FILE)) return null;
        const data = JSON.parse(fs.readFileSync(BROWSER_CACHE_FILE, "utf8"));
        if (
            Array.isArray(data.browser) &&
            data.browser.length === 3 &&
            typeof data.expiresAt === "number" &&
            Date.now() < data.expiresAt
        ) {
            return data.browser;
        }
        return null;
    } catch {
        return null;
    }
}

function writeBrowserCache(browser) {
    try {
        const ttl =
            BROWSER_CACHE_MIN_MS +
            Math.floor(Math.random() * (BROWSER_CACHE_MAX_MS - BROWSER_CACHE_MIN_MS));
        fs.writeFileSync(
            BROWSER_CACHE_FILE,
            JSON.stringify({ browser, expiresAt: Date.now() + ttl })
        );
    } catch {
    }
}

function resolveBrowser() {
    const cached = readBrowserCache();
    if (cached) return cached;
    const picked = pickRandomBrowser();
    writeBrowserCache(picked);
    return picked;
}

const INITIAL_BROWSER = resolveBrowser();

exports.UNAUTHORIZED_CODES = [401, 403, 419];
exports.version = INITIAL_VERSION;
exports.PHONENUMBER_MCC = phonenumber_mcc_json_1.default;
exports.DEFAULT_ORIGIN = "https://web.whatsapp.com";
exports.MOBILE_ENDPOINT = 'g.whatsapp.net';
exports.MOBILE_PORT = 443;
exports.DEF_CALLBACK_PREFIX = "CB:";
exports.DEF_TAG_PREFIX = "TAG:";
exports.PHONE_CONNECTION_CB = "CB:Pong";
exports.WA_DEFAULT_EPHEMERAL = 604800;
const WA_VERSION = INITIAL_WA_VERSION;
const WA_VERSION_HASH = (0, crypto_1.createHash)('md5').update(WA_VERSION).digest('hex');
exports.MOBILE_TOKEN = Buffer.from('0a1mLfGUIBVrMKF1RdvLI5lkRBvof6vn0fD2QRSM' + WA_VERSION_HASH);
exports.MOBILE_REGISTRATION_ENDPOINT = 'https://v.whatsapp.net/v2';
exports.MOBILE_USERAGENT = `WhatsApp/${WA_VERSION} iOS/17.5.1 Device/Apple-iPhone_13`;
exports.REGISTRATION_PUBLIC_KEY = Buffer.from([
    5, 142, 140, 15, 116, 195, 235, 197, 215, 166, 134, 92, 108, 60, 132, 56, 86, 176, 97, 33, 204, 232, 234, 119, 77,
    34, 251, 111, 18, 37, 18, 48, 45,
]);
exports.NOISE_MODE = "Noise_XX_25519_AESGCM_SHA256\x00\x00\x00\x00";
exports.DICT_VERSION = 2;
exports.KEY_BUNDLE_TYPE = Buffer.from([5]);
exports.NOISE_WA_HEADER = Buffer.from([87, 65, 6, exports.DICT_VERSION]);
exports.PROTOCOL_VERSION = [5, 2];
exports.MOBILE_NOISE_HEADER = Buffer.concat([Buffer.from('WA'), Buffer.from(exports.PROTOCOL_VERSION)]);

exports.URL_REGEX = /https:\/\/(?![^:@\/\s]+:[^:@\/\s]+@)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?/g;
exports.WA_CERT_DETAILS = { SERIAL: 0 };

exports.PROCESSABLE_HISTORY_TYPES = [
    "INITIAL_BOOTSTRAP",
    "PUSH_NAME",
    "RECENT",
    "FULL",
    "ON_DEMAND"
];

exports.DEFAULT_CONNECTION_CONFIG = {
    version: INITIAL_VERSION,
    browser: INITIAL_BROWSER,
    waWebSocketUrl: "wss://web.whatsapp.com/ws/chat",
    connectTimeoutMs: 2E4,
    keepAliveIntervalMs: 3E4,
    logger: logger_1.default.child({ class: "baileys" }),
    printQRInTerminal: !1,
    emitOwnEvents: !0,
    defaultQueryTimeoutMs: 6E4,
    customUploadHosts: [],
    retryRequestDelayMs: 250,
    maxMsgRetryCount: 5,
    fireInitQueries: !0,
    auth: void 0,
    markOnlineOnConnect: !0,
    syncFullHistory: !1,
    patchMessageBeforeSending: a => a,
    shouldSyncHistoryMessage: () => !0,
    shouldIgnoreJid: () => !1,
    linkPreviewImageThumbnailWidth: 192,
    transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 3E3 },
    generateHighQualityLinkPreview: !1,
    options: {},
    appStateMacVerification: { patch: !1, snapshot: !1 },
    countryCode: "US",
    getMessage: async () => { },
    cachedGroupMetadata: async () => { },
    makeSignalRepository: libsignal_1.makeLibSignalRepository
};

exports.MEDIA_PATH_MAP = {
    image: "/mms/image",
    video: "/mms/video",
    document: "/mms/document",
    audio: "/mms/audio",
    sticker: "/mms/image",
    "thumbnail-link": "/mms/image",
    "product-catalog-image": "/product/image",
    "md-app-state": "",
    "md-msg-hist": "/mms/md-app-state"
};

exports.MEDIA_HKDF_KEY_MAPPING = {
    audio: "Audio",
    document: "Document",
    gif: "Video",
    image: "Image",
    ppic: "",
    product: "Image",
    ptt: "Audio",
    sticker: "Image",
    video: "Video",
    "thumbnail-document": "Document Thumbnail",
    "thumbnail-image": "Image Thumbnail",
    "thumbnail-video": "Video Thumbnail",
    "thumbnail-link": "Link Thumbnail",
    "md-msg-hist": "History",
    "md-app-state": "App State",
    "product-catalog-image": "",
    "payment-bg-image": "Payment Background",
    ptv: "Video"
};

exports.MEDIA_KEYS = Object.keys(exports.MEDIA_PATH_MAP);
exports.MIN_PREKEY_COUNT = 5;
exports.INITIAL_PREKEY_COUNT = 30;

exports.DEFAULT_CACHE_TTLS = {
    SIGNAL_STORE: 300,
    MSG_RETRY: 3600,
    CALL_OFFER: 300,
    USER_DEVICES: 300
};