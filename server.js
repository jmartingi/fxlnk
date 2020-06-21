var http=require('http');
var url=require('url');
var fs=require('fs');
var querystring = require('querystring');
var rutaweb;
var rutahost;
var port = process.env.PORT || 8888;
var nodemail = require('nodemailer');
var jsontotable = require('./public/json_totable.js');
var open = require('open');


var mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  :	'audio/mpeg3',
   'mp4'  : 'video/mp4'
};

var servidor=http.createServer(function(pedido,respuesta){
	rutaweb = pedido.headers.referer;
	rutahost = pedido.headers.origin + "/";
    var objetourl = url.parse(pedido.url);
	var camino='public'+objetourl.pathname;
	if (camino=='public/')
		camino='public/index.html';
	encaminar(pedido, respuesta, camino);	
});

servidor.listen(port);


function encaminar (pedido,respuesta,camino) {
	
	switch (camino) {
		case 'public/editfixlink': {
			var param = {};
			if (pedido.method == 'POST') {
				pedido.on('data', function(data) {
					data = data.toString();
					console.log(JSON.parse(data));
					mensajevuelta = editfixlink(pedido,respuesta,JSON.parse(data).a,JSON.parse(data).b,JSON.parse(data).c);
				
					let vuelta = {element: mensajevuelta};
					respuesta.writeHead(200, {'Content-Type': 'text/json'});
					respuesta.write(JSON.stringify(vuelta));
					respuesta.end();

				})
			}			
			break;
		}	
		case 'public/deletefixlink': {
			var param = {};
			if (pedido.method == 'POST') {
				pedido.on('data', function(data) {
					data = data.toString();
					console.log(JSON.parse(data));
					mensajevuelta = deletefixlink(pedido,respuesta,JSON.parse(data).a,JSON.parse(data).b);

					let vuelta = {element: mensajevuelta};
					respuesta.writeHead(200, {'Content-Type': 'text/json'});
					respuesta.write(JSON.stringify(vuelta));
					respuesta.end();
				})
			}			
			break;
		}	
		case 'public/recuperaclave': {
			var param = {};
			if (pedido.method == 'POST') {
				pedido.on('data', function (data) {
					data = data.toString();
					console.log(JSON.parse(data));
					mensajevuelta = envia_mailclave(pedido, respuesta, JSON.parse(data).a);
					let vuelta = { element: mensajevuelta };
					respuesta.writeHead(200, { 'Content-Type': 'text/json' });
					respuesta.write(JSON.stringify(vuelta));
					respuesta.end();
				})
			}
			break;
		}
		case 'public/mixfixlink': {
			var param = {};
			if (pedido.method == 'POST') {
				pedido.on('data', function(data) {
					data = data.toString();
					console.log(JSON.parse(data));
					devuelve_tusfixlinks(pedido,respuesta,JSON.parse(data).a);
				})
			}			
			break;
		}	
		case 'public/crearfixlink': {
			var param = {};
			if (pedido.method == 'POST') {
				pedido.on('data', function(data) {
					data = data.toString();
					console.log(JSON.parse(data));
					crearfixlink(JSON.parse(data).a,JSON.parse(data).b,JSON.parse(data).c,pedido,respuesta);
				})
			}			
			break;
		}	
		case 'public/crearcutlink': {
			var param = {};
			if (pedido.method == 'POST') {
				pedido.on('data', function(data) {
					data = data.toString();
					console.log(JSON.parse(data));
					crearcutlink(JSON.parse(data).a,pedido,respuesta);
				})
			}			
			break;
		}	
		case 'public/damelink': {
			damelink(pedido,respuesta);
			break;
		}	
		case 'public/flk': {
			//devuelveRedirect(pedido, respuesta);
			//paso param flk en 3
			navegar(pedido, respuesta, 'flk');
			break;			
		}
		case 'public/cut': {
			//devuelveRedirect(pedido, respuesta);
			//paso param cut en 3
			navegar(pedido,respuesta,'cut');
			break;
		}			
	    default : {  
			fs.exists(camino,function(existe){
				if (existe) {
					fs.readFile(camino,function(error,contenido){
						if (error) {
							respuesta.writeHead(500, {'Content-Type': 'text/plain'});
							respuesta.write('Error interno');
							respuesta.end();					
						} else {
							var vec = camino.split('.');
							var extension=vec[vec.length-1];
							var mimearchivo=mime[extension];
							console.log(mimearchivo);
							if (mimearchivo == undefined) {
								mimearchivo = 'text/plain';
							}
							respuesta.writeHead(200, {'Content-Type': mimearchivo});
							respuesta.write(contenido);
							respuesta.end();
						}
					});
				} else {
					devuelve404(pedido, respuesta);
				}
			});	
		}
	}	
}
//función que devuelve un mail con el html de tus fixlinks incluida la clave
function envia_mailclave(pedido, respuesta, mail) {
	try {
		var resultado = '';
		var htmlmail = '';

		var datosmail = JSON.parse(fs.readFileSync('./pwdmail.json', 'utf8'));
		var json = JSON.parse(fs.readFileSync('./fixlinks.json', 'utf8'));
		//filtro el json para obtener solo los fixlinks del mail que hemos recibiod del cliente
		var filtered = json.filter(a => a.email == mail);
		//borro el campo click del json de momento irrelevante
		filtered.forEach(function (x) { delete x.click }); filtered.forEach(function (x) { delete x.email });

		//respuesta.writeHead(200, { 'Content-Type': 'text/json' });
		//respuesta.write(JSON.stringify(filtered));
		//respuesta.end();
		
		htmltabla = jsontotable.ConvertJsonToTable(filtered, 'mailclave',null);
		htmlplantilla = fs.readFileSync('./mail/plantillamail.html', 'utf8');
		htmlmail = htmlplantilla.replace('@tabla', htmltabla);

		if (enviamail(mail, htmlmail, datosmail[0].mail, datosmail[0].pwd ) == true){
			resultado = 'Mail enviado'
		} else {
			resultado = 'No se pudo enviar email por favor contacte con info@fxlnk.es'
        }


	}catch (error) {
		resultado = error;
		console.log(error);
	}
	return resultado;
}

