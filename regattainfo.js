// gsx$shortname
// gsx$name
// gsx$date
// gsx$location
// gsx$entrydue
// gsx$trailerload
// gsx$trailerunload
// gsx$details
// gsx$entries
// gsx$payment
// gsx$link

function GV(entry,shrt)
{
    var what = "gsx$" + shrt;
    if (entry && what in entry) {
	return entry[what].$t;
    }
    return "";
}

function CallbackListRegattasHow(jsonIn, active)
{
    var now = Date.now();

    var total = "";
    var entries = jsonIn.feed.entry;

    for (var i=0; i<entries.length; i++) {
	var entry = entries[i];
	var one = "<td>" + GV(entry,"date") + "</td><td>" + GV(entry,"name") + "</td><td>" + GV(entry,"location") + "</td>";
	var detail = "";

	var ed = GV(entry,"entrydue");
	if (active && ed) {
	    var due = new Date(ed);
	    var df = (due - now)/(24*60*60*1000);
	    if (df < 0) {
		detail += ed;
	    } else if (df < 2) {
		detail += "<span style=\"color: red; text-decoration: underline;\">" + ed + "</span>";
	    } else if (df < 7) {
		detail += "<span style=\"color: orange; text-decoration: underline;\">" + ed + "</span>";
	    } else {
		detail += ed;
	    }
	    detail += "<br>";
	}
	var ln = GV(entry,"link");
	if (ln) {
	    detail += "<a target=\"_blank\" href=\"" + ln + "\">click for details</a>";
	} else if (active) {
	    detail += "<a href=\"mailto:coach@argonautrowingclub.com\">click to inquire</a>";
	}
	if (!detail) {
	    detail = "&nbsp;";
	}
	one += "<td>" + detail + "</td>";
	total += "<tr>" + one + "</tr>";
	
    }
    var head = "<tr><th>Date</th><th>Regatta</th><th>Location</th><th>";
    if (active) {
	head += "Entries Due";
    } else {
	head += "Details";
    }
    head += "</th></tr>"
    document.getElementById("regattas").innerHTML = "<table>" + head + total + "</table>";
}

function CallbackListRegattas(jsonIn)
{
    CallbackListRegattasHow(jsonIn, true);
}

function CallbackListRegattasInactive(jsonIn)
{
    CallbackListRegattasHow(jsonIn, false);
}
