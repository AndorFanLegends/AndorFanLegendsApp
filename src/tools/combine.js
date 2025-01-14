// Check if Locale
if (!process.env.npm_config_locale) {
    console.log('\x1b[31m' + "No Locale defined" + '\x1b[0m');
    return
}

const locale = process.env.npm_config_locale;

console.log("Start combine legends : " + locale);

var fs = require('fs');
var files = fs.readdirSync(__dirname + "../../../public/legends/" + locale + "/");

//console.log(files);
//console.log(files.length)
legendList = [];
count = 0;
files.forEach( function (file) {
    if( file != "_legende-vierge.json" && file != "additional-pdf" ) {
        
        var obj = require(__dirname + "../../../public/legends/" + locale + "/" + file);
        console.log( obj.name);

        var shortLegend = {
            name: obj.name,
            slug: obj.slug,
            type: obj.type,
            saga: obj.series,
            sagaNumber: obj.number,
//            "type":"series","series":"BLALBLAL","number":"1"
            file: file,
            author: obj.author,
            abstract: obj.abstract,
            year: obj.year,
            officialBonus: obj.officialBonus,
            players: obj.players,
            difficulty: obj.difficulty,
            board: obj.board,
            boxExt: obj.boxExt,
            cardsCount: cardsCount(obj),
            additional: obj.additionaldownload,
            download: obj.download
        };
        legendList.push(shortLegend);
        console.log( shortLegend.name + " : ADDED");
        count++;
    }
});

function cardsCount(obj){
    if(obj.cards) {
        return obj.cards.length;
    } else {
        return 0;
    }
}

const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1;
let dd = today.getDate();
fs.writeFile(__dirname + "../../../public/legends/legends-" + locale + ".json", JSON.stringify(legendList), err => { //yyyy+mm+dd +
    if (err) {
      console.error(err);
    }
});

console.log("FINISH combine legends");
console.log("-> " + count + " legends have been summarize");
