import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StatementComparisonForm from '../../../components/forms/StatementComparisonForm';
import DataTable from '@/components/common/DataTable';
import { fetchStatementComparisons, resetStatementComparisonState } from '@/features/budget/statementComparisonSlice';
import { fetchFiscalYears } from '@/features/settings/fiscalYearSlice';

function StatementComparison() {
  const API_URL = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();

  const { statementComparisons, isLoading, error } = useSelector(state => state.statementComparison);
  const { fiscalYears } = useSelector(state => state.fiscalYears);

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };
  
  useEffect(() => {
    dispatch(resetStatementComparisonState());
    dispatch(fetchFiscalYears());
  }, [dispatch]);

  // Table columns definition
  const columns = [
  {
    key: 'Type',
    header: 'Type',
    sortable: true,
  },
  {
    key: 'SubID',
    header: 'Sub ID',
    sortable: true,
  },
  {
    key: 'Subtype',
    header: 'Subtype',
    sortable: true,
  },
  {
    key: 'Category',
    header: 'Category',
    sortable: true,
  },
  {
    key: 'Chart of Accounts',
    header: 'Chart of Accounts',
    sortable: true,
  },
  {
    key: 'Account Code',
    header: 'Account Code',
    sortable: true,
  },
  {
    key: 'Original',
    header: 'Original',
    sortable: true,
    className: 'text-right',
  },
  {
    key: 'Final',
    header: 'Final',
    sortable: true,
    className: 'text-right',
  },
  {
    key: 'Difference',
    header: 'Difference',
    sortable: true,
    className: 'text-right',
  },
  {
    key: 'Actual',
    header: 'Actual',
    sortable: true,
    className: 'text-right',
  },
  {
    key: 'Difference 2',
    header: 'Difference 2',
    sortable: true,
    className: 'text-right',
  },
  {
    key: 'Period',
    header: 'Period',
    sortable: true,
  },
  {
    key: 'Municipality',
    header: 'Municipality',
    sortable: true,
  },
  {
    key: 'Province',
    header: 'Province',
    sortable: true,
  },
];


  
  // Handle export to Excel
  const handleExport = async (values) => {
    try {
      const response = await fetch(`${API_URL}/statementOfComparison/exportExcel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fiscalYearID: values.fiscalYearID,
        })
      });

      if (!response.ok) throw new Error('Server response was not ok');

      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition');
      let filename = `Statement_of_Comparison.xlsx`;
      if (disposition && disposition.includes('filename=')) {
        filename = disposition.split('filename=')[1].replace(/['"]/g, '');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Optional: custom file name
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Export failed:', err);
      alert(err.message || 'Failed to export');
    }
  };

  // Handle view to Excel
  const handleView = (values) => {
    dispatch(fetchStatementComparisons(values));
  };

  return (
    <div>
      <div className="page-header">
        <h1>Statement of Comparison of Budget and Actual Amount</h1>
      </div>
      
      <div className="mt-4 p-6 bg-white rounded-md shadow">
        <StatementComparisonForm
          fiscalYears={fiscalYears}
          onExportExcel={handleExport}
          onView={handleView}
          onClose={() => {}}
        />
      </div>

      {error && (
        <div className="mt-4 p-4 bg-error-50 border border-error-200 rounded-md">
          <p className="text-error-700">{error}</p>
        </div>
      )}

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={statementComparisons}
          loading={isLoading}
          pagination={true}
        />
      </div>
    </div>
  );
}

export default StatementComparison;