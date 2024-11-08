import express from 'express';
import Employee from '../models/Employee.js';
import multer from 'multer';

const router = express.Router();

// Get all employees with search, pagination, and sorting
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortField = 'createDate', sortOrder = 'asc' } = req.query;

    let query = {};

    if (search.trim() !== '') {
      const searchWords = search.trim().split(/\s+/);
      query = {
        $or: searchWords.map((word) => ({
          name: { $regex: word, $options: 'i' },
        })),
      };
    }

    const totalEmployees = await Employee.countDocuments(query);
    const totalActiveEmployees = await Employee.countDocuments({ ...query, active: true });

    const employees = await Employee.find(query)
      .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ employees, totalEmployees, totalActiveEmployees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Failed to fetch employees', error: error.message });
  }
});

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // specify directory for storing images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // set a unique filename
  },
});

const upload = multer({ storage });

// Create a new employee with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, email, mobile, designation, gender, course } = req.body;
    const imagePath = req.file ? req.file.path : ''; // get the path of uploaded image

    // Create a new Employee instance with the uploaded image path
    const newEmployee = new Employee({
      name,
      email,
      mobile,
      designation,
      gender,
      course,
      image: imagePath, // store image path in the database
    });

    await newEmployee.save();
    res.status(201).json({
      message: 'Employee added successfully',
      employee: newEmployee, // Return the new employee data
    });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(400).json({ message: 'Failed to add employee', error: error.message });
  }
});

// Get an employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Failed to fetch employee', error: error.message });
  }
});

// Update an employee by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Failed to update employee', error: error.message });
  }
});

// Toggle active status
router.put('/:id/active', async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.active = !employee.active;
    await employee.save();

    res.json({ message: 'Employee status updated', active: employee.active });
  } catch (error) {
    console.error('Error toggling employee status:', error);
    res.status(500).json({ message: 'Failed to toggle employee status', error: error.message });
  }
});

// Delete an employee by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Failed to delete employee', error: error.message });
  }
});

export default router;
