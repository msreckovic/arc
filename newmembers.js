// var LinkRCAForgotPassword = "https://membership.rowingcanada.org/Account/ForgotPassword";

// As the questions get checked, remove the ability to uncheck them.  That way
// as you get to the next question, you can't mess with the flags and
// stop seeing enough things.  Perhaps it's a button, not a checkbox.

// Once they go through all that, show them the choices.
// In order, left most is the one we want them to take.  For juniors and
// university where they have an option to take the early one instead
// put the early one to the side.
// We can have just full, full + early, just late for each of those.
// We can have a button next to each one, as today, and just have them
// click one.
// Do we ask them for their name at any point?  Yes, when doing the
// safety test.
// We can show all the prices beforehand, they just can't pick them until
// they pass all the tests and check off all the boxes.


// "gsx$category"
// "gsx$earlyseasonronin"
// "gsx$earlyseasonprice"
// "gsx$fullseasonronin"
// "gsx$fullseasonprice"
// "gsx$lateseasonronin"
// "gsx$lateseasonprice"
// "gsx$description"

// This is the global that takes care of things
var CatAndQues = [[], []];
var Acknowledged = 0;
var Buttons = [];

var NUMBER_OF_COLUMNS = 4;

var CAT = 0;
var ESR = 1;
var ESP = 2;
var FSR = 3;
var FSP = 4;
var LSR = 5;
var LSP = 6;
var DESC = 7;
var LABELS = ["",
	      "Early Season - Join Now", "Early Season Fees: ",
	      "Join Now", "Full Season Fees: ",
	      "Join Now", "Late Season Fees: "];

var AnsweredQuestions = {};

function CheckRonin(what)
{
    if (what.toUpperCase().search("NO") == 0) {
	return "";
    }
    return what;
}

function CategoriesAndQuestions(entries)
{
    var categories = [];
    var questions = [];
    var pickingCategories = true;
    for (var i=0; i<entries.length; i+=1) {
	var vcat = entries[i].gsx$category.$t;
	if (vcat == "Registration") {
	    pickingCategories = false;
	    continue;
	}
	var vdesc = entries[i].gsx$description.$t;
	var vesr = CheckRonin(entries[i].gsx$earlyseasonronin.$t);
	if (pickingCategories) {
	    var vesp = entries[i].gsx$earlyseasonprice.$t;
	    var vfsr = CheckRonin(entries[i].gsx$fullseasonronin.$t);
	    var vfsp = entries[i].gsx$fullseasonprice.$t;
	    var vlsr = CheckRonin(entries[i].gsx$lateseasonronin.$t);
	    var vlsp = entries[i].gsx$lateseasonprice.$t;
	    categories.push([vcat, vesr, vesp, vfsr, vfsp, vlsr, vlsp, vdesc]);
	} else {
	    questions.push([vcat, vesr, vdesc]);
	}
    }
    return [categories, questions];
}

