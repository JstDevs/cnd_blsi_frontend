import { useState, useEffect, useRef } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  ArrowLeftIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';
import DataTable from '@/components/common/DataTable';
import CTCForm from './CTCForm';
import SearchableDropdown from '@/components/common/SearchableDropdown';
import Modal from '@/components/common/Modal';
import { fetchVendorDetails } from '@/features/settings/vendorDetailsSlice';
import { CheckLine, Trash, X } from 'lucide-react';
import {
  fetchCorporateCommunityTaxes,
  deleteCorporateCommunityTax,
  addCorporateCommunityTax,
} from '@/features/collections/CoorporateCommunityTax';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';
import { useReactToPrint } from 'react-to-print';
import CTCCorporatePrintPreview from './CTCCorporatePrintPreview';
import { fetchGeneralLedgers } from '@/features/reports/generalLedgerSlice';
import { BookOpenIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

function CommunityTaxCorporationPage() {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', 'details'
  const [currentCertificate, setCurrentCertificate] = useState(null);
  // const [searchTerm, setSearchTerm] = useState('');
  const [showListModal, setShowListModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isLoadingCTCActions, setIsLoadingCTCActions] = useState(false);
  const [isNewVendor, setIsNewVendor] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [showGLModal, setShowGLModal] = useState(false);
  // ---------------------USE MODULE PERMISSIONS------------------START (CommunityTaxCorporationPage - MODULE ID =  35 )
  const { Add, Edit, Delete, Print } = useModulePermissions(35);
  const { records: certificates, isLoading: certificatesLoading } = useSelector(
    (state) => state.corporateCommunityTax
  );
  const { vendorDetails, isLoading } = useSelector(
    (state) => state.vendorDetails
  );
  const { generalLedgers, isLoading: isGLLoading } = useSelector((state) => state.generalLedger);
  const dispatch = useDispatch();
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Corporation Community Tax Certificate',
  });

  useEffect(() => {
    dispatch(fetchVendorDetails());
    dispatch(fetchCorporateCommunityTaxes());
  }, [dispatch]);

  const handleCreateCertificate = () => {
    setCurrentCertificate(null);
    setCurrentView('form');
    setIsNewVendor(false);
    setNewVendorName('');
    setSelectedVendor(null);
  };

  const handleViewCertificate = (certificate) => {
    setCurrentCertificate(certificate);
    setCurrentView('details');
  };

  const handleEditCertificate = (certificate) => {
    setCurrentCertificate(certificate);
    setIsNewVendor(false);
    console.log('Edit certificate:', certificate);
    handleVendorChange(certificate.CustomerID);
    setCurrentView('form');
  };

  const handlePrintCertificate = (certificate) => {
    console.log('Print certificate:', certificate);
    handlePrint();
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setCurrentCertificate(null);
    setSelectedVendor(null);
    setIsNewVendor(false);
    setNewVendorName('');
  };
  // Updated columns definition to match the image
  const columns = [
    {
      key: 'InvoiceNumber',
      header: 'Certificate No.',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'Status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded ${value === 'Requested' ? 'bg-gradient-to-r from-warning-400 via-warning-300 to-warning-500 text-error-700'
            : value === 'Approved' ? 'bg-gradient-to-r from-success-300 via-success-500 to-success-600 text-neutral-800'
              : value === 'Posted' ? 'bg-gradient-to-r from-success-800 via-success-900 to-success-999 text-success-100'
                : value === 'Rejected' ? 'bg-gradient-to-r from-error-700 via-error-800 to-error-999 text-neutral-100'
                  : value === 'Void' ? 'bg-gradient-to-r from-primary-900 via-primary-999 to-tertiary-999 text-neutral-300'
                    : value === 'Cancelled' ? 'bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-400 text-neutral-800'
                      : 'bg-gray-100 text-gray-800'
            }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'InvoiceDate',
      header: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'CustomerName',
      header: 'Customer Name',
      sortable: true,
      className: 'text-right',
    },
    {
      key: 'Total',
      header: 'Total',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right font-semibold text-primary-700">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'AmountReceived',
      header: 'Amount Received',
      sortable: true,
      className: 'text-right',
      render: (value) => (
        <span className="text-right font-semibold text-primary-700">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'Year',
      header: 'Year',
      sortable: true,
      className: 'text-right',
    },
  ];

  // Updated currency formatting to handle large numbers
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    }
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Updated status badge rendering
  const renderStatusBadge = (value) => {
    let bgColor = 'bg-neutral-100 text-neutral-800';

    switch (value) {
      case 'Requested': bgColor = 'bg-gradient-to-r from-warning-400 via-warning-300 to-warning-500 text-error-700'; break;
      case 'Approved': bgColor = 'bg-gradient-to-r from-success-300 via-success-500 to-success-600 text-neutral-800'; break;
      case 'Posted': bgColor = 'bg-gradient-to-r from-success-800 via-success-900 to-success-999 text-success-100'; break;
      case 'Rejected': bgColor = 'bg-gradient-to-r from-error-700 via-error-800 to-error-999 text-neutral-100'; break;
      case 'Void': bgColor = 'bg-gradient-to-r from-primary-900 via-primary-999 to-tertiary-999 text-neutral-300'; break;
      case 'Cancelled': bgColor = 'bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-400 text-neutral-800'; break;
      default: break;
    }

    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}
      >
        {value}
      </span>
    );
  };
  // ----------DELETE CERTIFICATE FUNCTION------------
  const handleDeleteCertificate = async (certificate) => {
    try {
      await dispatch(deleteCorporateCommunityTax(certificate.ID)).unwrap();
      // If deletion was successful, refetch the data
      dispatch(fetchCorporateCommunityTaxes());
      console.log('Certificate deleted and data reFetched');
      toast.success('Certificate deleted successfully.');
    } catch (error) {
      console.error('Error deleting certificate:', error);
      toast.error('Failed to delete certificate. Please try again.');
    } finally {
      handleBackToList();
    }
  };
  // Actions for table rows
  // const actions = [
  //   {
  //     icon: EyeIcon,
  //     title: 'View',
  //     onClick: handleViewCertificate,
  //     className:
  //       'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
  //   },
  //   Edit && {
  //     icon: PencilIcon,
  //     title: 'Edit',
  //     onClick: handleEditCertificate,
  //     className:
  //       'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
  //   },
  //   Delete && {
  //     icon: Trash,
  //     title: 'Delete',
  //     onClick: handleDeleteCertificate,
  //     className:
  //       'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50',
  //   },
  // ];
  const handleCTCAction = async (dv, action) => {
    setIsLoadingCTCActions(true);
    // Properly format action strings for messages
    const actionPast = action === 'approve' ? 'approved' : 'rejected';
    const actionPresent = action === 'approve' ? 'approving' : 'rejecting';
    try {
      // TODO : add action
      // const response = await axiosInstance.post(
      //   `/disbursementVoucher/${action}`,
      //   { ID: dv.ID }
      // );
      const { data } = await axiosInstance.post(
        `/corporate-ctc/${action}`,
        { ID: dv.ID }
      );
      console.log(`${actionPast}:`, data);
      // If/when you enable the API call above, replace the log with
      // `console.log(`${actionPast}:`, response.data);` and uncomment the request.
      // Refresh list after action
      dispatch(fetchCorporateCommunityTaxes());
      toast.success(`Community Tax Corporation ${actionPast} successfully`);
    } catch (error) {
      console.error(`Error ${actionPresent} Community Tax Corporation:`, error);
      toast.error(`Error ${actionPresent} Community Tax Corporation`);
    } finally {
      setIsLoadingCTCActions(false);
    }
  };

  const handleViewGL = (row) => {
    setShowGLModal(true);
    dispatch(fetchGeneralLedgers({
      LinkID: row.LinkID,
      FundID: row.FundsID || '',
      CutOffDate: row.InvoiceDate
    }));
  };

  const handleCloseGLModal = () => {
    setShowGLModal(false);
  };

  const actions = (row) => {
    const actionList = [];

    if (row.Status.toLowerCase().includes('rejected') && Edit) {
      actionList.push({
        icon: PencilIcon,
        title: 'Edit',
        onClick: handleEditCertificate,
        className:
          'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
      });
      actionList.push({
        icon: Trash,
        title: 'Delete',
        onClick: handleDeleteCertificate,
        className:
          'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
      });
    } else if (row.Status.toLowerCase().includes('requested')) {
      actionList.push(
        {
          icon: CheckLine,
          title: 'Approve',
          onClick: () => handleCTCAction(row, 'approve'),
          className:
            'text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50',
        },
        {
          icon: X,
          title: 'Reject',
          onClick: () => handleCTCAction(row, 'reject'),
          className:
            'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50',
        }
      );
    }
    actionList.push({
      icon: EyeIcon,
      title: 'View',
      onClick: handleViewCertificate,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    });

    if (row.Status.toLowerCase().includes('posted')) {
      actionList.push({
        icon: BookOpenIcon,
        title: 'View GL',
        onClick: () => handleViewGL(row),
        className:
          'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
      });
    }

    return actionList;
  };
  const handleShowList = () => {
    setShowListModal(true);
  };

  const handleCloseListModal = () => {
    setShowListModal(false);
  };
  const handleCTCSubmitSuccess = async (formData) => {
    try {
      await dispatch(addCorporateCommunityTax(formData)).unwrap();

      dispatch(fetchCorporateCommunityTaxes());

      toast.success('Certificate saved successfully.');
    } catch (error) {
      console.error('Error saving certificate:', error);
      toast.error('Failed to save certificate. Please try again.');
    } finally {
      handleBackToList();
    }
  };
  const handleVendorChange = (value) => {
    // Check if the value is an ID (number) or a custom string (new name)
    const isCustom = typeof value === 'string' && !vendorDetails.find((c) => c.ID === value);
    if (isCustom) {
      setSelectedVendor(null);
      setIsNewVendor(true);
      setNewVendorName(value);
    } else {
      const selectedVendor = vendorDetails.find((vendor) => vendor.ID === value);
      setSelectedVendor(selectedVendor);
      setIsNewVendor(false);
      setNewVendorName('');
    }
    // console.log('Selected vendor:', selectedVendor);
  };
  return (
    <>
      {currentView === 'list' && (
        <>
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4 page-header">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Community Tax Certificate - Corporate
              </h1>
              <p className="text-gray-600">
                Manage community tax certificates for corporations.
              </p>
            </div>
            {Add && (
              <button
                type="button"
                onClick={handleCreateCertificate}
                className="btn btn-primary max-sm:w-full"
              >
                <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                New Certificate
              </button>
            )}
          </div>

          <div className="mt-6">
            <DataTable
              columns={columns}
              data={certificates}
              actions={actions}
              loading={isLoading || certificatesLoading || isLoadingCTCActions}
              onRowClick={handleViewCertificate}
            />
          </div>
        </>
      )}

      {currentView === 'form' && (
        <div>
          <div className="flex justify-between items-start mb-6 flex-col  gap-8">
            <div className="flex sm:items-center gap-4 max-sm:flex-col">
              <button
                onClick={handleBackToList}
                className="mr-4 p-1 rounded-full hover:bg-neutral-100 w-fit"
              >
                <ArrowLeftIcon className="h-5 w-5 text-neutral-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {currentCertificate
                    ? 'Edit Community Tax Certificate - Corporate'
                    : 'Community Tax Certificate - Corporate'}
                </h1>
                <p className="text-gray-600">
                  {currentCertificate
                    ? 'Update the certificate details'
                    : 'Fill out the form to create a new certificate'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-end gap-2 w-full">
              <div className="sm:w-96 w-full">
                <SearchableDropdown
                  options={
                    vendorDetails?.map((vendors) => ({
                      label: vendors.Name,
                      value: vendors.ID,
                    })) || []
                  }
                  selectedValue={isNewVendor ? newVendorName : selectedVendor?.ID}
                  label="Choose Vendor"
                  placeholder="Choose Vendor or Type New Name"
                  onSelect={handleVendorChange}
                  required
                />
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleShowList}
                  className="btn btn-secondary w-full sm:w-auto"
                >
                  Show List
                </button>
                <button className="btn btn-primary w-full sm:w-auto">
                  Add Attachments
                </button>
                {currentCertificate?.Status === 'Posted' && Print && (
                  <button
                    className="btn btn-outline w-full sm:w-auto"
                    onClick={handlePrint}
                  >
                    Print
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-2 sm:p-6">
            {selectedVendor || isNewVendor ? (
              <CTCForm
                key={selectedVendor?.ID || (isNewVendor ? newVendorName : 'new-vendor')}
                selectedVendor={selectedVendor}
                initialData={currentCertificate}
                onCancel={handleBackToList}
                onSubmitSuccess={handleCTCSubmitSuccess}
                readOnly={false}
                isNewVendor={isNewVendor}
                newVendorName={newVendorName}
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-800 text-center h-[50vh] flex items-center justify-center">
                Please select a Vendor or Type New Name to start{' '}
              </h2>
            )}
          </div>
        </div>
      )}

      {currentView === 'details' && currentCertificate && (
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
                  Certificate Details
                </h1>
                <p className="text-gray-600">
                  View and manage certificate details
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {Edit && (
                <button
                  type="button"
                  onClick={() => handleEditCertificate(currentCertificate)}
                  className="btn btn-primary flex items-center"
                >
                  <PencilIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  Edit
                </button>
              )}
              {currentCertificate?.Status === 'Posted' && Print && (
                <button
                  type="button"
                  onClick={() => handlePrintCertificate(currentCertificate)}
                  className="btn btn-outline flex items-center"
                >
                  <PrinterIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  Print
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-2 sm:p-6">
            <CTCForm
              initialData={currentCertificate}
              readOnly={true}
              onBack={handleBackToList}
            />
          </div>
        </div>
      )}

      {/* Modal for General Ledger View */}
      <Modal
        isOpen={showGLModal}
        onClose={handleCloseGLModal}
        title="General Ledger Entries"
        size="4xl"
      >
        <div className="overflow-hidden border border-neutral-200 rounded-xl shadow-sm my-2">
          {isGLLoading ? (
            <div className="flex justify-center items-center py-12">
              <ArrowPathIcon className="h-8 w-8 animate-spin text-neutral-400" />
              <span className="ml-2 text-neutral-500">Loading ledger data...</span>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Fund</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Ledger Item</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Account Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Debit</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Credit</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {generalLedgers && generalLedgers.length > 0 ? (
                  generalLedgers.map((item, index) => (
                    <tr key={index} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-neutral-900">
                        {item.fund}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {item.ledger_item}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {item.account_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 font-mono">
                        {item.account_code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-neutral-900 font-medium tabular-nums">
                        {Number(item.debit) > 0 ? (
                          <span className="text-primary-700">
                            ₱{Number(item.debit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-neutral-900 font-medium tabular-nums">
                        {Number(item.credit) > 0 ? (
                          <span className="text-secondary-700">
                            ₱{Number(item.credit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        ) : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-neutral-500">
                      <div className="flex flex-col items-center justify-center">
                        <BookOpenIcon className="h-10 w-10 text-neutral-300 mb-2" />
                        <p>No ledger records found for this transaction.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              {generalLedgers && generalLedgers.length > 0 && (
                <tfoot className="bg-neutral-50 font-semibold text-neutral-900">
                  <tr>
                    <td colSpan="4" className="px-6 py-3 text-right text-xs uppercase tracking-wider text-neutral-500">Total</td>
                    <td className="px-6 py-3 text-right text-sm tabular-nums text-primary-700">
                      ₱{(generalLedgers.reduce((acc, curr) => acc + (Number(curr.debit) || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-3 text-right text-sm tabular-nums text-secondary-700">
                      ₱{(generalLedgers.reduce((acc, curr) => acc + (Number(curr.credit) || 0), 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          )}
        </div>
        <div className="flex justify-end pt-4 border-t border-neutral-200 mt-4">
          <button
            type="button"
            onClick={handleCloseGLModal}
            className="btn btn-primary px-6"
          >
            Close
          </button>
        </div>
      </Modal>

      <div style={{ display: 'none' }}>
        <CTCCorporatePrintPreview
          ref={printRef}
          certificate={currentCertificate}
          vendor={selectedVendor}
        />
      </div>
    </>
  );
}

export default CommunityTaxCorporationPage;
