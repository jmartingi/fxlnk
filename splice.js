/*var searchresponse = [{
    "items": [{
        "employeeId": "ABC",
        "type": "D",
        "alive": "Yes"

    }, {
        "employeeId": "DEF",
        "type": "D",
        "alive": "Yes"

    }, {
        "employeeId": "NPK",
        "type": "D",
        "alive": "Yes"

    }, {
        "employeeId": "PKN",
        "type": "A",
        "alive": "Yes"
    }],
    "more": false
}];

var fx = [{"email":"info@fxlnk.es","clave":"1234","click":0,"fixlink":"http://localhost:8888/flk?go=94e21590154673000","vinculo":"http://www.welele.com"},{"email":"info@fxlnk.es","clave":"1234","click":0,"fixlink":"http://localhost:8888/flk?go=4e331590154738000","vinculo":"http://www.welele.com"},{"email":"info@fxlnk.es","clave":"1234","click":0,"fixlink":"http://localhost:8888/flk?go=319d1590154756000","vinculo":"http://www.welele.com"}];

var data1=["ABC","DEF"];
var items=searchresponse[0].items;
console.log(fx);

console.log('--------------------------------');
var itefx = fx;
itefx.splice(0,1);
console.log(itefx);


console.log('--------------------------------');
console.log(fx);
var i=items.length;
while (i--) {
    if(data1.indexOf(items[i].employeeId)!=-1){
        items.splice(i,1);
    }
}
console.log(searchresponse[0].items);*/




var fs = require('fs');
var fixlink = 'http://localhost:8888/flk?go=94e21590154673000';
var clave = '1234';

	//abro el json y lo vuelco a objeto
	var json = JSON.parse(fs.readFileSync('./fixlinks.json', 'utf8'));
    jsonborrado = json;
    console.log('-------------');
    console.log('-------------');
    console.log('-------------');
    console.log('-------------');

    console.log(json);
	for (var i=0 ; i < json.length ; i++)
	{
		if (json[i]['fixlink'] == fixlink) {
			if (json[i]['clave'] == clave){
                console.log(i);
                console.log('-------------');
                console.log('-------------');
                console.log('-------------');
                jsonborrado.splice(i,1);
                console.log(jsonborrado);
                console.log('-------------');
                console.log('-------------');
                console.log('-------------');
                console.log(json);

			}else{
				console.log('Clave incorrecta');
				break;
			}
		}
	}
	