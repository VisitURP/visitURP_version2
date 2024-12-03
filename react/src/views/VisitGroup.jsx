import React, { useState, useEffect } from "react";
import axios from "axios";

export default function VisitGroup() {
  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    nameGroup: "",
    guide: "",
    dayOfVisit: "",
    quantity: "",
    educationalInstitution: "",
  });
  const [editingGroup, setEditingGroup] = useState(null);

  // API endpoints
  const API_BASE = "http://localhost/visitURP_version2/public/index.php/api";

  // Fetch groups
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${API_BASE}/getvisit-groups`);
      setGroups(response.data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  // Add a new group
  const addGroup = async () => {
    try {
      await axios.post(`${API_BASE}/visit-group/`, formData);
      fetchGroups();
      resetForm();
    } catch (error) {
      console.error("Error adding group:", error);
    }
  };

  // Delete a group
  const deleteGroup = async (id) => {
    try {
      await axios.delete(`${API_BASE}/delete-visitgroup/${id}`);
      fetchGroups();
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  // Update a group
  const updateGroup = async () => {
    try {
      await axios.put(
        `${API_BASE}/update-visitgroups/${editingGroup.id_visitgroup}`,
        formData
      );
      fetchGroups();
      resetForm();
    } catch (error) {
      console.error("Error updating group:", error);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      nameGroup: "",
      guide: "",
      dayOfVisit: "",
      quantity: "",
      educationalInstitution: "",
    });
    setEditingGroup(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingGroup) {
      updateGroup();
    } else {
      addGroup();
    }
  };

  const handleEdit = (group) => {
    setFormData({
      nameGroup: group.nameGroup,
      guide: group.guide,
      dayOfVisit: group.dayOfVisit.split(" ")[0], // Format date
      quantity: group.quantity,
      educationalInstitution: group.educationalInstitution,
    });
    setEditingGroup(group);
  };

  return (
    <div>
      <h1>Gestionar Grupos</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nameGroup"
          placeholder="Nombre del Grupo"
          value={formData.nameGroup}
          onChange={handleFormChange}
          required
        />
        <input
          type="text"
          name="guide"
          placeholder="Guía"
          value={formData.guide}
          onChange={handleFormChange}
          required
        />
        <input
          type="date"
          name="dayOfVisit"
          value={formData.dayOfVisit}
          onChange={handleFormChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Cantidad"
          value={formData.quantity}
          onChange={handleFormChange}
          required
        />
        <input
          type="text"
          name="educationalInstitution"
          placeholder="Institución Educativa"
          value={formData.educationalInstitution}
          onChange={handleFormChange}
          required
        />
        <button type="submit">{editingGroup ? "Actualizar" : "Agregar"}</button>
        {editingGroup && (
          <button type="button" onClick={resetForm}>
            Cancelar
          </button>
        )}
      </form>

      {/* Lista de Grupos */}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Guía</th>
            <th>Fecha</th>
            <th>Cantidad</th>
            <th>Institución</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr key={group.id_visitgroup}>
              <td>{group.nameGroup}</td>
              <td>{group.guide}</td>
              <td>{group.dayOfVisit.split(" ")[0]}</td>
              <td>{group.quantity}</td>
              <td>{group.educationalInstitution}</td>
              <td>
                <button onClick={() => handleEdit(group)}>Editar</button>
                <button onClick={() => deleteGroup(group.id_visitgroup)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
