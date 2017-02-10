// gsx$who
// gsx$total
// gsx$paid
// gsx$owing

function ForTickets(entry, h3s, h3e)
{
    var who = entry[0];
    var amount = entry[1];
    var paid = entry[2];
    var owing = entry[3];
    var arrears = entry[4];

    var summary = "";
    if (amount) {
	summary = "<tr>";
	summary += "    <td data-label=Who>" + h3s + who + h3e + "</td>\n";
	summary += "    <td data-label=Amount>" + h3s + amount + h3e + "</td>\n";
	summary += "    <td data-label=Paid>" + h3s + paid + h3e + "</td>\n";
	summary += "    <td data-label=Owing>" + h3s + owing + h3e;
	if (arrears) {
	    summary += "<span class=\"owingtooltip\">" + who + ": " + arrears + "</span>";
	}
	summary += "</td>\n";
	summary += "</tr>";
    }
    return summary;
}

function GetValue(where, what, instead)
{
    if (where && what in where) {
	return where[what].$t;
    }
    return instead;
}

function GetOwing(entries, full)
{
    var people = [];

    var i, owing, who, amount, paid, arrears;
    for (i=1; i<entries.length; i++) {
	who = GetValue(entries[i], "gsx$who", "");
	owing = GetValue(entries[i], "gsx$owing", "");
	//		if (owing != 0) {
	// console.log("This is owing " + owing);
	if (full || owing > 2) {
	    amount = GetValue(entries[i], "gsx$total", "");
	    paid = GetValue(entries[i], "gsx$paid", "");
	    arrears = GetValue(entries[i], "gsx$arrears", "");
	    people.push([who, amount, paid, "$"+owing, arrears]);
	}
    }
    people = people.sort(); // Probably don't need to, but OK

    var tickets = "<table>\n";
    tickets += "  <thead>\n";
    tickets += ForTickets(["MEMBER", "REGATTA FEES", "PAID TO DATE", "FEES OUTSTANDING", ""], "<h3>", "</h3>");
    tickets += "  </thead>\n";

    tickets += "  <tbody>\n";

    for (i=0; i<people.length; i++) {
	tickets += ForTickets(people[i], "", "");
    }

    tickets += "</table>\n";
    return tickets;
}

function JsonCallback(jsonIn)
{
    el = document.getElementById("owing");
    if (el) {
	el.innerHTML = GetOwing(jsonIn.feed.entry, false);
    }
}

function JsonCallbackFull(jsonIn)
{
    el = document.getElementById("owing");
    if (el) {
	el.innerHTML = GetOwing(jsonIn.feed.entry, true);
    }
}
