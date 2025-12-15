import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Plus,
  PencilIcon,
  TrashIcon,
  Users,
  Building,
  Globe,
} from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import CustomerForm from '../../components/forms/CustomerForm';
import {
  fetchCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from '../../features/settings/customersSlice';
import { fetchIndustries } from '@/features/settings/industrySlice';
import { fetchTaxCodes } from '@/features/settings/taxCodeSlice';
import { fetchPaymentTerms } from '@/features/settings/paymentTermsSlice';
import { fetchModeOfPayments } from '@/features/settings/modeOfPaymentSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function Customer() {
  const dispatch = useDispatch();
  const { customers, isLoading } = useSelector((state) => state.customers);
  const { industries } = useSelector((state) => state.industries);
  const { taxCodes } = useSelector((state) => state.taxCodes);
  const { paymentTerms } = useSelector((state) => state.paymentTerms);
  const { modeOfPayments } = useSelector((state) => state.modeOfPayments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  // ---------------------USE MODULE PERMISSIONS------------------START (Customer  - MODULE ID = 38 )
  const { Add, Edit, Delete } = useModulePermissions(38);
  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchIndustries());
    dispatch(fetchTaxCodes());
    dispatch(fetchPaymentTerms());
    dispatch(fetchModeOfPayments());
  }, [dispatch]);

  const summaryStats = useMemo(() => {
    const total = customers?.length || 0;
    const orgKinds = new Set(
      customers?.map((c) => c.KindofOrganization).filter(Boolean)
    ).size;
    const countries = new Set(
      customers?.map((c) => c.Citizenship).filter(Boolean)
    ).size;
    return { total, orgKinds, countries };
  }, [customers]);

  const handleAdd = () => {
    setCurrentCustomer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (customerToDelete) {
      try {
        await dispatch(deleteCustomer(customerToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setCustomerToDelete(null);
        toast.success('Customer deleted successfully');
      } catch (error) {
        toast.error(
          error?.message || 'Failed to delete Individual/Citizen. Please try again.'
        );
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentCustomer) {
        await dispatch(
          updateCustomer({ ...values, ID: currentCustomer.ID })
        ).unwrap();
        toast.success('Customer updated successfully');
      } else {
        await dispatch(addCustomer(values)).unwrap();
        toast.success('Customer added successfully');
      }
      dispatch(fetchCustomers());
    } catch (error) {
      toast.error(error?.message || 'Failed to save Individual/Citizen');
    } finally {
      setCurrentCustomer(null);
      setIsModalOpen(false);
    }
  };

  const columns = [
    {
      key: 'Name',
      header: 'Name',
      sortable: true,
      className: 'text-neutral-900 font-medium',
      render: (value, row) => {
        const full = [row.FirstName, row.MiddleName, row.LastName]
          .filter(Boolean)
          .join(' ');
        return (
          <span className="text-neutral-900 font-medium">
            {value || full || 'N/A'}
          </span>
        );
      },
    },
    {
      key: 'TIN',
      header: 'TIN',
      sortable: true,
      render: (value) => <span className="text-neutral-700">{value || 'N/A'}</span>,
    },
    {
      key: 'ZIPCode',
      header: 'ZIP Code',
      sortable: true,
      render: (value) => <span className="text-neutral-600">{value || 'N/A'}</span>,
    },
    {
      key: 'PlaceofIncorporation',
      header: 'Place of Incorporation',
      sortable: true,
      render: (value) => value || 'N/A',
    },
    {
      key: 'KindofOrganization',
      header: 'Kind of Organization',
      sortable: true,
      render: (value) => value || 'N/A',
    },
    {
      key: 'Gender',
      header: 'Gender',
      sortable: true,
      render: (value) => value || 'N/A',
    },
    {
      key: 'StreetAddress',
      header: 'Address',
      sortable: true,
      render: (value) => <span className="text-neutral-700">{value || 'N/A'}</span>,
    },
    {
      key: 'Citizenship',
      header: 'Citizenship',
      sortable: true,
      render: (value) => value || 'N/A',
    },
    {
      key: 'Occupation',
      header: 'Occupation',
      sortable: true,
      render: (value) => value || 'N/A',
    },
  ];

  const actions = [
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEdit,
      className:
        'text-primary-600 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50 transition-all duration-200 shadow-sm hover:shadow',
    },
    Delete && {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDelete,
      className:
        'text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow',
    },
  ].filter(Boolean);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">Individuals/Citizens</h1>
                <p className="text-sm text-neutral-600 mt-0.5">
                  Manage individual / citizen records and profiles
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {Add && (
              <button
                type="button"
                onClick={handleAdd}
                className="btn btn-primary flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
              >
                <Plus className="h-5 w-5" />
                Add Individual/Citizen
              </button>
            )}
          </div>
        </div>

        {/* Summary cards */}
        {!isLoading && customers?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">Total Individuals</p>
                  <p className="text-2xl font-bold text-blue-900">{summaryStats.total}</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-lg">
                  <Users className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">Org Types</p>
                  <p className="text-2xl font-bold text-green-900">{summaryStats.orgKinds}</p>
                </div>
                <div className="p-3 bg-green-200 rounded-lg">
                  <Building className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-1">Citizenships</p>
                  <p className="text-2xl font-bold text-purple-900">{summaryStats.countries}</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-lg">
                  <Globe className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <h2 className="text-lg font-semibold text-neutral-900">
            Individual / Citizen Records
            <span className="ml-2 text-sm font-normal text-neutral-600">
              ({customers?.length || 0} {(customers?.length || 0) === 1 ? 'record' : 'records'})
            </span>
          </h2>
        </div>
        <DataTable
          columns={columns}
          data={customers || []}
          actions={actions}
          loading={isLoading}
          pagination={true}
          emptyMessage="No individuals/citizens found. Click 'Add Individual/Citizen' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentCustomer ? 'Edit Individual/Citizen' : 'Add Individual/Citizen'}
        size="lg"
      >
        <CustomerForm
          initialData={currentCustomer}
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
            Are you sure you want to delete the individual/citizen?
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

export default Customer;

