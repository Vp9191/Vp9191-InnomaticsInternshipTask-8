import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStudents, deleteStudent } from '../redux/studentSlice'; // action to fetch students
import { Link } from 'react-router-dom';

const StudentList = () => {
  const dispatch = useDispatch();
  const { list: students, status, error } = useSelector((state) => state.students);

  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    if (status === 'idle') {
        dispatch(fetchStudents());
    }
}, [dispatch, status]);

console.log('Students:', students);
console.log('Status:', status);
console.log('Error:', error);


if (status === 'loading') {
    return <div>Loading...</div>;
}

if (status === 'failed') {
    return <div>Error loading students.</div>;
}

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;

  const currentStudents = students
    .filter((student) => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((student) => 
      classFilter ? student.class === classFilter : true
    )
    .sort((a, b) => {
      if (sortKey === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortKey === 'class') {
        return a.class.localeCompare(b.class);
      }
      return 0;
    })
    .slice(indexOfFirstStudent, indexOfLastStudent);

  const totalPages = Math.ceil(students.length / studentsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this student?");
    if (confirmed) {
      dispatch(deleteStudent(id));
    }
  };

  return (
    <div className="container my-5 cust-container">
      <h2 className="text-center mb-4 fw-bold">STUDENT LIST</h2>
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name"
        className="form-control my-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filter Dropdown */}
      <select
        className="form-select mb-3"
        value={classFilter}
        onChange={(e) => setClassFilter(e.target.value)}
      >
        <option value="">Filter by Class</option>
        <option value="10th Grade">10th Grade</option>
        <option value="11th Grade">11th Grade</option>
        <option value="12th Grade">12th Grade</option>
      </select>

      {/* Sort Dropdown */}
      <select
        className="form-select mb-3"
        value={sortKey}
        onChange={(e) => setSortKey(e.target.value)}
      >
        <option value="">Sort By</option>
        <option value="name">Name</option>
        <option value="class">Class</option>
      </select>

      {/* Table of Students */}
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Class</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.class}</td>
              <td className="py-2">
              <div class="btn-group" role="group" aria-label="Basic outlined example">
              <Link to={`/students/${student.id}`} className="btn btn-outline-info btn-sm fw-bold ">
                  View
                </Link>
                <Link to={`/edit-student/${student.id}`} className="btn btn-outline-warning btn-sm  fw-bold">
                  Edit
                </Link>
                <button
                  onClick={() => {
                    console.log('Deleting student with ID:', student.id); // Log the ID
                    handleDelete(student.id);
                  }}
                  className="btn btn-outline-danger btn-sm fw-bold ">
                  Delete
                </button>
              </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default StudentList;
