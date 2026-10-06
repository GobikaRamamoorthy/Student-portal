/* eslint-disable no-console */
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const store = require('./config/dataStore');

const SALT_ROUNDS = 10;

function hash(plain) {
  return bcrypt.hashSync(plain, SALT_ROUNDS);
}

/** Build 8 semester records for a student given a profile of CGPAs/backlogs. */
function buildAcademics(studentId, profile) {
  const courses = [
    'Mathematics', 'Programming', 'Physics', 'Data Structures',
    'Databases', 'Operating Systems', 'Networks', 'Machine Learning',
  ];
  return Array.from({ length: 8 }).map((_, i) => {
    const semester = i + 1;
    const data = profile[i] || {};
    const released = data.cgpa !== undefined;
    return {
      id: uuid(),
      studentId,
      semester,
      primaryCourse: courses[i],
      cgpa: released ? data.cgpa : null,
      backlogs: data.backlogs ?? 0,
      currentBacklogs: data.currentBacklogs ?? 0,
      marksheetUrl: released ? `/marksheets/${studentId}-sem${semester}.pdf` : null,
      clearanceDate: data.clearanceDate ?? null,
      updatedAt: new Date().toISOString(),
    };
  });
}

function run() {
  const now = new Date().toISOString();

  // ---- Users (auth) -------------------------------------------------------
  const adminUserId = uuid();
  const aishaUserId = uuid();
  const rahulUserId = uuid();

  const users = [
    {
      id: adminUserId,
      role: 'admin',
      name: 'Portal Administrator',
      email: 'admin@zenstud.edu',
      passwordHash: hash('Admin@123'),
      createdAt: now,
    },
    {
      id: aishaUserId,
      role: 'student',
      name: 'Aisha Khan',
      email: 'aisha@zenstud.edu',
      passwordHash: hash('Student@1'),
      createdAt: now,
    },
    {
      id: rahulUserId,
      role: 'student',
      name: 'Rahul Verma',
      email: 'rahul@zenstud.edu',
      passwordHash: hash('Student@1'),
      createdAt: now,
    },
  ];

  // ---- Student profiles ---------------------------------------------------
  const aishaId = uuid();
  const rahulId = uuid();

  const students = [
    {
      id: aishaId,
      userId: aishaUserId,
      name: 'Aisha Khan',
      rollNo: 'CSE2021001',
      email: 'aisha@zenstud.edu',
      altEmail: 'aisha.k@gmail.com',
      phone: '9876543210',
      course: 'Bachelor of Technology',
      branch: 'Computer Science & Engineering',
      section: 'A',
      batch: '2021-2025',
      college: 'Zen Institute of Technology',
      gender: 'Female',
      dob: '2003-05-14',
      residentType: 'hosteller',
      address: '12 Rose Lane, Bengaluru, KA',
      fatherName: 'Imran Khan',
      motherName: 'Sana Khan',
      currentSemester: 7,
      currentYear: 4,
      resumeUrl: null,
      profilePicUrl: null,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: rahulId,
      userId: rahulUserId,
      name: 'Rahul Verma',
      rollNo: 'ECE2021045',
      email: 'rahul@zenstud.edu',
      altEmail: '',
      phone: '9123456780',
      course: 'Bachelor of Technology',
      branch: 'Electronics & Communication',
      section: 'B',
      batch: '2021-2025',
      college: 'Zen Institute of Technology',
      gender: 'Male',
      dob: '2003-11-02',
      residentType: 'day-scholar',
      address: '88 Park Street, Pune, MH',
      fatherName: 'Suresh Verma',
      motherName: 'Meena Verma',
      currentSemester: 7,
      currentYear: 4,
      resumeUrl: null,
      profilePicUrl: null,
      createdAt: now,
      updatedAt: now,
    },
  ];

  // ---- Academics ----------------------------------------------------------
  const academics = [
    ...buildAcademics(aishaId, [
      { cgpa: 9.1 }, { cgpa: 8.8 }, { cgpa: 9.3 }, { cgpa: 9.0 },
      { cgpa: 8.6, backlogs: 1, currentBacklogs: 0, clearanceDate: '2024-01-20' },
      { cgpa: 9.2 }, {}, {},
    ]),
    ...buildAcademics(rahulId, [
      { cgpa: 7.4 }, { cgpa: 7.1, backlogs: 2, currentBacklogs: 1 }, { cgpa: 7.8 },
      { cgpa: 8.0 }, { cgpa: 7.6 }, { cgpa: 8.1 }, {}, {},
    ]),
  ];

  // ---- Placement drives ---------------------------------------------------
  const placements = [
    {
      id: uuid(),
      company: 'Acme Cloud',
      role: 'Software Engineer',
      package: '12 LPA',
      driveDate: '2026-07-10',
      eligibility: 'CGPA >= 7.0, no active backlogs',
      location: 'Bengaluru',
      status: 'upcoming',
    },
    {
      id: uuid(),
      company: 'Nimbus Analytics',
      role: 'Data Analyst',
      package: '9 LPA',
      driveDate: '2026-07-22',
      eligibility: 'CGPA >= 7.5',
      location: 'Remote',
      status: 'upcoming',
    },
    {
      id: uuid(),
      company: 'Vertex Systems',
      role: 'Embedded Engineer',
      package: '10 LPA',
      driveDate: '2026-06-05',
      eligibility: 'ECE/EEE, CGPA >= 7.0',
      location: 'Hyderabad',
      status: 'completed',
    },
  ];

  // ---- A sample pending request ------------------------------------------
  const requests = [
    {
      id: uuid(),
      studentId: rahulId,
      studentName: 'Rahul Verma',
      rollNo: 'ECE2021045',
      branch: 'Electronics & Communication',
      section: 'B',
      semester: 2,
      field: 'currentBacklogs',
      currentValue: 1,
      requestedValue: 0,
      reason: 'Cleared the backlog in the supplementary exam.',
      status: 'pending',
      createdAt: now,
      resolvedAt: null,
    },
  ];

  store.write('users', users);
  store.write('students', students);
  store.write('academics', academics);
  store.write('placements', placements);
  store.write('requests', requests);

  console.log('✅ Seed complete.');
  console.log(`   Users:      ${users.length}`);
  console.log(`   Students:   ${students.length}`);
  console.log(`   Academics:  ${academics.length}`);
  console.log(`   Placements: ${placements.length}`);
  console.log(`   Requests:   ${requests.length}`);
  console.log('\n   Login with admin@zenstud.edu / Admin@123  or  aisha@zenstud.edu / Student@1');
}

run();