function enviamail(para, htmlcontenido, correo, pwd) {
	try {
		var estado = true;

		var transporter = nodemail.createTransport({
			host: 'smtp.fxlnk.es',
			port: 587,
			secure: false,
			tls: {
			rejectUnauthorized: false
			},
			auth: {
				user: correo,
				pass: pwd
			}
		});

		var mailOptions = {
			from: 'info@fxlnk.es',
			to: para,
			subject: 'FixLink - FxLnk.es Recuperación de clave',
			html: htmlcontenido
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
				estado = false;
			} else {
				console.log('Email sent: ' + info.response);
				estado = true;
			}
		});

	} catch (error) {
		estado = false;
	}
	return estado;
}

function editfixlink(pedido,respuesta,fixlink,clave,newvinculo){
	try {
		var fs = require('fs');
		//abro el json y lo vuelco a objeto
		var json = JSON.parse(fs.readFileSync('./fixlinks.json', 'utf8'));
		//busco en el json el fixlink y comprueba el valor de clave
		var resultado = '';
		for (var i=0 ; i < json.length ; i++)
		{
			if (json[i]['fixlink'] == fixlink) {
				if (json[i]['clave'] == clave){
					json[i]['vinculo'] = newvinculo;
					fs.writeFileSync('./fixlinks.json', JSON.stringify(json));
					resultado = 'Fixlink modificado';
					break;
				}else{
					resultado = 'Clave incorrecta';
					break;
				}			
			}
		}
		if (resultado == ''){resultado = 'No existe el FixLink introducido';}
	} catch (error) {
		resultado = error;		
	}
		return resultado;
}


function deletefixlink(pedido,respuesta,fixlink,clave){
	var fs = require('fs');
	//abro el json y lo vuelco a objeto
	var json = JSON.parse(fs.readFileSync('./fixlinks.json', 'utf8'));
	jsonborrado = json;
	//busco en el json el fixlink y comprueba el valor de clave
	var resultado = '';
	for (var i=0 ; i < json.length ; i++)
	{
		if (json[i]['fixlink'] == fixlink) {
			if (json[i]['clave'] == clave){
				jsonborrado.splice(i,1);
				fs.writeFileSync('./fixlinks.json', JSON.stringify(json));
				resultado = 'Fixlink Borrado';
				break;
			}else{
				resultado = 'Clave incorrecta';
				break;
			}
		}
	}
	if (resultado == ''){resultado = 'No existe el FixLink introducido';}
	return resultado;
}

function damelink(pedido,respuesta) {
    //devo crear lo primero el link con la fecha + hora
    var dat= new Date(); //Obtienes la fecha
    var dat2 = Date.parse(dat); //Lo parseas para transformarlo

    console.log(dat);
    console.log(dat2);
   
    var vinculo = rutaweb + 'flk?go=' + dat2;
    console.log(vinculo)
    //guardo en json enlaces campo link y campo hyperlink
    //devuevlo html con el campo link y campo hyperlink
    //TODO usar template en vez de html a capón
    respuesta.writeHead(200, {'Content-Type': 'text/html'});
	var pagina='<!doctype html><html><head></head><body>';
    pagina+='<a href="' + vinculo + '">link '+vinculo+'</a><br>';
	pagina+='</body></html>';
	respuesta.end(pagina);
    
}

