import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { addEmployee } from '../services/employeeService';

const AddEmployee = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    course: '',
    gender: '',
  });
  const [image, setImage] = useState(null); // State to hold the selected image file
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Validate mobile number to only accept digits
    if (name === 'mobile' && value !== '' && !/^\d*$/.test(value)) return;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      // Only append the image if it is selected
      if (image) {
        data.append('image', image);
      }
      const result = await addEmployee(data);
      setSuccess('Employee added successfully!');
      setFormData({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        course: '',
        gender: '',
      });
      setImage(null);
      onAdd && onAdd(result.employee); // Pass the new employee to the onAdd callback
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Failed to add employee');
      console.error('Failed to add employee:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg relative">
      {/* 'X' button to close the modal */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
      <h2 className="text-2xl font-bold mb-4">Add Employee</h2>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name field */}
        <div>
          <label className="block text-gray-700">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Email field */}
        <div>
          <label className="block text-gray-700">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Mobile field */}
        <div>
          <label className="block text-gray-700">Mobile *</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            maxLength={15}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Designation field */}
        <div>
          <label className="block text-gray-700">Designation *</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Course field */}
        <div>
          <label className="block text-gray-700">Course *</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Gender field */}
        <div>
          <label className="block text-gray-700">Gender *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Image field */}
        <div>
          <label className="block text-gray-700">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Form buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Adding...' : 'Add Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

AddEmployee.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func,
};

export default AddEmployee;

