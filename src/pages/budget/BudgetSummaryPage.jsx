import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '@/components/common/DataTable';
import { fetchDepartments } from '@/features/settings/departmentSlice';
import { fetchSubdepartments } from '@/features/settings/subdepartmentSlice';
import { fetchAccounts } from '@/features/settings/chartOfAccountsSlice';
import Modal from '@/components/common/Modal';
import axiosInstance from '@/utils/axiosInstance';
import { formatCurrency } from '@/utils/currencyFormater';
import {
  ChartBarIcon,
  FunnelIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  DocumentTextIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

const API_URL = import.meta.env.VITE_API_URL;

const BudgetSummaryPage = () => {
  const dispatch = useDispatch();

  const { departments, isLoading: departmentsLoading } = useSelector(
    (state) => state.departments
  );
  const { subdepartments, isLoading: subdepartmentsLoading } = useSelector(
    (state) => state.subdepartments
  );
  const accounts = useSelector(
    (state) => state.chartOfAccounts?.accounts || []
  );

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    department: '',
    subDepartment: '',
    chartOfAccounts: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchSubdepartments());
    dispatch(fetchAccounts());
    fetchBudgetSummaries();
  }, []);

  const fetchBudgetSummaries = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance(`/budgetSummary`);
      // const res = await response.json();

      setData(response.data || []);
    } catch (error) {
      console.error('Error fetching budget summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return (
        (!filters.department || item.Department?.Name === filters.department) &&
        (!filters.subDepartment ||
          item.SubDepartment?.Name === filters.subDepartment) &&
        (!filters.chartOfAccounts ||
          item.ChartOfAccounts === filters.chartOfAccounts)
      );
    });
  }, [data, filters]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const stats = filteredData.reduce(
      (acc, item) => {
        const appropriation = Number(item.Appropriation) || 0;
        const appropriationBalance = Number(item.AppropriationBalance) || 0;
        const totalAmount = Number(item.TotalAmount) || 0;
        const allotmentBalance = Number(item.AllotmentBalance) || 0;
        const charges = Number(item.Charges) || 0;

        return {
          totalAppropriation: acc.totalAppropriation + appropriation,
          totalAppropriationBalance:
            acc.totalAppropriationBalance + appropriationBalance,
          totalAmount: acc.totalAmount + totalAmount,
          totalAllotmentBalance:
            acc.totalAllotmentBalance + allotmentBalance,
          totalCharges: acc.totalCharges + charges,
          count: acc.count + 1,
        };
      },
      {
        totalAppropriation: 0,
        totalAppropriationBalance: 0,
        totalAmount: 0,
        totalAllotmentBalance: 0,
        totalCharges: 0,
        count: 0,
      }
    );

    return stats;
  }, [filteredData]);

  const columns = [
    {
      key: 'Name',
      header: 'Budget Name',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-neutral-900">{value || '—'}</span>
      ),
    },
    {
      key: 'FiscalYearID',
      header: 'Fiscal Year',
      sortable: true,
      render: (_, row) => (
        <span className="text-neutral-700">
          {row?.FiscalYear?.Name || '—'}
        </span>
      ),
    },
    {
      key: 'DepartmentID',
      header: 'Department',
      sortable: true,
      render: (_, row) => (
        <span className="text-neutral-700">
          {row?.Department?.Name || '—'}
        </span>
      ),
    },
    {
      key: 'SubDepartmentID',
      header: 'Sub Department',
      sortable: true,
      render: (_, row) => (
        <span className="text-neutral-600">
          {row?.SubDepartment?.Name || '—'}
        </span>
      ),
    },
    {
      key: 'ChartofAccountsID',
      header: 'Chart of Accounts',
      sortable: true,
      render: (_, row) => (
        <span className="text-neutral-700">
          {row?.ChartofAccounts?.Name || '—'}
        </span>
      ),
    },
    {
      key: 'FundsID',
      header: 'Fund',
      sortable: true,
      render: (_, row) => (
        <span className="text-neutral-700">{row?.Funds?.Name || '—'}</span>
      ),
    },
    {
      key: 'ProjectID',
      header: 'Project',
      sortable: true,
      render: (_, row) => (
        <span className="text-neutral-600">{row?.Project?.Title || '—'}</span>
      ),
    },
    {
      key: 'Appropriation',
      header: 'Appropriation',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right font-semibold text-green-700">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'AppropriationBalance',
      header: 'Appropriation Balance',
      sortable: true,
      className: 'text-right',
      render: (value) => {
        const numValue = Number(value) || 0;
        return (
          <span
            className={`text-right font-medium ${
              numValue >= 0 ? 'text-green-700' : 'text-red-600'
            }`}
          >
            {formatCurrency(value)}
          </span>
        );
      },
    },
    {
      key: 'TotalAmount',
      header: 'Total Amount',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right font-semibold text-blue-700">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'ChargedAllotment',
      header: 'Allotment',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right font-medium text-orange-700">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'AllotmentBalance',
      header: 'Allotment Balance',
      sortable: true,
      className: 'text-right',
      render: (value) => {
        const numValue = Number(value) || 0;
        return (
          <span
            className={`text-right font-medium ${
              numValue >= 0 ? 'text-green-700' : 'text-red-600'
            }`}
          >
            {formatCurrency(value)}
          </span>
        );
      },
    },
    {
      key: 'Change',
      header: 'Change',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right text-neutral-600">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'Supplemental',
      header: 'Supplemental',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right text-neutral-600">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'Released',
      header: 'Released',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right text-neutral-600">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'Charges',
      header: 'Charges',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right font-medium text-orange-700">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'PreEncumbrance',
      header: 'Pre Encumbr.',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right text-neutral-600">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'Encumbrance',
      header: 'Encumbrance',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right text-neutral-600">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'January',
      header: 'Jan',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right text-neutral-600">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'February',
      header: 'Feb',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right text-neutral-600">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'March',
      header: 'Mar',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right text-neutral-600">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'April',
      header: 'Apr',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right text-neutral-600">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'May',
      header: 'May',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right text-neutral-600">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'June',
      header: 'Jun',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right text-neutral-600">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'July',
      header: 'Jul',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right text-neutral-600">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'August',
      header: 'Aug',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right text-neutral-600">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'September',
      header: 'Sep',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right text-neutral-600">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'October',
      header: 'Oct',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right text-neutral-600">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'November',
      header: 'Nov',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right text-neutral-600">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'December',
      header: 'Dec',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right text-neutral-600">
          {formatCurrency(value)}
        </span>
      ),
    },
  ];
  const handleRowClick = (row) => {
    setSelectedBudget(row);
    setIsModalOpen(true);
  };
  return (
    <div className="page-container">
      {/* Enhanced Header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <ChartBarIcon className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Budget Summary
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              Review and analyze budget performance across departments, months,
              and categories
            </p>
          </div>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      {!loading && filteredData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 mb-1">
                  Total Appropriation
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(summaryStats.totalAppropriation)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 mb-1">
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-blue-700">
                  {formatCurrency(summaryStats.totalAmount)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BanknotesIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 mb-1">
                  Total Charges
                </p>
                <p className="text-2xl font-bold text-orange-700">
                  {formatCurrency(summaryStats.totalCharges)}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 mb-1">
                  Total Records
                </p>
                <p className="text-2xl font-bold text-neutral-700">
                  {summaryStats.count}
                </p>
              </div>
              <div className="p-3 bg-neutral-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-neutral-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Filters Card */}
      <div className="card mb-6 p-5">
        <div className="flex items-center gap-2 mb-4">
          <FunnelIcon className="h-5 w-5 text-neutral-600" />
          <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="department-filter"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              <div className="flex items-center gap-2">
                <BuildingOfficeIcon className="h-4 w-4" />
                Department
              </div>
            </label>
            <select
              id="department-filter"
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="form-select w-full"
            >
              <option value="">All Departments</option>
              {departments?.map((d) => (
                <option key={d.ID} value={d.Name}>
                  {d.Name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="subDepartment-filter"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              <div className="flex items-center gap-2">
                <BuildingOffice2Icon className="h-4 w-4" />
                Sub Department
              </div>
            </label>
            <select
              id="subDepartment-filter"
              name="subDepartment"
              value={filters.subDepartment}
              onChange={handleFilterChange}
              className="form-select w-full"
            >
              <option value="">All Sub Departments</option>
              {subdepartments?.map((sd) => (
                <option key={sd.ID} value={sd.Name}>
                  {sd.Name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="chartOfAccounts-filter"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              <div className="flex items-center gap-2">
                <AcademicCapIcon className="h-4 w-4" />
                Chart of Accounts
              </div>
            </label>
            <select
              id="chartOfAccounts-filter"
              name="chartOfAccounts"
              value={filters.chartOfAccounts}
              onChange={handleFilterChange}
              className="form-select w-full"
            >
              <option value="">All Chart of Accounts</option>
              {accounts?.map((a) => (
                <option key={a.ID} value={a.Name}>
                  {a.Name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredData}
          loading={loading || departmentsLoading || subdepartmentsLoading}
          pagination={true}
          onRowClick={handleRowClick}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Budget Summary Details"
        size="xxxl"
      >
        <BudgetSummaryDetail data={selectedBudget} />
      </Modal>
    </div>
  );
};

export default BudgetSummaryPage;
const BudgetSummaryDetail = ({ data }) => {
  if (!data) return null;

  const get = (val) => val || '—';

  return (
    <div className="space-y-6">
      {/* Basic Information Section */}
      <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <DocumentTextIcon className="h-5 w-5 text-primary-600" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Budget Name
            </p>
            <p className="text-sm font-semibold text-neutral-900">
              {get(data.Name)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Fiscal Year
            </p>
            <p className="text-sm font-medium text-neutral-700">
              {get(data.FiscalYear?.Name)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Department
            </p>
            <p className="text-sm font-medium text-neutral-700">
              {get(data.Department?.Name)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Sub Department
            </p>
            <p className="text-sm font-medium text-neutral-700">
              {get(data.SubDepartment?.Name)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Chart of Accounts
            </p>
            <p className="text-sm font-medium text-neutral-700">
              {get(data.ChartofAccounts?.Name)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Fund
            </p>
            <p className="text-sm font-medium text-neutral-700">
              {get(data.Funds?.Name)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Project
            </p>
            <p className="text-sm font-medium text-neutral-700">
              {get(data.Project?.Title)}
            </p>
          </div>
        </div>
      </div>

      {/* Financial Summary Section */}
      <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <CurrencyDollarIcon className="h-5 w-5 text-primary-600" />
          Financial Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Appropriation (Original)
            </p>
            <p className="text-lg font-bold text-green-700">
              {formatCurrency(data.Appropriation)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Appropriation Balance
            </p>
            <p
              className={`text-lg font-bold ${
                Number(data.AppropriationBalance) >= 0
                  ? 'text-green-700'
                  : 'text-red-600'
              }`}
            >
              {formatCurrency(data.AppropriationBalance)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Appropriation (Adjusted)
            </p>
            <p className="text-lg font-bold text-blue-700">
              {formatCurrency(data.RevisedAmount)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Adjustments
            </p>
            <p className="text-lg font-semibold text-neutral-700">
              {formatCurrency(data.Change)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Total Allotment
            </p>
            <p className="text-lg font-bold text-orange-700">
              {formatCurrency(data.ChargedAllotment)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Allotment Balance
            </p>
            <p
              className={`text-lg font-bold ${
                Number(data.AllotmentBalance) >= 0
                  ? 'text-green-700'
                  : 'text-red-600'
              }`}
            >
              {formatCurrency(data.AllotmentBalance)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Pre Encumbrance
            </p>
            <p className="text-lg font-semibold text-neutral-700">
              {formatCurrency(data.PreEncumbrance)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Encumbrance
            </p>
            <p className="text-lg font-semibold text-neutral-700">
              {formatCurrency(data.Encumbrance)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Charges
            </p>
            <p className="text-lg font-bold text-orange-700">
              {formatCurrency(data.Charges)}
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Distribution Section */}
      <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary-600" />
          Monthly Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ].map((month) => (
            <div
              key={month}
              className="bg-white p-3 rounded-lg border border-neutral-200"
            >
              <p className="text-xs font-medium text-neutral-500 mb-1">
                {month.slice(0, 3)}
              </p>
              <p className="text-sm font-semibold text-neutral-900">
                {formatCurrency(data[month])}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-neutral-300 bg-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-700">Total Amount</p>
            <p className="text-xl font-bold text-blue-700">
              {formatCurrency(data.TotalAmount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
