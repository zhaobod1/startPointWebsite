(function(a) {
    a.alerts = {
        verticalOffset: -75,
        horizontalOffset: 0,
        repositionOnResize: true,
        overlayOpacity: 0.8,
        overlayColor: "#000",
        draggable: true,
        okButton: "&nbsp;确定&nbsp;",
        saveButton: "&nbsp;保存&nbsp;",
        cancelButton: "&nbsp;取消&nbsp;",
        dialogClass: null,
        alert: function(b, c, d) {
            if (c == null) {
                c = "提示"
            }
            a.alerts._show(c, b, null, "alert", function(e) {
                if (d) {
                    d(e)
                }
            })
        },
        confirm: function(b, c, d) {
            if (c == null) {
                c = "确认"
            }
            a.alerts._show(c, b, null, "confirm", function(e) {
                if (d) {
                    d(e)
                }
            })
        },
        prompt: function(b, c, d, e) {
            if (d == null) {
                d = "提示"
            }
            a.alerts._show(d, b, c, "prompt", function(f) {
                if (e) {
                    e(f)
                }
            })
        },
        dialog: function(b, c, d, f) {
            if (c == null) {
                c = "确认"
            }
            a.alerts._show(c, b, null, "dialog", function(e) {
                if (d) {
                    d(e)
                }
            }, f)
        },
        _show: function(d, b, h, i, g, f) {
            a.alerts._hide();
            a.alerts._overlay("show");
            a("BODY").append('<div id="popup_container">' + '<h1 id="popup_title"></h1>' + '<div id="popup_content">' + '<div id="popup_message"></div>' + "</div>" + "</div>");
            if (a.alerts.dialogClass) {
                a("#popup_container").addClass(a.alerts.dialogClass)
            }
            var f = (a.browser.msie && parseInt(a.browser.version) <= 6) ? "absolute" : "fixed";
            a("#popup_container").css({
                position: f,
                zIndex: 99999,
                padding: 0,
                margin: 0
            });

            a("#popup_content").addClass(i);
            if (i == "dialog") {
                a("#popup_message").html(b);
                a("#popup_title").html(d);
            } else {
                a("#popup_title").text(d);
                a("#popup_message").text(b);
                a("#popup_message").html(a("#popup_message").text().replace(/(&lt;br\/&gt;)|\n/g, "<br />"));
            } //a("#popup_container").css({
            //    minWidth: a("#popup_container").outerWidth(),
            //    maxWidth: a("#popup_container").outerWidth()
            //});
            a.alerts._reposition();
            a.alerts._maintainPosition(true);
            switch (i) {
                case "alert":
                    a("#popup_message").after('<div id="popup_panel"><a id="popup_ok" href="javascript:void(0)" class="button">' + a.alerts.okButton + '</a></div>');
                    a("#popup_ok").click(function() {
                        a.alerts._hide();
                        g(true)
                    });
                    a("#popup_ok").focus().keypress(function(e) {
                        if (e.keyCode == 13 || e.keyCode == 27) {
                            a("#popup_ok").trigger("click")
                        }
                    });
                    break;
                case "confirm":
                    a("#popup_message").after('<div id="popup_panel"><a id="popup_cancel" href="javascript:void(0)" class="button">' + a.alerts.cancelButton + '</a><a id="popup_ok" href="javascript:void(0)" class="button">' + a.alerts.okButton + '</a></div>');
                    a("#popup_ok").click(function() {
                        a.alerts._hide();
                        if (g) {
                            g(true)
                        }
                    });
                    a("#popup_cancel").click(function() {
                        a.alerts._hide();
                        if (g) {
                            g(false)
                        }
                    });
                    a("#popup_ok").focus();
                    a("#popup_ok, #popup_cancel").keypress(function(e) {
                        if (e.keyCode == 13) {
                            a("#popup_ok").trigger("click")
                        }
                        if (e.keyCode == 27) {
                            a("#popup_cancel").trigger("click")
                        }
                    });
                    break;
                case "dialog":
                    !f && a("#popup_message").after('<div id="popup_panel"><a id="popup_cancel" href="javascript:void(0)" class="button">' + a.alerts.cancelButton + '</a><a id="popup_ok" href="javascript:void(0)" class="button">' + a.alerts.okButton + '</a></div>');
                    a("#popup_ok").click(function() {
                        a.alerts._hide();
                        if (g) {
                            g(true)
                        }
                    });
                    a("#popup_cancel").click(function() {
                        a.alerts._hide();
                        if (g) {
                            g(false)
                        }
                    });
                    a("#popup_ok").focus();
                    a("#popup_ok, #popup_cancel").keypress(function(e) {
                        if (e.keyCode == 13) {
                            a("#popup_ok").trigger("click")
                        }
                        if (e.keyCode == 27) {
                            a("#popup_cancel").trigger("click")
                        }
                    });
                    break;
                case "prompt":
                    a("#popup_message").append('<br /><input type="text" size="30" id="popup_prompt" />').after('<div id="popup_panel"><a id="popup_ok" href="javascript:void(0)" class="button">' + a.alerts.okButton + '</a><a id="popup_cancel" href="javascript:void(0)" class="button">' + a.alerts.cancelButton + '</a></div>');
                    a("#popup_prompt").width(a("#popup_message").width());
                    a("#popup_ok").click(function() {
                        var e = a("#popup_prompt").val();
                        a.alerts._hide();
                        if (g) {
                            g(e)
                        }
                    });
                    a("#popup_cancel").click(function() {
                        a.alerts._hide();
                        if (g) {
                            g(null)
                        }
                    });
                    a("#popup_prompt, #popup_ok, #popup_cancel").keypress(function(e) {
                        if (e.keyCode == 13) {
                            a("#popup_ok").trigger("click")
                        }
                        if (e.keyCode == 27) {
                            a("#popup_cancel").trigger("click")
                        }
                    });
                    if (h) {
                        a("#popup_prompt").val(h)
                    }
                    a("#popup_prompt").focus().select();
                    break
            }
            if (a.alerts.draggable) {
                try {
                    a("#popup_container").draggable({
                        handle: a("#popup_title")
                    });
                    a("#popup_title").css({
                        cursor: "move"
                    })
                } catch (c) {}
            }
        },
        _hide: function() {
            a("#popup_container").remove();
            a.alerts._overlay("hide");
            a.alerts._maintainPosition(false)
        },
        _overlay: function(b) {
            switch (b) {
                case "show":
                    a.alerts._overlay("hide");
                    a("BODY").append('<div id="popup_overlay"></div>');
                    a("#popup_overlay").css({
                        position: "absolute",
                        zIndex: 99998,
                        top: "0px",
                        left: "0px",
                        width: "100%",
                        height: a(document).height(),
                        background: a.alerts.overlayColor,
                        opacity: a.alerts.overlayOpacity
                    });
                    break;
                case "hide":
                    a("#popup_overlay").remove();
                    break
            }
        },
        _reposition: function() {
            var dialog_height = a("#popup_container").outerHeight();
            if (dialog_height >= 600) {
                dialog_height = 600;
                a("#popup_container").height(600).css("overflow", "hidden");
            }
            var vof = a.alerts.verticalOffset;
            vof < 0 ? vof = 0 : vof;
            var c = ((a(window).height() / 2) - (dialog_height / 2)) + vof;
            var b = ((a(window).width() / 2) - (dialog_height / 2)) + a.alerts.horizontalOffset;
            if (c < 0) {
                c = 0
            }
            if (b < 0) {
                b = 0
            }
            if (a.browser.msie && parseInt(a.browser.version) <= 6) {
                c = c + a(window).scrollTop()
            }
            a("#popup_container").css({
                top: c + "px",
                left: "50%",
                "margin-left": "-300px",
                width: "600px"
            });
            a("#popup_overlay").height(a(document).height())
        },
        _maintainPosition: function(b) {
            if (a.alerts.repositionOnResize) {
                switch (b) {
                    case true:
                        a(window).bind("resize", a.alerts._reposition);
                        break;
                    case false:
                        a(window).unbind("resize", a.alerts._reposition);
                        break
                }
            }
        }
    };
    jAlert = function(b, c, d) {
        a.alerts.alert(b, c, d)
    };
    jConfirm = function(b, c, d) {
        a.alerts.confirm(b, c, d)
    };
    jPrompt = function(b, c, d, e) {
        a.alerts.prompt(b, c, d, e)
    }
    jDialog = function(b, c, d, f) {
        a.alerts.dialog(b, c, d, f);
    }
    jClose = function() {
        a.alerts._hide();
    }
})(jQuery);
var easyTemplate = function(d, f) {
    if (!d) {
        return ""
    } else {
        s = document.getElementById(d).innerHTML
    }
    if (s !== easyTemplate.template) {
        easyTemplate.template = s;
        easyTemplate.aStatement = easyTemplate.parsing(easyTemplate.separate(s))
    }
    var h = easyTemplate.aStatement;
    var g = function(a) {
        if (a) {
            f = a
        }
        return arguments.callee
    };
    g.toString = function() {
        return (new Function(h[0], h[1]))(f)
    };
    return g
};
easyTemplate.separate = function(d) {
    var e = /\\'/g;
    var f = d.replace(/(<(\/?)#(.*?(?:\(.*?\))*)>)|(')|([\r\n\t])|(\$\{([^\}]*?)\})/g, function(c, h, b, g, n, o, p, a) {
        if (h) {
            return "{|}" + (b ? "-" : "+") + g + "{|}"
        }
        if (n) {
            return "\\'"
        }
        if (o) {
            return ""
        }
        if (p) {
            return "'+(" + a.replace(e, "'") + ")+'"
        }
    });
    return f
};
easyTemplate.parsing = function(m) {
    var n, u, q, k, r, t, p, o = ["var aRet = [];"];
    p = m.split(/\{\|\}/);
    var l = /\s/;
    while (p.length) {
        q = p.shift();
        if (!q) {
            continue
        }
        r = q.charAt(0);
        if (r !== "+" && r !== "-") {
            q = "'" + q + "'";
            o.push("aRet.push(" + q + ");");
            continue
        }
        k = q.split(l);
        switch (k[0]) {
            case "+macro":
                n = k[1];
                u = k[2];
                o.push('aRet.push("<!--' + n + ' start-->");');
                break;
            case "-macro":
                o.push('aRet.push("<!--' + n + ' end-->");');
                break;
            case "+if":
                k.splice(0, 1);
                o.push("if" + k.join(" ") + "{");
                break;
            case "+elseif":
                k.splice(0, 1);
                o.push("}else if" + k.join(" ") + "{");
                break;
            case "-if":
                o.push("}");
                break;
            case "+else":
                o.push("}else{");
                break;
            case "+list":
                o.push("if(" + k[1] + "&&" + k[1] + ".constructor === Array){with({i:0,l:" + k[1] + ".length," + k[3] + "_index:0," + k[3] + ":null}){for(i=l;i--;){" + k[3] + "_index=(l-i-1);" + k[3] + "=" + k[1] + "[" + k[3] + "_index];");
                break;
            case "-list":
                o.push("}}}");
                break;
            default:
                break
        }
    }
    o.push('return aRet.join("");');
    if (!u) {
        o.unshift("var data = arguments[0];")
    }
    return [u, o.join("")]
};
// JavaScript Document
Common = {};
Common.utc = new Date().getTime() + new Date().getTimezoneOffset() * 60000 + (3600000 * 8);
var MD5KEY = '0c09bc02-c74e-11e2-a9da-00163e1210d9';
var BASE_URL, OPEN_URL;
if (location.href.indexOf("www.edaijia.cn") > -1) {
    BASE_URL = "http://api.edaijia.cn/";
    OPEN_URL = "http://open.api.edaijia.cn/";
    dataURL = "http://open.d.api.edaijia.cn/";
    wechat_url = "http://www.d.edaijia.cn/v2/themes/api/views/open/wechat_test.php";
    weixin_url = "http://www.d.edaijia.cn/v2/themes/api/views/open/weixin.php?url=";
    F15URL = "http://activity.d3.edaijia.cn/";
    KDZPURL = "http://112.124.10.101:8090/";
    apiUrl = "http://api.edaijia.cn/rest/";
} else if (location.href.indexOf("www.d.edaijia.cn") > -1) {
    BASE_URL = "http://api.d.edaijia.cn/";
    OPEN_URL = "http://open.d.api.edaijia.cn/";
    dataURL = "http://open.api.edaijia.cn/";
    wechat_url = "http://www.edaijia.cn/v2/themes/api/views/open/wechat.php";
    weixin_url = "http://www.edaijia.cn/v2/themes/api/views/open/weixin.php?url=";
    F15URL = "http://activity.edaijia.cn/";
    KDZPURL = "http://api.wokuaidao.cn/";
    apiUrl = "http://api.d.edaijia.cn/rest/";
} else if (location.href.indexOf("www.d2.edaijia.cn") > -1) {
    BASE_URL = "http://api.d2.edaijia.cn/";
    OPEN_URL = "http://open.d2.api.edaijia.cn/";
    dataURL = "http://open.api.edaijia.cn/";
    wechat_url = "http://www.edaijia.cn/v2/themes/api/views/open/wechat.php";
    weixin_url = "http://www.edaijia.cn/v2/themes/api/views/open/weixin.php?url=";
    F15URL = "http://activity.edaijia.cn/";
    KDZPURL = "http://api.wokuaidao.cn/";
    apiUrl = "http://api.d2.edaijia.cn/rest/";
} else {
    BASE_URL = "http://api.edaijia.cc/";
    OPEN_URL = "http://open.api.edaijia.cc/";
    dataURL = "http://open.api.edaijia.cn/";
    wechat_url = "http://www.edaijia.cn/v2/themes/api/views/open/wechat.php";
    weixin_url = "http://www.edaijia.cn/v2/themes/api/views/open/weixin.php?url=";
    F15URL = "http://activity.edaijia.cn/";
    KDZPURL = "http://api.wokuaidao.cn/";
    apiUrl = "http://api.edaijia.cc/rest/";
}
//Common.config = {
//    appkey: '51000031',
//    ver: 3
//};
Common.config = {
    appkey: "51000031",
    ver: 3,
    udid: "h5__9094fe2f4ae64e5557a92645db8091b6",
    from: "edaijia",
    macaddress: "12:34:56:78:9A:BC"
};
jQuery.support.cors = true;
Common.isIE = function() {
    var browser = navigator.appName;
    //    var b_version=navigator.appVersion;
    //    var version=b_version.split(";");
    //    var trim_Version=version[1].replace(/[ ]/g,"");
    //    browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0";
    return browser == "Microsoft Internet Explorer";
};
var CU = Common.CU = {
    isSucceed: function(data) {
        if (data.code != 0) {
            alert(data.message);
        }
        return data.code == 0;
    },
    dateFormat: function(date, format) {
        format = format || 'yyyy-MM-dd hh:mm:ss';
        var o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    },
    getSigOld: function(param) {
        var paramStr = [],
            paramStrSorted = [];
        for (var n in param) {
            paramStr.push(n);
        }
        paramStr = paramStr.sort();
        $(paramStr).each(function(index) {
            paramStrSorted.push(this + param[this]);
        });
        var text = paramStrSorted.join('') + MD5KEY;
        return $.md5(text);
    },
    getSig: function(param) {
        var paramStr = [],
            paramStrSorted = [];
        for (var n in param) {
            paramStr.push(n);
        }
        paramStr = paramStr.sort();
        $(paramStr).each(function(index) {
            paramStrSorted.push(this + param[this]);
        });
        var text = MD5KEY + paramStrSorted.join('') + MD5KEY;
        return $.md5(text).slice(0, 30);
    }
};

