<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

    <!-- jQuery (required for Bootstrap's JavaScript plugins in older versions, and still commonly used) -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"
        integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>

    <!-- Bootstrap JavaScript Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous">
    </script>
    <script>
        function cargar() {
            try {
                let q = `
                    query GetUsuarios {
                        getUsuarios {
                            id
                            nombre
                            pass
                    }
                `;
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8080/graphql',
                    contentType: 'application/json',
                    timeout: 15000,
                    data: JSON.stringify({ query: q, variables : {} }),
                    succes: function(reponse) {
                        renderUsuariosTabla(response, "resultados"),
                        renderUsuariosSelect(response, "resultadosCombobox", "usuarios-select"),
                        renderUsuariosCards(reponse, "resultadosCards");
                    }

                })
            } catch ( e ) {
                alert(e.message);
            } 
        }
        function renderUsuariosTabla( response ) {
            const usuarios = response?.data?.getUsuarios ?? [];
            const container = document.getElementById(containerId);
            if ( !container) return;
            // Limpiarr los contenidos
            container.textContent = '';
            // comprobar a existencia de usuarios
            if ( usuarios.length === 0) {
                const p = document.createElement( 'p' );
                p.textContent = 'Sin Usuarios';
                container.appendChild( p );
                return p;
            }

            /*
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>nombre</th>
                            <th>pass</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr> 
                            <td> 98834892834 </td>
                            <td> Evelyn </td>
                            <td> 1234 </td>
                        </tr>
                    </tbody>
                </table>



            */
            
            // Crear tabla

            const table = document.createElement( 'table' ); // sin asignacion
            const thead = document.createElement('thead'); // sin asignacion
            const headerRow = document.createElement('tr');

            ['id', 'nombre', ' pass'].forEach( ( col ) => {
                const th = document.createElement('th');
                th.textContent = col;
                headerRow.appendChild(th);
            } );
            thead.appendChild( headerRow );
            table.appendChild( thead );
            
            const tbody = document.createElement('tbody');
            for ( const u of usuarios ) {
                const tr = document.createElement('tr');
                const tdId = document.createElement('td');
                tdId.textContent = u.id ?? '';

                
                const tdName = document.createElement('td');
                tdName.textContent = u.name ?? '';
                
                
                const tdPass = document.createElement('td');
                tdPass.textContent = u.pass ?? '';

                td.appendChild(tdId);
                td.appendChild(tdNombre);
                td.appendChild(tdPass);
                tbody.appendChild(tr);
            }
            table.appendChild(tbody) // Asignacion de tbody a table
            // Apicacion de etilos minimos

            table.style.borderCollapse = 'collapse';
            table.querySelectorAll('th','td').forEach((cell) => {
                cell.style.border = "1px solid #ccc";
                cell.style.padding= '6px 8px';

            });
            container.appendChild( table );
        }

        function renderUsuariosSelect( response, containerId, selectId) {
            const usuarios = response?.data?.getUsuarios ?? [];
            const container = document.getElementById(containerId);
            if ( !container) return;
         
            const datosPrevio = container.querySelector(`#${CSS.escape(selectId)}`);
            if (datosPrevio ) datosPrevio.remove;
            /*
                <select>
                    <option disabled="true" selecte="true" value=''>Seleccione un usuario</option>
                    <option id>
                </select>
            */
            const select = document.createElement('select');
            select.id = selectId;
            select.name = 'usuarios';
            // placeholder
            const placeHolder = document.createElement('option');
            placeHolder.value= '';
            placeHolder.textContent = 'Seleccione un usuario';
            placeHolder.disabled = true;
            placeHolder.selected = true;
            select.appendChild( placeHolder ); // asignacion del pace holder al select
            // Opciones 
            for( const u of usuarios ) {
                const opt = document.createElement('option')

                opt.value = String( u?.id ?? '' );
                opt.textContent = ( u?.nombre ?? '' );
                select.appendChild( opt );
            }

            container.appendChild(select); // asignacion de select al div
        }

        function renderUsuariosCards ( response, containerId ) {
            const usuarios = response?.data?.getUsuarios ?? [];
   
            const container = document.getElementById( containerId );
            
            if ( !container) return;

            container.innerHTML = '';
            /* 
                <div id="resultadosCards">
                    <h2>Usuarios en formato Cards</h2>
                </div>
                <div class = "card"></div>
                <div class = "card-header">Sin datos</div>
                <div class = "card-body">No se encontraron usuarios para mostrar</div>
                <div class = "card-footer text-muted">10/11/2025</div>
            */
            const h2 = document.createElement('h2');
            h2.textContent = 'Usuarios en formato cards';
            container.appendChild( h2 );
            if ( !Array.isArray( usuarios ) || usuarios.lenght === 0 ) {
                // Caso en el que no haya datos
                const emptyCard = document.createElement('div');
                emptyCard.className = 'card' ;
                const header = document.createElement("div");
                header.className = 'card-header';
                header.textContent = 'Sin datos';


                const body = document.createElement('div');
                body.className = 'card-body';
                body.textContent = 'No se encontraron usuarios para mostrar';
                const footer = document.createElement('div');
                footer.className = 'card-footer text-muted';
                footer.textContent = new Date().toLocaleString();
                emptyCard.append( header,body, footer );
                container.appendChild( emptyCard ); 
                return;
            } 

            for ( const u of usuarios ) {
                const card = document.createElement('card');
                card.className = 'card mb-3 shadow-sm';
                
                const header = document.createElement("div");
                header.className = 'card-header';
                header.textContent = `${ u?.nombre ?? 'sin nombre'} (ID : ${u?.id ?? "-"})`;

                const body = document.createElement('div');
                body.className = 'card-body';
                const p = document.createElement('p');
                p.className = 'card-text';
                const passText = (u?.pass ?? '') === '' ? '-' : String(u.pass);
                p.innerHTML = `
                    <strong>Nombre:</strong>${ u?.nombre ?? "-" }<br>
                    <strong>ID:</strong> ${ u?.id ?? "-" }<br>
                    <strong>Pass:</strong> ${ passText }<br>

                `;
                body.appendChild( p );
                
                const footer = document.createElement('div');
                footer.className = 'card-footer text-muted';
                footer.textContent = "Actualizado: " + new Date().toLocaleString();
                card.append( header,body, footer );
                container.appendChild( card ); 
                return;
            }

         

        }
    </script>
</head>
<body onload="cargar();">
    <div id="resultados"></div>
    <div id="resultadosCombobox"></div>
    <div id = "resultadosCards"></div>

</body>

</html>