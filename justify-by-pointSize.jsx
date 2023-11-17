//***********************************************************************
//                                                                     
//   justify_by_size_with_breaks
//Description:treibt den markierten Text dadurch aus, dass sein Schriftgrad schrittweise vergrößert wird
//                                                                     
//   [Ver: 0.5]   [Author: Gerald Singelmann]   [Modif: 11-07-07]
//   [Lang: DE]   [Req: InDesign CS5]   [Creat: 11-07-06]
//                                                                     
//   Bugs & Feedback : gerald{at}cuppascript{dot}com      
//                     www.cuppascript.com    
//                                                                     
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
//*********************************************************************

app.doScript( main, undefined, undefined, UndoModes.ENTIRE_SCRIPT, "Justify by Size")
function main() {
	if ( app.selection.length == 0 ) {
		alert(localize({de:"Markieren Sie den Text", en: "Select the text"}))
		return;
	}
	app.scriptPreferences.enableRedraw = true;
	var paras = app.selection[0].paragraphs.everyItem().getElements();
	var story = paras[0].parentStory;
	var para;
	for (var pr = paras.length-1; pr >= 0; pr--) {
		para = paras[pr];
		var lines = para.lines.everyItem().getElements();
		var ranges = new Array();
		var y1, y2;
		for (var n = lines.length-2; n >=0; n--) {
			y1 = lines[n].words.lastItem().characters.firstItem().baseline;
			y2 = lines[n].words.lastItem().characters.lastItem().baseline;
			if (lines[n].characters.lastItem().contents != SpecialCharacters.FORCED_LINE_BREAK) {
				if (y1 == y2) {
					lines[n].insertionPoints.lastItem().contents = "\n";
				} else {
					lines[n].insertionPoints.lastItem().contents = "-\n";
				}
			}
		}
		lines = para.lines.everyItem().getElements();
		for (var n = 0; n < lines.length; n++) {
			ranges.push( [ lines[n].characters.firstItem().index, lines[n].characters.lastItem().index] );
		}
		var pt, rng, pt_change;
		for (var n = lines.length-1; n >=0; n--) {
			rng = ranges[n];
			pt_change = lines[n].characters.firstItem().pointSize / 20;
			try {
				pt = lines[n].characters.firstItem().pointSize;
				y1 = lines[n].characters.firstItem().baseline;
				y2 = lines[n].characters.lastItem().baseline;
				while ( y1 == y2 ) {
					pt += pt_change;
					story.characters.itemByRange( rng[0], rng[1] ).pointSize = pt;
					y1 = story.characters.item( rng[0] ).baseline;
					y2 = story.characters.item( rng[1] ).baseline;
				}
			} catch(e) {
			} finally {
				while( y1 != y2) {
					pt -= pt_change;
					story.characters.itemByRange( rng[0], rng[1] ).pointSize = pt;
					y1 = story.characters.item( rng[0] ).baseline;
					y2 = story.characters.item( rng[1] ).baseline;
				}
			}
		}
		para.justification = Justification.FULLY_JUSTIFIED;
	}
}