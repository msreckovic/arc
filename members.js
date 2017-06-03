var map = {
    "first" : "gsx$firstname",
    "last" : "gsx$lastname",
    "comp" : "gsx$comp",
    "status" : "gsx$status",
    "email" : "gsx$e-mail"
};

function EmailLink(to, cc, subject, text, yahoo)
{
  // Apparently, this may work Yahoo!Mail:
  // http://compose.mail.yahoo.com/?to=TO&subject=SUBJECTMap&body=BODY
  var result = "<a href=\"";
  if (yahoo) {
    result += "http://compose.mail.yahoo.com/?to=" + to;
    if (cc) {
      result += "&cc=" + cc;
    }
    result += "&subject=" + subject;
    result += "&body=" + TemplateEmailBody();
  } else {
    result += "mailto:" + to  + "?";
    if (cc) {
      result += "cc=" + cc + "&";
    }
    // result += "subject=" + subject + "\" target=\"_blank\">";
    result += "subject=" + subject;
  }
  result += "\">";
  result += text;
  result += "</a>";
  return result;
}


function Categorized(entries, onlygood, category, header, getlinks)
{
    var counting = 0;
    var everybody = {};
    var emails = "";
    for (var i=0; i<entries.length; i+=1) {
	var status = entries[i][map.status].$t;
	if (status.search("bad:") == 0) {
	    if (onlygood) continue;
	} else {
	    if (!onlygood) continue;
	}

	var note = "";
	if (onlygood) {
	    if (entries[i][map.comp].$t.search(category) < 0) continue;
	} else {
	    if (status.substring(4,5) != category) continue;
	    note = "(<span style=\"color:red;\">!</span>)";
	}

	counting ++;
	var first = entries[i][map.first].$t;
	var last = entries[i][map.last].$t;
	if (!(last[0] in everybody)) {
	    everybody[last[0]] = first + " " + last + note;
	} else {
	    everybody[last[0]] += ", " + first + " " + last + note;
	}
	if (getlinks) {
	    var email = entries[i][map.email].$t;
	    if (email) {
		if (emails) {
		    emails += ", ";
		}
		emails += email;
	    }
	}
    }

    if (counting == 0) {
	return "";
    }

    var keys = Object.keys(everybody);
    keys.sort();

    var total = "";
    for (var i=0; i<keys.length; i+=1) {
	one = keys[i];
	total += "<h3>" + one + "</h3>";
	total += "<div>" + everybody[one] + "</div>";
    }

    note = "";

    if (emails) {
	counting = EmailLink(emails, "membership@argonautrowingclub.com",
			     "Missing Argonaut Rowing Club registration step",
			     counting, false);
    }

    if (!onlygood) {
	note = "See <a target=\"_blank\" href=\"http://www.argonautrowingclub.com/new-member-followup/\">the registration follow-up page</a> for details how to fix this problem.";
    }
    total = "<hr><h2>" + header + " <span style=\"color:#ccaaaa;\">(" + counting + ")</span></h2>" + note + total;
    return total;
}

function Everything(entries, getLinks)
{
    var yess = Categorized(entries, true, "yes", "Elligible to race", getLinks);
    document.getElementById("racing").innerHTML = yess;

    var nos = Categorized(entries, true, "no", "Registered as Non-Racing", getLinks);
    document.getElementById("nonracing").innerHTML = nos;

    var norca = Categorized(entries, false, 1, "No RCA Registration - Unable to race", getLinks);
    document.getElementById("norca").innerHTML = norca;

    var nofees = Categorized(entries, false, 2, "No Competitive Fee Payment - Unable to race", getLinks);
    document.getElementById("nofees").innerHTML = nofees;
}

function JsonCallbackL(jsonIn)
{
    Everything(jsonIn.feed.entry, true);
}

function JsonCallback(jsonIn)
{
    Everything(jsonIn.feed.entry, false);
}
