//var fs = require('fs');
//var files = fs.readdirSync(__dirname + "./public/legends/" + locale + "/");
legendDe = require('./de-legends-list.json');
var fs = require('fs');

//console.log(legendDe);

legendDe.forEach(function(item) {
    //item = JSON.parse(item); 
    name = item.Legendenname.replace("\n","")

    if(name != "") {
        json = {
            name: name,
            slug: slugify(name),
            author: item.AuteurDesigner,
            abstract: item['BesonderheitenInfo'],
            year:  yearCalc(item['Date de sortie (forum)']),
            players: item['Nb joueurs'],
            difficulty: difficultyCalc(item['Difficulté']),
            board: boardCalc(item['Plateau']),
            boxExt: boxCalc(item),
            boxOpt: boxOptCalc(item),
            download: item['Link zur Legende'],
        } 
    }
    //console.log(json);
//    console.log(item['Plateau'])
//    console.log(__dirname);
    fs.writeFile(__dirname + "/de-target/" + json.slug + ".json", JSON.stringify(json), err => { //yyyy+mm+dd +
        if (err) {
        console.error(err);
        }
    });
});


function slugify(string) {
    const a = 'àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœṕŕßśșțùúüûǘẃẍÿź·/_,:;'
    const b = 'aaaaaaaaceeeeghiiiimnnnoooooprssstuuuuuwxyz------'
    const p = new RegExp(a.split('').join('|'), 'g')
    return string.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '-and-') // Replace & with ‘and’
      // Remove all non-word characters 
      .replace(/[^\w\-]+/g, '') // eslint-disable-line no-useless-escape 
      // Replace multiple - with single -
      .replace(/\-\-+/g, '-') // eslint-disable-line no-useless-escape 
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '') // Trim - from end of text */
}

function yearCalc(date) {
    return date.slice(-4).toString();
    //return new Date(date).getFullYear();
}

function difficultyCalc(difficulty) {
    //Facile 1 - Moyenne 2 - Difficile 3
    if ( difficulty == 'mittel bis schwer') {
        difficultyConvResult = [2,3];
    } else if(difficulty == 'variabel; leicht bis Profi' || difficulty == 'variabel') {
        difficultyConvResult = [1,2,3];
    } else {
        difficultyArray = difficulty.split(' - ');
        if( difficultyArray[0] == '-' || difficultyArray[0] == '' ) {
            return difficultyConvResult = [];
        }
        difficultyConv = {'Facile': 1, 'Moyenne':2, 'Difficile':3, 'leicht': 1, 'mittel':2, 'schwer':3, 'sehr Difficile': 3 }
        difficultyConvResult = difficultyArray.map(n => {
            return difficultyConv[n];
        })
    }
    //difficultyArray = difficulty.split(' - ');
    return difficultyConvResult;
}

function boardCalc(plateau) {
    //const boardOptions = [{name:'Mer du Nord',key:"3"},{name:'Hadria',key:"4"},{name:'Montagnes grises',key:"5"},{name:'Krahd',key:"6"},{name:'Andor enneigé',key:"7"},{name:'Pays des trois frères',key:"8"}];
    plateauResult = [];
    switch(plateau) {
        case 'Andor (Vorderseite Grundspiel)':
        case '"Andor (Vorderseite Grundspiel)"':
            plateauResult.push('1');
            break;
        case 'Cavern (Rückseite Grundspiel)':
            plateauResult.push('2');
            break;
        case 'Norden (Vorderseite Reise in den Norden)':
            plateauResult.push('3');
            break;
        case 'Hadria (Rückseite Reise in den Norden)':
            plateauResult.push('4');
            break;
        case 'Krahd  (Rückseite  Letzte Hoffnung)':
            plateauResult.push('6');
            break;
        case 'Graues Gebirge (Vorderseite Letzte Hoffnung)':
        case '"Graues Gebirge (Vorderseite Letzte Hoffnung)"':
            plateauResult.push('5');
            break;
        case 'Andor + Norden (Vorderseite Grund- spiel + Vorderseite Reise in den Norden)':
            plateauResult.push('1','3');
            break;
        case 'Andor + Graues Gebirge + Norden (Vorderseite Grundspiel + Vorderseite Reise in den Norden + Vorderseite Letzte Hoffnung)':
            plateauResult.push('1', '5', '3');
            break;
        default:
            plateauResult = [];
            //plateauResult = 'undefined board';
    }
    return plateauResult;
}

function boxCalc(item) {
    boxExt = [];
    if (item['Boite de base'] == "1") {
        boxExt.push("1");
    }
    if (item['Voyage vers le Nord'] == "1") {
        boxExt.push("2");
    }
    if (item['Le dernier espoir'] == "1") {
        boxExt.push("3");
    }
    if (item['Boite Bonus'] == "1") {
        boxExt.push("5");
    }

    if (item['Légende de Gardétoile'] == '1') {
        boxExt.push("8");
    }
    if (item['Légendes oubliées : Heures sombres'] == '1') {
        boxExt.push("6");
    }
    if (item['Légendes oubliées : Esprits ancestraux'] == '1') {
        boxExt.push("7");
    }
    if (item['Nouveaux héros'] == '1') {
        boxExt.push("9");
    }
    if (item['Héros sombres'] == '1') {
        boxExt.push("10");
    }
    

    if(boxExt.length == 0) {
        return 'undefined box'
    }
    /*
    1  "Boite de base": "1",     
    2  "Voyage vers le Nord": "-",
    3  "Le dernier espoir": "-",
    4  "Froid Eternel": "-",
    5  "Boite Bonus": "-",
    6  "Légendes oubliées : Heures sombres": "-",
    7  "Légendes oubliées : Esprits ancestraux": "-",
    8  "Légende de Gardétoile": "-",
    9  "Nouveaux héros": "-",
    10  "Héros sombres": "-",*/
    return boxExt;
}

function boxOptCalc(item) {
    boxExt = [];
    if (item['Boite de base'] == "option") {
        boxExt.push("1");
    }
    if (item['Voyage vers le Nord'] == "option") {
        boxExt.push("2");
    }
    if (item['Le dernier espoir'] == "option") {
        boxExt.push("3");
    }
    if (item['Boite Bonus'] == "option") {
        boxExt.push("5");
    }

    if (item['Légende de Gardétoile'] == 'option') {
        boxExt.push("8");
    }
    if (item['Légendes oubliées : Heures sombres'] == 'option') {
        boxExt.push("6");
    }
    if (item['Légendes oubliées : Esprits ancestraux'] == 'option') {
        boxExt.push("7");
    }
    if (item['Nouveaux héros'] == 'option') {
        boxExt.push("9");
    }
    if (item['Héros sombres'] == 'option') {
        boxExt.push("10");
    }   
    return boxExt;
}