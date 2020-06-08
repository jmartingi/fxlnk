
    window.onload = function () {
               // Html elements
               const url_envia = document.querySelector('#url_form_fix');
               const mail_envia = document.querySelector('#mail_form_fix');
               const clave_envia = document.querySelector('#clave_form_fix');
               const btn_envia = document.querySelector('#btn_form_fix');

               console.log(url_envia.value + '-' + mail_envia.value + '-' + clave_envia.value);
               
               // list to render
               let fixlinkrecibido = [];
              
               // btn_envia button handler
               //
               btn_envia.addEventListener('click', () => {

                    if (this.validacreate(url_envia.value,mail_envia.value, clave_envia.value) == true)
                    {

                        let data = { a: url_envia.value, b: mail_envia.value, c:clave_envia.value };
        
                        fetch('http://localhost:8888/crearfixlink', {
                            method: "POST",
                            body: JSON.stringify(data)
                        })
                        .then(response => response.json())
                        .then(data => {
                            fixlinkrecibido = data; 
                            render();                   
                        });
                    }
               });

               

               function render() {
                                         
                   var x = document.getElementById("divvuelta");
                    if (x.style.display === "none") {
                        x.style.display = "block";
                    } 
                    x.innerHTML = '<h4 class="mbr-section-subtitle align-center pb-5 mbr-light mbr-fonts-style display-4">' +
                                  '<a class="mbr-fonts-style">Tu FixLink: </a>' + 
                                  '<a href =' + fixlinkrecibido.element + '>' + fixlinkrecibido.element + '</a>' +
                                  '</h4>';
                    var urlqr = document.getElementById("urlqr");
                    urlqr.value = fixlinkrecibido.element;
                    makeCode();
                    
                    var divqr = document.getElementById("qrcode");
                    if (divqr.style.display === "none"){
                        divqr.style.display = "flex";
                    }

                    var txtqr = document.getElementById("textqr");
                    if (txtqr.style.display === "none"){
                        txtqr.style.display = "block";
                    }

                    
                    
                };

                                
            }

            var qrcode = new QRCode(document.getElementById("qrcode"), {
                width : 200,
                height : 200
            });
            
            function makeCode () {		
                qrcode.makeCode(document.getElementById("urlqr").value);
            }
            
            /*makeCode();
            
            $("#text").
                on("blur", function () {
                    makeCode();
                }).
                on("keydown", function (e) {
                    if (e.keyCode == 13) {
                        makeCode();
                    }
                });*/
        
            
         