function devuelvefixlinkaleatorio(){
	//devo crear lo primero el link con la fecha + hora
    // var dat= new Date(); //Obtienes la fecha
    // var dat2 = Date.parse(dat); //Lo parseas para transformarlo

    // console.log(dat);
	// console.log(dat2);
	
	var crypto = require("crypto"); 
	var id = crypto.randomBytes(2).toString('hex'); // "bb5dc8842ca31d4603d6aa11448d1654" 
	console.log (id);

	var vinculo = 'https://testfxlnk.azurewebsites.net//flk?go=' + id; //+ dat2;
	
	console.log(vinculo);
	
	return vinculo;

}

//devuelve cut
function devuelvecutlinkaleatorio(){
	//devo crear lo primero el link con la fecha + hora
    // var dat= new Date(); //Obtienes la fecha
    // var dat2 = Date.parse(dat); //Lo parseas para transformarlo

    // console.log(dat);
	// console.log(dat2);
	
	var crypto = require("crypto"); 
	var id = crypto.randomBytes(2).toString('hex'); // "bb5dc8842ca31d4603d6aa11448d1654" 
	console.log (id);
	//rutahost + 'cut
	var vinculo = 'www.testfxlnk.azurewebsites.net//cut?go=' + id; //+ dat.getMonth() + dat.getFullYear();
	
	console.log(vinculo);
	
	return vinculo;

}

function crearcutlink(vinculo,pedido,respuesta){
	cut = devuelvecutlinkaleatorio();
	escribircutjson(vinculo,cut);
	console.log("fichero grabado");

	let data = {element: cut};
	respuesta.writeHead(200, {'Content-Type': 'text/json'});
	respuesta.write(JSON.stringify(data));
	respuesta.end();
}

function escribircutjson(vinculo,cutlink){
   const fs = require('fs');
   try {
        let userData = fs.readFileSync('./cutlinks.json');
        userData = JSON.parse(userData);
        userData.push({
			clicks: 0,
			cutlink: cutlink,
			vinculo: vinculo
        });
        fs.writeFileSync('./cutlinks.json', JSON.stringify(userData));
    } catch (error) {
        console.log(error);
    }
	
}
function crearfixlink(vinculo,mail,clave,pedido,respuesta) {
/* 	var info = '';
    pedido.on('data', function(datosparciales){
         info += datosparciales;
    });
    pedido.on('end', function(){
		var formulario = querystring.parse(info);
		console.log(formulario['url']);
		console.log(formulario['mail']);
		console.log(formulario['clave']);

		vinculo = devuelvefixlinkaleatorio();
		escribirjson(formulario['mail'],formulario['clave'],vinculo,formulario['url']);
		console.log("fichero grabado");

		let data = {element: vinculo};
		respuesta.writeHead(200, {'Content-Type': 'text/json'});
		respuesta.write(JSON.stringify(data));
		respuesta.end();
		
	});	 */
	
		fxlnk = devuelvefixlinkaleatorio();
		escribirjson(mail,clave,fxlnk,vinculo);
		console.log("fichero grabado");

		let data = {element: fxlnk};
		respuesta.writeHead(200, {'Content-Type': 'text/json'});
		respuesta.write(JSON.stringify(data));
		respuesta.end();
	
}

function escribirjson(mail,clave,fixlink,vinculo,clics){
/*
	var fs = require("fs");
	var sampleObject = {
		email: mail,
		clave: clave,
		click: 0,
		fixlink: fixlink,
		vinculo: vinculo
		};

	
	fs.writeFile("./object.json", JSON.stringify(sampleObject, null, 4), (err) => {
		if (err) {
			console.error(err);
			return;
		};
		console.log("File has been created");
	});

	


*/

/* 	var fs = require('fs');

	var history123 = [];
	history123.push({email: mail, clave: clave, clicks: 0, linki: fixlink, vinculo: vinculo});

	var objlink = [];

	fs.exists('./fixlinks.json', function(exists){
		if(exists){
			console.log("el fichero existe");
			fs.readFile('./fixlinks.json', function readFileCallback(err, data){
			if (err){
				console.log(err);
			} else {
			objlink = JSON.parse(data); 
			
			objlink.Push({email: mail, clave: clave, clicks: 0, linki: fixlink, vinculo: vinculo});
			
			var json = JSON.stringify(objlink); 
			fs.writeFile('./fixlinks.json', json, 'utf8', callback); // write it back 
			}});
		} else {
			console.log("no existe el fichero")
			
			objlink.Push({email: mail, clave: clave, clicks: 0, linki: fixlink, vinculo: vinculo});
			
			var json = JSON.stringify(objlink);
			fs.writeFile('./fixlinks.json', json);
			}
	});  */



	const fs = require('fs');
   try {
        let userData = fs.readFileSync('./fixlinks.json');
        userData = JSON.parse(userData);
        userData.push({
			email: mail,
			clave: clave,
			click: 0,
			fixlink: fixlink,
			vinculo: vinculo
        });
        fs.writeFileSync('./fixlinks.json', JSON.stringify(userData));
    } catch (error) {
        console.log(error);
    }


		
}


