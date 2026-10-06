const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const studentModel = require('../models/studentModel');
const academicModel = require('../models/academicModel');
const requestModel = require('../models/requestModel');

/** GET /api/admin/students?q= */
const searchStudents = asyncHandler(async (req, res) => {
  const students = studentModel.search(req.query.q);
  res.json({ success: true, count: students.length, students });
});

/** GET /api/admin/students/:id — full report for any student */
const studentReport = asyncHandler(async (req, res) => {
  const student = studentModel.findById(req.params.id);
  if (!student) throw ApiError.notFound('Student not found');

  const academics = academicModel.findByStudentId(student.id);
  const graded = academics.filter((a) => typeof a.cgpa === 'number');
  const cgpa = graded.length
    ? Number((graded.reduce((s, a) => s + a.cgpa, 0) / graded.length).toFixed(2))
    : null;

  res.json({
    success: true,
    student,
    academics,
    summary: {
      cgpa,
      totalBacklogs: academics.reduce((s, a) => s + (a.backlogs || 0), 0),
      currentBacklogs: academics.reduce((s, a) => s + (a.currentBacklogs || 0), 0),
    },
  });
});

/** GET /api/admin/stats — dashboard counters */
const stats = asyncHandler(async (req, res) => {
  const students = studentModel.all();
  const requests = requestModel.all();
  res.json({
    success: true,
    stats: {
      totalStudents: students.length,
      pendingRequests: requests.filter((r) => r.status === requestModel.STATUS.PENDING).length,
      acceptedRequests: requests.filter((r) => r.status === requestModel.STATUS.ACCEPTED).length,
      rejectedRequests: requests.filter((r) => r.status === requestModel.STATUS.REJECTED).length,
    },
  });
});

module.exports = { searchStudents, studentReport, stats };
