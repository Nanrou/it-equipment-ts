!(function(a) {
  var e,
    n =
      '<svg><symbol id="icon-icon-404" viewBox="0 0 1024 1024"><path d="M423.128 711.528v-53.8H313.704v-44.864l115.992-169.792h43.04v169.608h33.192v45.048h-33.192v53.8h-49.608z m0-98.84V521.32l-61.456 91.368h61.456zM616.992 443.08c25.888 0 46.144 9.24 60.728 27.72 17.384 21.88 26.08 58.176 26.08 108.88 0 50.576-8.752 86.928-26.256 109.056-14.472 18.232-34.656 27.36-60.544 27.36-26.024 0-46.992-10-62.92-30s-23.888-55.656-23.888-106.96c0-50.336 8.76-86.568 26.264-108.696 14.448-18.24 34.64-27.36 60.536-27.36z m0 42.496c-6.2 0-11.736 1.976-16.6 5.928-4.856 3.952-8.632 11.032-11.304 21.248-3.528 13.256-5.288 35.56-5.288 66.936 0 31.368 1.576 52.912 4.744 64.648s7.144 19.544 11.944 23.44 10.304 5.832 16.504 5.832a25.6 25.6 0 0 0 16.592-5.928c4.856-3.952 8.632-11.032 11.304-21.248 3.52-13.128 5.288-35.376 5.288-66.744 0-31.376-1.576-52.92-4.744-64.656-3.168-11.736-7.144-19.576-11.944-23.528a25.232 25.232 0 0 0-16.496-5.928zM838.568 711.528v-53.8H729.152v-44.864l115.992-169.792h43.04v169.608h33.184v45.048h-33.184v53.8h-49.616z m0-98.84V521.32l-61.464 91.368h61.464z"  ></path><path d="M893.84 198.04H135.936v624.808h216.776v-46.952H183.904V245h661.984v103.808h47.952V198.04z"  ></path></symbol></svg>',
    t = (e = document.getElementsByTagName("script"))[
      e.length - 1
    ].getAttribute("data-injectcss");
  if (t && !a.__iconfont__svg__cssinject__) {
    a.__iconfont__svg__cssinject__ = !0;
    try {
      document.write(
        "<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>"
      );
    } catch (e) {
      console && console.log(e);
    }
  }
  !(function(e) {
    if (document.addEventListener)
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState))
        setTimeout(e, 0);
      else {
        var t = function() {
          document.removeEventListener("DOMContentLoaded", t, !1), e();
        };
        document.addEventListener("DOMContentLoaded", t, !1);
      }
    else
      document.attachEvent &&
        ((o = e),
        (i = a.document),
        (c = !1),
        (d = function() {
          try {
            i.documentElement.doScroll("left");
          } catch (e) {
            return void setTimeout(d, 50);
          }
          n();
        })(),
        (i.onreadystatechange = function() {
          "complete" == i.readyState && ((i.onreadystatechange = null), n());
        }));
    function n() {
      c || ((c = !0), o());
    }
    var o, i, c, d;
  })(function() {
    var e, t;
    ((e = document.createElement("div")).innerHTML = n),
      (n = null),
      (t = e.getElementsByTagName("svg")[0]) &&
        (t.setAttribute("aria-hidden", "true"),
        (t.style.position = "absolute"),
        (t.style.width = 0),
        (t.style.height = 0),
        (t.style.overflow = "hidden"),
        (function(e, t) {
          t.firstChild
            ? (function(e, t) {
                t.parentNode.insertBefore(e, t);
              })(e, t.firstChild)
            : t.appendChild(e);
        })(t, document.body));
  });
})(window);
