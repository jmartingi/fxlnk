   let misfxlnk = [];
   let rowmodificado = 0;

   function inicializar () {
                // Html elements
                const mail = document.querySelector('#mail_manage');
                const btn = document.querySelector('#btn_manage');

                console.log(mail.value);
                
                // list to render
                
                
                //
                // btn button handler
                //
                btn.addEventListener('click', () => {
                    let data = { a: mail.value };

                    fetch('mixfixlink', {
                        method: "POST",
                        body: JSON.stringify(data)
                    })
                    .then(response => response.json())
                    .then(data => {
                        misfxlnk = data; 
                        render();                   
                    });

                });

                function render() {
                    var dom_menu_cabecera = document.getElementById("cabecera");
                    var dom_menu_edit = document.getElementById("div_menu");
                    var dom_tab_fxlnk = document.getElementById("divfxlnk");
                    var dom_edit = document.getElementById("editfxlnk");
                    var dom_del = document.getElementById("delfxlnk");
                    var dom_tit_tabla = document.getElementById("tittabla");
                    
                    
                    

                    if (misfxlnk.length > 0) {

                            //hago invisible la cabecera
                            if (dom_menu_cabecera.style.display === "block") {
                                dom_menu_cabecera.style.display = "none";
                            }

                            //hago visible la barra menu de edición
                            /* if (dom_menu_edit.style.display === "none") {
                                dom_menu_edit.style.display = "block";
                            } */

                            //hago visible la tabla de los link y el titulo
                            if (dom_tab_fxlnk.style.display === "none") {
                                dom_tab_fxlnk.style.display = "block";
                                dom_tit_tabla.style.display = "block";
                            } 
                            
                             //hago invisible div borrado
                            if (dom_del.style.display === "block") {
                                dom_del.style.display = "none";
                            } 
                            //hago invisible div edición
                            if (dom_edit.style.display === "block") {
                                dom_edit.style.display = "none";
                            } 
                            
                            //cargo en el div el html con la tabla

                            dom_tab_fxlnk.innerHTML = ConvertJsonToTable(misfxlnk, 'jsonTable', null);


                            //añado columna edición
                                var tbl = document.getElementById('jsonTable'), // table reference
                                    i;
                                var x = document.createElement("TH");
                                var t = document.createTextNode("editar");
                                x.appendChild(t);
                                document.getElementById("tr_jsontable").appendChild(x);
                                
                                x = document.createElement("TH");
                                t = document.createTextNode("eliminar");
                                x.appendChild(t);
                                document.getElementById("tr_jsontable").appendChild(x);
                                

                                                                   
                                // open loop for each row and append cell
                                for (i = 0; i < tbl.rows.length; i++) {
                                    if (i==0){
                                        //cabecera
                                        
                                       // createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), 'editar', 'head-item mbr-fonts-style display-7');
                                    }else{
                                        createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), '<button onclick="edittbl('+i+')" id=btnedit' + i + '>✏️</button>', 'body-item mbr-fonts-style display-7');
                                    }
                                }

                                for (i = 0; i < tbl.rows.length; i++) {
                                    if (i==0){
                                        //cabecera
                                        //createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), 'eliminar', 'head-item mbr-fonts-style display-7');
                                    }else{
                                        createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), '<button onclick="deletetbl('+i+')" id=btndelete' + i + '>🗑️</button>', 'body-item mbr-fonts-style display-7');
                                    }
                                }

                            //añado columna edición
