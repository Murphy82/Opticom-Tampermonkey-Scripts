// ==UserScript==
// @name         Opticom Ship File Viewer
// @namespace    https://ohlinis.me/
// @version      2026-04-08
// @description  Replaces plaintext rendering of ship files with opticom consistent UI
// @author       Ohlin Arellano
// @match        *://*.opticom-inc.com/shipment-notification/viewshipfile/?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=opticom-inc.com
// @grant        none
// ==/UserScript==

function getShipFileID() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    return id;
}

function parseShipFile(data) {
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

    function parseOpticomDate(dateStr) {
        if (!dateStr || dateStr.length !== 6) return dateStr;

        const month = parseInt(dateStr.substring(0, 2), 10) - 1;
        const day = parseInt(dateStr.substring(2, 4), 10);
        const year = parseInt(dateStr.substring(4, 6), 10) + 2000;

        return new Date(year, month, day);
    }

    const segments = data.split('+').map(s => s.trim()).filter(s => s.length > 0);

    const order = {
        header: {},
        items: [],
        rawUnmapped: []
    };

    let currentItem = null;

    segments.forEach(seg => {
        const prefix = seg.charAt(0);
        const value = seg.substring(1);

        switch (prefix) {
            case 'M': order.header.vendorCode = value; break;
            case 'A': order.header.account = value; break;
            case 'C': order.header.customerId = value; break;
            case 'H': order.header.invoiceNumber = value; break;
            case 'P': order.header.poNumber = value; break;
            case 'L': order.header.trackingNumber = value; break;
            case 'X': order.header.totalQuantity = parseInt(value, 10); break;

            case 'D': order.header.shipDate = parseOpticomDate(value); break;
            case 'E': order.header.expectedDate = parseOpticomDate(value); break;

            case 'T':
                if (currentItem) order.items.push(currentItem);
                currentItem = { lineId: value };
                break;
            case 'N':
                if (!currentItem) currentItem = {};
                currentItem.sku = value;
                break;
            case 'Q': if (currentItem) currentItem.qtyOrdered = parseInt(value, 10); break;
            case 'U': if (currentItem) currentItem.qtyShipped = parseInt(value, 10); break;
            case 'W': if (currentItem) currentItem.qtyBackordered = parseInt(value, 10); break;
            case 'K': if (currentItem) currentItem.unitPrice = parseFloat(value); break;

            default:
                order.rawUnmapped.push({ code: prefix, value: value });
        }
    });

    if (currentItem) {
        order.items.push(currentItem);
    }

    if (order.header.trackingNumber) {
        order.header.trackingUrl = getTrackingUrl(order.header.trackingNumber);
    }

    return order;
}


