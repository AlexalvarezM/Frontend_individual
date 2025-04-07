// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';
import TablaProductos from '../components/productos/TablaProductos'; // Importa el componente de tabla
import ModalRegistroProducto from '../components/productos/ModalRegistroProducto';
import { Container, Button } from "react-bootstrap";

// Declaración del componente Productos
const Productos = () => {
  // Estados para manejar los datos, carga y errores
  const [listaProductos, setListaProductos] = useState([]); // Almacena los datos de la API
  const [listaCategorias, setListaCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);            // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null);        // Maneja errores de la petición
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: '',
    descripcion: '',
    categoria: '',
    precio_unitario: '',
    stock: ''
  });

  const obtenerProductos = async () => { // Método renombrado a español
    try {
      const respuesta = await fetch('http://localhost:3000/api/clientes');
      if (!respuesta.ok) {
        throw new Error('Error al cargar los productos');
      }
      const datos = await respuesta.json();
      setListaProductos(datos);    // Actualiza el estado con los datos
      setCargando(false);           // Indica que la carga terminó
    } catch (error) {
      setErrorCarga(error.message); // Guarda el mensaje de error
      setCargando(false);           // Termina la carga aunque haya error
    }
  };

  // Obtener clientes para el dropdown
  const obtenerCategorias = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/categorias');
      if (!respuesta.ok) throw new Error('Error al cargar los Clientes');
      const datos = await respuesta.json();
      setListaCategorias(datos);
    } catch (error) {
      setErrorCarga(error.message);
    }
  };

  // Lógica de obtención de datos con useEffect
  useEffect(() => {
    obtenerProductos();  
    obtenerCategorias();          // Ejecuta la función al montar el componente
  }, []);                           // Array vacío para que solo se ejecute una vez


// Maneja los cambios en los inputs del modal
const manejarCambioInput = (e) => {
  const { name, value } = e.target;
  setNuevoProducto(prev => ({
    ...prev,
    [name]: value
  }));
};

// Manejo la inserción de un nuevo producto
const agregarProducto = async () => {

  if (!nuevoProducto.nombre_producto|| !nuevoProducto.descripcion) {
  setErrorCarga("Por favor, completa todos los campos antes de guardar.");
  return;
  }

  try {
    const respuesta = await fetch('http://localhost:3000/api/registrarcategoria', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoProducto),
    });

    if (!respuesta.ok) {
      throw new Error('Error al agregar el producto');
    }

    await obtenerProductos(); // Refresca toda la lista desde el servidor
    setNuevoCliente({ nombre_producto: '', descripcion: '' });
    setMostrarModal(false);
    setErrorCarga(null);
  } catch (error) {
    setErrorCarga(error.message);
  }
};

  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <br />
        <h4>Productos</h4>
        <Button variant="primary" onClick={() => setMostrarModal(true)}>
          Nuevo Producto
        </Button>
        <br/><br/>

        {/* Pasa los estados como props al componente TablaProductos */}
        <TablaProductos
          productos={listaProductos} 
          cargando={cargando} 
          error={errorCarga} 
        />

        <ModalRegistroProducto
          mostrarModal={mostrarModal}
          setMostrarModal={setMostrarModal}
          nuevoProducto={nuevoProducto}
          manejarCambioInput={manejarCambioInput}
          agregarProducto={agregarProducto}
          errorCarga={errorCarga}
          categoria={listaCategorias}
        />
        
      </Container>
    </>
    
  );
};


// Exportación del componente
export default Productos;