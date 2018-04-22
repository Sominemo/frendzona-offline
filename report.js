"use strict";

var report = {
    begin: function() {
        popup.show('test', _('error_report'));
    },
    screenshotTool: {
        parseEachDOM: function(e, d, c) {
           if (e.hasChildNodes()) for (i = 0; i < e.childNodes.length; i++) {
                this.parseEachDOM(e.childNodes[i], d.childNodes[i], c);
            } else {
                if (c) c(d, e);
            }
        },

        realStyle: function(_elem, _style) {
            var computedStyle;
            if ( typeof _elem.currentStyle != 'undefined' ) {
                computedStyle = _elem.currentStyle;
            } else {
               try{ computedStyle = document.defaultView.getComputedStyle(_elem, null); } catch(e) {};
            }
        
            return _style ? computedStyle[_style] : computedStyle;
        },
        
        copyComputedStyle: function(src, dest) {
            var s = report.screenshotTool.realStyle(src);
            for ( var i in s ) {
                if ( typeof i == "string" && i != "cssText" && !/\d/.test(i) ) {
                    try {
                        dest.style[i] = s[i];
                        if ( i == "font" ) {
                            dest.style.fontSize = s.fontSize;
                        }
                    } catch (e) {}
                }
            }
        }
    }
};