(function() {
    'use strict';

    const preTags = document.getElementsByTagName("pre");
    if (preTags.length === 0) return;
    const rawShipFile = preTags[0].innerText;
    const parsedShipFile = parseShipFile(rawShipFile);
    console.log(parsedShipFile);

    const mockUI = `
    <head>
	<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
			<title>Ship File Viewer &gt; Opticom</title>
			<link rel="stylesheet" href="/css/main.min.css?rnd=134201208020593386" defer="defer" />
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.2/css/bootstrap.min.css" defer="defer" />
			<link rel="stylesheet" href="/css/bootstrap-theme.min.css?rnd=134201208020593386" defer="defer" />
			<link rel="stylesheet" href="/css/theme.min.css?rnd=134201208020593386" defer="defer" />
			<link rel="stylesheet" href="//fonts.googleapis.com/css?family=Open+Sans:700italic&display=swap"/>
		</head>
		<body id="" class="site_opticom">
			<div id="page" class="container">
				<div id="head" class="container">
					<div class="container12">
						<div class="row">
							<div class="span2">
								<p id="head-logo">
									<a href="/">
										<img loading="lazy" src="/media/qp1nv1bs/opticom-logo.png" alt="Opticom" width="220" height="40">
										</a>
									</p>
								</div>
								<div class="span10">
									<div id="nav" class="container">
										<ul class="nav-menu">
											<li class="first">
												<a title="Home"  target="" href="/">
                                                    Home
                                            </a>
											</li>
											<li class="">
												<a href="/about/"  target="" title="About">About</a>
												<ul>
													<li>
														<a title="The Opticom System"  target="" href="/about/the-opticom-system/">
                                                                The Opticom System
                                                            </a>
													</li>
													<li>
														<a title="Participating Vendors"  target="" href="/about/vendors/">
                                                                Vendors
                                                            </a>
													</li>
													<li>
														<a title="Requirements"  target="" href="/about/computer-requirements/">
                                                                Requirements
                                                            </a>
													</li>
													<li>
														<a title="Getting Started"  target="" href="/about/getting-started/">
                                                                Getting Started
                                                            </a>
													</li>
													<li class="last">
														<a title="Contact"  target="" href="/about/contact-us/">
                                                                Contact Us
                                                            </a>
													</li>
												</ul>
											</li>
											<li class="">
												<a href="/product-search/"  target="" title="Product Search">Product Search</a>
												<ul>
													<li>
														<a title="Product Search"  target="" href="/product-search/">
                                                                Product Search / Ordering
                                                            </a>
													</li>
													<li class="last">
														<a title="Replacement Ordering" class=current target="" href="/replacement-ordering/">
                                                                Search by SKU
                                                            </a>
													</li>
												</ul>
											</li>
											<li class="">
												<a title="Replacement Ordering" target="" href="/replacement-ordering/">
                                                    Replacement Ordering
                                            </a>
											</li>
											<li class="">
												<a title="Order History"  target="" href="/order-history/">
                                                    Order History
                                            </a>
											</li>
											<li class="">
												<a title="Cart"  target="" href="/cart/">
                                                    Cart

													<i class="icon-shopping-cart icon-white"></i>
												</a>
											</li>
											<li class="">
												<a href="/shipment-notification/"  target="" title="Shipment Notification">Shipment Notification</a>
												<ul>
													<li>
														<a title="Shipment Notification"  target="" href="/shipment-notification/">
                                                                Go to My Shipments
                                                            </a>
													</li>
													<li class="last">
														<a title="Information"  target="" href="/shipment-notification/information/">
                                                                Information
                                                            </a>
													</li>
												</ul>
											</li>
											<li class=" last">
												<a title="Confirmation Check"  target="" href="/confirmation-check/">
                                                    Confirmation Check
                                            </a>
											</li>
										</ul>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="span12">
									<div id="head-user">Welcome: Doctors Optical Labs</div>
								</div>
							</div>
						</div>
					</div>
					<div id="body" class="container">
						<div id="body" class="container">
							<div id="hero">
								<h1>Ship File Viewer (#${getShipFileID()})</h1>
							</div>
							<div class="container12">
								<div class="row">
									<div class="span12">
										<div id="content" class="container">
											<!-- END FRAMEWORK HEADER -->
											<!-- START CONTENT -->
											<p>
												<span style="font-family: Verdana; font-size: small;">Displays extra information about shipments. This is a third party script not affiliated with Opticom.  </span>
											</p>
											<div id="ShipFileViewer">
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div id="foot" class="container">
							<div class="container12">
								<div class="row">
									<div class="span7">
										<div id="foot-nav">
											<div class="row">
												<div class="span2">
													<ul>
														<li>
															<a href="/about/vendors/" title="Participating Vendors">Participating Vendors</a>
														</li>
														<li>
															<a href="/about/contact-us/" title="Contact Us">Contact Us</a>
														</li>
													</ul>
												</div>
												<div class="span2">
													<ul>
														<li>
															<a href="/about/vendors/cut-off-times/" title="Vendor Cut-Off Times">Vendor Cut-Off Times</a>
														</li>
														<li>
															<a href="/member/" title="My Account">My Account</a>
														</li>
													</ul>
												</div>
												<div class="span2">
													<ul>
														<li>
															<a href="http://www.opticom-inc.com/about/getting-started/" title="Getting Started">Getting Started</a>
														</li>
													</ul>
												</div>
											</div>
										</div>
									</div>
									<div class="span5">
										<p id="foot-copy">
						&copy; 2026&nbsp;Opticom
											<br>all rights reserved

											</p>
											<p id="foot-credit" class="d-none">
												<a href="https://fyin.com">
													<picture>
														<source srcset="/images/fyin-powered-gray.webp?width=140&height=100&rnd=134201551619034871" type="image/webp">
															<img loading="lazy" src="/images/fyin-powered-gray.png" alt="fyin.com - Umbraco Web Development" width="132" />
														</picture>
													</a>
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div id="mast"></div>
							<!-- END FRAMEWORK FOOTER -->
						</body>
					</html>
`;

    document.documentElement.innerHTML = mockUI;

    const viewerContainer = document.getElementById('ShipFileViewer');

if (viewerContainer && parsedShipFile) {
    const { header, items } = parsedShipFile;

    const safePrice = (val) => parseFloat(val || 0);

    const totalPrice = items.reduce((sum, item) => {
        return sum + (safePrice(item.unitPrice) * (item.qtyShipped || 0));
    }, 0);

    const summaryHtml = `
        <div class="row-fluid" style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border: 1px solid #ddd;box-sizing:border-box;">
            <div class="span4">
                <strong>Vendor:</strong> ${header.vendorCode || 'N/A'} (${header.account || 'N/A'})<br>
                <strong>PO Number:</strong> ${header.poNumber || 'N/A'}
            </div>
            <div class="span4">
                <strong>Ship Date:</strong> ${header.shipDate ? header.shipDate.toLocaleDateString() : 'N/A'}<br>
                <strong>Order Date:</strong> ${header.orderDate ? header.orderDate.toLocaleDateString() : 'N/A'}
            </div>
            <div class="span4">
                <strong>Tracking:</strong> ${header.trackingNumber || 'N/A'}
                ${header.trackingNumber ? `
                    <a class="btn btn-success btn-small" href="${header.trackingUrl}" target="_blank" style="margin-left:10px;">
                        <i class="icon-map-marker icon-white"></i> Track Package
                    </a>` : ''}
            </div>
        </div>
    `;

    const itemRows = items.map(item => {
        const price = safePrice(item.unitPrice);
        const qty = item.qtyShipped || 0;
        const subtotal = price * qty;

        return `
            <tr>
                <td><strong>${item.sku || 'Unknown Item'}</strong></td>
                <td style="text-align:center;">${item.qtyOrdered || 0}</td>
                <td style="text-align:center;">${qty}</td>
                <td style="text-align:right;">$${price.toFixed(2)}</td>
                <td style="text-align:right;">$${subtotal.toFixed(2)}</td>
            </tr>
        `;
    }).join('');

    const unmappedList = parsedShipFile.rawUnmapped.map(u =>
        `<li><strong>Code ${u.code}:</strong> ${u.value}</li>`
    ).join('') || '<li>None</li>';

    const debugHtml = `
        <div class="accordion" id="debugAccordion" style="margin-top: 30px;">
            <div class="accordion-group">
                <div class="accordion-heading" style="background: #eee;">
                    <a class="accordion-toggle" data-toggle="collapse" href="#collapseDebug">
                        <i class="icon-wrench"></i> Show Raw Shipfile & Unmapped Data
                    </a>
                </div>
                <div id="collapseDebug" class="accordion-body collapse">
                    <div class="accordion-inner">
                        <div class="row-fluid">
                            <div class="span6">
                                <h5>Unmapped Fields</h5>
                                <ul style="font-family: monospace;">
                                    ${unmappedList}
                                </ul>
                            </div>
                            <div class="span6">
                                <h5>Original Shipfile</h5>
                                <textarea readonly style="width: 100%; height: 120px; font-family: monospace; font-size: 11px; box-sizing: border-box;">${rawShipFile}</textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    viewerContainer.innerHTML = `
        ${summaryHtml}
        <h4>Shipment Contents</h4>
        <table class="list-table table table-striped speciallist">
            <thead>
                <tr>
                    <th>Lens / SKU</th>
                    <th style="text-align:center;">Qty Ordered</th>
                    <th style="text-align:center;">Qty Shipped</th>
                    <th style="text-align:right;">Unit Price</th>
                    <th style="text-align:right;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${itemRows}
            </tbody>
            <tfoot>
                <tr style="background-color: #f5f5f5; font-weight: bold;">
                    <td colspan="4" style="text-align:right;">Total Shipment Value:</td>
                    <td style="text-align:right;">$${totalPrice.toFixed(2)}</td>
                </tr>
            </tfoot>
        </table>

        ${debugHtml}
    `;

document.querySelector('.accordion-toggle').addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.classList.toggle('in');
});
}

})();