function FormatCategories(categories)
{
    var i, one, id;
    var total = "";
    var buttons = [];

    total += "<div class='clearfix'>\n";

    var eachColumn = Math.ceil(categories.length / NUMBER_OF_COLUMNS);

    for (i=0; i<categories.length; i++) {
	var cc = categories[i];
	if (i % eachColumn == 0) {
	    if (categories.length - i <= eachColumn) {
		total += "<div class='fourth last'>\n";
	    } else {
		total += "<div class='fourth'>\n";
	    }
	    total += "<ul class='toggle'>\n";
	}

	one = "<li><a href='#cbid" + i + "' class='toggle-btn'><strong>";
	one += cc[CAT];
	one += "</strong></a>";
	one += "<div class='toggle-content'>\n";

	if (cc[FSP]) {
	    one += "<p><em>" + LABELS[FSP];
	    one += cc[FSP];
	    one += "</em></p>\n";
	}

	if (cc[ESP]) {
	    one += "<p><em>" + LABELS[ESP];
	    one += cc[ESP];
	    one += "</em></p>\n";
	}

	if (cc[LSP]) {
	    one += "<p><em>" + LABELS[LSP];
	    one += cc[LSP];
	    one += "</em></p>\n";
	}

	one += "<p>" + cc[DESC] + "</p>\n"
	one += "</div></li>\n";

	if (cc[FSR]) {
	    id = "rbf" + i;
	    buttons.push(id);
	    one += "<div style='display:none' id='" + id + "'>";
	    one += "<a target='_blank' href='";
	    one += cc[FSR];
	    one += "' class='btn small-btn'>" + LABELS[FSR] + "</a>";
	    one += "</div>";
	}

	if (cc[ESR]) {
	    id = "rbe" + i;
	    buttons.push(id);
	    one += "<div style='display:none' id='" + id + "'>";
	    one += "<a target='_blank' href='";
	    one += cc[ESR];
	    one += "' class='btn small-btn'>" + LABELS[ESR] + "</a>\n";
	    one += "</div>";
	}

	if (cc[LSR]) {
	    id = "rbl" + i;
	    buttons.push(id);
	    one += "<div style='display:none' id='" + id + "'>";
	    one += "<a target='_blank' href='";
	    one += cc[LSR];
	    one += "' class='btn small-btn'>" + LABELS[LSR] + "</a>\n";
	    one += "</div>";
	}

	one += "<p>&nbsp;</p>\n";
	total += one;

	if (i % eachColumn == (eachColumn-1)) {
	    total += "</ul>\n";
	    total += "</div>\n";
	}
    }

    total += "</div>\n";
    return [total, buttons];
}

function FormatQuestions(questions, countAgreed)
{
    var total = "";
    var i;
    var countChecked = 0;
    for (i=0; i<questions.length; i++) {
	if (countChecked > countAgreed) continue;
	var what = questions[i][0];
	var check = questions[i][1];
	var desc = questions[i][2];

	if (what == "LEAD") {
	    total += "<p class='lead'>" + desc + "</p>\n";
	    continue;
	}

	if (check) {
	    countChecked ++;
	}

	total += "<div class='price-table'>";
	total += "<div class='price-row'>\n";
	total += "<div class='price-cell feature'>\n";
	if (check) {
	    if (countChecked <= countAgreed) {
		total += "<img src='http://cliparts.co/cliparts/pT7/8X8/pT78X8jT9.jpg'>";
	    } else {
		total += "<h3>Read<span><span>and click on the right to proceed</span></span></h3>";
	    }
	}
	total += "  </div><!-- price-cell feature -->\n";

	total += "  <div class='price-cell'>\n";
	total += "    <h3>" + what + "</h3>\n";
	total += "    <p>" + desc + "</p>\n";
	total += "  </div><!-- price-cell -->\n";

	total += "  <div class='price-cell last'>\n";
	if (check && countChecked == countAgreed+1) {
	    total += "   <p><a class='btn' href='";
	    total += "javascript:IncrementAgreed();";
	    total += "'>" + check + "</a></p>\n";
	} else {
	    total += "&nbsp;";
	}
	total += "  </div><!-- price-cell last -->\n";
	total += " </div><!-- price-row -->\n";
	total += "</div><!-- price-table -->\n";
    }
    return [total, countChecked];
}

function IncrementAgreed()
{
    Acknowledged ++;
    FormatEverything(Acknowledged);
}

function FormatEverything(countAgreed)
{
    if (CatAndQues.length < 2) return;
    var qe = document.getElementById("questions");
    var fq = FormatQuestions(CatAndQues[1], countAgreed);
    if (qe) {
	qe.innerHTML = fq[0];
    }

    if (countAgreed == 0) {
	var categories = FormatCategories(CatAndQues[0]);
	Buttons = categories[1];
	var ce = document.getElementById("categories");
	if (ce) {
	    ce.innerHTML = categories[0];
	}
    } else if (countAgreed >= fq[1]) {
	var i;
	for (i=0; i<Buttons.length; i++) {
	    var el = document.getElementById(Buttons[i]);
	    if (el) {
		el.style.display = "block";
	    }
	}
    }
}

function JsonCallback(jsonIn)
{
    CatAndQues = CategoriesAndQuestions(jsonIn.feed.entry);
    FormatEverything(0);
}

