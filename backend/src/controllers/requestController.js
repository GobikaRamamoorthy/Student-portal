const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const requestModel = require('../models/requestModel');
const studentModel = require('../models/studentModel');
const academicModel = require('../models/academicModel');

/** Academic fields a student may request to change. */
const REQUESTABLE_FIELDS = ['cgpa', 'backlogs', 'currentBacklogs', 'marksheetUrl', 'clearanceDate'];

/** POST /api/requests  (student) */
const create = asyncHandler(async (req, res) => {
  const student = studentModel.findByUserId(req.user.id);
  if (!student) throw ApiError.notFound('Student profile not found');

  const { semester, field, requestedValue, reason } = req.body;

  if (!REQUESTABLE_FIELDS.includes(field)) {
    throw ApiError.badRequest(`Field "${field}" cannot be requested for change`);
  }

  const record = academicModel.findOne(student.id, semester);
  if (!record) throw ApiError.notFound(`No academic record for semester ${semester}`);

  const created = requestModel.create({
    studentId: student.id,
    studentName: student.name,
    rollNo: student.rollNo,
    branch: student.branch,
    section: student.section,
    semester: Number(semester),
    field,
    currentValue: record[field] ?? null,
    requestedValue,
    reason: reason || '',
  });

  res.status(201).json({ success: true, request: created });
});

/** GET /api/requests  (student: own | admin: all, filter by ?status=) */
const list = asyncHandler(async (req, res) => {
  let requests;
  if (req.user.role === 'admin') {
    requests = requestModel.findByStatus(req.query.status);
  } else {
    const student = studentModel.findByUserId(req.user.id);
    requests = student ? requestModel.findByStudentId(student.id) : [];
  }
  res.json({ success: true, requests });
});

/** PATCH /api/requests/:id  (admin) — body: { action: 'accept' | 'reject' } */
const resolve = asyncHandler(async (req, res) => {
  const { action } = req.body;
  const request = requestModel.findById(req.params.id);
  if (!request) throw ApiError.notFound('Request not found');
  if (request.status !== requestModel.STATUS.PENDING) {
    throw ApiError.conflict('Request has already been resolved');
  }

  if (action === 'accept') {
    academicModel.update(request.studentId, request.semester, {
      [request.field]: request.requestedValue,
    });
  }

  const updated = requestModel.update(request.id, {
    status: action === 'accept' ? requestModel.STATUS.ACCEPTED : requestModel.STATUS.REJECTED,
    resolvedAt: new Date().toISOString(),
    resolvedBy: req.user.email,
  });

  res.json({ success: true, request: updated });
});

module.exports = { create, list, resolve };
