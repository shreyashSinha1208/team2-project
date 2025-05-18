import mongoose from 'mongoose';
import Course from '../models/courseModel.js';
import User from '../models/User.js';



export const getAllCourses = async (req, res) => {
  try {
    const { permissions } = req.policy;
    const actions = permissions.flatMap(p => p.actions);
    if (!actions.includes('viewCourse')) {
      return res.status(403).json({ message: 'Access denied: cannot read courses' });
    }

    const courses = await Course.find().populate('teacher students');
    return res.json(courses);
  } catch (err) {
    console.error('getAllCourses error:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};


export const createCourse = async (req, res) => {
  try {
    const { permissions } = req.policy;
    const actions = permissions.flatMap(p => p.actions);
    if (!actions.includes('publish')) {
      return res.status(403).json({ message: 'Access denied: cannot create course' });
    }

    const { name, description, teacher } = req.body;

    // ✅ Validate ObjectId format before using it
    if (!mongoose.Types.ObjectId.isValid(teacher)) {
      return res.status(400).json({ message: 'Invalid teacher ID format. Expected a 24-character ObjectId.' });
    }

    const teacherUser = await User.findById(teacher);
    if (!teacherUser) {
      return res.status(404).json({ message: 'Teacher not found with the provided ID.' });
    }

    const course = new Course({ name, description, teacher });
    await course.save();
    return res.status(201).json(course);
  } catch (err) {
    console.error('createCourse error:', err);

    // 🛠️ Handle known Mongoose CastError (e.g. malformed IDs)
    if (err.name === 'CastError') {
      return res.status(400).json({
        message: `Invalid value for ${err.path}: ${err.value}. Expected a valid MongoDB ObjectId.`,
      });
    }

    // 🔁 Generic error fallback
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
// Delete a course (requires 'unpublish' permission)
export const deleteCourse = async (req, res) => {
  try {
    const { permissions } = req.policy;
    const actions = permissions.flatMap(p => p.actions);
    if (!actions.includes('unpublish')) {
      return res.status(403).json({ message: 'Access denied: cannot delete course' });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    return res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error('deleteCourse error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Assign students to course (requires 'assign_students' permission)
export const assignStudentsToCourse = async (req, res) => {
  try {
    const { permissions } = req.policy;
    const actions = permissions.flatMap(p => p.actions);
    if (!actions.includes('assign_students')) {
      return res.status(403).json({ message: 'Access denied: cannot assign students' });
    }

    const { id } = req.params;
    const { studentIds } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const validStudents = await User.find({
      _id: { $in: studentIds.filter(mongoose.Types.ObjectId.isValid) }
    });

    if (validStudents.length !== studentIds.length) {
      return res.status(400).json({ message: 'One or more student IDs are invalid' });
    }

    course.students = Array.from(new Set([
      ...course.students.map(id => id.toString()),
      ...studentIds
    ]));

    await course.save();
    await course.populate('students teacher');

    return res.json(course);
  } catch (err) {
    console.error('assignStudents error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
