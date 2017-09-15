if (!window.name) {
   location.href = location
      .href
      .replace("." + global_subsessionID, "");
   window.name = "learningsuite_tab_" + global_subsessionID
}
var saveException = false;
var courseSetup = false;
function setFieldValue(f, d, c, b, a) {
   function e(p, o, i, g, h, j) {
      var l = document.getElementsByName(p);
      if (g) {
         document
            .getElementById("REDIRECT_HREF")
            .value = g
      }
      if (l.length < 1) {
         return false
      }
      l[0].value = o;
      var m = l[0].form;
      cleanUpPage();
      try {
         if (i && m && j) {
            $(m).triggerHandler("pre-submit");
            if (h || o == "forward") {
               try {
                  frameworkVerify()
               } catch (n) {
                  removeFrameworkVerificationErrorsFromListEditor(n)
               }
               verify()
            }
            if (o == "back") {
               if (dataHasBeenChanged() && !saveException) {
                  showUnsavedChangesConfirmDialog(function () {
                     $(m).triggerHandler("will-submit");
                     m.submit()
                  }, function () {
                     setFieldValue(p, "back-no-save", i, g, h)
                  });
                  return false
               } else {
                  if (saveException) {
                     setFieldValue(p, "back-no-save", i, g, h)
                  }
               }
            } else {
               if (o == "redirect-jump") {
                  if ($(document.body).attr("id") == "setup") {
                     if (courseSetup && dataHasBeenChanged()) {
                        showUnsavedChangesConfirmDialog(function () {
                           $(m).triggerHandler("will-submit");
                           m.submit()
                        }, function () {
                           window.location = g
                        });
                        return false
                     }
                     m.submit();
                     return false
                  } else {
                     if (dataHasBeenChanged() && !saveException) {
                        showUnsavedChangesConfirmDialog(function () {
                           $(m).triggerHandler("will-submit");
                           m.submit()
                        }, function () {
                           window.location = g
                        });
                        return false
                     }
                  }
                  window.location = g;
                  return false
               }
            }
            $(m).triggerHandler("will-submit");
            m.submit()
         }
      } catch (k) {
         if (typeof k == "object") {
            if (k.displayAndFlag) {
               k.displayAndFlag()
            } else {
               if (k.display) {
                  k.display()
               } else {
                  if (window.console) {
                     console.log(k)
                  }
               }
            }
         }
      }
      return false
   }
   if ($(".openEditor").length > 0) {
      require(["app/views/shared/popups/confirm"], function (g) {
         var h = new g({
            query: "You have an open editing window that may contain new data. If you proceed you wi" +
                  "ll lose it. Do you wish to proceed?",
            title: "Unsaved Changes",
            buttons: {
               accept: {
                  text: "OK"
               },
               refuse: {
                  render: false
               }
            },
            popupOptions: {
               zIndex: 999999
            }
         });
         h.on("accept", function () {
            e(f, d, c, b, a, true)
         });
         h.on("cancel", function () {
            e(f, d, c, b, a, false)
         });
         h.open()
      })
   } else {
      return e(f, d, c, b, a, true)
   }
   return false
}
function showUnsavedChangesConfirmDialog(c, b, f, a) {
   var e,
      d;
   if (a && a.text) {
      e = a.text
   }
   if (a && a.title) {
      d = a.title
   }
   require(["app/views/shared/popups/confirm"], function (g) {
      var h = new g({
         query: e
            ? e
            : "You have unsaved changes on this page.",
         title: d
            ? d
            : "Unsaved Changes",
         buttons: {
            accept: {
               text: "Save and Continue"
            },
            refuse: {
               text: "Don't Save"
            }
         },
         popupOptions: {
            zIndex: 999999
         }
      });
      if (c && typeof c === "function") {
         h.on("accept", c)
      }
      if (f && typeof f === "function") {
         h.on("cancel", f)
      }
      if (b && typeof b === "function") {
         h.on("refuse", b)
      }
      h.open()
   })
}
function frameworkVerify(a) {
   var b = [];
   var c = [];
   $(".verify-Field").each(function () {
      var j = $(this);
      var n = j;
      var k = j
         .parent()
         .parent()
         .parent()
         .find("label[for=" + j.attr("id") + "]:first")
         .text();
      k = $.trim(k);
      if (k.length > 1) {
         var m = k.substring(k.length - 1, k.length);
         if (m == "?") {
            k = k.substring(0, k.length - 1)
         }
      }
      var l;
      var f = false;
      if (j.is(":text") || j.is('input[type="email"]') || j.is('input[type="url"]') || j.is('input[type="number"]')) {
         l = j.val();
         f = true
      } else {
         if (j.hasClass("CuteEditorTextArea")) {
            n = $("#CE_" + j.attr("id") + "_ID");
            l = n[0].getHTML();
            f = true
         } else {
            if (j.hasClass("forCKEditor")) {
               if ($("#cke_contents_" + j.attr("id")).length > 0) {
                  l = CKEDITOR
                     .instances[j.attr("id")]
                     .getData()
               } else {
                  l = j.val()
               }
               f = true
            } else {
               if (j.hasClass("mediumText")) {
                  l = j.val();
                  f = true
               } else {
                  if (j.is("select")) {
                     l = j.val()
                  } else {
                     if (j.is(":radio")) {
                        n = j
                           .parent()
                           .parent();
                        k = j
                           .parent()
                           .parent()
                           .parent()
                           .find("label[for=" + j.attr("name") + "]:first")
                           .text()
                     } else {
                        throw new AppInstanceValidationError(["Unsupported verify element type: general.js"], [j])
                     }
                  }
               }
            }
         }
      }
      var d = {
         NotEmpty: function () {
            if (/(\s|(&nbsp;)|(<br>))+$/.test(l)) {
               l = l.replace(/(\s|(&nbsp;)|(<br>))+$/, "");
               if (f) {
                  if (j.hasClass("CuteEditorTextArea")) {
                     n[0].getHTML() = l
                  } else {
                     if (j.hasClass("forCKEditor") && $("#cke_contents_" + j.attr("id")).length > 0) {} else {
                        j.val(l)
                     }
                  }
               }
            }
            if (!/\S/.test(l)) {
               if (j.hasClass("forCKEditor") && $("#cke_contents_" + j.attr("id")).length > 0) {
                  if ($("#cke_contents_" + j.attr("id") + " > iframe").length > 0) {
                     c.push($("#cke_contents_" + j.attr("id") + " > iframe"))
                  } else {
                     if ($("#cke_contents_" + j.attr("id") + " > textarea").length > 0) {
                        c.push($("#cke_contents_" + j.attr("id") + " > textarea"))
                     }
                  }
               } else {
                  c.push(n)
               }
               if (k) {
                  b.push(k + " is required.")
               } else {
                  b.push("These fields are required.")
               }
            }
         },
         Url: function () {
            if (l.indexOf("://") == -1) {
               c.push(n);
               b.push('URLs require schemes; please prefix with "http://"')
            }
         },
         Int: function () {
            if (isNaN(Number(l)) || l.split(".").length > 1) {
               c.push(n);
               b.push("Input must be an integer.")
            }
         },
         PositiveInt: function () {
            if (isNaN(Number(l)) || l.split(".").length > 1 || parseInt(l) < 0) {
               c.push(n);
               b.push("Input must be a positive integer.")
            }
         },
         Float: function () {
            if (isNaN(Number(l))) {
               c.push(n);
               b.push("Input must be a decimal value.")
            }
         },
         PositiveFloat: function () {
            if (isNaN(Number(l)) || parseFloat(l) < 0) {
               c.push(n);
               b.push("Input must be a positive decimal value.")
            }
         },
         Number: function () {
            if (isNaN(l)) {
               c.push(n);
               b.push("Input must be a number.")
            }
         },
         EmailAddress: function () {
            var p = l.split("@");
            var i = false;
            if (p.length != 2) {
               i = true
            } else {
               var o = p[1].split(".");
               if (o.length < 2) {
                  i = true
               }
            }
            if (i) {
               c.push(n);
               b.push("Invalid email address.")
            }
         },
         ISBN: function () {
            var p = l.split("-");
            var o = false;
            if (p.length != 1 || p.length != 4) {
               o = true
            } else {
               if (p.length == 1 && l.length != 10) {
                  o = true
               } else {
                  if (p.length == 4 && l.length != 13) {
                     o = true
                  } else {
                     for (var q in p) {
                        if (parseInt(p[q]) == null || parseInt(p[q]) < 0) {
                           o = true
                        }
                     }
                  }
               }
            }
            if (o) {
               c.push(n);
               b.push("Invalid ISBN number. Must be 10 digits. Hyphens are permitted if all three hyphe" +
                     "ns are included.")
            }
         },
         IpAddress: function () {
            var p = false;
            var o = l.split(".");
            if (o.length != 4) {
               p = true
            } else {
               for (var q in o) {
                  if (parseInt(o[q]) == null || parseInt(o[q]) < 0 || parseInt(o[q] > 255)) {
                     p = true
                  }
               }
            }
            if (p) {
               c.push(n);
               b.push("Invalid IP Address. There must be four numbers between 255 and 0 seperated by pe" +
                     "riods.")
            }
         },
         String: function () {
            if (typeof(input) != "string") {
               c.push(n);
               b.push("Input must be text.")
            }
         },
         ComboBoxChoice: function () {
            if (j.children("option.placeholder:selected").length == 1) {
               c.push(n);
               var i = "Select an option from the drop-down menu";
               if (k) {
                  i += " for " + k
               }
               i += ".";
               b.push(i)
            }
         },
         RadioButtonChoice: function () {
            var i = true;
            if ($(':radio[name="' + j.attr("name") + '"]:checked').length > 0) {
               i = false
            }
            if (i) {
               c.push(n);
               var o = "Pick an option from the radio buttons";
               if (k) {
                  o += " for " + k
               }
               o += ".";
               b.push(o)
            }
         },
         MaxLength: function () {
            var o = true;
            var i;
            switch (j.get(0).tagName) {
               case "TEXTAREA":
                  var r = j.attr("id");
                  i = LongtextData[r]["maxLength"];
                  var p = encode_utf8(l.replace(/(<([^>]+)>)/ig, ""));
                  if (!i || p.length <= i) {
                     o = false
                  }
                  break;
               case "INPUT":
                  i = parseInt(j.attr("maxlength"));
                  var p = encode_utf8(l);
                  if (!i || p.length <= i) {
                     o = false
                  }
                  break;
               default:
                  o = false
            }
            if (o) {
               c.push(n);
               var q = "The value has exceeded the max length of " + i + " characters";
               if (k) {
                  q += " for " + k
               }
               q += ".";
               b.push(q)
            }
         },
         MinValue: function () {
            var i = true;
            var p;
            if (j.get(0).tagName == "INPUT") {
               p = parseInt(j.attr("min"));
               var o = encode_utf8(l);
               if (!p || o >= p) {
                  i = false
               }
            } else {
               i = false
            }
            if (i) {
               c.push(n);
               var q = "The value is not greater than the minimum value of " + p;
               if (k) {
                  q += " for " + k
               }
               q += ".";
               b.push(q)
            }
         },
         MaxValue: function () {
            var i = true;
            var p;
            if (j.get(0).tagName == "INPUT") {
               p = parseInt(j.attr("max"));
               var o = encode_utf8(l);
               if (!p || o <= p) {
                  i = false
               }
            } else {
               i = false
            }
            if (i) {
               c.push(n);
               var q = "The value has exceeded the max value of " + p;
               if (k) {
                  q += " for " + k
               }
               q += ".";
               b.push(q)
            }
         }
      };
      for (var g in d) {
         if (j.hasClass("verify-" + g)) {
            var h = !f || ((l != "" || g == "NotEmpty"));
            if (h) {
               (d[g])()
            }
         }
      }
      if (!a) {
         for (var e = b.length - 1; e > 0; e--) {
            if ($.inArray(b[e], b) < e) {
               b.splice(e, 1)
            }
         }
      }
   });
   if (b.length || c.length) {
      throw new AppInstanceValidationError(b, c)
   }
}
function encode_utf8(a) {
   return unescape(encodeURIComponent(a))
}
function decode_utf8(a) {
   return decodeURIComponent(escape(a))
}
function cleanUpPage() {}
function removeFrameworkVerificationErrorsFromListEditor(d) {
   var c = d.alertObjects;
   for (var b = 0; b < c.length; b++) {
      if (c[b].invalidObject) {
         var a = c[b]
            .invalidObject
            .parents(".itemEditor");
         if (a.length > 0) {
            c.splice(b, 1);
            b--
         }
      }
   }
   if (c.length > 0) {
      throw d
   }
}
function ListEditorUseFrameworkVerify(b) {
   if (!b) {
      b = "openEditor"
   }
   try {
      frameworkVerify(true);
      return true
   } catch (f) {
      var d = f.alertObjects;
      for (var c = 0; c < d.length; c++) {
         if (d[c].invalidObject) {
            var a = d[c]
               .invalidObject
               .parents(".itemEditor");
            if (!a.hasClass(b) || !d[c].invalidObject.is(":visible") || d[c].invalidObject.prop("disabled")) {
               d.splice(c, 1);
               c--
            }
         }
      }
      if (d.length == 0) {
         return true
      }
      f.displayAndFlag();
      return false
   }
}
function AppInstanceError(a) {
   this.msgs = a
}
AppInstanceError.clearAllErrors = function () {
   var a = $(document).find(".alert");
   if (a.length > 0) {
      a
         .slideUp("350", function () {
            a.remove()
         })
   }
};
AppInstanceError.prototype.display = function () {
   var a;
   for (var b = 0; b < this.msgs.length; b++) {
      a = $('<div class="alert"><p></p></div>');
      a.animate({
         height: "15px"
      }, 200);
      $("section#main form").before(a);
      a
         .children("p")
         .text(this.msgs[b]);
      if (a[0].scrollIntoView) {
         a[0].scrollIntoView(false)
      }
   }
};
function AppInstanceValidationError(c, b, d) {
   this.alertObjects = Array();
   var a = (c.length < b.length)
      ? b.length
      : c.length;
   for (var e = 0; e < a; e++) {
      if (b[e] && c[e]) {
         this.alertObjects[e] = {
            txt: c[e],
            invalidObject: b[e]
         }
      } else {
         if (c[e]) {
            this.alertObjects[e] = {
               txt: c[e]
            }
         } else {
            if (b[e]) {
               this.alertObjects[e] = {
                  invalidObject: b[e]
               }
            }
         }
      }
   }
   this
      .alertObjects
      .reverse();
   this.shouldDisplay = !d
}
AppInstanceValidationError.prototype = new AppInstanceError(null);
AppInstanceValidationError.prototype.constructor = AppInstanceValidationError;
AppInstanceValidationError.prototype.displayAndFlag = function () {
   if (this.shouldDisplay) {
      showAlert("error", this.alertObjects)
   }
};
function verify() {
   return true
}
function initializePageFocus(b) {
   var a = $(document).find("#" + b);
   a.focus()
}
function checkBrowser() {
   check = document
      .getElementById("browserCheckLimiter")
      .value;
   if (check == 0) {
      if (navigator.userAgent.indexOf("MSIE") > -1) {
         var a = 99;
         var b = navigator.appVersion;
         if (b.indexOf("MSIE") > -1) {
            b = b.substring(b.indexOf("MSIE"), b.indexOf(";", b.indexOf("MSIE"))).replace("MSIE", "");
            a = parseInt(b)
         } else {
            b = b.substring(0, b.indexOf("."));
            var a = parseInt(b)
         }
         if (a <= 9) {
            alert("--------------------- \n\nYou are currently using Internet Explorer " + a + ", an unsupported web browser. \n\nSome features of this site may not function pr" +
                  "operly. \n\nWe recommend using the latest version of Chrome, FireFox, Internet E" +
                  "xplorer, or Safari. \n\n---------------------")
         }
      } else {
         var c = Modernizr.csstransitions;
         if (navigator.userAgent.indexOf("Firefox") && c === false) {
            alert("--------------------- \n\nYou are currently using an unsupported web browser (Fi" +
                  "refox 3.6 or older). \n\nSome features of this site may not function properly. " +
                  "\n\nWe recommend using the latest version of Chrome, FireFox, Internet Explorer," +
                  " or Safari. \n\n---------------------")
         }
      }
   }
}
function clearDescriptors(a) {
   $checks = $(document).find("input:checkbox");
   for ($i = 0; $i < $checks.length - 1; $i++) {
      if (jQuery.inArray($checks[$i], a)) {
         $checks
            .filter(":eq(" + $i + ")")
            .prop("checked", false)
      }
   }
}
function ls_disablePage(b) {
   if ($("#loaderContainer").length) {
      console.warn("ls_disablePage() called when page is already disabled.");
      return
   }
   b = b || {};
   if (typeof b === "string") {
      b = {
         text: b
      }
   }
   if (!b.text) {
      b.text = "Loading..."
   }
   if (!b.title) {
      if (arguments.length >= 2 && typeof arguments[1] === "string") {
         b.title = arguments[1]
      } else {
         b.title = "Learning Suite"
      }
   }
   hideAlert();
   $("div.overlay")
      .addClass("active")
      .after('<div id="loaderContainer" class="loaderImageBox"></div>');
   $("#loaderContainer")
      .append("<h3>" + b.title + "</h3>")
      .append("<p>" + b.text + "</p>")
      .append('<img class="loaderImage active" src="images/ajax-loader.gif" alt="content loadin' +
            'g">');
   var a = function (f) {
      $(window).off("error.disabledPage");
      ls_enablePage();
      if (typeof b.onError === "function") {
         b.onError()
      }
      var c = !window
         .location
         .host
         .match(/byu\.edu/);
      if (!c) {
         showAlert("error", {txt: "An error occurred. Please refresh the page and try again."})
      } else {
         var d;
         if (f.originalEvent && f.originalEvent.message) {
            d = 'A JavaScript error occurred: "' + f.originalEvent.message + '"'
         } else {
            d = "A JavaScript error occurred. Check the console."
         }
         showAlert("warning", {txt: d})
      }
   };
   $(window).on("error.disabledPage", a)
}
function ls_enablePage() {
   $(window).off("error.disabledPage");
   var a = $("#loaderContainer");
   if (a.length === 0) {
      console.warn("ls_enablePage() called when page is not disabled.")
   } else {
      a.remove();
      $("div.overlay").removeClass("active")
   }
}
function ajaxCurrentPage(d, b, e, a) {
   resetWarningTime();
   var c = $('input[name="appId"]').val();
   if ($('input[name="view"]').length > 0) {
      if (a) {
         return $.post("ajax.php?appId=" + c + "&view=" + $('input[name="view"]').val(), {
            pageId: $('input[name="pageId"]').val(),
            currentPage: true,
            funcName: d,
            funcParams: b
         }, e).fail(a)
      } else {
         return $.post("ajax.php?appId=" + c + "&view=" + $('input[name="view"]').val(), {
            pageId: $('input[name="pageId"]').val(),
            currentPage: true,
            funcName: d,
            funcParams: b
         }, e)
      }
   } else {
      if (a) {
         return $.post("ajax.php?appId=" + c, {
            currentPage: true,
            funcName: d,
            funcParams: b
         }, e).fail(a)
      } else {
         return $.post("ajax.php?appId=" + c, {
            currentPage: true,
            funcName: d,
            funcParams: b
         }, e)
      }
   }
}
function ajax(h, a, c, f, b, e, i, g, d) {
   resetWarningTime();
   if (d) {
      return $.post("ajax.php?appId=" + h, {
         url: a,
         classname: c,
         contructorParams: f,
         isPage: b,
         funcName: e,
         funcParams: i
      }, g).fail(d)
   } else {
      return $.post("ajax.php?appId=" + h, {
         url: a,
         classname: c,
         contructorParams: f,
         isPage: b,
         funcName: e,
         funcParams: i
      }, g)
   }
}
function ajax_param(d, a) {
   resetWarningTime();
   var c = $.extend({}, a);
   if (!c.functionName) {
      throw "ajax_param error: No function name given in options to execute."
   }
   if (!c.currentPage && !c.url) {
      throw "ajax_param error: No url given in options to send request to."
   }
   if (c.success && !$.isFunction(c.success)) {
      delete c.success
   }
   if (c.error && !$.isFunction(c.error)) {
      delete c.error
   }
   var e = {
      classname: "",
      constructorParams: "",
      isPage: false,
      success: function () {}
   };
   var b = $.extend(e, c);
   if (b.currentPage) {
      return ajaxCurrentPage(b.functionName, d, b.success, b.error)
   } else {
      return ajax(global_appID, b.url, b.classname, b.constructorParams, b.isPage, b.functionName, d, b.success, b.error)
   }
}
function ToggleHelp(a) {
   a
      .next()
      .toggle()
}
function EditHelp(b, a) {
   baseURL = "http://byuls-dev.byu.edu/ls/plugins/HelpEdit/HelpEditPage.php?itemkey=" + b + "&pagekey=" + a;
   realURL = baseURL;
   window.open(baseURL, "_blank", "toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=ye" +
         "s, resizable=no, copyhistory=yes, width=800, height=400")
}
Date.prototype.getUnixTime = function () {
   return Math.round(this.getTime() / 1000)
};
Date.prototype.setUnixTime = function (a) {
   this.setTime(parseInt(a) * 1000);
   return this
};
var pageChanged = false;
function dataHasBeenChanged() {
   pageChanged = false;
   if (!$(".openEditor").length > 0) {
      if (typeof CKEDITOR != "undefined") {
         for (instance in CKEDITOR.instances) {
            if ($(".cke_editor").parents(".LSPopupControl").length == 0) {
               if (CKEDITOR.instances[instance].checkDirty()) {
                  pageChanged = true
               }
            }
         }
      }
      $(":checkbox, :radio")
         .each(function () {
            if ($("#" + $(this).attr("id")).parents(".LSPopupControl").length == 0) {
               if ($("#" + $(this).attr("id") + ":checked").length > 0) {
                  if (!$(this)[0].defaultChecked) {
                     pageChanged = true
                  }
               } else {
                  if ($(this)[0].defaultChecked) {
                     pageChanged = true
                  }
               }
            }
         });
      if (global_appID == "pages") {
         if (typeof(areThereUnsavedChanges) == "function" && areThereUnsavedChanges(true)) {
            pageChanged = true
         }
      } else {
         $("input[type=text], textarea")
            .each(function () {
               if ($("#" + $(this).attr("id")).parents(".LSPopupControl").length == 0) {
                  if ($(this)[0].defaultValue != $(this).val()) {
                     pageChanged = true
                  }
               }
            });
         $(".checkDropdownChange")
            .find("select")
            .each(function () {
               if ($("#" + $(this).attr("id")).parents(".LSPopupControl").length == 0) {
                  if ($(this).find("option[selected]").last().val() != $(this).val()) {
                     pageChanged = true
                  }
               }
            })
      }
      return pageChanged
   }
   return false
}
var __changesTimer = setTimeout(checkForKeepAliveChanges, 900000);
var __changesMadeOnPage = false;
function checkForKeepAliveChanges() {
   if (__changesMadeOnPage == true) {
      ajax(global_appID, "ajax/general/general.php", "", null, false, "keepAlive", null, function (a) {
         __changesMadeOnPage = false
      }, function (a) {})
   }
   __changesTimer = setTimeout(checkForKeepAliveChanges, 900000)
}
function changeMadeOnPage() {
   __changesMadeOnPage = true
}
var __warningTimer = undefined;
if (typeof global_sessionWarnTime === "undefined" || typeof global_sessionTimeoutTime === "undefined") {
   console.log("global_sessionWarnTime or global_sessionTimeoutTime is not defined")
} else {
   resetWarningTimer(true)
}
function resetWarningTimer(b) {
   var a = ((global_sessionTimeoutTime - global_sessionWarnTime) * 1000) - (new Date().getTime());
   if (a > 60000) {
      a -= 30000
   }
   if (a <= 0) {
      a = 200
   }
   if (b == true && (a / global_sessionMaxLifetime) < 0.25) {
      console.log("Warning time too short.  Resetting...");
      resetWarningTime();
      return
   }
   clearTimeout(__warningTimer);
   __warningTimer = setTimeout(openWarningMessage, a)
}
function resetWarningTime() {
   if (typeof global_sessionWarnTime === "undefined" || typeof global_sessionTimeoutTime === "undefined" || typeof global_sessionMaxLifetime === "undefined") {
      console.log("global_sessionWarnTime or global_sessionTimeoutTime or global_sessionMaxLifetime" +
            " is not defined");
      return
   }
   var a = (new Date().getTime() / 1000);
   global_sessionTimeoutTime = a + global_sessionMaxLifetime;
   resetWarningTimer()
}
function openWarningMessage() {
   if (global_useDriverBuild && global_useDriverBuild == true) {
      var a = null;
      if (typeof global_jsversion != "undefined") {
         a = global_jsversion
      }
      loadScript("app/drivers/controls/timeoutWarning/driver-build.js" + (a
         ? "?v=" + a
         : ""), __initTimeoutWarning)
   } else {
      __initTimeoutWarning()
   }
}
function __initTimeoutWarning() {
   require(["app/drivers/controls/timeoutWarning/driver"], function (a) {
      a.init(global_sessionWarnTime)
   })
}
function loadScript(b, d) {
   var c = document.getElementsByTagName("head")[0];
   var a = document.createElement("script");
   a.type = "text/javascript";
   a.src = b;
   a.onreadystatechange = d;
   a.onload = d;
   c.appendChild(a)
};