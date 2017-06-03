var DaysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function GetValue(where, what)
{
  var instead = "*";
  if (what in where) {
    return where[what].$t;
  }
  return instead;
}

function DayIndex(day)
{
  for (var i=0; i<7; i+=1) {
    if (day == DaysOfWeek[i]) {
      return i;
    }
  }
  if (day == "SKIP" || day == "") {
		return -2;
	}
  return -1;
}

function GetWeeks(entries)
{
  var weeks = [];
  var weekCount = 0;

  for (var i=0; i<entries.length; i++) {
    var date = GetValue(entries[i], "gsx$date");
    var day = GetValue(entries[i], "gsx$day");
    var natalie = GetValue(entries[i], "gsx$natalie");
    var sub = GetValue(entries[i], "gsx$sub");
    var andrew = GetValue(entries[i], "gsx$andrew");
    var john = GetValue(entries[i], "gsx$john");
    var markian = GetValue(entries[i], "gsx$markian");
    var milan = GetValue(entries[i], "gsx$milan");
    var workout = GetValue(entries[i], "gsx$workout");
    var time = GetValue(entries[i], "gsx$time");

    var di = DayIndex(day);
    if (di == -2) continue;
    if (di < 0) break;
    if (di == 0) {
      weekCount++;
      if (weeks.length < weekCount) {
        weeks.push( [[], [], [], [], [], [], [], date] );
      }
    }
    var rowers = [];
    var coxie = "";
    if (natalie) {
      coxie = "Natalie";
    } else if (sub) {
      coxie = sub;
    }
    if (andrew) {
      rowers.push("Andrew");
    }
    if (john) {
      rowers.push("John");
    }
    if (markian) {
      rowers.push("Markian");
    }
    if (milan) {
      rowers.push("Milan");
    }

    if (weekCount > 0) {
      weeks[weekCount-1][di] = [rowers, coxie, time, workout];
		}
  }
  return weeks;
}
