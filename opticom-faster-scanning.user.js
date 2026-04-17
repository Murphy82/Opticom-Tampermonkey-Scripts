// ==UserScript==
// @name         Opticom Faster Scanning
// @namespace    https://ohlinis.me/
// @version      2026-04-17.1
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
    const TARGET_FILE = 'opticom_replacement-ordering.min.js';
    const REPLACEMENT_URL = `https://raw.githubusercontent.com/Murphy82/Opticom-Tampermonkey-Scripts/refs/heads/main/replacements/opticom-replacement-ordering.min.js?v=${SCRIPT_VERSION}`;

    window.addEventListener('beforescriptexecute', function(e) {
        if (e.target.src.includes(TARGET_FILE)) {
            e.preventDefault();
            e.stopPropagation();
            loadReplacement();
        }
    }, true);

    const originalAppend = Node.prototype.appendChild;
    Node.prototype.appendChild = function(element) {
        if (element.tagName === 'SCRIPT' && element.src && element.src.includes(TARGET_FILE)) {
            console.log("[TM] Blocking dynamic script injection...");
            return null; 
        }
        return originalAppend.apply(this, arguments);
    };

    function loadReplacement() {
        if (document.getElementById('opticom-custom-script')) return;
        
        console.log("[TM] Injecting replacement script from GitHub...");
        const script = document.createElement('script');
        script.id = 'opticom-custom-script';
        script.src = REPLACEMENT_URL;
        script.type = 'text/javascript';
        script.defer = true; 
        document.head.appendChild(script);
    }
    
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'SCRIPT' && node.src.includes(TARGET_FILE)) {
                    node.type = 'javascript/blocked';
                    node.src = ''; 
                    node.remove();
                    loadReplacement();
                }
            });
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
})();