function navegar(pedido,respuesta,opcion) {
	//extraigo los parametros
	var valor= url.parse(pedido.url,true).query.go;
	var vinc = "";
	var fich = "";
	var param = "";
	//leo el json
	var fs = require('fs');
	//diferencia en funcion de nav o de cut 
	if (opcion == 'flk') {
		//leo json fixlink
		fich = './fixlinks.json';
		param = 'fixink';
	}else if (opcion == 'cut'){
		//leo json cut
		fich = './cutlinks.json';
		param = 'cutlink';
	}
	
	
		var json = JSON.parse(fs.readFileSync(fich, 'utf8'));
		//busco en el json
		for (i = 0; i < json.length; i++) {
			
			if (opcion == 'flk') {
				if (url.parse(json[i].fixlink, true).query.go == valor) {
					console.log("Registro encontrado:" + json[i].vinculo)
					vinc = json[i].vinculo;
					break;
				}
			} else {
				if (url.parse(json[i].cutlink, true).query.go == valor) {
					console.log("Registro encontrado:" + json[i].vinculo)
					vinc = json[i].vinculo;
					break;
				}
			}

		}


		if (vinc == "") {
			//recurso no encontrado
			//respuesta.writeHead(404, {'Content-Type': 'text/html'});
			//respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
			//respuesta.end();
			devuelve404(pedido, respuesta);

		} else {
			//redirijo
			if (vinc.substring(0, 8) != "https://" && vinc.substring(0, 7) != "http://") {
				vinc = "http://" + vinc
			}
			console.log(vinc);
			//averiguar - con 301 el navegador cachea y no vuelve a procesar la petición con 302 la pide siempre
			respuesta.writeHead(302,
				{Location: vinc}
			);
			respuesta.end();
			//(async () => {
			//	// Opens the URL in the default browser.
			//	await open(vinc);
			//})();
			//require("openurl").open(vinc);			
		}
	
	
}

function devuelve_tusfixlinks(pedido,respuesta,mail) {
	var json = JSON.parse(fs.readFileSync('./fixlinks.json', 'utf8'));

	var filtered = json.filter(a=>a.email==mail);

	filtered.forEach(function(x){ delete x.email }); filtered.forEach(function(x){ delete x.clave }); filtered.forEach(function(x){ delete x.click })
	
	respuesta.writeHead(200, {'Content-Type': 'text/json'});
	respuesta.write(JSON.stringify(filtered));
	respuesta.end();
}


function devuelve404(pedido,respuesta) {
	var fs404 = require("fs");
	
	fs404.readFile('PUBLIC/404.html', (error,contenido) => {
        if (error) {
          respuesta.writeHead(500, {'Content-Type': 'text/plain'});
          respuesta.write('Error interno');
          respuesta.end();					
        } else {
          respuesta.writeHead(200, {'Content-Type': 'text/html'});
          respuesta.write(contenido);
          respuesta.end();
        }
      });
}


function devuelveRedirect(pedido, respuesta) {
	var fs404 = require("fs");

	fs404.readFile('PUBLIC/redirect.html', (error, contenido) => {
		if (error) {
			respuesta.writeHead(500, { 'Content-Type': 'text/plain' });
			respuesta.write('Error interno');
			respuesta.end();
		} else {
			respuesta.writeHead(200, { 'Content-Type': 'text/html' });
			respuesta.write(contenido);
			respuesta.end();
		}
	});
}

/* function listar(pedido,respuesta) {
    var info = '';
	respuesta.writeHead(200, {'Content-Type': 'text/html'});
	var pagina='<!doctype html><html><head></head><body>';
    for(var f=1;f<=20;f++) {
	   pagina+='<a href="listadotabla?num='+f+'">'+f+'</a><br>';
	}
	pagina+='</body></html>';
	respuesta.end(pagina);
}

function listarTablaMultiplicar(pedido,respuesta) {
	var valor=url.parse(pedido.url,true).query.num;
    respuesta.writeHead(200, {'Content-Type': 'text/html'});
	var pagina='<!doctype html><html><head></head><body>';
	for(var f=1;f<=10;f++) {
	    pagina+=valor+'*'+f+'='+(valor*f)+'<br>';
	}		   
	pagina+='</body></html>';
	respuesta.end(pagina);
} */


console.log('Servidor web iniciado en el puerto-> :' + port );