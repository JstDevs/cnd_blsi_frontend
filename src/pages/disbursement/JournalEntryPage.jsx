import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import JournalEntryForm from '../../components/forms/JournalEntryForm';
import {
  fetchJournalEntries,
  addJournalEntry,
  updateJournalEntry,
  deleteJournalEntry
} from '../../features/disbursement/journalEntrySlice';

function JournalEntryPage() {
  const typeOptions = [
    { label: 'Cash Disbursement', value: 'Cash Disbursement' },
    { label: 'Check Disbursement', value: 'Check Disbursement' },
    { label: 'Collection', value: 'Collection' },
    { label: 'Others', value: 'Others' }
  ];
  const fundOptions = [
    { label: 'General Fund', value: 'General Fund' },
    { label: 'Trust Fund', value: 'Trust Fund' },
    { label: 'Special Education Fund', value: 'Special Education Fund' }
  ];
  const centerOptions = [
    { label: 'Finance Department', value: 'finance' },
    { label: 'Human Resources', value: 'hr' },
    { label: 'IT Services', value: 'it' },
    { label: 'Procurement Division', value: 'procurement' },
  ];

  const accountOptions = [
    { label: '101 - Cash in Bank', value: '101' },
    { label: '201 - Accounts Payable', value: '201' },
    { label: '301 - Office Supplies', value: '301' },
    { label: '401 - Travel Expenses', value: '401' },
  ];

  const dispatch = useDispatch();
  const { journalEntries, isLoading } = useSelector(state => state.journalEntries);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentJournalEntry, setCurrentJournalEntry] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [journalEntryToDelete, setJournalEntryToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchJournalEntries());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentJournalEntry(null);
    setIsModalOpen(true);
  };

  const handleEdit = (journalEntry) => {
    setCurrentJournalEntry(journalEntry);
    setIsModalOpen(true);
  };

  const handleDelete = (journalEntry) => {
    setJournalEntryToDelete(journalEntry);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (journalEntryToDelete) {
      try {
        await dispatch(deleteJournalEntry(journalEntryToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setJournalEntryToDelete(null);
      } catch (error) {
        console.error('Failed to delete journal entry:', error);
      }
    }
  };

  const handleSubmit = (values) => {
    if (currentJournalEntry) {
      dispatch(updateJournalEntry({ ...values, ID: currentJournalEntry.ID }));
    } else {
      dispatch(addJournalEntry(values));
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      key: 'Name',
      header: 'Name',
      sortable: true
    }
  ];

  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEdit,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDelete,
      className: 'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50'
    }
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Journal Entries</h1>
            <p>Manage Journal Entries</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Journal Entry
          </button>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={journalEntries}
          actions={actions}
          loading={isLoading}
          emptyMessage="No journal entries found. Click 'Add Journal Entry' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        size="xxxl"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentJournalEntry ? "Edit Journal Entry" : "Add Journal Entry"}
      >
        <JournalEntryForm
          typeOptions={typeOptions}
          fundOptions={fundOptions}
          centerOptions={centerOptions}
          accountOptions={accountOptions}
          initialData={currentJournalEntry}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="py-3">
          <p className="text-neutral-700">
            Are you sure you want to delete the journal entry "{journalEntryToDelete?.Name}"?
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(false)}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default JournalEntryPage;