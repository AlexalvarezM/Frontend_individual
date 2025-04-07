// Importaciones necesarias para la vista
import React, { useState, useEffect } from 'react';
import TablaClientes from '../components/clientes/TablaClientes'; // Importa el componente de tabla
import CuadroBusquedas from '../components/busquedas/CuadroBusquedas';
import { Container, Button, Row, Col } from "react-bootstrap";

// Declaración del componente Categorias
const Clientes = () => {
  // Estados para manejar los datos, carga y errores
  const [listaClientes, setListaClientes] = useState([]); // Almacena los datos de la API
  const [cargando, setCargando] = useState(true);            // Controla el estado de carga
  const [errorCarga, setErrorCarga] = useState(null);        // Maneja errores de la petición

  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  // Lógica de obtención de datos con useEffect
  useEffect(() => {
    const obtenerClientes = async () => { // Método renombrado a español
      try {
        const respuesta = await fetch('http://localhost:3000/api/clientes');
        if (!respuesta.ok) {
          throw new Error('Error al cargar los clientes');
        }
        const datos = await respuesta.json();
        setListaClientes(datos);    // Actualiza el estado con los datos
        setClientesFiltrados(datos);
        setCargando(false);           // Indica que la carga terminó
      } catch (error) {
        setErrorCarga(error.message); // Guarda el mensaje de error
        setCargando(false);           // Termina la carga aunque haya error
      }
    };
    obtenerClientes();            // Ejecuta la función al montar el componente
  }, []);    

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    
    const filtradas = listaClientes.filter(
      (clientes) =>
        clientes.nombre.toLowerCase().includes(texto) ||
        clientes.apellido.toLowerCase().includes(texto) ||
        clientes.celular.toLowerCase().includes(texto) ||
        clientes.direccion.toLowerCase().includes(texto)
    );
    setClientesFiltrados(filtradas);
  };                     // Array vacío para que solo se ejecute una vez

  // Renderizado de la vista
  return (
    <>
      <Container className="mt-5">
        <br />
        <h3>Clientes</h3>

        <Row>
    <Col lg={2} md={4} sm={4} xs={5}>
      <Button variant="primary" onClick={() => setMostrarModal(true)} style={{ width: "100%" }}>
        Nuevo Cliente
      </Button>
    </Col>
    <Col lg={5} md={8} sm={8} xs={7}>
      <CuadroBusquedas
        textoBusqueda={textoBusqueda}
        manejarCambioBusqueda={manejarCambioBusqueda}
      />
    </Col>
  </Row>

        {/* Pasa los estados como props al componente TablaCategorias */}
        <TablaClientes
          clientes={clientesFiltrados}
          cargando={cargando}
          error={errorCarga}
        />
      </Container>
    </>
  );
};

// Exportación del componente
export default Clientes;