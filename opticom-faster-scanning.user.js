// ==UserScript==
// @name         Opticom Faster Scanning
// @namespace    https://ohlinis.me/
// @version      2026-04-17
// @description  Intercepts and replaces the replacement-ordering minified script to fix barcode errors when scanning fast
// @author       Ohlin Arellano
// @match        *://*.opticom-inc.com/replacement-ordering/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=opticom-inc.com
// @grant        none
// @run-at       document-start
// @updateURL    https://github.com/Murphy82/Opticom-Tampermonkey-Scripts/raw/refs/heads/main/opticom-faster-scanning.user.js
// @downloadURL  https://github.com/Murphy82/Opticom-Tampermonkey-Scripts/raw/refs/heads/main/opticom-faster-scanning.user.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_VERSION = GM_info.script.version;
    const ORIGINAL_SCRIPT_URL = "/scripts/opticom_replacement-ordering.min.js?rnd=134208516122888545";
    const REPLACEMENT_URL = `https://raw.githubusercontent.com/Murphy82/Opticom-Tampermonkey-Scripts/refs/heads/main/replacements/opticom-replacement-ordering.min.js?v=${SCRIPT_VERSION}`;

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                
                if (node.tagName === 'SCRIPT' && node.src) {
                    
                    const src = node.getAttribute('src');

                    if (src === ORIGINAL_SCRIPT_URL) {
                        console.log(`[TM] Intercepted original script. Redirecting to v${SCRIPT_VERSION}...`);
                        node.src = REPLACEMENT_URL;
                    } 
                    
                    else if (src.includes('opticom_replacement-ordering.min.js') && src !== REPLACEMENT_URL) {
                        console.error("!!! OPTICOM UPDATED THEIR SCRIPT !!!");
                        console.warn("Expected:", ORIGINAL_SCRIPT_URL);
                        console.warn("Found:", src);
                        console.info("Your custom script was NOT loaded to prevent breaking functionality.");
                    }
                }
            }
        }
    });
    
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();