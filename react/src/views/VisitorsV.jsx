import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function VisitorsV() {
  const [visitors, setVisitors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newVisitor, setNewVisitor] = useState({ identificacion: '', fecha: '', hora: '', semestre: '', provincia: '' });
  const [visitorToEdit, setVisitorToEdit] = useState(null);
  const [visitorToDelete, setVisitorToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/visitors');
        setVisitors(response.data);
      } catch (error) {
        console.error("Error fetching visitors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  const handleAddVisitor = async (e) => {
    e.preventDefault();

    if (!newVisitor.identificacion || !newVisitor.fecha || !newVisitor.hora) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    try {
      setLoading(true);
      if (visitorToEdit) {
        // Actualizar visitante
        const response = await axios.put(`http://localhost:3000/api/visitors/${visitorToEdit.id}`, newVisitor);
        setVisitors(visitors.map((visitor) =>
          visitor.id === visitorToEdit.id ? { ...response.data } : visitor
        ));
        setVisitorToEdit(null);
      } else {
        // Agregar nuevo visitante
        const response = await axios.post('http://localhost:3000/api/visitors', { ...newVisitor, estado: 'Completado' });
        setVisitors([...visitors, response.data]);
      }
      resetForm();
    } catch (error) {
      console.error("Error al agregar/actualizar visitante:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewVisitor({ identificacion: '', fecha: '', hora: '', semestre: '', provincia: '' });
    setShowModal(false);
  };

  const handleEdit = (visitor) => {
    setNewVisitor(visitor);
    setVisitorToEdit(visitor);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setVisitorToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/api/visitors/${visitorToDelete}`);
      setVisitors((prev) => prev.filter((visitor) => visitor.id !== visitorToDelete));
      setVisitorToDelete(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting visitor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVisitor((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <style>{`
        table { width: 100%; border-collapse: collapse; background-color: #fff; margin-top: 20px; }
        th, td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        button { padding: 8px 12px; margin: 5px; cursor: pointer; border: none; border-radius: 4px; }
        button:hover { opacity: 0.8; }
        .add-button { background-color: #4CAF50; color: white; }
        .modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; }
        .modal-content { background-color: white; padding: 20px; border-radius: 5px; width: 90%; max-width: 400px; }
        .form-group input { width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; }
      `}</style>

      <h2>Gestión de Visitas</h2>
      <button className="add-button" onClick={() => { resetForm(); setShowModal(true); }}>Agregar Visitante</button>

      {loading && <p>Cargando...</p>}

      <table>
        <thead>
          <tr>
            <th>Identificación</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Semestre</th>
            <th>Provincia</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((visitor) => (
            <tr key={visitor.id}>
              <td>{visitor.identificacion}</td>
              <td>{visitor.fecha}</td>
              <td>{visitor.hora}</td>
              <td>{visitor.semestre}</td>
              <td>{visitor.provincia}</td>
              <td>{visitor.estado}</td>
              <td>
                <button onClick={() => handleEdit(visitor)}>✏️</button>
                <button onClick={() => handleDelete(visitor.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            {visitorToDelete === null ? (
              <>
                <h3>{visitorToEdit ? 'Editar Visitante' : 'Agregar Visitante'}</h3>
                <form onSubmit={handleAddVisitor}>
                  <div className="form-group"><input type="text" name="identificacion" placeholder="Identificación" value={newVisitor.identificacion} onChange={handleChange} required /></div>
                  <div className="form-group"><input type="text" name="fecha" placeholder="Fecha" value={newVisitor.fecha} onChange={handleChange} required /></div>
                  <div className="form-group"><input type="text" name="hora" placeholder="Hora" value={newVisitor.hora} onChange={handleChange} required /></div>
                  <div className="form-group"><input type="text" name="semestre" placeholder="Semestre" value={newVisitor.semestre} onChange={handleChange} required /></div>
                  <div className="form-group"><input type="text" name="provincia" placeholder="Provincia" value={newVisitor.provincia} onChange={handleChange} required /></div>
                  <button type="submit">{visitorToEdit ? 'Actualizar' : 'Guardar'}</button>
                  <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
                </form>
              </>
            ) : (
              <>
                <p>¿Estás seguro de eliminar este visitante?</p>
                <button onClick={() => setShowModal(false)}>Cancelar</button>
                <button onClick={confirmDelete}>Confirmar</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
