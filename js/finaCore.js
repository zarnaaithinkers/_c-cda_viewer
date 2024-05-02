/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-redeclare */
/* eslint-disable brace-style */
/* eslint-disable prefer-template */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-array-constructor */
/* eslint-disable no-var */

var cdaxml = "";
var cdaxsl = "";
var hidden = new Array();
var firstsection = new Array();
var sectionorder = [];
var collapseall;
//localStorage.setItem("hidden", hidden);
var REACT_APP_HOST_URL = "https://dev.eyecare360plus.eyecare-partners.com/ecp-int-apps";
REACT_APP_HOST_URL = REACT_APP_HOST_URL.includes("REACT_APP_HOST_URL")
    ? "http://localhost:3000/"
    : REACT_APP_HOST_URL;
var url = new URL(REACT_APP_HOST_URL);
var origin = url.origin;

cdaxsl = ``;

window.addEventListener("message", arg => {
    if (arg.origin !== origin) return;

    /**
     * @description To found out the intermittent issue
     */
    window.parent.postMessage({
        action: "CCDA_IFRAME_DATA_LOADED",
    });

    if (arg?.data?.data?.firstsection) {
        localStorage.setItem("firstsection", arg?.data?.data?.firstsection);
    }
    if (arg?.data?.data?.hidden) {
        localStorage.setItem("hidden", arg?.data?.data?.hidden);
    }
    cdaxml = arg.data.data.data;
    loadCCDAViewer();
});

function loadCCDAViewer() {
    $("#viewcda").html("");
    setTimeout(() => {
        new Transformation()
            .setCallback(() => {
                setTimeout(() => {
                    init();
                }, 300);
            })
            .setXml(cdaxml)
            .setXslt(cdaxsl)
            .transform("viewcda");
        $("#viewcda").append(
            '<p style="text-align: center; font-size: 8pt; font-weight: bold;">CONFIDENTIAL</p>'
        );
    }, 300);
}

function sendDataToParentWindow() {
    window.parent.postMessage({
        action: "UPDATE_USER_CCDA_CONFIGURATION",
    });
}

function loadcontents(data, reponame, owner, path) {
    var ojson = data;
    var s = "";
    if (path.indexOf("/") != -1) {
        path = path.substring(0, path.indexOf("/"));
    } else path = "";
    s =
        s +
        '<p class="pure-button loadrepo" path="' +
        path +
        '" owner="' +
        owner +
        '" reponame="' +
        reponame +
        '">..<i class="fa fa-level-up" /></p>';
    for (var i = 0, j = ojson.length; i < j; i++) {
        o = ojson[i];
        if (o["type"] == "file" && o["name"].indexOf(".xml") > 0)
            s =
                s +
                '<p class="pure-button transform" file="' +
                o["download_url"] +
                '"><i class="fa fa-angle-double-right"></i>' +
                o["name"] +
                "</p>";
        else if (o["type"] == "dir") {
            s =
                s +
                '<p class="pure-button loadrepo" path="' +
                o["path"] +
                '" owner="' +
                owner +
                '" reponame="' +
                reponame +
                '"><i class="fa fa-folder" /> ' +
                o["name"] +
                "</p>";
        }
    }
    $("#github").html(s);

    $("#github")
        .find(".loadrepo")
        .off("click")
        .click(function () {
            var url =
                "https://api.github.com/repos/" +
                $(this).attr("owner") +
                "/" +
                $(this).attr("reponame") +
                "/contents/" +
                $(this).attr("path");
            var reponame = $(this).attr("reponame");
            var owner = $(this).attr("owner");
            var path = $(this).attr("path");
            $.get(url, function (data) {
                loadcontents(data, reponame, owner, path);
            }).fail(function () {
                alert("Error - failed to retrieve data.");
            });
        });
    $("#github")
        .find(".transform")
        .off("click")
        .click(function () {
            $("#viewcda").html("");
            if ($(this).attr("file") != undefined) {
                cdaxml = $(this).attr("file");
            }
            new Transformation().setXml(cdaxml).setXslt("cda.xsl").transform("viewcda");
            $("#viewcda").append(
                '<p style="text-align: center; font-size: 8pt; font-weight: bold;">CONFIDENTIAL</p>'
            );
        });
}

