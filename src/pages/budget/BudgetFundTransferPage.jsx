import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PencilIcon, TrashIcon } from 'lucide-react';
import Modal from '../../components/common/Modal';
import BudgetFundTransferForm from '../../components/forms/BudgetFundTransferForm';
import DataTable from '../../components/common/DataTable';

const BudgetFundTransferPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [data] = useState([
    {
      id: 1,
      Code: '100',
      Name: 'General Fund',
      Description: 'The general fund.',
      OriginalAmount: '50,10,00,00,050.00',
      Balance: '50,10,00,00,050.00',
      Total: '50,10,00,00,050.00',
    },
    {
      id: 2,
      Code: '300',
      Name: 'Trust Fund',
      Description: 'The trust fund.',
      OriginalAmount: '1,99,950.00',
      Balance: '3,00,000.00',
      Total: '3,00,000.00',
    },
    {
      id: 3,
      Code: '200',
      Name: 'Special Education Fund',
      Description: 'The special education fund.',
      OriginalAmount: '2,00,000.00',
      Balance: '2,00,000.00',
      Total: '2,00,000.00',
    },
    {
      id: 4,
      Code: '000',
      Name: 'Test Fund',
      Description: 'This is just a test fund. This will also be deleted.',
      OriginalAmount: '1,00,000.00',
      Balance: '1,00,000.00',
      Total: '1,00,000.00',
    },
  ]);

  const columns = [
    {
      key: 'Code',
      header: 'Code',
      sortable: true,
      className: 'font-medium text-neutral-900',
      render: (value) => value || '—',
    },
    {
      key: 'Name',
      header: 'Name',
      sortable: true,
      render: (value) => <span className="font-medium">{value || '—'}</span>,
    },
    {
      key: 'Description',
      header: 'Description',
      sortable: true,
      render: (value) => (
        <span className="text-gray-600">{value || 'No description'}</span>
      ),
    },
    {
      key: 'OriginalAmount',
      header: 'Original Amount',
      sortable: true,
      className: 'text-right',
      render: (value) => <span className="font-medium">{value || '—'}</span>,
    },
    {
      key: 'Balance',
      header: 'Balance',
      sortable: true,
      className: 'text-right',
      render: (value) => <span className="font-medium">{value || '—'}</span>,
    },
    {
      key: 'Total',
      header: 'Total',
      sortable: true,
      className: 'text-right',
      render: (value) => <span className="font-medium">{value || '—'}</span>,
    },
  ];

  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: (row) => handleEdit(row),
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    {
      icon: TrashIcon,
      title: 'Delete',
      onClick: (row) => handleDelete(row.id),
      className:
        'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
    },
  ];

  const handleSubmit = (values) => {
    if (activeRow) {
      console.log('Updated:', values);
      toast.success('Transfer updated successfully');
    } else {
      console.log('Created:', values);
      toast.success('Transfer created successfully');
    }
    setIsOpen(false);
  };

  const handleEdit = (data) => {
    setActiveRow(data);
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    // if (!window.confirm('Are you sure you want to delete this transfer?'))
    // return;
    console.log('Deleted transfer with id:', id);
    toast.success('Transfer deleted successfully');
  };

  const handleViewTransfer = (row) => {
    console.log('View transfer:', row);
  };

  return (
    <>
      <div className="page-header">
        <div className="flex justify-between items-center max-sm:flex-wrap gap-4">
          <div>
            <h1>Fund Transfer</h1>
            <p>Manage fund transfers between accounts</p>
          </div>
          <div className="flex space-x-2 max-sm:w-full">
            <button
              type="button"
              onClick={() => handleEdit(null)}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Transfer
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={data}
          actions={actions}
          loading={false}
          onRowClick={handleViewTransfer}
        />
      </div>

      <Modal
        size="md"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={activeRow ? 'Edit Fund Transfer' : 'Add Fund Transfer'}
      >
        <BudgetFundTransferForm
          onSubmit={handleSubmit}
          initialData={activeRow}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
};

export default BudgetFundTransferPage;