Common.stringify = function(data) {
    var value = "";
    for (prop in data) {
        value += prop + "=" + data[prop] + "&";
    }
    return value.substr(0, value.length - 1);
};
Common.getCode = function(pp) {
    var model = {
        method: "open.site.verifyCode"
    };
    model.key = pp;
    var req = $.extend(true, {}, Common.config);
    req.method = model.method;
    //req.timestamp = CU.dateFormat(new Date());
    req.timestamp = CU.dateFormat(new Date(Common.utc));
    var model = model.params ? model.params : model;

    req = $.extend(true, req, model);
    req.sig = CU.getSigOld(req);

    return BASE_URL + "rest/?" + Common.stringify(req)
}
Common.getRequest = function(model) {
    var req = $.extend(true, {}, Common.config);
    req.method = model.method;
    req.timestamp = CU.dateFormat(new Date(Common.utc));
    var model = model.params ? model.params : model;

    req = $.extend(true, req, model);
    req.sig = CU.getSigOld(req);

    return $.ajax({
        url: BASE_URL + "rest/",
        type: 'GET',
        data: Common.stringify(req),
        crossDomain: true,
        dataType: 'jsonp',
        timeout: 5000,
        statusCode: {
            500: function() {
                alert('500 服务器错误');
            },
            404: function() {
                alert('404 服务器无法找到被请求的页面');
            }
        },
        error: function(x, h, r) {
            alert("错误")
        },
        success: function(data) {

        }
    });
};
Common.getReqUrl = function(d) {
    var c = $.extend(true, {}, Common.config);
    c.method = d.method;
    c.timestamp = CU.dateFormat(new Date());
    var d = d.params ? d.params : d;
    c = $.extend(true, c, d);
    c.sig = CU.getSigOld(c);
    return ajaxTimeoutTest = $.ajax({
        url: d.url || apiUrl,
        type: "GET",
        data: Common.stringify(c),
        crossDomain: true,
        dataType: "json",
        jsonpCallback: c.callback,
        timeout: 5000, //超时问题
        statusCode: {
            500: function() {}
        },
        statusCode: {
            404: function() {}
        },
        error: function(a, f, b) {},
        complete: function(XMLHttpRequest, status) {
            if (status == 'timeout') {
                ajaxTimeoutTest.abort();
            }
        },
        success: function(a) {}
    })
};
Common.postReqUrl = function(d) {
    var c = $.extend(true, {}, Common.config);
    c.method = d.method;
    c.timestamp = CU.dateFormat(new Date());
    var d = d.params ? d.params : d;
    c = $.extend(true, c, d);
    c.sig = CU.getSigOld(c);
    return $.ajax({
        url: d.url || apiUrl,
        type: "POST",
        data: Common.stringify(c),
        crossDomain: true,
        dataType: "json",
        timeout: 0,
        statusCode: {
            500: function() {}
        },
        statusCode: {
            404: function() {}
        },
        error: function(a, f, b) {
            $("#edaijia_price").show()
        },
        success: function(a) {}
    })
};
Common.getVipRequest = function(model) {
    var getURL = OPEN_URL + model.method;
    delete model.method;

    var model = model.params ? model.params : model;

    var req = $.extend(true, {}, Common.config);
    //req.method = model.method;
    //model.gps_type && (req.gps_type = model.gps_type);
    req.timestamp = CU.dateFormat(new Date(Common.utc));
    req = $.extend(true, req, model);
    req.sig = CU.getSig(req);

    return $.ajax({
        url: getURL,
        type: 'GET',
        data: Common.stringify(req),
        crossDomain: true,
        dataType: 'json',
        timeout: 5000,
        statusCode: {
            500: function() {
                alert('500 服务器错误');
            }
        },
        statusCode: {
            404: function() {
                alert('404 服务器无法找到被请求的页面');
            }
        },
        error: function(x, h, r) {
            modalHan("抱歉, 您的网络连接中断");
            /*Common.distribute("cNetworkError");
             Common.timer && Common.timer.stop();
             $("#lightBox").hide();
             $("#order_pull_container").empty();*/

        },
        success: function(data) {

        }
    });
};
Common.postRequest = function(model) {
    var req = $.extend(true, {}, Common.config);
    req.method = model.method;
    req.timestamp = CU.dateFormat(new Date(Common.utc));
    var model = model.params ? model.params : model;

    req = $.extend(true, req, model);
    req.sig = CU.getSigOld(req);

    return $.ajax({
        url: BASE_URL + "public/",
        type: 'POST',
        data: Common.stringify(req),
        crossDomain: true,
        dataType: 'json',
        timeout: 5000,
        statusCode: {
            500: function() {
                alert('500 服务器错误');
            }
        },
        statusCode: {
            404: function() {
                alert('404 服务器无法找到被请求的页面');
            }
        },
        error: function(x, h, r) {
            alert("错误")
        },
        success: function(data) {

        }
    });
};

