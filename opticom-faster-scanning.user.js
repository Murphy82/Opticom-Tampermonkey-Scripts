// ==UserScript==
// @name          Opticom Faster Scanning
// @namespace     https://ohlinis.me/
// @version       2026-04-22
// @description   Intercepts and replaces the replacement-ordering minified script to fix barcode errors when scanning fast
// @author        Ohlin Arellano
// @match         *://*.opticom-inc.com/replacement-ordering/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=opticom-inc.com
// @grant         none
// @run-at        document-start
// @updateURL    https://github.com/Murphy82/Opticom-Tampermonkey-Scripts/raw/refs/heads/main/opticom-faster-scanning.user.js
// @downloadURL  https://github.com/Murphy82/Opticom-Tampermonkey-Scripts/raw/refs/heads/main/opticom-faster-scanning.user.js
// ==/UserScript==

(function() {
    'use strict';
    const TARGET_FILE = 'opticom_replacement-ordering.min.js';

    const INJECTED_SCRIPT = `
/*! For license information please see opticom_replacement-ordering.min.js.LICENSE.txt */
(self.webpackChunkfyindotcom_opticom_web = self.webpackChunkfyindotcom_opticom_web || []).push([[652], {
    203: () => {
        !function () {
            $('[name="ReplacementOrderingProductCode"]').focus();
            var t = !1
                , e = []
                , n = null
                , scanQueue = []
                , isProcessing = false
                , barcodeBuffer = "";
            function o() {
                $("#btnReloadTop").removeAttr("disabled"),
                    $("#cartWarningText").fadeIn(),
                    $("#Qty1").text(""),
                    $("#RowCount1").text(""),
                    $("#pnlJSError").hide(),
                    $("#ItemRows").html(""),
                    $("#ItemHeader").html(""),
                    $("#ReplacementOrdering_lblRowCount").text(""),
                    $("#ReplacementOrdering_lblQTYCount").text(""),
                    $('[name="ReplacementOrderingProductCode"]')[0].disabled = !1,
                    $('[name="ReplacementOrderingProductCode"]').focus()
            }
            function i(o) {
                var i = $("[id$=ProductCode]")
                    , r = $("#TheError")
                    , s = $("#pnlJSError");
                $("[id$=JSAdd]").toggle(),
                    $(i)[0] && ($(i)[0].disabled = !0),
                    $("#WaitingPanel").toggle();
                var d = o;
                $("[id$=JSAdd]").toggle(),
                    $(i)[0] && ($(i)[0].disabled = !1),
                    $("#WaitingPanel").toggle();
                var c = jQuery.parseJSON(d)
                    , p = c.orders
                    , h = ""
                    , f = ""
                    , m = $("#ItemHeader")
                    , y = $("#ItemRows")
                    , _ = $("#ItemRows").data("showpcat")
                    , g = $("#ItemRows").data("showrush");
                if (0 !== p.length || c.error)
                    if (void 0 !== p && null != p[0] && "" == p[0].error) {
                        $("[id$=JSAdd]")[0].disabled = !1,
                            $(i)[0] && ($(i)[0].disabled = !1),
                            $(r).text(""),
                            $(s).attr("style", "display:none;");
                        var v = !1;
                        "" == $(m).text().trim() && (h += "<tr><th>Item Number</th>",
                            _ && void 0 !== p[0].PCAT && "" != p[0].PCAT ? h += "<th>PCAT</th>" : h += "<th id='pactTh'></th>",
                            h += "<th>Qty</th>",
                            h += "<th>Manufacturer</th>",
                            h += "<th>Description</th>",
                            h += "<th>Tray</th>",
                            g && (h += "<th>Rush</th>"),
                            h += "<th>BO&nbsp;<i style='display: none;' class='icon-question-sign' title='Check to ship backordered items. Uncheck to cancel out of stock items.'></i></th>",
                            h += "</tr>"),
                            [].map.call(p, (function (e) {
                                f += "<tr class='" + (e.classes || "") + " " + (e.Discontinued ? "error" : "") + "' data-item=" + e.ItemNumber + " data-manufid=" + e.ManufacturerID + ">",
                                    f += "<td>" + (e.botext || "") + " " + e.ItemNumber + "</td>",
                                    _ && void 0 !== e.PCAT && "" != e.PCAT ? (f += "<td>" + e.PCAT + "</td>",
                                        v = !0) : f += "<td></td>",
                                    t ? (f += "<td class='editMode txtQty'><input type='number' value='" + e.QTY + "' min='0' max='9999' class='input-qty increment-input enforce-qty' ></td>",
                                        f += "<td class='viewMode tdQty _qty' style='display: none;'>" + e.QTY + "</td>",
                                        f += "<td>" + e.MFG.replace("!!", '"').replace("~~", "'") + "</td>",
                                        f += "<td>" + e.Description.replace("!!", '"').replace("~~", "'") + "</td>",
                                        f += "<td class='editMode'><input type='text' value='" + e.Tray + "' maxlength='10'  class='input-medium tray-input'></td>",
                                        f += "<td class='viewMode _tray' style='display: none;'>" + e.Tray + "</td>",
                                        g && (f += "<td class='editMode'><input id='RushCheckBox_0' type='checkbox' name='RushCheckBox'" + (e.Rush ? "checked = 'checked'" : "") + " class='chkGridRush'></td>",
                                            f += "<td class='viewMode _rush' style='display: none;'>" + (e.Rush ? "Yes" : "No") + "</td>"),
                                        f += "<td class='editMode'><input id='BOCheckBox_0' type='checkbox' name='BOCheckBox'" + (e.BO ? "checked = 'checked'" : "") + " class='chkGridBO'></td>",
                                        f += "<td class='viewMode _bo' style='display: none;'>" + (e.BO ? "Yes" : "No") + "</td>",
                                        f += "<td class='editMode'> <a class='_removeButton' href=''><i class='icon-remove'>&nbsp;</i> </a> </td>") : (f += "<td class='editMode txtQty' style='display: none;'><input type='number' value='" + e.QTY + "' min='0' max='9999' class='input-qty increment-input enforce-qty' ></td>",
                                            f += "<td class='viewMode tdQty _qty'>" + e.QTY + "</td>",
                                            f += "<td>" + e.MFG.replace("!!", '"').replace("~~", "'") + "</td>",
                                            f += "<td>" + e.Description.replace("!!", '"').replace("~~", "'") + "</td>",
                                            f += "<td class='editMode' style='display: none;'><input type='text' value='" + e.Tray + "' maxlength='10' class='input-medium tray-input'></td>",
                                            f += "<td class='viewMode _tray'>" + e.Tray + "</td>",
                                            g && (f += "<td class='editMode' style='display: none;'><input id='RushCheckBox_0' type='checkbox' name='RushCheckBox'" + (e.Rush ? "checked = 'checked'" : "") + " class='chkGridRush'></td>",
                                                f += "<td class='viewMode _rush'>" + (e.Rush ? "Yes" : "No") + "</td>"),
                                            f += "<td class='editMode' style='display: none;'><input id='BOCheckBox_0' type='checkbox' name='BOCheckBox'" + (e.BO ? "checked = 'checked'" : "") + " class='chkGridBO'></td>",
                                            f += "<td class='viewMode _bo'>" + (e.BO ? "Yes" : "No") + "</td>",
                                            f += "<td class='editMode' style='display: none;'> <a class='_removeButton' href=''><i class='icon-remove'>&nbsp;</i> </a> </td>"),
                                    f += "</tr>"
                            }
                            )),
                            "" == $(m).text().trim() && $(m).prepend(h),
                            _ && v && $(m).find("#pactTh").html("PCAT"),
                            $(y).prepend(f),
                            a(),
                            $("._barcode").val(""),
                            $("._barcode").focus(),
                            $(".chkGridBO").on("click", (function (t) {
                                $(this).parent().parent().data("item");
                                var n, o, i = $(this).prop("checked"), a = $(".chkGridBO").index(this);
                                n = i,
                                    o = a,
                                    $.ajax({
                                        url: "/api/ReplacementOrdering/UpdateBO",
                                        type: "POST",
                                        data: {
                                            index: o,
                                            BackOrder: n
                                        },
                                        success: function () {
                                            e[o].BO = n,
                                                $("._bo")[o].innerText = n ? "Yes" : "No"
                                        },
                                        error: function (t) { },
                                        complete: function (t) { }
                                    })
                            }
                            )),
                            $(".chkGridRush").on("click", (function (t) {
                                $(this).parent().parent().data("item");
                                var n, o, i = $(this).prop("checked"), a = $(".chkGridRush").index(this);
                                n = i,
                                    o = a,
                                    $.ajax({
                                        url: "/api/ReplacementOrdering/UpdateRush",
                                        type: "POST",
                                        data: {
                                            index: o,
                                            Rush: n
                                        },
                                        success: function () {
                                            e[o].Rush = n,
                                                $("._rush")[o].innerText = n ? "Yes" : "No"
                                        },
                                        error: function (t) { },
                                        complete: function (t) { }
                                    })
                            }
                            )),
                            enforceQty(),
                            $(".txtQty input").off("change", "**"),
                            $(".txtQty input").change((function (t) {
                                t.preventDefault(),
                                    t.stopPropagation();
                                var e = $(this).closest(".txtQty")
                                    , n = ($(e).parent().data("item"),
                                        $(e).find("input").val())
                                    , o = $(".txtQty").index(e);
                                !function (t, e, n, o) {
                                    $("#qtyWarningText").fadeOut();
                                    var i = "" == $("#qtyWarningText").data("qtywarning") ? 200 : $("#qtyWarningText").data("qtywarning")
                                        , a = $("#qtyWarningText").data("qtywarningmessage")
                                        , r = $("#qtyWarningText").data("qtywarningmessagechanged");
                                    a = a.replace("{0}", n),
                                        r = r.replace("{0}", n),
                                        $("#qtyWarningText").html(r),
                                        1 * n <= i ? u(0, n, o) : i > 0 && (confirm(a) ? ($("#qtyWarningText").fadeIn(),
                                            u(0, n, o)) : ($(t).val("1"),
                                                u(0, 1, o)))
                                }($(e).find("input"), 0, n, o)
                            }
                            )),
                            $(".tray-input").focusout((function () {
                                var t, n;
                                $(this).parent().parent().data("item"),
                                    t = $(this).val(),
                                    n = $(".tray-input").index(this),
                                    $.ajax({
                                        url: "/api/ReplacementOrdering/UpdateTray",
                                        type: "POST",
                                        data: {
                                            index: n,
                                            tray: t
                                        },
                                        success: function () {
                                            e[n].Tray = t,
                                                $("._tray")[n].innerText = t
                                        },
                                        error: function (t) { },
                                        complete: function (t) { }
                                    })
                            }
                            )),
                            $("._removeButton").off("click", l),
                            $("._removeButton").on("click", l)
                    } else
                        $("[id$=JSAdd]")[0].disabled = !0,
                            $(i)[0] && ($(i)[0].disabled = !0),
                            "" != c.error ? $(r).text(c.error) : null != p[0] && $(r).text(p[0].error),
                            $(s).attr("style", ""),
                            n.play(),
                            $(i).val(""),
                            $(i).focus()
            }
            function a() {
                $("[id$=lblRowCount]").text("Line Count: "),
                    $("#RowCount1").text(e.length),
                    $("#ReplacementOrdering_Qty").css("display", "none");
                var t = 0;
                [].map.call(e, (function (e) {
                    t += parseInt(e.Quantity)
                }
                )),
                    $('[id$="lblQTYCount"]').text("Quantity: "),
                    $("#Qty1").text(t)
            }
            function r() {
                var t = $("#TheError");
                if ("" != $(t).text())
                    return !1;
                var e = $("._barcode");
                return "" != $(e).val().trim()
            }
            function processQueue() {
                if (isProcessing || scanQueue.length === 0) return;
                console.log('processQueue() running and we are processing or the scanQueue is greater than 0')

                isProcessing = true;
                var barcodeVal = scanQueue.shift();
                $.ajax({
                    url: "/api/ReplacementOrdering/additem",
                    type: "GET",
                    data: { itemID: barcodeVal },
                    success: function (response) {
                        var parsed = JSON.parse(response);
                        if (parsed.orders[0] && !parsed.orders[0].error) {
                            e.splice(0, 0, parsed.orders[0]);
                        }
                        i(response);
                    },
                    error: function () {
                        console.error("Scan failed for: " + barcodeVal);
                        if (n) n.play();
                    },
                    complete: function () {
                        isProcessing = false;
                        processQueue();
                    }
                });
            }
            function s() {
                var barcodeInput = $("._barcode");
                var t = barcodeInput.val().trim(); // 1. Capture the value
                console.log('if this is called that means s() is still being used. Remove!')

                if (t) {
                    barcodeInput.val(""); // 2. Clear the field immediately
                    barcodeInput.focus(); // 3. Keep focus for the next scan

                    $.ajax({
                        url: "/api/ReplacementOrdering/additem",
                        type: "GET",
                        data: {
                            itemID: t // 4. Use the captured value for the request
                        },
                        success: function (response) {
                            var n = JSON.parse(response);
                            // Add to local array 'e' and re-render UI
                            if (n.orders[0] && !n.orders[0].error) {
                                e.splice(0, 0, n.orders[0]);
                            }
                            i(response);
                        },
                        error: function (err) {
                            // Optional: If the request fails, you might want to
                            // notify the user since the field is already cleared.
                            console.error("Scan failed for barcode: " + t);
                            // The original code put the value back on error:
                            barcodeInput.val(t);
                            // But for "Fast Scan," it's better to just trigger the error sound.
                            if (n) n.play();
                        }
                    });
                }
            }
            function u(t, n, o) {
                $.ajax({
                    url: "/api/ReplacementOrdering/UpdateQty",
                    type: "POST",
                    data: {
                        index: o,
                        qty: n
                    },
                    success: function () {
                        e[o].QTY = isNaN(parseInt(n)) ? 0 : parseInt(n),
                            e[o].Quantity = e[o].QTY,
                            a(),
                            $("._qty")[o].innerText = n
                    },
                    error: function (t) { },
                    complete: function (t) { }
                })
            }
            function l(t) {
                t.preventDefault(),
                    t.stopPropagation();
                var n = $("._removeButton").index(this);
                -1 !== n && $.ajax({
                    url: "/api/ReplacementOrdering/RemoveItem",
                    type: "POST",
                    data: {
                        index: n
                    },
                    success: function () {
                        e.splice(n, 1),
                            0 === e.length ? o() : ($("#ItemRows > tr")[n] && $("#ItemRows > tr")[n].remove(),
                                a())
                    },
                    error: function (t) { }
                })
            }
            function d(t) {
                t.preventDefault(),
                    t.stopPropagation();
                var n = [];
                [].map.call(e, (function (t) {
                    n.push({
                        id: t.ItemNumber,
                        itemID: t.ItemNumber,
                        manufId: t.ManufacturerID,
                        tray: t.Tray,
                        quantity: t.QTY,
                        rush: t.Rush,
                        backorder: t.BO
                    })
                }
                )),
                    n.length && $.ajax({
                        url: "/api/cart/additem",
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        context: this,
                        data: JSON.stringify(n),
                        success: function () {
                            $.post("/api/ReplacementOrdering/clearlist").done((function () {
                                window.location.href = "/cart"
                            }
                            ))
                        },
                        error: function (t) { }
                    })
            }
            window.ClearList = function () {
                confirm("The list of items on this page will be cleared. Click OK to continue.") && $.ajax({
                    url: "/api/ReplacementOrdering/ClearList",
                    type: "POST",
                    success: function () {
                        o(),
                            e = []
                    },
                    error: function (t) { }
                })
            }
                ,
                window.ClearError = function () {
                    n.stop(),
                        $("[id$=JSAdd]")[0].disabled = !1,
                        $('[name="ReplacementOrderingProductCode"]')[0].disabled = !1,
                        $("#TheError").text(""),
                        $("#pnlJSError").attr("style", "display:none;"),
                        $('[name="ReplacementOrderingProductCode"]').focus(),
                        $("._barcode").val(""),
                        $("._barcode").focus()
                }
                ,
                window.CanSubmit = r,
                window.getItems = s,
                $(document).ready((function () {
                    soundManager.url = "/assets/video/",
                        soundManager.debugMode = !1,
                        soundManager.onload = function () {
                            n = soundManager.createSound({
                                id: "badBarCode",
                                loops: 9999,
                                url: "/assets/video/Windows XP Battery Critical.mp3"
                            })
                        }
                        ,
                        $.ajax({
                            url: "/api/ReplacementOrdering/GetItems",
                            type: "GET",
                            success: function (t) {
                                $("#ItemRows").html(""),
                                    e = JSON.parse(t).orders || [],
                                    i(t)
                            },
                            error: function (t) { }
                        }),
                        a(),
                        $("#ReplacementOrdering_EditMode").click((function (e) {
                            $(".viewMode").toggle(),
                                $(".editMode").toggle(),
                                "Go to Edit Mode" === $("#ReplacementOrdering_EditMode").text() ? ($("#ReplacementOrdering_EditMode").text("Go to Fast Scan Mode"),
                                    t = !0,
                                    $(".icon-question-sign").show()) : ($("#ReplacementOrdering_EditMode").text("Go to Edit Mode"),
                                        t = !1,
                                        $(".icon-question-sign").hide())
                        }
                        )),

                        $("._barcode").on("keydown", (function (t) {
                            if (13 === t.which) {
                                t.preventDefault();
                                var barcodeVal = barcodeBuffer.trim();
                                barcodeBuffer = ""; // clear the buffer, not the field
                                $(this).val("");
                                $(this).focus();
                                if (barcodeVal && $("#TheError").text() === "") {
                                    console.log("Adding barcode value: " + barcodeVal);
                                    scanQueue.push(barcodeVal);
                                    processQueue();
                                }
                            } else {
                                // Accumulate characters in our own buffer instead of trusting the field
                                if (t.key && t.key.length === 1) {
                                    barcodeBuffer += t.key;
                                }
                            }
                        }));
                    var o = document.querySelectorAll("._add-to-order");
                    [].map.call(o, (function (t) {
                        t.addEventListener("click", d)
                    }
                    ))
                }
                ))
        }()
    }
    ,
    52: () => {
        !function (t, e) {
            function n(n, o) {
                function i(t) {
                    return lt.preferFlash && ot && !lt.ignoreFlash && lt.flash[t] !== e && lt.flash[t]
                }
                function a(t) {
                    return function (e) {
                        var n = this._s;
                        return n && n._a ? t.call(this, e) : null
                    }
                }
                this.setupOptions = {
                    url: n || null,
                    flashVersion: 8,
                    debugMode: !0,
                    debugFlash: !1,
                    useConsole: !0,
                    consoleOnly: !0,
                    waitForWindowLoad: !1,
                    bgColor: "#ffffff",
                    useHighPerformance: !1,
                    flashPollingInterval: null,
                    html5PollingInterval: null,
                    flashLoadTimeout: 1e3,
                    wmode: null,
                    allowScriptAccess: "always",
                    useFlashBlock: !1,
                    useHTML5Audio: !0,
                    html5Test: /^(probably|maybe)$/i,
                    preferFlash: !0,
                    noSWFCache: !1
                },
                    this.defaultOptions = {
                        autoLoad: !1,
                        autoPlay: !1,
                        from: null,
                        loops: 1,
                        onid3: null,
                        onload: null,
                        whileloading: null,
                        onplay: null,
                        onpause: null,
                        onresume: null,
                        whileplaying: null,
                        onposition: null,
                        onstop: null,
                        onfailure: null,
                        onfinish: null,
                        multiShot: !0,
                        multiShotEvents: !1,
                        position: null,
                        pan: 0,
                        stream: !0,
                        to: null,
                        type: null,
                        usePolicyFile: !1,
                        volume: 100
                    },
                    this.flash9Options = {
                        isMovieStar: null,
                        usePeakData: !1,
                        useWaveformData: !1,
                        useEQData: !1,
                        onbufferchange: null,
                        ondataerror: null
                    },
                    this.movieStarOptions = {
                        bufferTime: 3,
                        serverURL: null,
                        onconnect: null,
                        duration: null
                    },
                    this.audioFormats = {
                        mp3: {
                            type: ['audio/mpeg; codecs="mp3"', "audio/mpeg", "audio/mp3", "audio/MPA", "audio/mpa-robust"],
                            required: !0
                        },
                        mp4: {
                            related: ["aac", "m4a", "m4b"],
                            type: ['audio/mp4; codecs="mp4a.40.2"', "audio/aac", "audio/x-m4a", "audio/MP4A-LATM", "audio/mpeg4-generic"],
                            required: !1
                        },
                        ogg: {
                            type: ["audio/ogg; codecs=vorbis"],
                            required: !1
                        },
                        opus: {
                            type: ["audio/ogg; codecs=opus", "audio/opus"],
                            required: !1
                        },
                        wav: {
                            type: ['audio/wav; codecs="1"', "audio/wav", "audio/wave", "audio/x-wav"],
                            required: !1
                        }
                    },
                    this.movieID = "sm2-container",
                    this.id = o || "sm2movie",
                    this.debugID = "soundmanager-debug",
                    this.debugURLParam = /([#?&])debug=1/i,
                    this.versionNumber = "V2.97a.20130324",
                    this.altURL = this.movieURL = this.version = null,
                    this.enabled = this.swfLoaded = !1,
                    this.oMC = null,
                    this.sounds = {},
                    this.soundIDs = [],
                    this.didFlashBlock = this.muted = !1,
                    this.filePattern = null,
                    this.filePatterns = {
                        flash8: /\\.mp3(\\?.*)?$/i,
                        flash9: /\\.mp3(\\?.*)?$/i
                    },
                    this.features = {
                        buffering: !1,
                        peakData: !1,
                        waveformData: !1,
                        eqData: !1,
                        movieStar: !1
                    },
                    this.sandbox = {},
                    this.html5 = {
                        usingFlash: null
                    },
                    this.flash = {},
                    this.ignoreFlash = this.html5Only = !1;
                var r, s, u, l, d, c, p, h, f, m, y, _, g, v, O, b, T, M, w, P, $, L, S, x, I, C, k, D, R, E, H, A, F, B, N, q, U, Q, j, W, V, G, J, Y, X, K, z, Z, tt, et, nt, ot, it, at, rt, st, ut, lt = this, dt = null, ct = null, pt = navigator.userAgent, ht = t.location.href.toString(), ft = document, mt = [], yt = !1, _t = !1, gt = !1, vt = !1, Ot = !1, bt = null, Tt = null, Mt = !1, wt = !1, Pt = 0, $t = null, Lt = [], St = null, xt = Array.prototype.slice, It = !1, Ct = pt.match(/(ipad|iphone|ipod)/i), kt = pt.match(/android/i), Dt = pt.match(/msie/i), Rt = pt.match(/webkit/i), Et = pt.match(/safari/i) && !pt.match(/chrome/i), Ht = pt.match(/opera/i), At = pt.match(/(mobile|pre\\/|xoom)/i) || Ct || kt, Ft = !ht.match(/usehtml5audio/i) && !ht.match(/sm2\\-ignorebadua/i) && Et && !pt.match(/silk/i) && pt.match(/OS X 10_6_([3-7])/i), Bt = ft.hasFocus !== e ? ft.hasFocus() : null, Nt = Et && (ft.hasFocus === e || !ft.hasFocus()), qt = !Nt, Ut = /(mp3|mp4|mpa|m4a|m4b)/i, Qt = ft.location ? ft.location.protocol.match(/http/i) : null, jt = Qt ? "" : "http://", Wt = /^\\s*audio\\/(?:x-)?(?:mpeg4|aac|flv|mov|mp4||m4v|m4a|m4b|mp4v|3gp|3g2)\\s*(?:$|;)/i, Vt = "mpeg4 aac flv mov mp4 m4v f4v m4a m4b mp4v 3gp 3g2".split(" "), Gt = RegExp("\\\\.(" + Vt.join("|") + ")(\\\\?.*)?$", "i");
                this.mimePattern = /^\\s*audio\\/(?:x-)?(?:mp(?:eg|3))\\s*(?:$|;)/i,
                    this.useAltURL = !Qt;
                try {
                    ut = Audio !== e && (Ht && opera !== e && 10 > opera.version() ? new Audio(null) : new Audio).canPlayType !== e
                } catch (t) {
                    ut = !1
                }
                this.hasHTML5 = ut,
                    this.setup = function (t) {
                        var n = !lt.url;
                        return t !== e && gt && St && lt.ok() && (t.flashVersion !== e || t.url !== e || t.html5Test !== e) && U(A("setupLate")),
                            f(t),
                            n && S && t.url !== e && lt.beginDelayedInit(),
                            !S && t.url !== e && "complete" === ft.readyState && setTimeout($, 1),
                            lt
                    }
                    ,
                    this.supported = this.ok = function () {
                        return St ? gt && !vt : lt.useHTML5Audio && lt.hasHTML5
                    }
                    ,
                    this.getMovie = function (e) {
                        return s(e) || ft[e] || t[e]
                    }
                    ,
                    this.createSound = function (t, n) {
                        function o() {
                            return i = N(i),
                                lt.sounds[i.id] = new r(i),
                                lt.soundIDs.push(i.id),
                                lt.sounds[i.id]
                        }
                        var i, a = null;
                        return gt && lt.ok() ? (n !== e && (t = {
                            id: t,
                            url: n
                        }),
                            (i = h(t)).url = G(i.url),
                            Q(i.id, !0) ? lt.sounds[i.id] : (Y(i) ? (a = o())._setup_html5(i) : (8 < c && null === i.isMovieStar && (i.isMovieStar = !(!i.serverURL && !(i.type && i.type.match(Wt) || i.url.match(Gt)))),
                                i = q(i, void 0),
                                a = o(),
                                8 === c ? ct._createSound(i.id, i.loops || 1, i.usePolicyFile) : (ct._createSound(i.id, i.url, i.usePeakData, i.useWaveformData, i.useEQData, i.isMovieStar, !!i.isMovieStar && i.bufferTime, i.loops || 1, i.serverURL, i.duration || null, i.autoPlay, !0, i.autoLoad, i.usePolicyFile),
                                    i.serverURL || (a.connected = !0,
                                        i.onconnect && i.onconnect.apply(a))),
                                !i.serverURL && (i.autoLoad || i.autoPlay) && a.load(i)),
                                !i.serverURL && i.autoPlay && a.play(),
                                a)) : (U(void 0),
                                    !1)
                    }
                    ,
                    this.destroySound = function (t, e) {
                        if (!Q(t))
                            return !1;
                        var n, o = lt.sounds[t];
                        for (o._iO = {},
                            o.stop(),
                            o.unload(),
                            n = 0; n < lt.soundIDs.length; n++)
                            if (lt.soundIDs[n] === t) {
                                lt.soundIDs.splice(n, 1);
                                break
                            }
                        return e || o.destruct(!0),
                            delete lt.sounds[t],
                            !0
                    }
                    ,
                    this.load = function (t, e) {
                        return !!Q(t) && lt.sounds[t].load(e)
                    }
                    ,
                    this.unload = function (t) {
                        return !!Q(t) && lt.sounds[t].unload()
                    }
                    ,
                    this.onposition = this.onPosition = function (t, e, n, o) {
                        return !!Q(t) && lt.sounds[t].onposition(e, n, o)
                    }
                    ,
                    this.clearOnPosition = function (t, e, n) {
                        return !!Q(t) && lt.sounds[t].clearOnPosition(e, n)
                    }
                    ,
                    this.start = this.play = function (t, e) {
                        var n = !1;
                        return gt && lt.ok() ? Q(t) ? lt.sounds[t].play(e) : (e instanceof Object || (e = {
                            url: e
                        }),
                            e && e.url && (e.id = t,
                                n = lt.createSound(e).play()),
                            n) : (U("soundManager.play(): " + A(gt ? "notOK" : "notReady")),
                                n)
                    }
                    ,
                    this.setPosition = function (t, e) {
                        return !!Q(t) && lt.sounds[t].setPosition(e)
                    }
                    ,
                    this.stop = function (t) {
                        return !!Q(t) && lt.sounds[t].stop()
                    }
                    ,
                    this.stopAll = function () {
                        for (var t in lt.sounds)
                            lt.sounds.hasOwnProperty(t) && lt.sounds[t].stop()
                    }
                    ,
                    this.pause = function (t) {
                        return !!Q(t) && lt.sounds[t].pause()
                    }
                    ,
                    this.pauseAll = function () {
                        var t;
                        for (t = lt.soundIDs.length - 1; 0 <= t; t--)
                            lt.sounds[lt.soundIDs[t]].pause()
                    }
                    ,
                    this.resume = function (t) {
                        return !!Q(t) && lt.sounds[t].resume()
                    }
                    ,
                    this.resumeAll = function () {
                        var t;
                        for (t = lt.soundIDs.length - 1; 0 <= t; t--)
                            lt.sounds[lt.soundIDs[t]].resume()
                    }
                    ,
                    this.togglePause = function (t) {
                        return !!Q(t) && lt.sounds[t].togglePause()
                    }
                    ,
                    this.setPan = function (t, e) {
                        return !!Q(t) && lt.sounds[t].setPan(e)
                    }
                    ,
                    this.setVolume = function (t, e) {
                        return !!Q(t) && lt.sounds[t].setVolume(e)
                    }
                    ,
                    this.mute = function (t) {
                        var e = 0;
                        if (t instanceof String && (t = null),
                            t)
                            return !!Q(t) && lt.sounds[t].mute();
                        for (e = lt.soundIDs.length - 1; 0 <= e; e--)
                            lt.sounds[lt.soundIDs[e]].mute();
                        return lt.muted = !0
                    }
                    ,
                    this.muteAll = function () {
                        lt.mute()
                    }
                    ,
                    this.unmute = function (t) {
                        if (t instanceof String && (t = null),
                            t)
                            return !!Q(t) && lt.sounds[t].unmute();
                        for (t = lt.soundIDs.length - 1; 0 <= t; t--)
                            lt.sounds[lt.soundIDs[t]].unmute();
                        return lt.muted = !1,
                            !0
                    }
                    ,
                    this.unmuteAll = function () {
                        lt.unmute()
                    }
                    ,
                    this.toggleMute = function (t) {
                        return !!Q(t) && lt.sounds[t].toggleMute()
                    }
                    ,
                    this.getMemoryUse = function () {
                        var t = 0;
                        return ct && 8 !== c && (t = parseInt(ct._getMemoryUse(), 10)),
                            t
                    }
                    ,
                    this.disable = function (n) {
                        var o;
                        if (n === e && (n = !1),
                            vt)
                            return !1;
                        for (vt = !0,
                            o = lt.soundIDs.length - 1; 0 <= o; o--)
                            R(lt.sounds[lt.soundIDs[o]]);
                        return p(n),
                            et.remove(t, "load", g),
                            !0
                    }
                    ,
                    this.canPlayMIME = function (t) {
                        var e;
                        return lt.hasHTML5 && (e = X({
                            type: t
                        })),
                            !e && St && (e = t && lt.ok() ? !!(8 < c && t.match(Wt) || t.match(lt.mimePattern)) : null),
                            e
                    }
                    ,
                    this.canPlayURL = function (t) {
                        var e;
                        return lt.hasHTML5 && (e = X({
                            url: t
                        })),
                            !e && St && (e = t && lt.ok() ? !!t.match(lt.filePattern) : null),
                            e
                    }
                    ,
                    this.canPlayLink = function (t) {
                        return !(t.type === e || !t.type || !lt.canPlayMIME(t.type)) || lt.canPlayURL(t.href)
                    }
                    ,
                    this.getSoundById = function (t, e) {
                        if (!t)
                            throw Error("soundManager.getSoundById(): sID is null/_undefined");
                        return lt.sounds[t]
                    }
                    ,
                    this.onready = function (e, n) {
                        if ("function" != typeof e)
                            throw A("needFunction", "onready");
                        return n || (n = t),
                            y("onready", e, n),
                            _(),
                            !0
                    }
                    ,
                    this.ontimeout = function (e, n) {
                        if ("function" != typeof e)
                            throw A("needFunction", "ontimeout");
                        return n || (n = t),
                            y("ontimeout", e, n),
                            _({
                                type: "ontimeout"
                            }),
                            !0
                    }
                    ,
                    this._wD = this._writeDebug = function (t, e) {
                        return !0
                    }
                    ,
                    this._debug = function () { }
                    ,
                    this.reboot = function (e, n) {
                        var o, i, a;
                        for (o = lt.soundIDs.length - 1; 0 <= o; o--)
                            lt.sounds[lt.soundIDs[o]].destruct();
                        if (ct)
                            try {
                                Dt && (Tt = ct.innerHTML),
                                    bt = ct.parentNode.removeChild(ct)
                            } catch (t) { }
                        if (Tt = bt = St = ct = null,
                            lt.enabled = S = gt = Mt = wt = yt = _t = vt = It = lt.swfLoaded = !1,
                            lt.soundIDs = [],
                            lt.sounds = {},
                            e)
                            mt = [];
                        else
                            for (o in mt)
                                if (mt.hasOwnProperty(o))
                                    for (i = 0,
                                        a = mt[o].length; i < a; i++)
                                        mt[o][i].fired = !1;
                        return lt.html5 = {
                            usingFlash: null
                        },
                            lt.flash = {},
                            lt.html5Only = !1,
                            lt.ignoreFlash = !1,
                            t.setTimeout((function () {
                                P(),
                                    n || lt.beginDelayedInit()
                            }
                            ), 20),
                            lt
                    }
                    ,
                    this.reset = function () {
                        return lt.reboot(!0, !0)
                    }
                    ,
                    this.getMoviePercent = function () {
                        return ct && "PercentLoaded" in ct ? ct.PercentLoaded() : null
                    }
                    ,
                    this.beginDelayedInit = function () {
                        Ot = !0,
                            $(),
                            setTimeout((function () {
                                return !wt && (I(),
                                    w(),
                                    wt = !0)
                            }
                            ), 20),
                            v()
                    }
                    ,
                    this.destruct = function () {
                        lt.disable(!0)
                    }
                    ,
                    r = function (t) {
                        var n, o, i, a, r, s, u, l, d, p, f = this, m = !1, y = [], _ = 0, g = null;
                        o = n = null,
                            this.sID = this.id = t.id,
                            this.url = t.url,
                            this._iO = this.instanceOptions = this.options = h(t),
                            this.pan = this.options.pan,
                            this.volume = this.options.volume,
                            this.isHTML5 = !1,
                            this._a = null,
                            this.id3 = {},
                            this._debug = function () { }
                            ,
                            this.load = function (t) {
                                var n;
                                if (t !== e ? f._iO = h(t, f.options) : (t = f.options,
                                    f._iO = t,
                                    g && g !== f.url && (f._iO.url = f.url,
                                        f.url = null)),
                                    f._iO.url || (f._iO.url = f.url),
                                    f._iO.url = G(f._iO.url),
                                    (n = f.instanceOptions = f._iO).url === f.url && 0 !== f.readyState && 2 !== f.readyState)
                                    return 3 === f.readyState && n.onload && st(f, (function () {
                                        n.onload.apply(f, [!!f.duration])
                                    }
                                    )),
                                        f;
                                if (f.loaded = !1,
                                    f.readyState = 1,
                                    f.playState = 0,
                                    f.id3 = {},
                                    Y(n))
                                    f._setup_html5(n)._called_load || (f._html5_canplay = !1,
                                        f.url !== n.url && (f._a.src = n.url,
                                            f.setPosition(0)),
                                        f._a.autobuffer = "auto",
                                        f._a.preload = "auto",
                                        f._a._called_load = !0,
                                        n.autoPlay && f.play());
                                else
                                    try {
                                        f.isHTML5 = !1,
                                            f._iO = q(N(n)),
                                            n = f._iO,
                                            8 === c ? ct._load(f.id, n.url, n.stream, n.autoPlay, n.usePolicyFile) : ct._load(f.id, n.url, !!n.stream, !!n.autoPlay, n.loops || 1, !!n.autoLoad, n.usePolicyFile)
                                    } catch (t) {
                                        C({
                                            type: "SMSOUND_LOAD_JS_EXCEPTION",
                                            fatal: !0
                                        })
                                    }
                                return f.url = n.url,
                                    f
                            }
                            ,
                            this.unload = function () {
                                return 0 !== f.readyState && (f.isHTML5 ? (s(),
                                    f._a && (f._a.pause(),
                                        z(f._a, "about:blank"),
                                        g = "about:blank")) : 8 === c ? ct._unload(f.id, "about:blank") : ct._unload(f.id),
                                    i()),
                                    f
                            }
                            ,
                            this.destruct = function (t) {
                                f.isHTML5 ? (s(),
                                    f._a && (f._a.pause(),
                                        z(f._a),
                                        It || r(),
                                        f._a._s = null,
                                        f._a = null)) : (f._iO.onfailure = null,
                                            ct._destroySound(f.id)),
                                    t || lt.destroySound(f.id, !0)
                            }
                            ,
                            this.start = this.play = function (t, n) {
                                var o, i;
                                if (i = !0,
                                    i = null,
                                    n = n === e || n,
                                    t || (t = {}),
                                    f.url && (f._iO.url = f.url),
                                    f._iO = h(f._iO, f.options),
                                    f._iO = h(t, f._iO),
                                    f._iO.url = G(f._iO.url),
                                    f.instanceOptions = f._iO,
                                    f._iO.serverURL && !f.connected)
                                    return f.getAutoPlay() || f.setAutoPlay(!0),
                                        f;
                                if (Y(f._iO) && (f._setup_html5(f._iO),
                                    u()),
                                    1 === f.playState && !f.paused && ((o = f._iO.multiShot) || (i = f)),
                                    null !== i)
                                    return i;
                                if (t.url && t.url !== f.url && f.load(f._iO),
                                    f.loaded || (0 === f.readyState ? (f.isHTML5 || (f._iO.autoPlay = !0),
                                        f.load(f._iO),
                                        f.instanceOptions = f._iO) : 2 === f.readyState && (i = f)),
                                    null !== i)
                                    return i;
                                if (!f.isHTML5 && 9 === c && 0 < f.position && f.position === f.duration && (t.position = 0),
                                    f.paused && 0 <= f.position && (!f._iO.serverURL || 0 < f.position))
                                    f.resume();
                                else {
                                    if (f._iO = h(t, f._iO),
                                        null !== f._iO.from && null !== f._iO.to && 0 === f.instanceCount && 0 === f.playState && !f._iO.serverURL) {
                                        if (o = function () {
                                            f._iO = h(t, f._iO),
                                                f.play(f._iO)
                                        }
                                            ,
                                            f.isHTML5 && !f._html5_canplay ? (f.load({
                                                oncanplay: o
                                            }),
                                                i = !1) : f.isHTML5 || f.loaded || f.readyState && 2 === f.readyState || (f.load({
                                                    onload: o
                                                }),
                                                    i = !1),
                                            null !== i)
                                            return i;
                                        f._iO = p()
                                    }
                                    (!f.instanceCount || f._iO.multiShotEvents || !f.isHTML5 && 8 < c && !f.getAutoPlay()) && f.instanceCount++,
                                        f._iO.onposition && 0 === f.playState && l(f),
                                        f.playState = 1,
                                        f.paused = !1,
                                        f.position = f._iO.position === e || isNaN(f._iO.position) ? 0 : f._iO.position,
                                        f.isHTML5 || (f._iO = q(N(f._iO))),
                                        f._iO.onplay && n && (f._iO.onplay.apply(f),
                                            m = !0),
                                        f.setVolume(f._iO.volume, !0),
                                        f.setPan(f._iO.pan, !0),
                                        f.isHTML5 ? (u(),
                                            i = f._setup_html5(),
                                            f.setPosition(f._iO.position),
                                            i.play()) : (i = ct._start(f.id, f._iO.loops || 1, 9 === c ? f.position : f.position / 1e3, f._iO.multiShot || !1),
                                                9 === c && !i && f._iO.onplayerror && f._iO.onplayerror.apply(f))
                                }
                                return f
                            }
                            ,
                            this.stop = function (t) {
                                var e = f._iO;
                                return 1 === f.playState && (f._onbufferchange(0),
                                    f._resetOnPosition(0),
                                    f.paused = !1,
                                    f.isHTML5 || (f.playState = 0),
                                    d(),
                                    e.to && f.clearOnPosition(e.to),
                                    f.isHTML5 ? f._a && (t = f.position,
                                        f.setPosition(0),
                                        f.position = t,
                                        f._a.pause(),
                                        f.playState = 0,
                                        f._onTimer(),
                                        s()) : (ct._stop(f.id, t),
                                            e.serverURL && f.unload()),
                                    f.instanceCount = 0,
                                    f._iO = {},
                                    e.onstop && e.onstop.apply(f)),
                                    f
                            }
                            ,
                            this.setAutoPlay = function (t) {
                                f._iO.autoPlay = t,
                                    f.isHTML5 || (ct._setAutoPlay(f.id, t),
                                        t && !f.instanceCount && 1 === f.readyState && f.instanceCount++)
                            }
                            ,
                            this.getAutoPlay = function () {
                                return f._iO.autoPlay
                            }
                            ,
                            this.setPosition = function (t) {
                                t === e && (t = 0);
                                var n = f.isHTML5 ? Math.max(t, 0) : Math.min(f.duration || f._iO.duration, Math.max(t, 0));
                                if (f.position = n,
                                    t = f.position / 1e3,
                                    f._resetOnPosition(f.position),
                                    f._iO.position = n,
                                    f.isHTML5) {
                                    if (f._a && f._html5_canplay && f._a.currentTime !== t)
                                        try {
                                            f._a.currentTime = t,
                                                (0 === f.playState || f.paused) && f._a.pause()
                                        } catch (t) { }
                                } else
                                    t = 9 === c ? f.position : t,
                                        f.readyState && 2 !== f.readyState && ct._setPosition(f.id, t, f.paused || !f.playState, f._iO.multiShot);
                                return f.isHTML5 && f.paused && f._onTimer(!0),
                                    f
                            }
                            ,
                            this.pause = function (t) {
                                return f.paused || 0 === f.playState && 1 !== f.readyState || (f.paused = !0,
                                    f.isHTML5 ? (f._setup_html5().pause(),
                                        s()) : (t || t === e) && ct._pause(f.id, f._iO.multiShot),
                                    f._iO.onpause && f._iO.onpause.apply(f)),
                                    f
                            }
                            ,
                            this.resume = function () {
                                var t = f._iO;
                                return f.paused ? (f.paused = !1,
                                    f.playState = 1,
                                    f.isHTML5 ? (f._setup_html5().play(),
                                        u()) : (t.isMovieStar && !t.serverURL && f.setPosition(f.position),
                                            ct._pause(f.id, t.multiShot)),
                                    !m && t.onplay ? (t.onplay.apply(f),
                                        m = !0) : t.onresume && t.onresume.apply(f),
                                    f) : f
                            }
                            ,
                            this.togglePause = function () {
                                return 0 === f.playState ? (f.play({
                                    position: 9 !== c || f.isHTML5 ? f.position / 1e3 : f.position
                                }),
                                    f) : (f.paused ? f.resume() : f.pause(),
                                        f)
                            }
                            ,
                            this.setPan = function (t, n) {
                                return t === e && (t = 0),
                                    n === e && (n = !1),
                                    f.isHTML5 || ct._setPan(f.id, t),
                                    f._iO.pan = t,
                                    n || (f.pan = t,
                                        f.options.pan = t),
                                    f
                            }
                            ,
                            this.setVolume = function (t, n) {
                                return t === e && (t = 100),
                                    n === e && (n = !1),
                                    f.isHTML5 ? f._a && (f._a.volume = Math.max(0, Math.min(1, t / 100))) : ct._setVolume(f.id, lt.muted && !f.muted || f.muted ? 0 : t),
                                    f._iO.volume = t,
                                    n || (f.volume = t,
                                        f.options.volume = t),
                                    f
                            }
                            ,
                            this.mute = function () {
                                return f.muted = !0,
                                    f.isHTML5 ? f._a && (f._a.muted = !0) : ct._setVolume(f.id, 0),
                                    f
                            }
                            ,
                            this.unmute = function () {
                                f.muted = !1;
                                var t = f._iO.volume !== e;
                                return f.isHTML5 ? f._a && (f._a.muted = !1) : ct._setVolume(f.id, t ? f._iO.volume : f.options.volume),
                                    f
                            }
                            ,
                            this.toggleMute = function () {
                                return f.muted ? f.unmute() : f.mute()
                            }
                            ,
                            this.onposition = this.onPosition = function (t, n, o) {
                                return y.push({
                                    position: parseInt(t, 10),
                                    method: n,
                                    scope: o !== e ? o : f,
                                    fired: !1
                                }),
                                    f
                            }
                            ,
                            this.clearOnPosition = function (t, e) {
                                var n;
                                if (t = parseInt(t, 10),
                                    isNaN(t))
                                    return !1;
                                for (n = 0; n < y.length; n++)
                                    t !== y[n].position || e && e !== y[n].method || (y[n].fired && _--,
                                        y.splice(n, 1))
                            }
                            ,
                            this._processOnPosition = function () {
                                var t, e;
                                if (!(t = y.length) || !f.playState || _ >= t)
                                    return !1;
                                for (t -= 1; 0 <= t; t--)
                                    !(e = y[t]).fired && f.position >= e.position && (e.fired = !0,
                                        _++,
                                        e.method.apply(e.scope, [e.position]));
                                return !0
                            }
                            ,
                            this._resetOnPosition = function (t) {
                                var e, n;
                                if (!(e = y.length))
                                    return !1;
                                for (e -= 1; 0 <= e; e--)
                                    (n = y[e]).fired && t <= n.position && (n.fired = !1,
                                        _--);
                                return !0
                            }
                            ,
                            p = function () {
                                var t, e, n = f._iO, o = n.from, i = n.to;
                                return e = function () {
                                    f.clearOnPosition(i, e),
                                        f.stop()
                                }
                                    ,
                                    t = function () {
                                        null === i || isNaN(i) || f.onPosition(i, e)
                                    }
                                    ,
                                    null !== o && !isNaN(o) && (n.position = o,
                                        n.multiShot = !1,
                                        t()),
                                    n
                            }
                            ,
                            l = function () {
                                var t, e = f._iO.onposition;
                                if (e)
                                    for (t in e)
                                        e.hasOwnProperty(t) && f.onPosition(parseInt(t, 10), e[t])
                            }
                            ,
                            d = function () {
                                var t, e = f._iO.onposition;
                                if (e)
                                    for (t in e)
                                        e.hasOwnProperty(t) && f.clearOnPosition(parseInt(t, 10))
                            }
                            ,
                            u = function () {
                                f.isHTML5 && j(f)
                            }
                            ,
                            s = function () {
                                f.isHTML5 && W(f)
                            }
                            ,
                            i = function (t) {
                                t || (y = [],
                                    _ = 0),
                                    m = !1,
                                    f._hasTimer = null,
                                    f._a = null,
                                    f._html5_canplay = !1,
                                    f.bytesLoaded = null,
                                    f.bytesTotal = null,
                                    f.duration = f._iO && f._iO.duration ? f._iO.duration : null,
                                    f.durationEstimate = null,
                                    f.buffered = [],
                                    f.eqData = [],
                                    f.eqData.left = [],
                                    f.eqData.right = [],
                                    f.failures = 0,
                                    f.isBuffering = !1,
                                    f.instanceOptions = {},
                                    f.instanceCount = 0,
                                    f.loaded = !1,
                                    f.metadata = {},
                                    f.readyState = 0,
                                    f.muted = !1,
                                    f.paused = !1,
                                    f.peakData = {
                                        left: 0,
                                        right: 0
                                    },
                                    f.waveformData = {
                                        left: [],
                                        right: []
                                    },
                                    f.playState = 0,
                                    f.position = null,
                                    f.id3 = {}
                            }
                            ,
                            i(),
                            this._onTimer = function (t) {
                                var e, i = !1, a = {};
                                if (f._hasTimer || t)
                                    return f._a && (t || (0 < f.playState || 1 === f.readyState) && !f.paused) && ((e = f._get_html5_duration()) !== n && (n = e,
                                        f.duration = e,
                                        i = !0),
                                        f.durationEstimate = f.duration,
                                        (e = 1e3 * f._a.currentTime || 0) !== o && (o = e,
                                            i = !0),
                                        (i || t) && f._whileplaying(e, a, a, a, a)),
                                        i
                            }
                            ,
                            this._get_html5_duration = function () {
                                var t = f._iO;
                                return (t = f._a && f._a.duration ? 1e3 * f._a.duration : t && t.duration ? t.duration : null) && !isNaN(t) && 1 / 0 !== t ? t : null
                            }
                            ,
                            this._apply_loop = function (t, e) {
                                t.loop = 1 < e ? "loop" : ""
                            }
                            ,
                            this._setup_html5 = function (t) {
                                t = h(f._iO, t);
                                var e, n = It ? dt : f._a, o = decodeURI(t.url);
                                if (It ? o === decodeURI(nt) && (e = !0) : o === decodeURI(g) && (e = !0),
                                    n) {
                                    if (n._s)
                                        if (It)
                                            n._s && n._s.playState && !e && n._s.stop();
                                        else if (!It && o === decodeURI(g))
                                            return f._apply_loop(n, t.loops),
                                                n;
                                    e || (i(!1),
                                        n.src = t.url,
                                        nt = g = f.url = t.url,
                                        n._called_load = !1)
                                } else
                                    f._a = t.autoLoad || t.autoPlay ? new Audio(t.url) : Ht && 10 > opera.version() ? new Audio(null) : new Audio,
                                        (n = f._a)._called_load = !1,
                                        It && (dt = n);
                                return f.isHTML5 = !0,
                                    f._a = n,
                                    n._s = f,
                                    a(),
                                    f._apply_loop(n, t.loops),
                                    t.autoLoad || t.autoPlay ? f.load() : (n.autobuffer = !1,
                                        n.preload = "auto"),
                                    n
                            }
                            ,
                            a = function () {
                                if (f._a._added_events)
                                    return !1;
                                var t;
                                for (t in f._a._added_events = !0,
                                    rt)
                                    rt.hasOwnProperty(t) && f._a && f._a.addEventListener(t, rt[t], !1);
                                return !0
                            }
                            ,
                            r = function () {
                                var t;
                                for (t in f._a._added_events = !1,
                                    rt)
                                    rt.hasOwnProperty(t) && f._a && f._a.removeEventListener(t, rt[t], !1)
                            }
                            ,
                            this._onload = function (t) {
                                var e = !!t || !f.isHTML5 && 8 === c && f.duration;
                                return f.loaded = e,
                                    f.readyState = e ? 3 : 2,
                                    f._onbufferchange(0),
                                    f._iO.onload && st(f, (function () {
                                        f._iO.onload.apply(f, [e])
                                    }
                                    )),
                                    !0
                            }
                            ,
                            this._onbufferchange = function (t) {
                                return !(0 === f.playState || t && f.isBuffering || !t && !f.isBuffering || (f.isBuffering = 1 === t,
                                    f._iO.onbufferchange && f._iO.onbufferchange.apply(f),
                                    0))
                            }
                            ,
                            this._onsuspend = function () {
                                return f._iO.onsuspend && f._iO.onsuspend.apply(f),
                                    !0
                            }
                            ,
                            this._onfailure = function (t, e, n) {
                                f.failures++,
                                    f._iO.onfailure && 1 === f.failures && f._iO.onfailure(f, t, e, n)
                            }
                            ,
                            this._onfinish = function () {
                                var t = f._iO.onfinish;
                                f._onbufferchange(0),
                                    f._resetOnPosition(0),
                                    f.instanceCount && (f.instanceCount--,
                                        f.instanceCount || (d(),
                                            f.playState = 0,
                                            f.paused = !1,
                                            f.instanceCount = 0,
                                            f.instanceOptions = {},
                                            f._iO = {},
                                            s(),
                                            f.isHTML5 && (f.position = 0)),
                                        (!f.instanceCount || f._iO.multiShotEvents) && t && st(f, (function () {
                                            t.apply(f)
                                        }
                                        )))
                            }
                            ,
                            this._whileloading = function (t, e, n, o) {
                                var i = f._iO;
                                f.bytesLoaded = t,
                                    f.bytesTotal = e,
                                    f.duration = Math.floor(n),
                                    f.bufferLength = o,
                                    f.durationEstimate = f.isHTML5 || i.isMovieStar ? f.duration : i.duration ? f.duration > i.duration ? f.duration : i.duration : parseInt(f.bytesTotal / f.bytesLoaded * f.duration, 10),
                                    f.isHTML5 || (f.buffered = [{
                                        start: 0,
                                        end: f.duration
                                    }]),
                                    (3 !== f.readyState || f.isHTML5) && i.whileloading && i.whileloading.apply(f)
                            }
                            ,
                            this._whileplaying = function (t, n, o, i, a) {
                                var r = f._iO;
                                return !isNaN(t) && null !== t && (f.position = Math.max(0, t),
                                    f._processOnPosition(),
                                    !f.isHTML5 && 8 < c && (r.usePeakData && n !== e && n && (f.peakData = {
                                        left: n.leftPeak,
                                        right: n.rightPeak
                                    }),
                                        r.useWaveformData && o !== e && o && (f.waveformData = {
                                            left: o.split(","),
                                            right: i.split(",")
                                        }),
                                        r.useEQData && a !== e && a && a.leftEQ && (t = a.leftEQ.split(","),
                                            f.eqData = t,
                                            f.eqData.left = t,
                                            a.rightEQ !== e && a.rightEQ && (f.eqData.right = a.rightEQ.split(",")))),
                                    1 === f.playState && (!f.isHTML5 && 8 === c && !f.position && f.isBuffering && f._onbufferchange(0),
                                        r.whileplaying && r.whileplaying.apply(f)),
                                    !0)
                            }
                            ,
                            this._oncaptiondata = function (t) {
                                f.captiondata = t,
                                    f._iO.oncaptiondata && f._iO.oncaptiondata.apply(f, [t])
                            }
                            ,
                            this._onmetadata = function (t, e) {
                                var n, o, i = {};
                                for (n = 0,
                                    o = t.length; n < o; n++)
                                    i[t[n]] = e[n];
                                f.metadata = i,
                                    f._iO.onmetadata && f._iO.onmetadata.apply(f)
                            }
                            ,
                            this._onid3 = function (t, e) {
                                var n, o, i = [];
                                for (n = 0,
                                    o = t.length; n < o; n++)
                                    i[t[n]] = e[n];
                                f.id3 = h(f.id3, i),
                                    f._iO.onid3 && f._iO.onid3.apply(f)
                            }
                            ,
                            this._onconnect = function (t) {
                                t = 1 === t,
                                    (f.connected = t) && (f.failures = 0,
                                        Q(f.id) && (f.getAutoPlay() ? f.play(e, f.getAutoPlay()) : f._iO.autoLoad && f.load()),
                                        f._iO.onconnect && f._iO.onconnect.apply(f, [t]))
                            }
                            ,
                            this._ondataerror = function (t) {
                                0 < f.playState && f._iO.ondataerror && f._iO.ondataerror.apply(f)
                            }
                    }
                    ,
                    x = function () {
                        return ft.body || ft._docElement || ft.getElementsByTagName("div")[0]
                    }
                    ,
                    s = function (t) {
                        return ft.getElementById(t)
                    }
                    ,
                    h = function (t, n) {
                        var o, i, a = t || {};
                        for (i in o = n === e ? lt.defaultOptions : n)
                            o.hasOwnProperty(i) && a[i] === e && (a[i] = "object" != typeof o[i] || null === o[i] ? o[i] : h(a[i], o[i]));
                        return a
                    }
                    ,
                    st = function (e, n) {
                        e.isHTML5 || 8 !== c ? n() : t.setTimeout(n, 0)
                    }
                    ,
                    m = {
                        onready: 1,
                        ontimeout: 1,
                        defaultOptions: 1,
                        flash9Options: 1,
                        movieStarOptions: 1
                    },
                    f = function (t, n) {
                        var o, i = !0, a = n !== e, r = lt.setupOptions;
                        for (o in t)
                            if (t.hasOwnProperty(o))
                                if ("object" != typeof t[o] || null === t[o] || t[o] instanceof Array || t[o] instanceof RegExp)
                                    a && m[n] !== e ? lt[n][o] = t[o] : r[o] !== e ? (lt.setupOptions[o] = t[o],
                                        lt[o] = t[o]) : m[o] === e ? (U(A(lt[o] === e ? "setupUndef" : "setupError", o), 2),
                                            i = !1) : lt[o] instanceof Function ? lt[o].apply(lt, t[o] instanceof Array ? t[o] : [t[o]]) : lt[o] = t[o];
                                else {
                                    if (m[o] !== e)
                                        return f(t[o], o);
                                    U(A(lt[o] === e ? "setupUndef" : "setupError", o), 2),
                                        i = !1
                                }
                        return i
                    }
                    ,
                    et = function () {
                        function e(t) {
                            var e = (t = xt.call(t)).length;
                            return o ? (t[1] = "on" + t[1],
                                3 < e && t.pop()) : 3 === e && t.push(!1),
                                t
                        }
                        function n(t, e) {
                            var n = t.shift()
                                , a = [i[e]];
                            o ? n[a](t[0], t[1]) : n[a].apply(n, t)
                        }
                        var o = t.attachEvent
                            , i = {
                                add: o ? "attachEvent" : "addEventListener",
                                remove: o ? "detachEvent" : "removeEventListener"
                            };
                        return {
                            add: function () {
                                n(e(arguments), "add")
                            },
                            remove: function () {
                                n(e(arguments), "remove")
                            }
                        }
                    }(),
                    rt = {
                        abort: a((function () { }
                        )),
                        canplay: a((function () {
                            var t, n = this._s;
                            if (n._html5_canplay)
                                return !0;
                            if (n._html5_canplay = !0,
                                n._onbufferchange(0),
                                t = n._iO.position === e || isNaN(n._iO.position) ? null : n._iO.position / 1e3,
                                n.position && this.currentTime !== t)
                                try {
                                    this.currentTime = t
                                } catch (t) { }
                            n._iO._oncanplay && n._iO._oncanplay()
                        }
                        )),
                        canplaythrough: a((function () {
                            var t = this._s;
                            t.loaded || (t._onbufferchange(0),
                                t._whileloading(t.bytesLoaded, t.bytesTotal, t._get_html5_duration()),
                                t._onload(!0))
                        }
                        )),
                        ended: a((function () {
                            this._s._onfinish()
                        }
                        )),
                        error: a((function () {
                            this._s._onload(!1)
                        }
                        )),
                        loadeddata: a((function () {
                            var t = this._s;
                            !t._loaded && !Et && (t.duration = t._get_html5_duration())
                        }
                        )),
                        loadedmetadata: a((function () { }
                        )),
                        loadstart: a((function () {
                            this._s._onbufferchange(1)
                        }
                        )),
                        play: a((function () {
                            this._s._onbufferchange(0)
                        }
                        )),
                        playing: a((function () {
                            this._s._onbufferchange(0)
                        }
                        )),
                        progress: a((function (t) {
                            var e, n, o = this._s, i = 0;
                            i = t.target.buffered,
                                e = t.loaded || 0;
                            var a = t.total || 1;
                            if (o.buffered = [],
                                i && i.length) {
                                for (e = 0,
                                    n = i.length; e < n; e++)
                                    o.buffered.push({
                                        start: 1e3 * i.start(e),
                                        end: 1e3 * i.end(e)
                                    });
                                e = (i = 1e3 * (i.end(0) - i.start(0))) / (1e3 * t.target.duration)
                            }
                            isNaN(e) || (o._onbufferchange(0),
                                o._whileloading(e, a, o._get_html5_duration()),
                                e && a && e === a && rt.canplaythrough.call(this, t))
                        }
                        )),
                        ratechange: a((function () { }
                        )),
                        suspend: a((function (t) {
                            var e = this._s;
                            rt.progress.call(this, t),
                                e._onsuspend()
                        }
                        )),
                        stalled: a((function () { }
                        )),
                        timeupdate: a((function () {
                            this._s._onTimer()
                        }
                        )),
                        waiting: a((function () {
                            this._s._onbufferchange(1)
                        }
                        ))
                    },
                    Y = function (t) {
                        return !(t.serverURL || t.type && i(t.type)) && (t.type ? X({
                            type: t.type
                        }) : X({
                            url: t.url
                        }) || lt.html5Only)
                    }
                    ,
                    z = function (t, e) {
                        t && (t.src = e,
                            t._called_load = !1),
                            It && (nt = null)
                    }
                    ,
                    X = function (t) {
                        if (!lt.useHTML5Audio || !lt.hasHTML5)
                            return !1;
                        var n = t.url || null;
                        t = t.type || null;
                        var o, a = lt.audioFormats;
                        if (t && lt.html5[t] !== e)
                            return lt.html5[t] && !i(t);
                        if (!K) {
                            for (o in K = [],
                                a)
                                a.hasOwnProperty(o) && (K.push(o),
                                    a[o].related && (K = K.concat(a[o].related)));
                            K = RegExp("\\\\.(" + K.join("|") + ")(\\\\?.*)?$", "i")
                        }
                        return (o = n ? n.toLowerCase().match(K) : null) && o.length ? o = o[1] : t && (o = (-1 !== (n = t.indexOf(";")) ? t.substr(0, n) : t).substr(6)),
                            o && lt.html5[o] !== e ? n = lt.html5[o] && !i(o) : (t = "audio/" + o,
                                n = lt.html5.canPlayType({
                                    type: t
                                }),
                                n = (lt.html5[o] = n) && lt.html5[t] && !i(t)),
                            n
                    }
                    ,
                    tt = function () {
                        function t(t) {
                            var e, n, o = e = !1;
                            if (!a || "function" != typeof a.canPlayType)
                                return e;
                            if (t instanceof Array) {
                                for (e = 0,
                                    n = t.length; e < n; e++)
                                    (lt.html5[t[e]] || a.canPlayType(t[e]).match(lt.html5Test)) && (o = !0,
                                        lt.html5[t[e]] = !0,
                                        lt.flash[t[e]] = !!t[e].match(Ut));
                                e = o
                            } else
                                e = !(!(t = !(!a || "function" != typeof a.canPlayType) && a.canPlayType(t)) || !t.match(lt.html5Test));
                            return e
                        }
                        if (!lt.useHTML5Audio || !lt.hasHTML5)
                            return !1;
                        var n, o, i, a = Audio !== e ? Ht && 10 > opera.version() ? new Audio(null) : new Audio : null, r = {};
                        for (n in i = lt.audioFormats)
                            if (i.hasOwnProperty(n) && (o = "audio/" + n,
                                r[n] = t(i[n].type),
                                r[o] = r[n],
                                n.match(Ut) ? (lt.flash[n] = !0,
                                    lt.flash[o] = !0) : (lt.flash[n] = !1,
                                        lt.flash[o] = !1),
                                i[n] && i[n].related))
                                for (o = i[n].related.length - 1; 0 <= o; o--)
                                    r["audio/" + i[n].related[o]] = r[n],
                                        lt.html5[i[n].related[o]] = r[n],
                                        lt.flash[i[n].related[o]] = r[n];
                        return r.canPlayType = a ? t : null,
                            lt.html5 = h(lt.html5, r),
                            !0
                    }
                    ,
                    M = {},
                    A = function () { }
                    ,
                    N = function (t) {
                        return 8 === c && 1 < t.loops && t.stream && (t.stream = !1),
                            t
                    }
                    ,
                    q = function (t, e) {
                        return t && !t.usePolicyFile && (t.onid3 || t.usePeakData || t.useWaveformData || t.useEQData) && (t.usePolicyFile = !0),
                            t
                    }
                    ,
                    U = function (t) { }
                    ,
                    u = function () {
                        return !1
                    }
                    ,
                    R = function (t) {
                        for (var e in t)
                            t.hasOwnProperty(e) && "function" == typeof t[e] && (t[e] = u)
                    }
                    ,
                    E = function (t) {
                        t === e && (t = !1),
                            (vt || t) && lt.disable(t)
                    }
                    ,
                    H = function (t) {
                        if (t)
                            if (t.match(/\\.swf(\\?.*)?$/i)) {
                                if (t.substr(t.toLowerCase().lastIndexOf(".swf?") + 4))
                                    return t
                            } else
                                t.lastIndexOf("/") !== t.length - 1 && (t += "/");
                        return t = (t && -1 !== t.lastIndexOf("/") ? t.substr(0, t.lastIndexOf("/") + 1) : "./") + lt.movieURL,
                            lt.noSWFCache && (t += "?ts=" + (new Date).getTime()),
                            t
                    }
                    ,
                    b = function () {
                        8 !== (c = parseInt(lt.flashVersion, 10)) && 9 !== c && (lt.flashVersion = c = 8);
                        var t = lt.debugMode || lt.debugFlash ? "_debug.swf" : ".swf";
                        lt.useHTML5Audio && !lt.html5Only && lt.audioFormats.mp4.required && 9 > c && (lt.flashVersion = c = 9),
                            lt.version = lt.versionNumber + (lt.html5Only ? " (HTML5-only mode)" : 9 === c ? " (AS3/Flash 9)" : " (AS2/Flash 8)"),
                            8 < c ? (lt.defaultOptions = h(lt.defaultOptions, lt.flash9Options),
                                lt.features.buffering = !0,
                                lt.defaultOptions = h(lt.defaultOptions, lt.movieStarOptions),
                                lt.filePatterns.flash9 = RegExp("\\\\.(mp3|" + Vt.join("|") + ")(\\\\?.*)?$", "i"),
                                lt.features.movieStar = !0) : lt.features.movieStar = !1,
                            lt.filePattern = lt.filePatterns[8 !== c ? "flash9" : "flash8"],
                            lt.movieURL = (8 === c ? "soundmanager2.swf" : "soundmanager2_flash9.swf").replace(".swf", t),
                            lt.features.peakData = lt.features.waveformData = lt.features.eqData = 8 < c
                    }
                    ,
                    k = function (t, e) {
                        if (!ct)
                            return !1;
                        ct._setPolling(t, e)
                    }
                    ,
                    D = function () {
                        lt.debugURLParam.test(ht) && (lt.debugMode = !0)
                    }
                    ,
                    Q = this.getSoundById,
                    B = function () {
                        var t = [];
                        return lt.debugMode && t.push("sm2_debug"),
                            lt.debugFlash && t.push("flash_debug"),
                            lt.useHighPerformance && t.push("high_performance"),
                            t.join(" ")
                    }
                    ,
                    F = function () {
                        A("fbHandler");
                        var t = lt.getMoviePercent()
                            , e = {
                                type: "FLASHBLOCK"
                            };
                        if (lt.html5Only)
                            return !1;
                        lt.ok() ? lt.oMC && (lt.oMC.className = [B(), "movieContainer", "swf_loaded" + (lt.didFlashBlock ? " swf_unblocked" : "")].join(" ")) : (St && (lt.oMC.className = B() + " movieContainer " + (null === t ? "swf_timedout" : "swf_error")),
                            lt.didFlashBlock = !0,
                            _({
                                type: "ontimeout",
                                ignoreInit: !0,
                                error: e
                            }),
                            C(e))
                    }
                    ,
                    y = function (t, n, o) {
                        mt[t] === e && (mt[t] = []),
                            mt[t].push({
                                method: n,
                                scope: o || null,
                                fired: !1
                            })
                    }
                    ,
                    _ = function (t) {
                        if (t || (t = {
                            type: lt.ok() ? "onready" : "ontimeout"
                        }),
                            !gt && t && !t.ignoreInit || "ontimeout" === t.type && (lt.ok() || vt && !t.ignoreInit))
                            return !1;
                        var e, n = {
                            success: t && t.ignoreInit ? lt.ok() : !vt
                        }, o = t && t.type && mt[t.type] || [], i = [], a = (n = [n],
                            St && !lt.ok());
                        for (t.error && (n[0].error = t.error),
                            t = 0,
                            e = o.length; t < e; t++)
                            !0 !== o[t].fired && i.push(o[t]);
                        if (i.length)
                            for (t = 0,
                                e = i.length; t < e; t++)
                                i[t].scope ? i[t].method.apply(i[t].scope, n) : i[t].method.apply(this, n),
                                    a || (i[t].fired = !0);
                        return !0
                    }
                    ,
                    g = function () {
                        t.setTimeout((function () {
                            lt.useFlashBlock && F(),
                                _(),
                                "function" == typeof lt.onload && lt.onload.apply(t),
                                lt.waitForWindowLoad && et.add(t, "load", g)
                        }
                        ), 1)
                    }
                    ,
                    it = function () {
                        if (ot !== e)
                            return ot;
                        var n, o = !1, i = navigator, a = i.plugins, r = t.ActiveXObject;
                        if (a && a.length)
                            (i = i.mimeTypes) && i["application/x-shockwave-flash"] && i["application/x-shockwave-flash"].enabledPlugin && i["application/x-shockwave-flash"].enabledPlugin.description && (o = !0);
                        else if (r !== e && !pt.match(/MSAppHost/i)) {
                            try {
                                n = new r("ShockwaveFlash.ShockwaveFlash")
                            } catch (t) { }
                            o = !!n
                        }
                        return ot = o
                    }
                    ,
                    J = function () {
                        var t, e, n = lt.audioFormats;
                        if (Ct && pt.match(/os (1|2|3_0|3_1)/i) ? (lt.hasHTML5 = !1,
                            lt.html5Only = !0,
                            lt.oMC && (lt.oMC.style.display = "none")) : !lt.useHTML5Audio || lt.html5 && lt.html5.canPlayType || (lt.hasHTML5 = !1),
                            lt.useHTML5Audio && lt.hasHTML5)
                            for (e in n)
                                n.hasOwnProperty(e) && (n[e].required && !lt.html5.canPlayType(n[e].type) || lt.preferFlash && (lt.flash[e] || lt.flash[n[e].type])) && (t = !0);
                        return lt.ignoreFlash && (t = !1),
                            lt.html5Only = lt.hasHTML5 && lt.useHTML5Audio && !t,
                            !lt.html5Only
                    }
                    ,
                    G = function (t) {
                        var e, n, o = 0;
                        if (t instanceof Array) {
                            for (e = 0,
                                n = t.length; e < n; e++)
                                if (t[e] instanceof Object) {
                                    if (lt.canPlayMIME(t[e].type)) {
                                        o = e;
                                        break
                                    }
                                } else if (lt.canPlayURL(t[e])) {
                                    o = e;
                                    break
                                }
                            t[o].url && (t[o] = t[o].url),
                                t = t[o]
                        }
                        return t
                    }
                    ,
                    j = function (t) {
                        t._hasTimer || (t._hasTimer = !0,
                            !At && lt.html5PollingInterval && (null === $t && 0 === Pt && ($t = setInterval(V, lt.html5PollingInterval)),
                                Pt++))
                    }
                    ,
                    W = function (t) {
                        t._hasTimer && (t._hasTimer = !1,
                            !At && lt.html5PollingInterval && Pt--)
                    }
                    ,
                    V = function () {
                        var t;
                        if (null !== $t && !Pt)
                            return clearInterval($t),
                                $t = null,
                                !1;
                        for (t = lt.soundIDs.length - 1; 0 <= t; t--)
                            lt.sounds[lt.soundIDs[t]].isHTML5 && lt.sounds[lt.soundIDs[t]]._hasTimer && lt.sounds[lt.soundIDs[t]]._onTimer()
                    }
                    ,
                    C = function (n) {
                        n = n !== e ? n : {},
                            "function" == typeof lt.onerror && lt.onerror.apply(t, [{
                                type: n.type !== e ? n.type : null
                            }]),
                            n.fatal !== e && n.fatal && lt.disable()
                    }
                    ,
                    at = function () {
                        if (!Ft || !it())
                            return !1;
                        var t, e, n = lt.audioFormats;
                        for (e in n)
                            if (n.hasOwnProperty(e) && ("mp3" === e || "mp4" === e) && (lt.html5[e] = !1,
                                n[e] && n[e].related))
                                for (t = n[e].related.length - 1; 0 <= t; t--)
                                    lt.html5[n[e].related[t]] = !1
                    }
                    ,
                    this._setSandboxType = function (t) { }
                    ,
                    this._externalInterfaceOK = function (t, e) {
                        if (lt.swfLoaded)
                            return !1;
                        lt.swfLoaded = !0,
                            Nt = !1,
                            Ft && at(),
                            setTimeout(d, Dt ? 100 : 1)
                    }
                    ,
                    I = function (t, n) {
                        function o(t, e) {
                            return '<param name="' + t + '" value="' + e + '" />'
                        }
                        if (yt && _t)
                            return !1;
                        if (lt.html5Only)
                            return b(),
                                lt.oMC = s(lt.movieID),
                                d(),
                                _t = yt = !0,
                                !1;
                        var i, a, r, u = n || lt.url, l = lt.altURL || u, c = x(), p = B(), h = null;
                        if (h = (h = ft.getElementsByTagName("html")[0]) && h.dir && h.dir.match(/rtl/i),
                            t = t === e ? lt.id : t,
                            b(),
                            lt.url = H(Qt ? u : l),
                            n = lt.url,
                            lt.wmode = !lt.wmode && lt.useHighPerformance ? "transparent" : lt.wmode,
                            null !== lt.wmode && (pt.match(/msie 8/i) || !Dt && !lt.useHighPerformance) && navigator.platform.match(/win32|win64/i) && (Lt.push(M.spcWmode),
                                lt.wmode = null),
                            c = {
                                name: t,
                                id: t,
                                src: n,
                                quality: "high",
                                allowScriptAccess: lt.allowScriptAccess,
                                bgcolor: lt.bgColor,
                                pluginspage: jt + "www.macromedia.com/go/getflashplayer",
                                title: "JS/Flash audio component (SoundManager 2)",
                                type: "application/x-shockwave-flash",
                                wmode: lt.wmode,
                                hasPriority: "true"
                            },
                            lt.debugFlash && (c.FlashVars = "debug=1"),
                            lt.wmode || delete c.wmode,
                            Dt)
                            u = ft.createElement("div"),
                                a = ['<object id="' + t + '" data="' + n + '" type="' + c.type + '" title="' + c.title + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="' + jt + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0">', o("movie", n), o("AllowScriptAccess", lt.allowScriptAccess), o("quality", c.quality), lt.wmode ? o("wmode", lt.wmode) : "", o("bgcolor", lt.bgColor), o("hasPriority", "true"), lt.debugFlash ? o("FlashVars", c.FlashVars) : "", "</object>"].join("");
                        else
                            for (i in u = ft.createElement("embed"),
                                c)
                                c.hasOwnProperty(i) && u.setAttribute(i, c[i]);
                        if (D(),
                            p = B(),
                            c = x())
                            if (lt.oMC = s(lt.movieID) || ft.createElement("div"),
                                lt.oMC.id)
                                r = lt.oMC.className,
                                    lt.oMC.className = (r ? r + " " : "movieContainer") + (p ? " " + p : ""),
                                    lt.oMC.appendChild(u),
                                    Dt && ((i = lt.oMC.appendChild(ft.createElement("div"))).className = "sm2-object-box",
                                        i.innerHTML = a),
                                    _t = !0;
                            else {
                                if (lt.oMC.id = lt.movieID,
                                    lt.oMC.className = "movieContainer " + p,
                                    i = p = null,
                                    lt.useFlashBlock || (lt.useHighPerformance ? p = {
                                        position: "fixed",
                                        width: "8px",
                                        height: "8px",
                                        bottom: "0px",
                                        left: "0px",
                                        overflow: "hidden"
                                    } : (p = {
                                        position: "absolute",
                                        width: "6px",
                                        height: "6px",
                                        top: "-9999px",
                                        left: "-9999px"
                                    },
                                        h && (p.left = Math.abs(parseInt(p.left, 10)) + "px"))),
                                    Rt && (lt.oMC.style.zIndex = 1e4),
                                    !lt.debugFlash)
                                    for (r in p)
                                        p.hasOwnProperty(r) && (lt.oMC.style[r] = p[r]);
                                try {
                                    Dt || lt.oMC.appendChild(u),
                                        c.appendChild(lt.oMC),
                                        Dt && ((i = lt.oMC.appendChild(ft.createElement("div"))).className = "sm2-object-box",
                                            i.innerHTML = a),
                                        _t = !0
                                } catch (t) {
                                    throw Error(A("domError") + " \\n" + t.toString())
                                }
                            }
                        return yt = !0
                    }
                    ,
                    w = function () {
                        return lt.html5Only ? (I(),
                            !1) : !(ct || !lt.url || ((ct = lt.getMovie(lt.id)) || (bt ? (Dt ? lt.oMC.innerHTML = Tt : lt.oMC.appendChild(bt),
                                bt = null,
                                yt = !0) : I(lt.id, lt.url),
                                ct = lt.getMovie(lt.id)),
                                "function" == typeof lt.oninitmovie && setTimeout(lt.oninitmovie, 1),
                                0))
                    }
                    ,
                    v = function () {
                        setTimeout(O, 1e3)
                    }
                    ,
                    O = function () {
                        var e, n = !1;
                        return !(!lt.url || Mt) && (Mt = !0,
                            et.remove(t, "load", v),
                            !(Nt && !Bt) && (gt || 0 < (e = lt.getMoviePercent()) && 100 > e && (n = !0),
                                void setTimeout((function () {
                                    if (e = lt.getMoviePercent(),
                                        n)
                                        return Mt = !1,
                                            t.setTimeout(v, 1),
                                            !1;
                                    !gt && qt && (null === e ? lt.useFlashBlock || 0 === lt.flashLoadTimeout ? lt.useFlashBlock && F() : _({
                                        type: "ontimeout",
                                        ignoreInit: !0
                                    }) : 0 !== lt.flashLoadTimeout && E(!0))
                                }
                                ), lt.flashLoadTimeout)))
                    }
                    ,
                    T = function () {
                        return Bt || !Nt ? (et.remove(t, "focus", T),
                            !0) : (Bt = qt = !0,
                                Mt = !1,
                                v(),
                                et.remove(t, "focus", T),
                                !0)
                    }
                    ,
                    p = function (e) {
                        if (gt)
                            return !1;
                        if (lt.html5Only)
                            return gt = !0,
                                g(),
                                !0;
                        var n, o = !0;
                        return lt.useFlashBlock && lt.flashLoadTimeout && !lt.getMoviePercent() || (gt = !0,
                            vt && (n = {
                                type: !ot && St ? "NO_FLASH" : "INIT_TIMEOUT"
                            })),
                            (vt || e) && (lt.useFlashBlock && lt.oMC && (lt.oMC.className = B() + " " + (null === lt.getMoviePercent() ? "swf_timedout" : "swf_error")),
                                _({
                                    type: "ontimeout",
                                    error: n,
                                    ignoreInit: !0
                                }),
                                C(n),
                                o = !1),
                            vt || (lt.waitForWindowLoad && !Ot ? et.add(t, "load", g) : g()),
                            o
                    }
                    ,
                    l = function () {
                        var t, n = lt.setupOptions;
                        for (t in n)
                            n.hasOwnProperty(t) && (lt[t] === e ? lt[t] = n[t] : lt[t] !== n[t] && (lt.setupOptions[t] = lt[t]))
                    }
                    ,
                    d = function () {
                        if (gt)
                            return !1;
                        if (lt.html5Only)
                            return gt || (et.remove(t, "load", lt.beginDelayedInit),
                                lt.enabled = !0,
                                p()),
                                !0;
                        w();
                        try {
                            ct._externalInterfaceTest(!1),
                                k(!0, lt.flashPollingInterval || (lt.useHighPerformance ? 10 : 50)),
                                lt.debugMode || ct._disableDebug(),
                                lt.enabled = !0,
                                lt.html5Only || et.add(t, "unload", u)
                        } catch (t) {
                            return C({
                                type: "JS_TO_FLASH_EXCEPTION",
                                fatal: !0
                            }),
                                E(!0),
                                p(),
                                !1
                        }
                        return p(),
                            et.remove(t, "load", lt.beginDelayedInit),
                            !0
                    }
                    ,
                    $ = function () {
                        return !S && (S = !0,
                            l(),
                            D(),
                            !ot && lt.hasHTML5 && lt.setup({
                                useHTML5Audio: !0,
                                preferFlash: !1
                            }),
                            tt(),
                            lt.html5.usingFlash = J(),
                            St = lt.html5.usingFlash,
                            !ot && St && (Lt.push(M.needFlash),
                                lt.setup({
                                    flashLoadTimeout: 1
                                })),
                            ft.removeEventListener && ft.removeEventListener("DOMContentLoaded", $, !1),
                            w(),
                            !0)
                    }
                    ,
                    Z = function () {
                        return "complete" === ft.readyState && ($(),
                            ft.detachEvent("onreadystatechange", Z)),
                            !0
                    }
                    ,
                    L = function () {
                        Ot = !0,
                            et.remove(t, "load", L)
                    }
                    ,
                    (P = function () {
                        At && (lt.setupOptions.useHTML5Audio = !0,
                            lt.setupOptions.preferFlash = !1,
                            Ct || kt && !pt.match(/android\\s2\\.3/i)) && (Ct && (lt.ignoreFlash = !0),
                                It = !0)
                    }
                    )(),
                    it(),
                    et.add(t, "focus", T),
                    et.add(t, "load", v),
                    et.add(t, "load", L),
                    ft.addEventListener ? ft.addEventListener("DOMContentLoaded", $, !1) : ft.attachEvent ? ft.attachEvent("onreadystatechange", Z) : C({
                        type: "NO_DOM2_EVENTS",
                        fatal: !0
                    })
            }
            var o = null;
            void 0 !== t.SM2_DEFER && SM2_DEFER || (o = new n),
                t.SoundManager = n,
                t.soundManager = o
        }(window)
    }
}, t => {
    var e = e => t(t.s = e);
    e(52),
        e(203)
}
]);


    `;
    
    console.log(`[TM] Initializing Faster Scanning`);

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'SCRIPT' && node.src && node.src.includes(TARGET_FILE)) {
                    node.type = 'text/plain';
                    node.remove();
                    console.log("[TM] Blocked original script tag.");
                }
            }
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    const scriptElement = document.createElement('script');
    scriptElement.id = 'tm-injected-logic';
    scriptElement.textContent = INJECTED_SCRIPT;
    document.documentElement.appendChild(scriptElement);
    console.log("[TM] Successfully inlined replacement script.");

})();