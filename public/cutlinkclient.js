    function inicia_cut () {
               // Html elements
               const url_cut = document.querySelector('#url_cut');
               const btn_cut = document.querySelector('#btn_cut');

               console.log(url_cut.value);
               
               // list to render
              
               let cutlinkrecibido = [];
               //
               // btn_cut button handler
               //
               btn_cut.addEventListener('click', () => {

                    if (this.Validateurl(url_cut.value) == true)
                    {
                        let data = { a: url_cut.value };

                        //al hospedarse en el mismo server no hace falta hacer
                        //el fetch indicando ip y puerto con hacer llamada a la función a enrutar vale
                        //de este modo al subirlo a un server y dejar de trabajar en local funcionara sin hacer cambios
                        fetch('crearcutlink', {
                            method: "POST",
                            body: JSON.stringify(data)
                        })
                        .then(response => response.json())
                        .then(data => {
                            cutlinkrecibido = data; 
                            render();                   
                        });
                    }
                });


               function render() {
                    var x = document.getElementById("divvueltacut");
                    if (x.style.display === "none") {
                        x.style.display = "block";
                    } 
                    x.innerHTML = '<h4 class="mbr-section-subtitle align-center pb-5 mbr-light mbr-fonts-style display-4">' +
                                  '<a class="mbr-fonts-style">Tu url corta: </a>' +  
                                  '<a href =' + cutlinkrecibido.element + '>' + cutlinkrecibido.element + '</a>' +
                                  '</h4>';

                    var urlqr = document.getElementById("urlqr");
                    urlqr.value = cutlinkrecibido.element;
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
            
            
            
