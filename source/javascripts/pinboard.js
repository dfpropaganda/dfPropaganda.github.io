function pinboardNS_fetch_script(url) {
    (function(){
        var pinboardLinkroll = document.createElement('script');
        pinboardLinkroll.type = 'text/javascript';
        pinboardLinkroll.async = true;
        pinboardLinkroll.src = url;
        document.getElementsByTagName('head')[0].appendChild(pinboardLinkroll);
    })();
}

function pinboardNS_show_bmarks(r) {
    var lr = new Pinboard_Linkroll();
    lr.set_items(r);
    lr.show_bmarks();
}

function Pinboard_Linkroll() {
    var items;

    this.set_items = function(i) {
        this.items = i;
    }
    this.show_bmarks = function() {
        var lines = [];
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            var str = this.format_item(item);
            lines.push(str);
        }
        document.getElementById(linkroll).innerHTML = lines.join("\n");
    }
    this.cook = function(v) {
        return v.replace('<', '&lt;').replace('>', '&gt>');
    }

    this.format_item = function(it) {
        var tmp = new Array();
        tmp.push("<li class=\"pin-item\">");
        if (!it.d) { return; }
        tmp.push("<a class=\"pin-title\" target=\"_blank\" href=\"");
        tmp.push(this.cook(it.u));
        tmp.push("\">");
        tmp.push(this.cook(it.d));
        tmp.push("</a>");
        if (it.n) {
            tmp.push("<span class=\"pin-description\">" + this.cook(it.n) + "</span>\n");
        }
        tmp.push("<ul class=\"nav nav-pills\">");
        if (it.t.length > 0) {
            for (var i = 0; i < it.t.length; i++) {
                var tag = it.t[i];
                tmp.push("<li>");
                tmp.push("<a class=\"pin-tag tags-1\" target=\"_blank\" href=\"https://pinboard.in/u:");
                tmp.push(this.cook(it.a));
                tmp.push("/t:");
                tmp.push(this.cook(tag));
                tmp.push("\">");
                tmp.push("<span class=\"glyphicon glyphicon-tags\"></span>&nbsp;&nbsp;");
                tmp.push(this.cook(tag).replace(/^\s+|\s+$/g, ''));
                tmp.push("</a></li>");
            }
        }
        tmp.push("</ul>");
        tmp.push("</li>\n");
        return tmp.join("");
    }
}
Pinboard_Linkroll.prototype = new Pinboard_Linkroll();
pinboardNS_fetch_script("https://feeds.pinboard.in/json/v1/u:"+pinboard_user+"/?cb=pinboardNS_show_bmarks\&count="+pinboard_count);