function init() {
    sectionorder = [];

    $("li.toc[data-code]").each(function () {
        sectionorder.push($(this).attr("data-code"));
    });

    $(".minimise")
        .off("click")
        .click(function (event) {
            var section = $(this).closest(".section");
            $(this).toggleClass("fa-compress fa-expand");
            var sectiondiv = $(this).parent().parent().find("div:last");
            sectiondiv.slideToggle(function () {
                adjustWidth(section);
            });
        });
    var cdabody = $("#cdabody");

    cdabody.find("div.section").each(function () {
        var sect = $(this);
        $(this).hover(
            function () {
                $(this).find(".controls").show();
            },
            function () {
                $(this).find(".controls").hide();
            }
        );
        $(this)
            .find("table")
            .each(function () {
                var tbl = $(this);
                if (tbl.width() > sect.width()) sect.width(tbl.width() + 20);

                var c = tbl.find("tr.duplicate").length;
                if (c > 0) {
                    if (c == 1)
                        var s = $(
                            '<tr class="all" style="cursor:pointer"><td colspan="5"><i class="fa fa-warning"></i> (' +
                                c +
                                ') duplicate row hidden. Click here to <span class="show">show</span>.</td></tr>'
                        );
                    else
                        var s = $(
                            '<tr class="all" style="cursor:pointer"><td colspan="5"><i class="fa fa-warning"></i> (' +
                                c +
                                ') duplicate rows hidden. Click here to <span class="show">show</span>.</td></tr>'
                        );
                    tbl.prepend(s).on("click", "tr.all", function () {
                        if ($(this).find(".show").text() == "show") {
                            $(this).find(".show").text("hide");
                            tbl.find("tr.duplicate").show();
                        } else {
                            $(this).find(".show").text("show");
                            tbl.find("tr.duplicate").hide();
                        }
                        $("#cdabody").packery();
                    });
                }
                c = tbl.find("tr.duplicatefirst").length;
                if (c > 0) {
                    if (c == 1)
                        var s = $(
                            '<tr class="first" style="cursor:pointer"><td colspan="5"><i class="fa fa-question-circle"></i> (' +
                                c +
                                ') potential duplicate row. Click here to <span class="show1">hide</span>.</td></tr>'
                        );
                    else
                        var s = $(
                            '<tr class="first" style="cursor:pointer"><td colspan="5"><i class="fa fa-question-circle"></i> (' +
                                c +
                                ') potential duplicate row. Click here to <span class="show1">hide</span>.</td></tr>'
                        );
                    tbl.prepend(s).on("click", "tr.first", function () {
                        if ($(this).find(".show1").text() == "show") {
                            $(this).find(".show1").text("hide");
                            tbl.find("tr.duplicatefirst").show();
                        } else {
                            $(this).find(".show1").text("show");
                            tbl.find("tr.duplicatefirst").hide();
                        }
                        $("#cdabody").packery();
                    });
                }
            });
    });

    cdabody.packery({
        stamp: ".stamp",
        columnWidth: "div.section:not(.narr_table)",
        //columnWidth: 160,
        transitionDuration: "0.2s",
        itemSelector: "div.section",
        gutter: 10,
    });

    cdabody.find("div.section:not(.recordTarget)").each(function (i, gridItem) {
        var draggie = new Draggabilly(gridItem);
        // bind drag events to Packery
        cdabody.packery("bindDraggabillyEvents", draggie);
    });

    cdabody.on("dragItemPositioned", function () {
        orderItems();
    });
    $(".toc")
        .off("click")
        .click(function () {
            var section = $('.section[data-code="' + $(this).attr("data-code") + '"]');
            if (section.is(":visible")) {
                section.fadeOut(function () {
                    $("#cdabody").packery();
                    if (hidden.indexOf(section.attr("data-code")) == -1) {
                        hidden.push(section.attr("data-code"));
                        localStorage.setItem("hidden", hidden);
                        sendDataToParentWindow();
                    }
                });
                $(this).addClass("hide");
                $(this).find("i.tocli").removeClass("fa-check-square-o").addClass("fa-square-o");
            } else {
                section.addClass("fadehighlight").fadeIn(function () {
                    $("#cdabody").packery();
                    $(this).removeClass("fadehighlight");
                    hidden.splice(hidden.indexOf(section.attr("data-code")), 1);
                    localStorage.setItem("hidden", hidden);
                    sendDataToParentWindow();
                });
                $(this).removeClass("hide");
                $(this).find("i.tocli").removeClass("fa-square-o").addClass("fa-check-square-o");
            }
            th = $("#tochead");
            if ($("li.hide.toc[data-code]").length != 0) {
                if (th.find("i.fa-warning").length == 0)
                    th.prepend(
                        '<i class="fa fa-warning fa-lg" style="margin-right:0.5em" title="Sections are hidden"></i>'
                    );
            } else {
                th.find("i.fa-warning").remove();
            }
        });
    $("#tochead")
        .off("click")
        .click(function () {
            $("#toc").slideToggle(function () {
                $("#cdabody").packery();
            });
        });
    $(".tocup")
        .off("click")
        .click(function (event) {
            var li = $(this).parent();
            var section = $('.section[data-code="' + li.attr("data-code") + '"]');
            moveup(section, li, true);
            event.stopPropagation();
            event.preventDefault();
        });
    $(".tocdown")
        .off("click")
        .click(function (event) {
            var li = $(this).parent();
            var section = $('.section[data-code="' + li.attr("data-code") + '"]');
            movedown(section, li, true);
            event.stopPropagation();
            event.preventDefault();
        });
    $(".sectionup")
        .off("click")
        .click(function (event) {
            var section = $(this).closest(".section");
            var li = $('.toc[data-code="' + section.attr("data-code") + '"]');
            moveup(section, li, true);
        });
    $(".sectiondown")
        .off("click")
        .click(function (event) {
            var section = $(this).closest(".section");
            var li = $('.toc[data-code="' + section.attr("data-code") + '"]');
            movedown(section, li, true);
        });

    $(".hideshow")
        .off("click")
        .click(function () {
            var up = $(this).find("i").hasClass("fa-compress");

            if (up) {
                $("div.sectiontext").slideUp(function () {
                    adjustWidth($(this).parent().parent());
                });
                $(".minimise").addClass("fa-expand").removeClass("fa-compress");
            } else {
                $("div.sectiontext").slideDown(function () {
                    adjustWidth($(this).parent().parent());
                });
                $(".minimise").addClass("fa-compress").removeClass("fa-expand");
            }
            $("#cdabody").packery();
            $(".hideshow").find("i").toggleClass("fa-compress fa-expand");
           
            localStorage.setItem("collapseall", up);
        });

    $("#restore")
        .off("click")
        .click(function () {
            localStorage.setItem("firstsection", []);
            loadCCDAViewer();
            sendDataToParentWindow();
        });
    $("#showall")
        .off("click")
        .click(function () {
            localStorage.setItem("hidden", []);
            $(".section").each(function () {
                $(this).show();
                var code = $(this).attr("data-code");
                $('.toc[data-code="' + code + '"]')
                    .removeClass("hide")
                    .find("i.tocli")
                    .addClass("fa-check-square-o")
                    .removeClass("fa-square-o");
            });
            $("#cdabody").packery();
            sendDataToParentWindow();
        });
    $(".transform")
        .off("click")
        .click(function () {
            $("#viewcda").html("");
            if ($(this).attr("file") != undefined) {
                cdaxml = $(this).attr("file");
            } else {
                cdaxml = $("#cdaxml").val();
            }

            new Transformation().setXml(cdaxml).setXslt("cda.xsl").transform("viewcda");
            loadCCDAViewer();
        });
    $("i.delete")
        .off("click")
        .click(function () {
            var section = $(this).closest("div.section");
            section.fadeOut(function () {
                var code = section.attr("data-code");
                if (hidden.indexOf(code) == -1) {
                    hidden.push(code);
                    localStorage.setItem("hidden", hidden);
                    sendDataToParentWindow();
                }
                cdabody.packery();
                $('.toc[data-code="' + code + '"]')
                    .addClass("hide")
                    .find("i.tocli")
                    .removeClass("fa-check-square-o")
                    .addClass("fa-square-o");
                th = $("#tochead");
                if ($("li.hide.toc[data-code]").length != 0) {
                    if (th.find("i.fa-warning").length == 0)
                        th.prepend(
                            '<i class="fa fa-warning fa-lg" style="margin-right:0.5em" title="Sections are hidden"></i>'
                        );
                } else {
                    th.find("i.fa-warning").remove();
                }
            });
        });

    if (typeof Storage !== "undefined" && localStorage != undefined) {
        collapseall = localStorage.collapseall;
        if (collapseall == undefined || collapseall == "false") {
            $("div.sectiontext").show(function () {
            });
            $(".hideshow").find("i").addClass("fa-compress").removeClass("fa-expand");
            $(".minimise").addClass("fa-compress").removeClass("fa-expand");
        } else {
            $("div.sectiontext").hide(function () {
                adjustWidth($(this).parent().parent());
            });
            $(".hideshow").find("i").addClass("fa-expand").removeClass("fa-compress");
        }

        if (localStorage?.hidden || localStorage?.firstsection) {
            hidden = localStorage?.hidden?.split(",") || [];
            if (hidden.length > 0) {
                var ihid = 0;
                for (i = 0; i < hidden.length; i++) {
                    if (hidden[i] !== undefined && hidden[i] != "") {
                        var section = $('.section[data-code="' + hidden[i] + '"]');
                        section.hide();
                        $('.toc[data-code="' + hidden[i] + '"]')
                            .addClass("hide")
                            .find("i.tocli")
                            .removeClass("fa-check-square-o")
                            .addClass("fa-square-o");
                        ihid++;
                    }
                }
                if (ihid > 0) {
                    th = $("#tochead");
                    th.prepend(
                        '<i class="fa fa-warning fa-lg" style="margin-right:0.5em" title="' +
                            ihid +
                            ' sections are hidden"></i>'
                    );
                }
            }

            firstsection = localStorage?.firstsection?.split(",") || [];
            if (firstsection.length > 1) {
                for (i = firstsection.length - 1; i > -1; i--) {
                    if (firstsection[i] !== undefined && firstsection[i] != "") {
                        var section = $('.section[data-code="' + firstsection[i] + '"]');
                        var li = $('.toc[data-code="' + section.attr("data-code") + '"]');
                        moveup(section, li, false);
                        sectionorder.splice(sectionorder.indexOf(firstsection[i]), 1);
                    }
                }
            }
        }

        for (i = 0; i < sectionorder.length; i++) {
            firstsection.push(sectionorder[i]);
        }
        $("#cdabody").packery("reloadItems");
        $("#cdabody").packery();
    } else {
        $("#storagemsg").text(
            "Your browser does not have localStorage - your preferences will not be saved"
        );
    }
}

