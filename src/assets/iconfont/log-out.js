!(function(a) {
  var e,
    n =
      '<svg><symbol id="icon-log-out" viewBox="0 0 1024 1024"><path d="M765.395478 667.158261l51.734261 51.712L1024 512l-206.870261-206.870261-51.734261 51.712 118.583652 118.583652H365.746087v73.149218H883.97913z"  ></path><path d="M821.693217 822.316522a435.934609 435.934609 0 0 1-310.316521 128.534261 436.023652 436.023652 0 0 1-310.316522-128.534261C118.160696 739.439304 73.149217 629.225739 73.149217 512c0-117.203478 45.011478-227.417043 127.910957-310.316522a436.023652 436.023652 0 0 1 310.316522-128.534261c117.225739 0 227.417043 45.634783 310.316521 128.534261 5.787826 5.787826 11.353043 11.709217 16.762435 17.741913h93.094957C839.034435 86.817391 685.345391 0 511.398957 0 228.61913 0 0 229.242435 0 512c0 282.779826 228.61913 512 511.398957 512 173.968696 0 327.657739-86.79513 420.151652-219.425391h-93.094957a445.217391 445.217391 0 0 1-16.762435 17.741913z"  ></path></symbol></svg>',
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
