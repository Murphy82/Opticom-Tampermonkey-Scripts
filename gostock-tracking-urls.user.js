// ==UserScript==
// @name         GOStock Tracking URLs
// @namespace    https://ohlinis.me
// @version      2026-04-22
// @description  Embeds tracking URLs to the tracking number column in order history
// @author       Ohlin Arellano
// @match        *://*.gostocklenses.com/wp-admin/admin.php?page=go-stock-lenses-order-history*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gostocklenses.com
// @grant        none
// @updateURL    https://github.com/Murphy82/Opticom-Tampermonkey-Scripts/raw/refs/heads/main/gostock-tracking-urls.user.js
// @downloadURL  https://github.com/Murphy82/Opticom-Tampermonkey-Scripts/raw/refs/heads/main/gostock-tracking-urls.user.js
// ==/UserScript==

function getTrackingUrl(trackingNum) {
    if (!trackingNum) return '';

    // UPS
    if (/^1Z/i.test(trackingNum)) {
        return `https://www.ups.com/track?trackNums=${trackingNum}/trackdetails`;
    }

    // FedEx
    if (/^\d{12,15}$/.test(trackingNum)) {
        return `https://www.fedex.com/apps/fedextrack/?trknbr=${trackingNum}`;
    }

    // Misc
    return `https://www.google.com/search?q=${trackingNum}`;
}

function embedTrackingURLs() {
    let trackingColumnNodes = document.getElementsByClassName("column-tracking")
    Array.from(trackingColumnNodes).forEach((e)=> {
        let trackingNumber = e.innerHTML.trim()
        let isInvalidTracking = trackingNumber == "" || trackingNumber == "Tracking Number"
        if(isInvalidTracking) return
        e.innerHTML = `<a href="${getTrackingUrl(trackingNumber)}" target="_blank">${trackingNumber}</a>`;
    })
}

(function() {
    'use strict';

    embedTrackingURLs();
})();