function adjustWidth(section) {
    s = section.attr("style");
    var is = s.indexOf("width:");

    if (is > -1) {
        var ie = s.indexOf("px;");
        sStart = s.substring(0, is);
        sEnd = s.substring(is, s.length);
        ie = sEnd.indexOf("px;");
        sEnd = sEnd.substring(ie + 3, sEnd.length);
        s = sStart + sEnd;
        section.attr("style", s);
    }

    if (section.find("table").length > 0) {
        if (section.find("table").width() > section.width())
            section.width(section.find("table").width() + 20);
    }
    $("#cdabody").packery();
}

function moveup(section, li, bRefresh) {
    var curr = li;
    curr.fadeOut(function () {
        var t = li.parent().find("li:first");
        t.before(curr);
        curr.fadeIn();
    });

    //section
    f = section.parent().find("div.section:eq(0)");
    f.before(section);
    if (bRefresh) {
        var code = section.attr("data-code");
        if (firstsection.indexOf(code) == -1) {
            firstsection.unshift(code);
        } else {
            firstsection.splice(firstsection.indexOf(code), 1);
            firstsection.unshift(code);
        }
        localStorage.setItem("firstsection", firstsection);
        sendDataToParentWindow();
        $("#cdabody").packery("reloadItems");
        $("#cdabody").packery();
    }
}