//获取URL参数
Common.UrlGet = function() {
        var args = {};
        var query = location.search.substring(1);
        var pairs = query.split("&");
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('=');
            if (pos == -1) continue;
            var argname = pairs[i].substring(0, pos);
            var value = pairs[i].substring(pos + 1);
            value = decodeURIComponent(value);
            args[argname] = value;
        }
        return args;
    }
    //特殊字符过滤正则
Common.strip = function(s) {
    var pattern = new RegExp("[%--`'!@#$^&*()=|{}:;,\\[\\]<>/?'！@#￥……&*（）——|{}【】‘；：”“ 。，、？]");
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern);
    }
    return rs;
}
Common.is_weixin = function() {
    var b = navigator.userAgent.toLowerCase();
    if (b.match(/MicroMessenger/i) == "micromessenger") {
        return true
    } else {
        return false
    }
};
Common.wechatRequest = function(b) {
    return $.ajax({
        type: "GET",
        url: wechat_url,
        data: Common.stringify(b),
        dataType: "jsonp",
        error: function(a, f, e) {},
        success: function(a) {}
    })
};
jQuery.fn.replaceClass = function(b) {
    return $(this).each(function() {
        return $(this).removeAttr("class").addClass(b)
    })
};
Common.cookie = {
    set: function(l, j, g) {
        var k = l + "=" + escape(j);
        var h = new Date(),
            i = 0;
        if (g && g > 0) {
            i = g * 3600 * 1000;
            h.setTime(h.getTime() + i);
            k += "; expires=" + h.toGMTString();
        } else {
            k += "; expires=Session";
        }
        document.cookie = k;
    },
    get: function(f) {
        var e = document.cookie.split("; ");
        for (var g = 0; g < e.length; g++) {
            var h = e[g].split("=");
            if (h[0] == f) {
                return unescape(h[1]);
            }
        }
    },
    del: function(c) {
        var d = new Date();
        d.setTime(d.getTime() - 10000);
        document.cookie = c + "=a; expires=" + d.toGMTString();
    }
};
//获取外部js模板
Common.getTemplate = function(url) {
        return $.ajax({
            url: url,
            type: 'GET',
            dataType: 'html',
            crossDomain: true,
            timeout: 5000,
            statusCode: {
                500: function() {
                    alert('500 服务器错误');
                }
            },
            statusCode: {
                404: function() {
                    alert('404 服务器无法找到被请求的页面');
                }
            },
            error: function(x, h, r) {
                alert("错误")
            },
            success: function(data) {

            }
        });
    }
    //字符串转对象
