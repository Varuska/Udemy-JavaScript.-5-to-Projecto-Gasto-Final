// Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//Eventos
eventListeners()
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}



//Classes
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto) //Para verificar si es un numero
        this.restante = Number(presupuesto)
        this.gastos = []
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];// express operator
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0) //reduce es para cumular los valores en un gran total.
        this.restante = this.presupuesto - gastado;

    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id );
       this.calcularRestante();
    }

}

class UI {
    insertarPresupuesto(cantidad) {
        // Extrayendo los valores
        const { presupuesto, restante } = cantidad;


        //Agregar al html
        document.querySelector('#total').textContent = presupuesto;

        document.querySelector('#restante').textContent = restante;
    }

    //Imprimir alerta
    //va a utilizar dos parametros 'mensaje y 'tipo ' de mensaje
    imprimirAlerta(mensaje, tipo) {
        // crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success')
        }

        //Mensaje de error
        divMensaje.textContent = mensaje;

        //Insertar en el html
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        //Quitar del html
        setTimeout(() => {
            divMensaje.remove()
        }, 3000)
    }

    mostrarGastos(gastos) {

        this.limpiarHTML(); //Elimina el html previo

        //Iterar sobre los gastos
        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;

            //Crear un Li

            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            console.log(nuevoGasto)


            //Diferencia entre classNAme y classList, ClassList reporta que clases hay y con .add y .remove: se agregan y se quitan clases. className solamente se reportan las clases que hay y se pueden asignar valores diferentes



            //Agregar un html del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad}</span>`;

            //Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            btnBorrar.innerHTML = 'Borrar &time'

            nuevoGasto.appendChild(btnBorrar);

            //Agregar al html

            gastoListado.appendChild(nuevoGasto);
        })
    }
    limpiarHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
    actualizarREstante(restante) {
        document.querySelector('#restante').textContent = restante;
    }
    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector('.restante')
        //comprobar 25%
        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger')
        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning')
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success')
        }

        //Si el total es 0 o menor
        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');

            formulario.querySelector('button[type="submit"]').disable = true;
        }
    }

}

//Instanciar
const ui = new UI();

let presupuesto;



//funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('Qual es tu presupuesto');

    console.log(Number(presupuestoUsuario));

    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();//Esto es para cargar de nuevo el prompt
    }

    // Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto)

    ui.insertarPresupuesto(presupuesto)
}

//Añade Gastos

function agregarGasto(e) {
    e.preventDefault();

    //Leer los datos del formualrio
    const nombre = document.querySelector('#gasto').value;

    const cantidad = Number(document.querySelector('#cantidad').value);

    //Validar 
    //Campos vacios
    if (nombre === '' || cantidad === '') {
        //Llamar la funcion imprimir alerta
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
    } else if (cantidad <= 0 || isNaN(cantidad)) { //isNan Para asegurar que es un numero que se esta agregando
        ui.imprimirAlerta('Cantidad no Valida', 'error')

        return;
    }
    //Generar un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now() } // Object Literal , Une nombre y cantidad a gasto
    /*    const { nombre, cantidad} = gasto, destructuring , Extraen nombre y cantidad de gasto */

    //añade nuevo gasto
    presupuesto.nuevoGasto(gasto);

    //Mensaje de todo bien
    ui.imprimirAlerta('Gasto Agregado correctamente');

    //Imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarREstante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //Reinicia el formulario
    formulario.reset();
}

function eliminarGasto(id) {
    //Elimina del objeto
    presupuesto.eliminarGasto(id)

    //Elimina los gastos del html
    const { gastos, restante } = presupuesto
    ui.mostrarGastos( gastos )

    ui.actualizarREstante(restante);

    ui.comprobarPresupuesto(presupuesto)
}