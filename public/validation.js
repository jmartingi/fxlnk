function ValidateEmail(mail, alert = true) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    if (alert = true) {alertify.alert("Introduzca un email válido");}
    return (false);
}

function Validateurl(url, alert = true)
{
  regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (regexp.test(url))
        {
          return true;
        }
        else
        {
          if (alert = true) {alertify.alert("Introduzca una url válida");}
          return false;
        }
}

function validacreate(url,mail,clave){
    if (this.ValidateEmail(mail,false) == false && this.Validateurl(url,false) == false){
        alertify.alert("Introduzca una url y un email válidos"); 
        return false;                   
    }
    else if (this.ValidateEmail(mail,false) == false) {
        alertify.alert("Introduzca un email válido");      
        return false;                                         
    }else if (this.Validateurl(url,false) == false){
        alertify.alert("Introduzca una url válida");     
        return false;
    }else if (clave.length != 4){
        alertify.alert("El campo clave requiere 4 caracteres.");     
        return false;
    }else{
        return true;
    }
}