/*                             var tbl = document.getElementById('jsonTable'), // table reference
                            i;
                            // open loop for each row and append cell
                            for (i = 0; i < tbl.rows.length; i++) {
                                if (i==0){
                                    //cabecera
                                    createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), 'borrar', 'col');
                                }else{
                                    createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), '🗑️', 'col',true,'borrar'+i);
                                }
                            } */
                            
                    }else{
                        //hago invisible la barra menu de edición
                        /* if (dom_menu_edit.style.display === "block") {
                            dom_menu_edit.style.display = "none";
                        } */

                        //hago invisible la barra de los link
                        if (dom_tab_fxlnk.style.display === "block") {
                            dom_tab_fxlnk.style.display = "none";
                            dom_tit_tabla.style.display = "none";
                        } 

                        //hago invisible div borrado
                        if (dom_del.style.display === "block") {
                            dom_del.style.display = "none";
                        } 
                        //hago invisible div edición
                        if (dom_edit.style.display === "block") {
                            dom_edit.style.display = "none";
                        } 
                        alertify.alert("No existen fixlinks para el mail introducido");
                    }
                                         
                    

                };




                // Html elements
               const fxlnkedit = document.querySelector('#fxlnk_edit');
               const claveedit = document.querySelector('#clave_edit');
               const vinculoedit = document.querySelector('#vinculo_edit');

               const btnconfirmedit = document.querySelector('#btn_confirm_edit');

              
               // list to render
              
               let respedit = [];
               //
               // btn button handler
               //
               btnconfirmedit.addEventListener('click', () => {

                    if (this.Validateurl(vinculoedit.value) == true) 
                    {
                        let data = { a: fxlnkedit.value, b: claveedit.value, c:vinculoedit.value };

                        fetch('editfixlink', {
                            method: "POST",
                            body: JSON.stringify(data)
                        })
                        .then(response => response.json())
                        .then(data => {
                            respedit = data; 
                            if (respedit.element == 'Fixlink modificado'){
                                //modifico el objeto mixfxlnk y renderizo para actualizar los datos
                                misfxlnk[rowmodificado].vinculo = vinculoedit.value;
                                render();
                            }       
                            alertify.alert(respedit.element);
                        });
                    }
                });

                


                               // Html elements
               const fxlnkdelete = document.querySelector('#fxlnk_delete');
               const clavedelete = document.querySelector('#clave_delete');

               const btnconfirmdelete = document.querySelector('#btn_confirm_delete');

              
               // list to render
              
               let respsup = [];
               //
               // btn button handler
               //
               btnconfirmdelete.addEventListener('click', () => {
                    let data = { a: fxlnkdelete.value, b: clavedelete.value };

                    fetch('deletefixlink', {
                        method: "POST",
                        body: JSON.stringify(data)
                    })
                    .then(response => response.json())
                    .then(data => {
                        respsup = data;  
                        if (respsup.element == 'Fixlink Borrado'){
                            //borro registro array local y renderizo
                            var copyfxlnk = misfxlnk;
                            copyfxlnk.splice(rowmodificado,1);
                            render();
                        }      
                        alertify.alert(respsup.element);
                    });
                });

                               

                                   


               
            }
            
// create DIV element and append to the table cell
function createCell(cell, text, style) {
    var div = document.createElement('div'), // create DIV element
        txt = document.createTextNode(text); // create text node
    cell.innerHTML = text;
    //cell.appendChild(txt);                    // append text node to the DIV
    cell.setAttribute('class', style);        // set DIV class attribute
    //cell.setAttribute('className', style);    // set DIV class attribute for IE (?!)
    //if (boton == true) {cell.setAttribute('type', 'button')} 
    //if (id != null) {cell.setAttribute('id', id)}
    


/*     var div = document.createElement('div'), // create DIV element
    txt = document.createTextNode(text); // create text node
div.appendChild(txt);                    // append text node to the DIV
div.setAttribute('class', style);        // set DIV class attribute
div.setAttribute('className', style);    // set DIV class attribute for IE (?!)
if (boton == true) {div.setAttribute('type', 'button')} 
if (id != null) {div.setAttribute('id', id)}
cell.appendChild(div);                   // append DIV to the table cell */
}

function deletetbl(row){
    //hago visible bloque borrado e invisible bloque edit
    x = document.getElementById("delfxlnk");
    if (x.style.display === "none") {
    x.style.display = "block";
    }

    x = document.getElementById("editfxlnk");
    if (x.style.display === "block") {
    x.style.display = "none";
    }
    
    //relleno los datos
    document.getElementById('fxlnk_delete').value = misfxlnk[row-1].fixlink;
    document.getElementById('clave_delete').value = "";
    document.getElementById('clave_delete').focus();

    rowmodificado = row -1;
}

function edittbl(row){
   
    
    //hago visible bloque edit e invisible bloque borrado
    x = document.getElementById("editfxlnk");
    if (x.style.display === "none") {
    x.style.display = "block";
    }

    x = document.getElementById("delfxlnk");
    if (x.style.display === "block") {
    x.style.display = "none";
    }

    //relleno los datos
    document.getElementById('fxlnk_edit').value = misfxlnk[row -1].fixlink;
    document.getElementById('vinculo_edit').value = misfxlnk[row -1].vinculo;
    document.getElementById('vinculo_edit').focus();
    document.getElementById('clave_edit').value = "";

    rowmodificado = row -1; 

}




//handler botones edición y borrado para hacer visible div

/* const btnedit = this.document.querySelector('#btn_edit');
const btndelete = this.document.querySelector('#btn_delete');

btnedit.addEventListener('click', () =>{
    x = document.getElementById("editfxlnk");
    if (x.style.display === "none") {
    x.style.display = "block";
    }

    x = document.getElementById("delfxlnk");
    if (x.style.display === "block") {
    x.style.display = "none";
    }
});

btndelete.addEventListener('click', () =>{
    x = document.getElementById("delfxlnk");
    if (x.style.display === "none") {
    x.style.display = "block";
    }

    x = document.getElementById("editfxlnk");
    if (x.style.display === "block") {
    x.style.display = "none";
    }
}); */

