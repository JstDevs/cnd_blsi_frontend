import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

import Modal from '@/components/common/Modal';
import DataTable from '@/components/common/DataTable';
import BudgetForm from '@/components/forms/BudgetForm';

import { fetchDepartments } from '@/features/settings/departmentSlice';
import { fetchSubdepartments } from '@/features/settings/subdepartmentSlice';
import { fetchAccounts } from '@/features/settings/chartOfAccountsSlice';

const API_URL = import.meta.env.VITE_API_URL;

const BudgetDetailsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { departments } = useSelector((state) => state.departments);
  const { subdepartments } = useSelector((state) => state.subdepartments);
  const accounts = useSelector(
    (state) => state.chartOfAccounts?.accounts || []
  );

  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [filters, setFilters] = useState({
    department: '',
    subDepartment: '',
    chartOfAccounts: '',
  });

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchSubdepartments());
    dispatch(fetchAccounts());
    fetchBudgetDetails();
  }, []);

  const fetchBudgetDetails = async () => {
    try {
      const res = await fetch(`${API_URL}/budget`);
      const json = await res.json();
      if (json?.status) {
        setData(json?.items || []);
      } else {
        toast.error('Failed to fetch budget details');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (values) => {
    activeRow ? handleUpdate(values) : handleCreate(values);
  };

  const handleCreate = async (values) => {
    try {
      const res = await fetch(`${API_URL}/budget`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...mapFormToPayload(values),
          CreatedBy: user?.UserName,
          CreatedDate: new Date().toISOString(),
          ModifyBy: user?.UserName,
          ModifyDate: new Date().toISOString(),
        }),
      });
      const json = await res.json();
      if (json) {
        fetchBudgetDetails();
        setIsModalOpen(false);
        toast.success('Budget added successfully');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdate = async (values) => {
    try {
      const res = await fetch(`${API_URL}/budget/${values?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...mapFormToPayload(values),
          ModifyBy: user?.UserName,
          ModifyDate: new Date().toISOString(),
        }),
      });
      const json = await res.json();
      if (json) {
        fetchBudgetDetails();
        setIsModalOpen(false);
        toast.success('Budget updated successfully');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/budget/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json) {
        fetchBudgetDetails();
        toast.success('Budget deleted');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const mapFormToPayload = (values) => ({
    FiscalYearID: values?.fiscalYear,
    FundID: values?.fund,
    ProjectID: values?.project,
    Name: values?.budgetName,
    DepartmentID: values?.department,
    SubDepartmentID: values?.subDepartment,
    ChartofAccountsID: values?.chartOfAccounts,
    Appropriation: values?.appropriation,
    TotalAmount: values?.totalAmount,
    AppropriationBalance: values?.charges,
    Charges: values?.charges,
    January: values?.january,
    February: values?.february,
    March: values?.march,
    April: values?.april,
    May: values?.may,
    June: values?.june,
    July: values?.july,
    August: values?.august,
    September: values?.september,
    October: values?.october,
    November: values?.november,
    December: values?.december,
  });

  const columns = [
    { key: 'Name', header: 'Name' },
    { key: 'FiscalYear', header: 'Fiscal Year' },
    { key: 'Department.Name', header: 'Department' },
    { key: 'SubDepartment.Name', header: 'Sub Department' },
    { key: 'ChartofAccounts.Name', header: 'Chart of Accounts' },
    { key: 'FundId', header: 'Fund' },
    { key: 'ProjectID', header: 'Project' },
    { key: 'Appropriation', header: 'Appropriation' },
    { key: 'AppropriationBalance', header: 'Appropriation Balance' },
    { key: 'TotalAmount', header: 'Total Amount' },
    { key: 'Allotment', header: 'Allotment' },
    { key: 'AllotmentBalance', header: 'Allotment Balance' },
    { key: 'ChargedAllotment', header: 'Charges' },
    { key: 'PreEncumbrance', header: 'Pre Encumbrance' },
    { key: 'Encumbrance', header: 'Encumbrance' },
    { key: 'January', header: 'January' },
    { key: 'February', header: 'February' },
    { key: 'March', header: 'March' },
    { key: 'April', header: 'April' },
    { key: 'May', header: 'May' },
    { key: 'June', header: 'June' },
    { key: 'July', header: 'July' },
    { key: 'August', header: 'August' },
    { key: 'September', header: 'September' },
    { key: 'October', header: 'October' },
    { key: 'November', header: 'November' },
    { key: 'December', header: 'December' },
  ];

  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: (row) => {
        setActiveRow(row);
        setIsModalOpen(true);
      },
      className: 'text-primary-600 hover:text-primary-900 p-1',
    },
    {
      icon: TrashIcon,
      title: 'Delete',
      onClick: (row) => handleDelete(row?.ID),
      className: 'text-red-600 hover:text-red-800 p-1',
    },
  ];

  const filteredData = data.filter((item) => {
    return (
      (!filters.department || item.Department?.ID == filters.department) &&
      (!filters.subDepartment ||
        item.SubDepartment?.ID == filters.subDepartment) &&
      (!filters.chartOfAccounts ||
        item.ChartofAccounts?.ID == filters.chartOfAccounts)
    );
  });

  return (
    <div className="page-container">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Budget Details</h1>
          <p>View and manage detailed budget entries</p>
        </div>
        <button
          onClick={() => {
            setActiveRow(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Budget
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4">
        <select
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          className="form-select"
        >
          <option value="">Select Department</option>
          {departments?.map((d) => (
            <option key={d.ID} value={d.ID}>
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
          {subdepartments?.map((s) => (
            <option key={s.ID} value={s.ID}>
              {s.Name}
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
          {accounts?.map((a) => (
            <option key={a.ID} value={a.ID}>
              {a.Name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        actions={actions}
        pagination
      />

      {/* Modal */}
      <Modal
        size="lg"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeRow ? 'Edit Budget' : 'Add Budget'}
      >
        <BudgetForm
          onSubmit={handleSubmit}
          initialData={activeRow}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default BudgetDetailsPage;
