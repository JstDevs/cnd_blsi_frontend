import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import VendorDetailsForm from '../../components/forms/VendorDetailsForm';
import {
  fetchVendorDetails,
  addVendorDetails,
  updateVendorDetails,
  deleteVendorDetails
} from '../../features/settings/vendorDetailsSlice';

function VendorDetailsPage() {
  const dispatch = useDispatch();
  const { vendorDetails, isLoading } = useSelector(state => state.vendorDetails);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVendorDetails, setCurrentVendorDetails] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vendorDetailsToDelete, setVendorDetailsToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchVendorDetails());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentVendorDetails(null);
    setIsModalOpen(true);
  };

  const handleEdit = (vendorDetails) => {
    setCurrentVendorDetails(vendorDetails);
    setIsModalOpen(true);
  };

  const handleDelete = (vendorDetails) => {
    setVendorDetailsToDelete(vendorDetails);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (vendorDetailsToDelete) {
      try {
        await dispatch(deleteVendorDetails(vendorDetailsToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setVendorDetailsToDelete(null);
      } catch (error) {
        console.error('Failed to delete vendor details:', error);
      }
    }
  };

  const handleSubmit = (values) => {
    if (currentVendorDetails) {
      dispatch(updateVendorDetails({ ...values, ID: currentVendorDetails.ID }));
    } else {
      dispatch(addVendorDetails(values));
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
            <h1>Vendor Details</h1>
            <p>Manage Vendor Details</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Vendor Details
          </button>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={vendorDetails}
          actions={actions}
          loading={isLoading}
          emptyMessage="No vendor details found. Click 'Add Vendor Details' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentVendorDetails ? "Edit Vendor Details" : "Add Vendor Details"}
      >
        <VendorDetailsForm
          initialData={currentVendorDetails}
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
            Are you sure you want to delete the vendor details "{vendorDetailsToDelete?.name}"?
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

export default VendorDetailsPage;