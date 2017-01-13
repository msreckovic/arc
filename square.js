var map = {
  "which" :    {"label" : "",
                "item" : "gsx$which"},
  "when" :     {"label" : "When",
                "item" : "gsx$paymentatinitiatedat"},
  "merchant" : {"label" : "",
                "item" : "gsx$merchantname"},
  "device" :   {"label" : "Device",
                "item" : "gsx$devicename"},
  "id" :       {"label" : "ID",
                "item" : "gsx$id"},
  "url" :      {"label" : "Details",
                "item" : "gsx$urlstatus"},
  "amount" :   {"label" : "Amount",
                "item" : "gsx$amount"},
  "note" :     {"label" : "",
                "item" : "gsx$note"},
};

function GetValue(where, what, instead)
{
  if (what in where) {
    if (where[what].$t) {
      return where[what].$t;
    }
  }
  return instead;
}

function MakeLink(link, msg)
{
  return "<a target=\"_blank\" href=\"" + link + "\">" + msg + "</a>";
}

function ForId(id, link)
{
  if (link.search("http") != 0) {
    return id;
  }
  return MakeLink(link, id);
}

function ForReceipt(id, link)
{
  if (link.search("http") != 0) {
    if (link.search("SENT") == 0) {
      return "Deposit";
    }
    return link;
  }
  return MakeLink("https://squareup.com/receipt/preview/" + id, "Receipt");
}

function ForSingleOne(entry)
{
  var which = GetValue(entry, map.which.item, "");
  var when = GetValue(entry, map.when.item, "when");
  var device = GetValue(entry, map.device.item, "device");
  var id = GetValue(entry, map.id.item, "id");
  var url = GetValue(entry, map.url.item, "");
  var amount = GetValue(entry, map.amount.item, "amount");
  var note= GetValue(entry, map.note.item, "note");

  var link = ForReceipt(id, url);
  id = ForId(id, url);

  var total = "<tr>\n";
  total += "    <td class=\"tiny\" data-label=" + map.id.label + ">" + id + "</td>\n";
  total += "    <td data-label=" + map.when.label +">" + when  + "</td>\n";
  total += "    <td data-label=" + map.note.label + ">" + note  + "</td>\n";
  total += "    <td data-label=" + map.amount.label + ">" + amount  + "</td>\n";
  total += "    <td data-label=" + map.url.label + ">" + link  + "</td>\n";
  total += "</tr>\n";

  return total;
}

function FillSquare(jsonIn, where)
{
  var entries = jsonIn.feed.entry;

  var details = "<table>\n";
  details += "  <thead>\n";
  details += "    <tr>\n";
  details += "      <th>" + map.id.label + "</th>\n";
  details += "      <th>" + map.when.label + "</th>\n";
  details += "      <th>" + map.device.label + "</th>\n";
  details += "      <th>" + map.amount.label + "</th>\n";
  details += "      <th>" + map.url.label + "</th>\n";
  details += "    </tr>\n";
  details += "  </thead>\n";
  details += "  <tbody>\n";

  for (var i=0; i<entries.length; i+=1) {
    details += ForSingleOne(entries[i]);
	}
  details += "  </tbody>\n";
  details += "</table>\n";

  document.getElementById(where).innerHTML = details;
}

