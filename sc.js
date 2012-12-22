function TocviewToggle(glyph, id) {
  var s = document.getElementById(id).style;
  var expand = s.display == "none";
  s.display = expand ? "block" : "none";
  glyph.innerHTML = expand ? "&#9660;" : "&#9658;";
}


window.onload = function() {
    var a0 = document.getElementById("arrow0");
    TocviewToggle(a0, "tocview_0")
    var a1 = document.getElementById("arrow1");
    TocviewToggle(a1, "tocview_1")
    var a2 = document.getElementById("arrow2");
    TocviewToggle(a2, "tocview_2")
    var a3 = document.getElementById("arrow3");
    TocviewToggle(a3, "tocview_3")

};

