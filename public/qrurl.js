
function inicia_qr () {
               // Html elements
               const url_qr = document.querySelector('#url_qr');
               const btn_qr = document.querySelector('#btn_qr');

               console.log(url_qr.value);
               
               // list to render
              
               let cutlinkrecibido = [];
               
               btn_qr.addEventListener('click', () => {
                    var urlqr = url_qr.value

                    if (this.Validateurl(urlqr) == true)
                    {
                        makeCode();
                        
                        var divqr = document.getElementById("qrcode");
                        if (divqr.style.display === "none"){
                            divqr.style.display = "flex";
                        }

                        var txtqr = document.getElementById("textqr");
                        if (txtqr.style.display === "none"){
                            txtqr.style.display = "block";
                        }
                    }
                });

                                                     
                    
    };
            

            var i = 0
            var dataURL
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                width : 200,
                height : 200
            });
            
            function makeCode () {		
                qrcode.makeCode(document.getElementById("urlqr").value);
               
            }
            

           