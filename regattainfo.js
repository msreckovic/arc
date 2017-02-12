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
    var el = document.getElementById("regattas");
    if (el) {
	el.innerHTML = "<table>" + head + total + "</table>";
    }
}

function CallbackListRegattas(jsonIn)
{
    CallbackListRegattasHow(jsonIn, true);
}

function CallbackListRegattasInactive(jsonIn)
{
    CallbackListRegattasHow(jsonIn, false);
}

/*
REGATTA DETAILS & DEADLINES
* This is a masters only regatta, 1000m, age 21+, handicaps applied at the finish.
* It is held on Saturday, June 18th, Welland North Course
* Entry deadline (see below for details) is the end of day Saturday, June 11th
* The boats are being loaded Friday morning before the regatta (6am.)  If you must load on Thursday evening, talk to the coach, we may be able to arrange it.
* Outstanding entry and trailer fees must be paid before the boats are loaded.
* The oats are being unloaded Saturday evening, 8pm. All crews must have enough members present to safely unload the boats.
* See the bottom of this page for the current entries and outstanding fees.

For more details and event list and timing, go to regattacentral.com

ENTRIES
If unsure what to do, ask captain@...

1. The entries should be coordinated ...
2. Figure out what event...
3. Figure out the crew, figure...
4. Everybody ...
5. Send the e-mail...

PAYMENT
*The cost is...
* The way to pay:
** Click here to go to...
** In person...
* Payments are due
* Payment made $5, $10, $15

FAQ
* You have to be ARC members...
* Deadlines
* Composite, double trailer fees
* First choice of the boat

CURRENT REGISTRATION INFORMATION
...
 */

function InfoSingleRegatta(entry)
{
    var total = "";
    total += "<ul>";
    total += GV(entry, "details");
    total += "<li>Outstanding entry and trailer fees should be paid before the boats are loaded.</li>";
    total += "<li>See the bottom of this page for current entries and outstanding fees.</li>";
    total += "</ul>";
    total += "For more details and event list and timing, go to <a href=\"http://regattacentral.com\">regattacentral.com</a>";
    return total;
}

function InfoSingleEntries(entry)
{
    var total = "";
    total += "If unsure what to do, ask <a href=\"mailto:captain@argonautrowingclub.com\">captain@argonautrowingclub.com</a>.";
    total += "<ol>";
    total += GV(entry, "entries");
    total += "<li>Submit the names of everybody in the crew.</li>";
    total += "<li>Submit the event name and number, and preferred boat.</li>";
    total += "<li>Send an e-mail to <a href=\"mailto:captain@argonautrowingclub.com\">captain@argonautrowingclub.com</a>, CC-ing everybody in the crew and your program coach/coordinator.</li>";
    total += "<li>You can send multiple entries in the same e-mail.</li>";
    total += "</ol>";
    return total;
}

function InfoSinglePayment(entry)
{
    // List elements from the payment
    var total = "";
    total += "<ul>";
    total += GV(entry, "payment");
    total += "<li>Find your name in the list below, see what your total fees are.</li>";
    total += "<li>The way to pay:</li>";
    total += "<ol>";
    total += "<li>Go to the <a href=\"\">Argo store</a>; look for the item matching " + GV(entry, "name") + " and put in the amount you owe. Put your name/info in the comments section.</li>";
    total += "<li>In person, with a credit card, if you catch one of the coaches or the captain.</li>";
    total += "</ol>";
    total += "<li>Payments are due with the entries.</li>";
    total += "<li>Payments made after the noon the day before the trailer loading are subject to a $5 late fee.</li>";
    total += "<li>Payments made after the trailer has been loaded are subject to a $10 late fee.</li>";
    total += "<li>Payments made after the athlete raced their first race at a regatta are subject to a $15 late fee.</li>";
    total += "</ul>";
    return total;
}

function InfoSingleFAQ(entry)
{
    // Full valid HTML
    var total = "";
    total += "<ul>";
    total += "<li>You have to be a registered ARC member, with paid competitive fees, as well as registered with RCA as competitive. Without that in place, we cannot add you to the crew roster in the regatta registration system.</li>";
    total += "<li>Getting all the things in place will take a few days, so please submit the entries as early as possible.</li>";
    total += "<li>If you are rowing in a composite crew, with non-ARC members, start the process a bit earlier. Note that the trailer fees are doubled for non-ARC members.</li>";
    total += "<li>Note that you may not get the first choice of a boat for the race.</li>";
    total += "</ul>";
    return total;
}

function CallbackForRegatta(entry)
{
    var el;
    el = document.getElementById("title");
    if (el) {
	el.innerHTML = GV(entry, "name") + " (" + GV(entry, "date") + ")";
    }
    el = document.getElementById("regatta");
    if (el) {
	el.innerHTML = InfoSingleRegatta(entry);
    }
    el = document.getElementById("entries");
    if (el) {
	el.innerHTML = InfoSingleEntries(entry);
    }
    el = document.getElementById("payment");
    if (el) {
	el.innerHTML = InfoSinglePayment(entry);
    }
    el = document.getElementById("faq");
    if (el) {
	el.innerHTML = InfoSingleFAQ(entry);
    }
}

function CallbackSingleRegatta(jsonIn, index)
{
    var entries = jsonIn.feed.entry;
    CallbackForRegatta(entries[index]);
}

function IndexFromShortName(entries, shortname)
{
    for (var i=0; i<entries.length; i++) {
	var sn = GV(entries[i], "shortname");
	if (sn == shortname) {
	    return i;
	}
    }
    return -1;
}

function CallbackNamedRegatta(jsonIn, shortname)
{
    var entries = jsonIn.feed.entry;
    var index = IndexFromShortName(entries, shortname);
    if (index >= 0) {
      CallbackForRegatta(entries[index]);
    }
}

