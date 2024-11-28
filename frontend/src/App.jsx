import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const App = () => {
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState({ name: '', position: '', salary: '', city: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false); // To control when to show the form

    // Fetch employees
    const fetchEmployees = async () => {
        const { data } = await axios.get('http://localhost:5008/employees');
        setEmployees(data);
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Add or Update employee
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.id) {
            await axios.put(`http://localhost:5008/employees/${form.id}`, form);
        } else {
            await axios.post('http://localhost:5008/employees', form);
        }
        setForm({ name: '', position: '', salary: '', city: '' });
        setShowForm(false); // Hide the form after submit
        fetchEmployees();
    };

    // Delete employee
    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5008/employees/${id}`);
        fetchEmployees();
    };

    // Set form for update
    const handleEdit = (employee) => {
        setForm(employee);
        setShowForm(true); // Show the form when editing an employee
    };

    // Filter employees based on search query
    const filteredEmployees = employees.filter((emp) => {
        return (
            emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.city.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // Cancel form
    const handleCancel = () => {
        setForm({ name: '', position: '', salary: '', city: '' });
        setShowForm(false); // Close the form
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-center">Employee Management</h1>

            {/* Search Bar */}
       {/* Search Bar */}
<div className="mt-12 flex justify-center">
    <div className="relative">
        <input
            type="text"
            placeholder="Search by Name or City"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 pl-10 rounded-lg"
        />
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 5a6 6 0 100 12 6 6 0 000-12z"
            />
        </svg>
    </div>
    <button
        onClick={() => setSearchQuery('')}
        className="bg-blue-500 text-white p-2 ml-2 rounded-lg"
    >
        Reset
    </button>
</div>


            {/* Add Button */}
            <div className="text-center mt-8">
                <button
                    onClick={() => setShowForm(true)} // Show the form on click
                    className="bg-green-500 text-white p-2"
                >
                    Add Employee
                </button>
            </div>

            {/* Form to Add/Update Employee */}
            {showForm && (
           <div className="flex justify-center items-center fixed inset-0 bg-gray-500 bg-opacity-50 z-10">
           <form
               className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-lg lg:max-w-2xl z-10p;"
               onSubmit={handleSubmit}
           >
               <h2 className="text-xl font-bold mb-4 text-center">
                   {form.id ? 'Edit Employee' : 'Add Employee'}
               </h2>
       
               <div className="mb-4">
                   <label className="block text-sm md:text-base font-medium">Name:</label>
                   <input
                       type="text"
                       placeholder="Name"
                       value={form.name}
                       onChange={(e) => setForm({ ...form, name: e.target.value })}
                       className="border p-2 w-full rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                   />
               </div>
               <div className="mb-4">
                   <label className="block text-sm md:text-base font-medium">Position:</label>
                   <input
                       type="text"
                       placeholder="Position"
                       value={form.position}
                       onChange={(e) => setForm({ ...form, position: e.target.value })}
                       className="border p-2 w-full rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                   />
               </div>
               <div className="mb-4">
                   <label className="block text-sm md:text-base font-medium">Salary:</label>
                   <input
                       type="number"
                       placeholder="Salary"
                       value={form.salary}
                       onChange={(e) => setForm({ ...form, salary: e.target.value })}
                       className="border p-2 w-full rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                   />
               </div>
               <div className="mb-4">
                   <label className="block text-sm md:text-base font-medium">City:</label>
                   <input
                       type="text"
                       placeholder="City"
                       value={form.city}
                       onChange={(e) => setForm({ ...form, city: e.target.value })}
                       className="border p-2 w-full rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                   />
               </div>
               <div className="flex flex-col md:flex-row gap-4 justify-between">
                   <button
                       type="submit"
                       className="bg-blue-500 text-white p-2 rounded-lg w-full md:w-1/2 lg:w-1/3"
                   >
                       {form.id ? 'Update' : 'Add'}
                   </button>
                   <button
                       type="button"
                       onClick={handleCancel}
                       className="bg-gray-500 text-white p-2 rounded-lg w-full md:w-1/2 lg:w-1/3"
                   >
                       Cancel
                   </button>
               </div>
           </form>
       </div>
       
            )}

            {/* Employee Table */}
            <div className="overflow-x-auto mt-8  " >
                <table className="table-auto w-3/4     mx-auto"  >
                    <thead>
                        <tr>
                            <th className="border px-4 py-2"id='bor' >Name</th>
                            <th className="border px-4 py-2" id='bor'>Position</th>
                            <th className="border px-4 py-2" id='bor'>Salary</th>
                            <th className="border px-4 py-2" id='bor'>City</th>
                            <th className="border px-4 py-2 w-28" id='bor'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((emp) => (
                            <tr key={emp.id}>
                                <td className="border px-4 py-2"id='bor'>{emp.name}</td>
                                <td className="border px-4 py-2" id='bor'>{emp.position}</td>
                                <td className="border px-4 py-2"id='bor'>{emp.salary}</td>
                                <td className="border px-4 py-2"id='bor'>{emp.city}</td>
                                <td className="border px-4 py-2 flex"id='bor'>
                                <button
    onClick={() => handleEdit(emp)}
    className="bg-yellow-500 text-white p-2 mr-4 flex items-center relative group overflow-hidden"
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:translate-y-full"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 3H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V9l-5-5zm1 7V4.5L17.5 9H12z"
        />
    </svg>
    <span className="relative z-10 group-hover:animate-pulse">Edit</span>
    <div className="absolute inset-0 bg-yellow-600 transition-transform duration-300 transform translate-x-full group-hover:translate-x-0"></div>
</button>

                                    <button
  onClick={() => handleDelete(emp.id)} // This will trigger the handleDelete function
  className="group relative flex h-14 w-14 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-red-800 bg-red-400 hover:bg-red-600 "
>
  {/* First SVG Icon */}
  <svg
    viewBox="0 0 1.625 1.625"
    className="absolute -top-7 fill-white delay-100 group-hover:top-6 group-hover:animate-[spin_1.4s] group-hover:duration-1000"
    height="15"
    width="15"
  >
    <path
      d="M.471 1.024v-.52a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099h-.39c-.107 0-.195 0-.195-.195"
    />
    <path
      d="M1.219.601h-.163A.1.1 0 0 1 .959.504V.341A.033.033 0 0 0 .926.309h-.26a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099v-.39a.033.033 0 0 0-.032-.033"
    />
    <path
      d="m1.245.465-.15-.15a.02.02 0 0 0-.016-.006.023.023 0 0 0-.023.022v.108c0 .036.029.065.065.065h.107a.023.023 0 0 0 .023-.023.02.02 0 0 0-.007-.016"
    />
  </svg>

  {/* Second SVG Icon */}
  <svg
    width="16"
    fill="none"
    viewBox="0 0 39 7"
    className="origin-right duration-500 group-hover:rotate-90"
  >
    <line strokeWidth="4" stroke="white" y2="5" x2="39" y1="5"></line>
    <line
      strokeWidth="3"
      stroke="white"
      y2="1.5"
      x2="26.0357"
      y1="1.5"
      x1="12"
    ></line>
  </svg>

  {/* Third SVG Icon */}
  <svg
    width="16"
    fill="none"
    viewBox="0 0 33 39"
    className=""
  >
    <mask fill="white" id="path-1-inside-1_8_19">
      <path
        d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"
      />
    </mask>
    <path
      mask="url(#path-1-inside-1_8_19)"
      fill="white"
      d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
    />
    <path strokeWidth="4" stroke="white" d="M12 6L12 29"></path>
    <path strokeWidth="4" stroke="white" d="M21 6V29"></path>
  </svg>
</button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default App;
