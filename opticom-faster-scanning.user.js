// ==UserScript==
// @name          Opticom Faster Scanning
// @namespace     https://ohlinis.me/
// @version       2026-04-17.2
// @description   Intercepts and replaces the replacement-ordering minified script to fix barcode errors when scanning fast
// @author        Ohlin Arellano
// @match         *://*.opticom-inc.com/replacement-ordering/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=opticom-inc.com
// @grant         none
// @run-at        document-start
// @updateURL     https://github.com/Murphy82/Opticom-Tampermonkey-Scripts/raw/refs/heads/main/opticom-faster-scanning.user.js
// @downloadURL   https://github.com/Murphy82/Opticom-Tampermonkey-Scripts/raw/refs/heads/main/opticom-faster-scanning.user.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_VERSION = GM_info.script.version;
    const TARGET_FILE = 'opticom_replacement-ordering.min.js';
    const REPLACEMENT_URL = `https://raw.githubusercontent.com/Murphy82/Opticom-Tampermonkey-Scripts/refs/heads/main/replacements/opticom-replacement-ordering.min.js?v=${SCRIPT_VERSION}`;

    console.log(`[TM] Initializing Faster Scanning v${SCRIPT_VERSION}`);

    // 1. Kill their script if it tries to load via MutationObserver
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'SCRIPT' && node.src && node.src.includes(TARGET_FILE)) {
                    node.type = 'text/plain'; // Browser will not execute this
                    node.remove();
                    console.log("[TM] Blocked original script tag.");
                }
            }
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // 2. Fetch your script and inject it immediately
    try {
        const xhr = new XMLHttpRequest();
        // 'false' as the third parameter makes this SYNCHRONOUS
        // This pauses the page until your script is fetched.
        xhr.open('GET', REPLACEMENT_URL, false); 
        xhr.send(null);

        if (xhr.status === 200) {
            const scriptContent = xhr.responseText;
            const scriptElement = document.createElement('script');
            scriptElement.id = 'tm-injected-logic';
            scriptElement.textContent = scriptContent;
            
            // Inject into documentElement because head might not exist yet
            document.documentElement.appendChild(scriptElement);
            console.log("[TM] Successfully inlined replacement script.");
        } else {
            console.error(`[TM] Failed to fetch replacement: ${xhr.status}`);
        }
    } catch (e) {
        console.error("[TM] Error during synchronous injection:", e);
    }

})();