function movedown(section, li, bRefresh) {
    curr = li;
    curr.fadeOut(function () {
        t = curr.next("[data-code]");
        t.after(curr);
        curr.fadeIn();
    });

    //f=section.parent().find('div.section:eq(1)')
    f = section.next();
    f.after(section);
    if (bRefresh) {
        var code = section.attr("data-code");
        if (firstsection.indexOf(code) == -1) {
            firstsection.unshift(code);
        } else {
            var pos = firstsection.indexOf(code);
            if (pos < firstsection.length) {
                var b = firstsection[pos + 1];
                firstsection[pos + 1] = firstsection[pos];
                firstsection[pos] = b;
            }
            localStorage.setItem("firstsection", firstsection);
            sendDataToParentWindow();
        }
        $("#cdabody").packery("reloadItems");
        $("#cdabody").packery();
    }
}

function orderItems() {
    firstsection = [];
    restore = $("#restore");
    var itemElems = $("#cdabody").packery("getItemElements");
    $(itemElems).each(function (i, itemElem) {
        var code = $(itemElem).attr("data-code");
        firstsection.push(code);
        li = $('.toc[data-code="' + code + '"]');
        restore.before(li);
    });
    localStorage.setItem("firstsection", firstsection);
    sendDataToParentWindow();
}

function comparer(index) {
    return function (a, b) {
        var valA = getCellValue(a, index),
            valB = getCellValue(b, index);
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB);
    };
}

function getCellValue(row, index) {
    return $(row).children("td").eq(index).html();
}

var xmload;
function loadtextarea(fname) {
    xmload = new XMLHttpRequest();
    xmload.onreadystatechange = loaded;
    try {
        xmload.open("GET", fname, true);
    } catch (e) {
        alert(e);
    }
    xmload.send(null);
}

var loaded = function () {
    if (xmload.readyState == 4) {
        $("#cdaxml").val(xmload.responseText);
        //$('#transform').get(0).click()
    }
};
