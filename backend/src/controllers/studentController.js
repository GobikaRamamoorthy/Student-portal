const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const studentModel = require('../models/studentModel');
const academicModel = require('../models/academicModel');

/** Fields a student is allowed to edit on their own profile. */
const EDITABLE_FIELDS = [
  'name',
  'phone',
  'altEmail',
  'gender',
  'dob',
  'residentType',
  'address',
  'fatherName',
  'motherName',
  'resumeUrl',
];

function currentStudent(req) {
  const student = studentModel.findByUserId(req.user.id);
  if (!student) throw ApiError.notFound('Student profile not found');
  return student;
}

/** GET /api/students/me */
const getProfile = asyncHandler(async (req, res) => {
  const student = currentStudent(req);
  const academics = academicModel.findByStudentId(student.id);
  res.json({ success: true, student, academics });
});

/** PUT /api/students/me */
const updateProfile = asyncHandler(async (req, res) => {
  const student = currentStudent(req);

  const patch = {};
  for (const field of EDITABLE_FIELDS) {
    if (req.body[field] !== undefined) patch[field] = req.body[field];
  }

  const updated = studentModel.update(student.id, patch);
  res.json({ success: true, student: updated });
});

/** GET /api/students/me/academics */
const getAcademics = asyncHandler(async (req, res) => {
  const student = currentStudent(req);
  res.json({ success: true, academics: academicModel.findByStudentId(student.id) });
});

/** GET /api/students/me/report — consolidated profile + academics summary */
const getReport = asyncHandler(async (req, res) => {
  const student = currentStudent(req);
  const academics = academicModel.findByStudentId(student.id);

  const totalBacklogs = academics.reduce((sum, a) => sum + (a.backlogs || 0), 0);
  const currentBacklogs = academics.reduce((sum, a) => sum + (a.currentBacklogs || 0), 0);
  const graded = academics.filter((a) => typeof a.cgpa === 'number');
  const cgpa = graded.length
    ? Number((graded.reduce((s, a) => s + a.cgpa, 0) / graded.length).toFixed(2))
    : null;

  res.json({
    success: true,
    student,
    academics,
    summary: { cgpa, totalBacklogs, currentBacklogs, semestersCompleted: graded.length },
  });
});

module.exports = { getProfile, updateProfile, getAcademics, getReport };