Common.parse = function(str) {
    var arrParam = str.split("&");
    var resObj = {};
    for (var i = 0; i < arrParam.length; i++) {
        var param = arrParam[i].split("=");
        resObj[param[0]] = !!param[1] ? param[1] : "";
    }
    return resObj;
}
Common.log = function() {
    var urlParams = Common.UrlGet()
    if (!urlParams['a_name']) {
        return false
    }
    var params = {
        'from': urlParams['from'] || 'weixin_edaijia',
        'uri': location.href,
        'utm_medium': urlParams['utm_medium'] || '',
        'utm_source': urlParams['utm_source'] || '',
        'kewords': urlParams['kewords'] || '',
        'campaign': urlParams['campaign'] || '',
        'term': urlParams['term'] || '',
        'a_name': urlParams['a_name'] || '',
        'timestamp': (new Date()).getTime()
    }
    edaijia.log.eventLog(params);
}

$(function() {
    var templateURL = "templates/";
    $("[data-edj-temp]").each(function(i, e) {
        $t = $(this);
        var fileName = $(this).data("edj-temp");
        var url = templateURL + fileName + ".temp";
        $.ajax({
            url: url,
            type: 'GET',
            data: fileName,
            dataType: 'html',
            crossDomain: true,
            timeout: 5000,
            statusCode: {
                500: function() {
                    alert('500 服务器错误');
                }
            },
            statusCode: {
                404: function() {
                    alert('404 服务器无法找到被请求的页面');
                }
            },
            error: function(x, h, r) {
                alert("错误")
            },
            success: function(t) {
                if (t == "") {
                    //          console.log("the template is null");
                    return false;
                }
                var data = {
                    category_fee_1: "北京、上海、广州、深圳",
                    category_fee_2: "杭州、成都、南京、西安、郑州、武汉、天津、济南、长沙、青岛、合肥、厦门、福州、宁波、沈阳、大连、太原、石家庄、海口、银川、哈尔滨、贵阳、南昌、西宁、长春、南宁、昆明、呼和浩特、兰州",
                    category_fee_3: "湛江、珠海、佛山、汕头、阳江、漳州、江门、韶关、揭阳、三明、东莞、茂名、惠州、龙岩、潮州、中山、泉州、莆田、肇庆、宁德",
                    category_fee_4: "重庆",
                    category_fee_5: "苏州、无锡、常州、常熟、昆山",
                    category_fee_6: "南通、扬州、镇江、徐州、金华、绍兴、嘉兴、湖州、洛阳、大同、丽水、连云港、盐城、泰州、唐山、潍坊、济宁、德州、威海、宿迁、绵阳、德阳、宜昌、襄阳、日照、莱芜、萍乡、黄石、荆州、舟山、淮安、温州、锦州、运城、汉中、渭南、新余、商丘、焦作、许昌、宝鸡、长治、临沂、邯郸、达州、义乌、衡阳、岳阳、常德、郴州、安庆、柳州、蚌埠、宿州、自贡、广元、娄底、益阳、株洲、烟台、三门峡、泸州、承德、淄博、濮阳、安阳、赤峰、新乡、十堰、景德镇、宜宾、淮南、赣州、九江、松原、佳木斯、黄冈、南阳、保定、芜湖、江阴、开封、湘潭、吉林、晋城、大庆、平顶山",

                    conventional: "北京、成都、上海、杭州、广州、深圳、重庆、南京、长沙、武汉、西安、宁波、温州、天津、济南、苏州、昆明、郑州、沈阳、青岛、大连、厦门、合肥、哈尔滨、石家庄、南昌、福州、佛山、太原、无锡、常州、东莞、贵阳、兰州、南宁、长春、南通、呼和浩特、包头、威海、海口、乌鲁木齐、银川、扬州、镇江、泰州、徐州、金华、绍兴、嘉兴、台州、湖州、惠州、中山、珠海、马鞍山、泉州、淄博、烟台、洛阳、新乡、廊坊、秦皇岛、唐山、鞍山、辽阳、宜昌、岳阳、宜宾、大同、咸阳、连云港、丽水、盐城、湛江、西宁、拉萨、漳州、莆田、龙岩、南平、三明、潍坊、济宁、东营、临沂、泰安、德州、聊城、滨州、枣庄、菏泽、日照、莱芜、义乌、舟山、衢州、茂名、江门、肇庆、汕头、揭阳、清远、阳江、韶关、梅州、潮州、河源、汕尾、云浮、淮安、宿迁、邯郸、沧州、保定、邢台、安阳、焦作、许昌、平顶山、漯河、长治、晋城、临汾、阳泉、运城、榆林、宝鸡、渭南、汉中、襄阳、孝感、黄石、黄冈、荆州、荆门、常德、衡阳、株洲、湘潭、芜湖、蚌埠、淮南、安庆、淮北、阜阳、绵阳、德阳、自贡、攀枝花、泸州、乐山、内江、九江、新余、萍乡、景德镇、赣州、营口、盘锦、锦州、抚顺、本溪、铁岭、商丘、开封、遵义、郴州、吕梁、达州、六安、柳州、濮阳、承德、十堰、赤峰、三门峡、宿州、娄底、益阳、怀化、广元、吉林、常熟、江阴、南阳、佳木斯、松原、宁德、大庆、昆山、邵阳、驻马店、三亚、延吉、四平、通化、上饶、张家港、资阳、通辽、晋中、丹东、南充、巴中、忻州、牡丹江、遂宁、衡水、保山、丽江、延安、天水、吉安、齐齐哈尔、曲靖、余姚、涪陵、滁州、鄂尔多斯、鸡西、朔州、六盘水、桂林、如皋、奉化、张家口、咸宁、朝阳、沂水、宜兴、雅安、北海、太仓、宜春、葫芦岛、信阳、抚州、辽源、白山、绥化、鹤岗、武安、海宁、涿州、遵化、富阳、长兴、启东、海门、北仑、即墨、诸暨、吴江、荣成、乐清、招远、丹阳、鹤山、龙海、福清、石狮、晋江、长乐、博罗、安康、神木、酒泉、石嘴山、长沙县、新郑、宣城、随州、鄂州、永州、周口、亳州、鹤壁、铜陵、贵港、广安、万州、玉林、眉山、开平、百色、海丰、普宁、靖江、泰兴、兴化、吴川",
                    hz_single: "",
                    cq_single: "",
                    wx_single: ""
                };
                $("[data-edj-temp='" + this.url.split("?")[1] + "']").append(doT.template(t)(data));
                //$("[data-edj-temp='"+this.url.split("?")[1]+"']").append($(t));
            }

        });
    });
});
