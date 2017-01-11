// gsx$rcaid
// gsx$lastname
// gsx$firstname

function JsonCallback(jsonIn)
{
	var total = "";
	var entries = jsonIn.feed.entry;
  var everybody = {};
  for (var i=0; i<entries.length; i+=1) {
    var first = entries[i].gsx$firstname.$t;
    var last = entries[i].gsx$lastname.$t;
		if (!(last[0] in everybody)) {
				console.log("NEW " + first + " " + last);
			everybody[last[0]] = first + " " + last;
		} else {
				console.log("AGAIN " + first + " " + last);
			everybody[last[0]] += ", " + first + " " + last;
		}
	}
  var keys = Object.keys(everybody);
	keys.sort();
  for (var i=0; i<keys.length; i+=1) {
		one = keys[i];
    total += "<h3>" + one + "</h3>";
    total += "<div>" + everybody[one] + "</div>";
	}

  total += "<br><h6 style=\"color: #ccaaaa;\">(" + entries.length + ")</h6>";
	document.getElementById("everybody").innerHTML = total;
}
