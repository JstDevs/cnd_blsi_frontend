import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  ArrowLeftIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';
import DataTable from '@/components/common/DataTable';
import RealPropertyTaxForm from './RealPropertyTaxForm';
import { useModulePermissions } from '@/utils/useModulePremission';
import {
  fetchRealPropertyTaxes,
  saveRealPropertyTax,
} from '@/features/collections/realPropertyTaxSlice';
import { fetchGeneralRevisions } from '@/features/settings/generalRevisionSlice';
import { fetchCustomers } from '@/features/settings/customersSlice';
import toast from 'react-hot-toast';
import { CheckLine, TrashIcon, X } from 'lucide-react';

function RealPropertyTaxPage() {
  const dispatch = useDispatch();
  const { realPropertyTaxes, isLoading } = useSelector(
    (state) => state.realPropertyTax
  );
  const { generalRevisions, isLoading: isLoadingGeneralRevisions } =
    useSelector((state) => state.generalRevisions);
  const { customers, isLoading: isLoadingCustomers } = useSelector(
    (state) => state.customers
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (RealPropertyTaxPage - MODULE ID =  70 )
  const { Add, Edit, Print } = useModulePermissions(70);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', 'details'
  const [currentProperty, setCurrentProperty] = useState(null);
  const [isLoadingReceipt, setIsLoadingReceipt] = useState(false);

  useEffect(() => {
    dispatch(fetchRealPropertyTaxes());
    dispatch(fetchGeneralRevisions());
    dispatch(fetchCustomers());
  }, []);

  const handleCreateProperty = () => {
    setCurrentProperty(null);
    setCurrentView('form');
  };

  const handleViewProperty = (property) => {
    setCurrentProperty(property);
    setCurrentView('details');
  };

  const handleEditProperty = (property) => {
    setCurrentProperty(property);
    setCurrentView('form');
  };

  const handlePrintProperty = (property) => {
    // Implement print functionality
    console.log('Print property:', property);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setCurrentProperty(null);
  };
  // Table columns definition
  const columns = [
    {
      key: 'Status',
      header: 'Status',
      sortable: true,
      render: (value) => renderStatusBadge(value),
    },
    {
      key: 'CustomerName',
      header: 'Customer Name',
      sortable: true,
    },
    {
      key: 'T_D_No',
      header: 'TD No.',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },

    {
      key: 'LinkID',
      header: 'Link ID',
      sortable: true,
    },
  ];

  // Helper function for status badges
  const renderStatusBadge = (value) => {
    let bgColor = 'bg-neutral-100 text-neutral-800';

    switch (value) {
      case 'Active':
        bgColor = 'bg-success-100 text-success-800';
        break;
      case 'Requested':
        bgColor = 'bg-warning-100 text-warning-800';
        break;
      case 'Rejected':
        bgColor = 'bg-error-100 text-error-800';
        break;
      default:
        break;
    }

    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}
      >
        {value}
      </span>
    );
  };

  const handleRPTAction = async (dv, action) => {
    const actionConfig = {
      approve: {
        endpoint: 'postTransaction',
        payload: {
          id: dv.id,
          linkID: dv.LinkID,
          approvalLinkID: dv.approvalLinkID,
          approvalProgress: dv.approvalProgress,
          amountReceived: dv.amountReceived,
          ApprovalOrder: dv.ApprovalOrder,
          transactionApprovalVersion: dv.transactionApprovalVersion,
        },
        successMsg: 'Real Property approved successfully',
        errorMsg: 'Error approving Real Property',
      },
      reject: {
        endpoint: 'rejectTransaction',
        payload: {
          id: dv.id,
          approvalLinkID: dv.approvalLinkID,
          reasonForRejection: dv.reasonForRejection,
        },
        successMsg: 'Real Property rejected successfully',
        errorMsg: 'Error rejecting Real Property',
      },
    };

    const config = actionConfig[action];
    if (!config) {
      console.error('Invalid action:', action);
      return;
    }

    setIsLoadingReceipt(true);
    try {
      const { data } = await axiosInstance.post(
        `/real-property-tax/${config.endpoint}`,
        config.payload
      );

      console.log(`${action} response:`, data);
      dispatch(fetchRealPropertyTaxes());
      toast.success(config.successMsg);
    } catch (error) {
      const errMsg = error.response?.data?.message || config.errorMsg;
      console.error(errMsg, error);
      toast.error(errMsg);
    } finally {
      setIsLoadingReceipt(false);
    }
  };

  const actions = (row) => {
    const actionList = [];

    if (row.Status.toLowerCase().includes('rejected') && Edit) {
      actionList.push({
        icon: PencilIcon,
        title: 'Edit',
        onClick: () => handleEditProperty(row),
        className:
          'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
      });
      // actionList.push({
      //   icon: TrashIcon,
      //   title: 'Delete',
      //   onClick: () => {},
      //   className:
      //     'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
      // });
    } else if (row.Status === 'Requested') {
      actionList.push(
        {
          icon: CheckLine,
          title: 'Post',
          onClick: () => handleRPTAction(row, 'approve'),
          className:
            'text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50',
        },
        {
          icon: X,
          title: 'Reject',
          onClick: () => handleRPTAction(row, 'reject'),
          className:
            'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50',
        }
      );
    }
    actionList.push({
      icon: EyeIcon,
      title: 'View',
      onClick: () => {},
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    });
    return actionList;
  };
  const handleSubmitSuccess = async (payload) => {
    // console.log('payload', payload);
    try {
      await dispatch(saveRealPropertyTax(payload)).unwrap();

      dispatch(fetchRealPropertyTaxes());
      handleBackToList();
      toast.success('Property saved successfully');
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Failed to save property. Please try again.');
    }
  };
  const individualOptions = customers?.map((customer) => ({
    value: customer.ID,
    label:
      customer.Name ||
      `${customer.FirstName} ${customer.MiddleName} ${customer.LastName}`,
  }));
  const generalRevisionsOptions = generalRevisions?.map((revision) => ({
    value: revision.ID,
    label: revision.General_Revision_Date_Year,
  }));
  // console.log('individualOptions', generalRevisionsOptions);
  return (
    <>
      {currentView === 'list' && (
        <>
          <div className="flex justify-between items-center max-sm:flex-wrap gap-4 mb-6 page-header">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Real Property Tax Records
              </h1>
              <p className="text-gray-600">
                Manage real property tax assessments
              </p>
            </div>
            {Add && (
              <button
                type="button"
                onClick={handleCreateProperty}
                className="btn btn-primary max-sm:w-full"
              >
                <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                New Property
              </button>
            )}
          </div>

          <DataTable
            columns={columns}
            data={realPropertyTaxes}
            actions={actions}
            loading={
              isLoading ||
              isLoadingGeneralRevisions ||
              isLoadingCustomers ||
              isLoadingReceipt
            }
            // onRowClick={() => handleViewProperty(null)}
            selectedRow={currentProperty}
          />
        </>
      )}

      {currentView === 'form' && (
        <div>
          <div className="flex justify-between max-sm:flex-col gap-4 sm:items-center mb-6">
            <div className="flex sm:items-center gap-4 max-sm:flex-col">
              <button
                onClick={handleBackToList}
                className="mr-4 p-1 rounded-full hover:bg-neutral-100 w-fit"
              >
                <ArrowLeftIcon className="h-5 w-5 text-neutral-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {currentProperty
                    ? 'Edit Real Property Tax Record'
                    : 'Create New Real Property Tax Record'}
                </h1>
                <p className="text-gray-600">
                  {currentProperty
                    ? 'Update the property details'
                    : 'Fill out the form to create a new property record'}
                </p>
              </div>
            </div>
            {Print && (
              <button
                onClick={() => {
                  console.log('Print');
                }}
                className="btn btn-primary"
              >
                <PrinterIcon className="h-5 w-5 mr-2" aria-hidden="true" />{' '}
                Print
              </button>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-2 sm:p-6">
            <RealPropertyTaxForm
              initialData={currentProperty}
              onBack={handleBackToList}
              onCreateOrEdit={handleSubmitSuccess}
              individualOptions={individualOptions}
              generalRevisionsOptions={generalRevisionsOptions}
            />
          </div>
        </div>
      )}

      {currentView === 'details' && currentProperty && (
        <div>
          <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
            <div className="flex items-center">
              <button
                onClick={handleBackToList}
                className="mr-4 p-1 rounded-full hover:bg-neutral-100"
              >
                <ArrowLeftIcon className="h-5 w-5 text-neutral-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Property Details
                </h1>
                <p className="text-gray-600">
                  View and manage property tax details
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleEditProperty(currentProperty)}
                className="btn btn-primary flex items-center"
              >
                <PencilIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => handlePrintProperty(currentProperty)}
                className="btn btn-outline flex items-center"
              >
                <PrinterIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Print
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-2 sm:p-6">
            <RealPropertyTaxForm
              initialData={currentProperty}
              readOnly={true}
              onBack={handleBackToList}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default RealPropertyTaxPage;
