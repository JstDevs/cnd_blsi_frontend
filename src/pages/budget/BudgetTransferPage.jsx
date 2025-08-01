import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/common/Modal';
import BudgetTransferForm from '@/components/forms/BudgetTransferForm';
import { toast } from 'react-hot-toast';
import DataTable from '@/components/common/DataTable'; // Assuming you have this
import FormField from '@/components/common/FormField'; // For input fields

const BudgetTransferPage = () => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);

  const handleEdit = (row) => {
    setActiveRow(row);
    setIsModalOpen(true);
  };

  const handleDelete = (row) => {
    toast.success(`Deleted ${row.InvoiceNumber}`);
    // dispatch(deleteTransfer(row.id)); // Uncomment when integrated
  };

  const handleSubmit = (formValues) => {
    if (activeRow) {
      toast.success('Transfer updated successfully');
    } else {
      toast.success('New transfer added');
    }
    setIsModalOpen(false);
  };

  const columns = [
    { key: 'InvoiceNumber', header: 'Invoice #', sortable: true },
    { key: 'Budget', header: 'Budget', sortable: true },
    { key: 'Status', header: 'Status', sortable: true },
    { key: 'InvoiceDate', header: 'Invoice Date', sortable: true },
    { key: 'Total', header: 'Total', sortable: true, numeric: true },
    { key: 'Remarks', header: 'Remarks', sortable: false },
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
  const data = [
    {
      InvoiceNumber: 'BT-18-2025',
      Budget: 'Traveling Expenses',
      Status: 'Posted',
      InvoiceDate: '03-03-2025',
      Total: '5,000.00',
      Remarks: '',
    },
    {
      InvoiceNumber: 'BT-17-2025',
      Budget: 'Electricity Expenses',
      Status: 'Posted',
      InvoiceDate: '25-02-2025',
      Total: '99,00,000.00',
      Remarks: 'testing',
    },
    // more...
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header flex justify-between items-center gap-4 flex-wrap ">
        <div>
          <h1>Budget Transfer</h1>
          <p>Manage your budget transfers here</p>
        </div>
        <button
          onClick={() => handleEdit(null)}
          className="btn btn-primary max-sm:w-full"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Transfer
        </button>
      </div>
      {/* Table */}
      <DataTable
        columns={columns}
        data={data}
        actions={actions}
        pagination={true}
      />

      {/* Modal */}
      <Modal
        size="md"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeRow ? 'Edit Transfer' : 'Add New Transfer'}
      >
        <BudgetTransferForm
          onSubmit={handleSubmit}
          initialData={activeRow}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default BudgetTransferPage;
