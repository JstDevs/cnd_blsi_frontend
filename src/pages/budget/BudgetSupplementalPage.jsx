import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/common/Modal';
import BudgetSupplementalForm from '@/components/forms/BudgetSupplementalForm';
import { toast } from 'react-hot-toast';
import DataTable from '@/components/common/DataTable';
import { useEffect } from 'react';
import { fetchDepartments } from '@/features/settings/departmentSlice';
import { fetchSubdepartments } from '@/features/settings/subdepartmentSlice';
import { fetchAccounts } from '@/features/settings/chartOfAccountsSlice';

const BudgetSupplementalPage = () => {
  const dispatch = useDispatch();

  const { departments, isLoading } = useSelector((state) => state.departments);
  const { subdepartments, isLoading: subdepartmentsLoading } = useSelector(
    (state) => state.subdepartments
  );
  const chartOfAccounts = useSelector(
    (state) => state.chartOfAccounts?.accounts || []
  );
  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchSubdepartments());
    dispatch(fetchAccounts());
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);

  const [filters, setFilters] = useState({
    department: '',
    subDepartment: '',
    chartOfAccounts: '',
  });

  const handleEdit = (row) => {
    setActiveRow(row);
    setIsModalOpen(true);
  };

  const handleDelete = (row) => {
    toast.success(`Deleted ${row.Name}`);
    // dispatch(deleteSupplemental(row.id)); // real call
  };

  const handleSubmit = (formValues) => {
    if (activeRow) {
      toast.success('Supplemental updated successfully');
    } else {
      toast.success('New supplemental added');
    }
    setIsModalOpen(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const columns = [
    { key: 'Name', header: 'Name', sortable: true },
    { key: 'FiscalYear', header: 'Fiscal Year', sortable: true },
    { key: 'Department', header: 'Department', sortable: true },
    { key: 'SubDepartment', header: 'Sub Department', sortable: true },
    { key: 'ChartOfAccounts', header: 'Chart of Accounts', sortable: true },
    { key: 'Fund', header: 'Fund', sortable: true },
    { key: 'Project', header: 'Project', sortable: true },
    { key: 'Appropriation', header: 'Appropriation', sortable: true },
    {
      key: 'AppropriationBalance',
      header: 'Appropriation Balance',
      sortable: true,
    },
    { key: 'TotalAmount', header: 'Total Amount', sortable: true },
    { key: 'Allotment', header: 'Allotment', sortable: true },
    { key: 'AllotmentBalance', header: 'Allotment Balance', sortable: true },
  ];

  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEdit,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDelete,
      className:
        'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
    },
  ];

  const allData = [
    {
      Name: 'Travelling E...',
      FiscalYear: 'january to d...',
      Department: 'Municipal Di...',
      SubDepartment: 'Network Op...',
      ChartOfAccounts: 'Travelling E...',
      Fund: 'General Fund',
      Project: 'No Project',
      Appropriation: '1,00,000.00',
      AppropriationBalance: '-8,45,000.00',
      TotalAmount: '1,55,000.00',
      Allotment: '1,00,000.00',
      AllotmentBalance: '1,00,000.00',
    },
    {
      Name: 'Investments',
      FiscalYear: 'feb aug',
      Department: 'Accounting',
      SubDepartment: 'Payroll',
      ChartOfAccounts: 'Investments',
      Fund: 'General Fund',
      Project: 'No Project',
      Appropriation: '60,000.00',
      AppropriationBalance: '60,000.00',
      TotalAmount: '60,000.00',
      Allotment: '0.00',
      AllotmentBalance: '0.00',
    },
    // ... more
  ];

  // Apply filters to data
  const filteredData = allData.filter((item) => {
    return (
      (!filters.department || item.Department === filters.department) &&
      (!filters.subDepartment ||
        item.SubDepartment === filters.subDepartment) &&
      (!filters.chartOfAccounts ||
        item.ChartOfAccounts === filters.chartOfAccounts)
    );
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Budget Supplemental</h1>
          <p>Manage your supplemental budgets here</p>
        </div>
        <button
          onClick={() => handleEdit(null)}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Supplemental
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <select
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          className="form-select"
        >
          <option value="">Select Department</option>
          {departments?.map((d) => (
            <option key={d.ID} value={d.Name}>
              {d.Name}
            </option>
          ))}
        </select>

        <select
          name="subDepartment"
          value={filters.subDepartment}
          onChange={handleFilterChange}
          className="form-select"
        >
          <option value="">Select Sub Department</option>
          {subdepartments?.map((sd) => (
            <option key={sd.ID} value={sd.Name}>
              {sd.Name}
            </option>
          ))}
        </select>

        <select
          name="chartOfAccounts"
          value={filters.chartOfAccounts}
          onChange={handleFilterChange}
          className="form-select"
        >
          <option value="">Select Chart of Account</option>
          {chartOfAccounts?.map((c) => (
            <option key={c.ID} value={c.Name}>
              {c.Name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        loading={isLoading || subdepartmentsLoading}
        actions={actions}
        pagination={true}
      />

      {/* Modal */}
      <Modal
        size="md"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeRow ? 'Edit Supplemental' : 'Add New Supplemental'}
      >
        <BudgetSupplementalForm
          onSubmit={handleSubmit}
          initialData={activeRow}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default BudgetSupplementalPage;
