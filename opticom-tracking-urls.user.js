// ==UserScript==
// @name         Opticom Tracking URLs
// @namespace    https://ohlinis.me/
// @version      2026-03-25
// @description  Adds a column in the shipment notification table for linked tracking numbers
// @author       Ohlin Arellano
// @match        *://*.opticom-inc.com/shipment-notification/ship-file-report*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=opticom-inc.com
// @grant        none
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

async function processTrackingNumbers() {
    const TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
    const now = Date.now();

    const table = document.querySelector('table.list-table');
    if (!table || document.getElementById('tracking-column-header')) return;

    const headerRow = table.querySelector('thead tr');
    const th = document.createElement('th');
    th.id = 'tracking-column-header';
    th.innerHTML = '<button class="btn btn-link" type="button" style="font-weight:bold;">Tracking Number</button>';
    headerRow.appendChild(th);

    const rows = table.querySelectorAll('tbody tr#itemTR');
    const pendingTasks = [];

    rows.forEach(row => {
        const poLinkElement = row.querySelector('td:nth-child(3) a');
        if (!poLinkElement) return;

        const url = poLinkElement.href;
        const shipId = new URL(url).searchParams.get('id');

        const newCell = document.createElement('td');
        newCell.className = 'tracking-number-cell';
        newCell.style.textAlign = 'center';
        newCell.innerText = 'Checking...';
        row.appendChild(newCell);

        pendingTasks.push({ shipId, url, cell: newCell });
    });

    for (const task of pendingTasks) {
        const cacheKey = `tracking_cache_${task.shipId}`;
        const cachedRaw = localStorage.getItem(cacheKey);
        let trackingNum = null;

        if (cachedRaw) {
            try {
                const cacheData = JSON.parse(cachedRaw);
                if (now - cacheData.timestamp < TTL_MS) {
                    trackingNum = cacheData.value;
                } else {
                    localStorage.removeItem(cacheKey);
                }
            } catch (e) {
                localStorage.removeItem(cacheKey);
            }
        }

        if (trackingNum === null) {
            try {
                const response = await fetch(task.url);
                const text = await response.text();
                const match = text.match(/^L(.+?)\+$/m);

                if (match && match[1]) {
                    const found = match[1].trim();
                    trackingNum = found.toLowerCase() === "unavailable" ? "" : found;
                } else {
                    trackingNum = "";
                }

                localStorage.setItem(cacheKey, JSON.stringify({
                    value: trackingNum,
                    timestamp: now
                }));
            } catch (error) {
                console.error(`Failed to fetch ${task.url}`, error);
                task.cell.innerText = 'Error';
                continue;
            }
        }

        if (trackingNum) {
            const link = document.createElement('a');
            link.href = getTrackingUrl(trackingNum);
            link.target = "_blank";
            link.innerText = trackingNum;
            link.style.color = "#007bff";
            task.cell.innerHTML = '';
            task.cell.appendChild(link);
        } else {
            task.cell.innerText = '';
        }
    }
}


(function() {
    'use strict';

    processTrackingNumbers();
})();