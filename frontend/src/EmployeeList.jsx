import React, { useState, useEffect } from 'react';
import api from './api';
import { ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', job_title: '', country: '', salary: '' });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const response = await api.get('employees/');
      // for UI sake, just slice top 100 since there are 10,000
      setEmployees(response.data.slice(0, 100));
    } catch (error) {
      console.error("Failed to fetch employees", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`employees/${editingId}/`, formData);
      } else {
        await api.post('employees/', formData);
      }
      setFormData({ first_name: '', last_name: '', job_title: '', country: '', salary: '' });
      setEditingId(null);
      fetchEmployees();
    } catch (error) {
      console.error("Failed to save employee", error);
      alert("Failed to save employee. Please check the form data.");
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setFormData(emp);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`employees/${id}/`);
        fetchEmployees();
      } catch (error) {
        console.error("Failed to delete", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center text-blue-600 mb-6 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
        </button>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Employee</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div><label className="block text-sm">First Name</label><input required className="w-full border p-2 rounded" value={formData.first_name} onChange={e=>setFormData({...formData, first_name: e.target.value})} /></div>
            <div><label className="block text-sm">Last Name</label><input required className="w-full border p-2 rounded" value={formData.last_name} onChange={e=>setFormData({...formData, last_name: e.target.value})} /></div>
            <div><label className="block text-sm">Job Title</label><input required className="w-full border p-2 rounded" value={formData.job_title} onChange={e=>setFormData({...formData, job_title: e.target.value})} /></div>
            <div><label className="block text-sm">Country</label><input required className="w-full border p-2 rounded" value={formData.country} onChange={e=>setFormData({...formData, country: e.target.value})} /></div>
            <div><label className="block text-sm">Salary</label><input required type="number" className="w-full border p-2 rounded" value={formData.salary} onChange={e=>setFormData({...formData, salary: e.target.value})} /></div>
            <div className="md:col-span-5 flex justify-end space-x-2">
              {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({ first_name: '', last_name: '', job_title: '', country: '', salary: '' })}} className="px-4 py-2 border rounded">Cancel</button>}
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"><Plus className="h-4 w-4 mr-1" /> Save Employee</button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salary</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr> : 
                employees.map(emp => (
                  <tr key={emp.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{emp.first_name} {emp.last_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{emp.job_title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{emp.country}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${parseFloat(emp.salary).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button onClick={() => handleEdit(emp)} className="text-blue-600 hover:text-blue-900"><Edit2 className="h-4 w-4 inline" /></button>
                      <button onClick={() => handleDelete(emp.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4 inline" /></button>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 bg-gray-50 text-sm text-gray-500 text-center">Showing top 100 recent employees</div>
        </div>
      </div>
    </div>
  );
}
