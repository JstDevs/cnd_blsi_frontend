import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Plus,
  PencilIcon,
  TrashIcon,
  Building,
  FileText,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import VendorDetailsForm from '../../components/forms/VendorDetailsForm';
import {
  fetchVendorDetails,
  addVendorDetails,
  updateVendorDetails,
  deleteVendorDetails,
} from '../../features/settings/vendorDetailsSlice';
import { fetchRegions } from '../../features/settings/regionsSlice';
import { fetchProvinces } from '../../features/settings/provincesSlice';
import { fetchMunicipalities } from '../../features/settings/municipalitiesSlice';
import { fetchBarangays } from '../../features/settings/barangaysSlice';
import { fetchVendorTypes } from '../../features/settings/vendorTypeSlice';
import { fetchIndustries } from '../../features/settings/industrySlice';
import { fetchTaxCodes } from '../../features/settings/taxCodeSlice';
import { fetchPaymentTerms } from '../../features/settings/paymentTermsSlice';
import { fetchModeOfPayments } from '../../features/settings/modeOfPaymentSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function VendorDetailsPage() {
  const dispatch = useDispatch();
  const { vendorDetails, isLoading } = useSelector(
    (state) => state.vendorDetails
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (Vendor Customer Type Page - MODULE ID = 91 )
  const { Add, Edit, Delete } = useModulePermissions(91);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVendorDetails, setCurrentVendorDetails] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vendorDetailsToDelete, setVendorDetailsToDelete] = useState(null);

  const { regions } = useSelector((state) => state.regions);
  const { provinces } = useSelector((state) => state.provinces);
  const { municipalities } = useSelector((state) => state.municipalities);
  const { barangays } = useSelector((state) => state.barangays);
  const { vendorTypes } = useSelector((state) => state.vendorTypes);
  const { industries } = useSelector((state) => state.industries);
  const { taxCodes } = useSelector((state) => state.taxCodes);
  const { paymentTerms } = useSelector((state) => state.paymentTerms);
  const { modeOfPayments } = useSelector((state) => state.modeOfPayments);

  useEffect(() => {
    dispatch(fetchVendorDetails());
    dispatch(fetchRegions());
    dispatch(fetchProvinces());
    dispatch(fetchMunicipalities());
    dispatch(fetchBarangays());
    dispatch(fetchVendorTypes());
    dispatch(fetchIndustries());
    dispatch(fetchTaxCodes());
    dispatch(fetchPaymentTerms());
    dispatch(fetchModeOfPayments());
  }, [dispatch]);

  // const summaryStats = useMemo(() => {
  //   const total = vendorDetails?.length || 0;
  //   const vatable = vendorDetails?.filter((v) => v.Vatable)?.length || 0;
  //   const types = new Set(vendorDetails?.map((v) => v.TypeID).filter(Boolean)).size;
  //   return { total, vatable, types };
  // }, [vendorDetails]);

  const summaryStats = useMemo(() => {
    const total = vendorDetails?.length || 0;

    const vatableCount = vendorDetails?.filter((v) => v.Vatable)?.length || 0;
    const nonVatableCount = vendorDetails?.filter((v) => !v.Vatable)?.length || 0;

    const typeCountMap =
      vendorDetails?.reduce((acc, v) => {
        if (!v.TypeID) return acc;
        const key = v.TypeID;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {}) || {};

    const typeCounts = Object.entries(typeCountMap).map(([typeId, count]) => {
      const type = vendorTypes.find((t) => t.ID == typeId);
      return {
        id: typeId,
        name: type?.Name || 'Unknown type',
        count,
      };
    });

    return {
      total,
      vatableCount,
      nonVatableCount,
      typeCounts,
    };
  }, [vendorDetails, vendorTypes]);

  const regionOptions = regions.map((r) => ({ value: r.ID, label: r.Name }));
  const provinceOptions = provinces.map((p) => ({
    value: p.ID,
    label: p.Name,
  }));
  const municipalityOptions = municipalities.map((m) => ({
    value: m.ID,
    label: m.Name,
  }));
  const barangayOptions = barangays.map((b) => ({
    value: b.ID,
    label: b.Name,
  }));
  const vendorTypeOptions = vendorTypes.map((v) => ({
    value: v.ID,
    label: v.Name,
  }));
  const industryOptions = industries.map((i) => ({
    value: i.ID,
    label: i.Name,
  }));
  const taxCodeOptions = taxCodes.map((t) => ({ value: t.ID, label: t.Code }));
  const paymentTermsOptions = paymentTerms.map((pt) => ({
    value: pt.ID,
    label: pt.Name,
  }));
  const modeOfPaymentOptions = modeOfPayments.map((mop) => ({
    value: mop.ID,
    label: mop.Name,
  }));

  const handleAdd = () => {
    setCurrentVendorDetails(null);
    setIsModalOpen(true);
  };

  const handleEdit = (vendorDetailsRow) => {
    setCurrentVendorDetails(vendorDetailsRow);
    setIsModalOpen(true);
  };

  const handleDelete = (vendorDetailsRow) => {
    setVendorDetailsToDelete(vendorDetailsRow);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (vendorDetailsToDelete) {
      try {
        await dispatch(deleteVendorDetails(vendorDetailsToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setVendorDetailsToDelete(null);
        toast.success('Vendor details deleted successfully');
      } catch (error) {
        toast.error('Failed to delete vendor details. Please try again.');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentVendorDetails) {
        await dispatch(
          updateVendorDetails({ ...values, ID: currentVendorDetails.ID })
        ).unwrap();
        toast.success('Vendor details updated successfully');
      } else {
        await dispatch(addVendorDetails(values)).unwrap();
        toast.success('Vendor details added successfully');
      }
      dispatch(fetchVendorDetails());
    } catch (error) {
      toast.error('Failed to save vendor details. Please try again.');
    } finally {
      setIsModalOpen(false);
    }
  };

  const columns = [
    {
      key: 'Code',
      header: 'Code',
      sortable: true,
      className: 'text-neutral-900 font-medium',
      render: (value) => value || '—',
    },
    {
      key: 'Name',
      header: 'Vendor',
      sortable: true,
      render: (value) => <span className="text-neutral-900 font-medium">{value || '—'}</span>,
    },
    {
      key: 'PaymentTermsID',
      header: 'Payment Terms',
      sortable: true,
      render: (value) => {
        const terms = paymentTerms.find((t) => t.ID == value);
        return terms?.Name || 'N/A';
      },
    },
    {
      key: 'PaymentMethodID',
      header: 'Payment Method',
      sortable: true,
      render: (value) => {
        const method = modeOfPayments.find((m) => m.ID == value);
        return method?.Name || 'N/A';
      },
    },
    {
      key: 'DeliveryLeadTime',
      header: 'Lead Time (days)',
      sortable: true,
      render: (value) => value || '0',
    },
    {
      key: 'TIN',
      header: 'TIN',
      sortable: true,
      render: (value) => value || '—',
    },
    {
      key: 'Vatable',
      header: 'Vatable',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-700'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'TaxCodeID',
      header: 'Tax Code',
      sortable: true,
      render: (value) => {
        const tax = taxCodes.find((t) => t.ID == value);
        return tax?.Code || 'N/A';
      },
    },
    {
      key: 'TypeID',
      header: 'Vendor Type',
      sortable: true,
      render: (value) => {
        const type = vendorTypes.find((t) => t.ID == value);
        return type?.Name || 'N/A';
      },
    },
    {
      key: 'IndustryTypeID',
      header: 'Industry Type',
      sortable: true,
      render: (value) => {
        const industry = industries.find((i) => i.ID == value);
        return industry?.Name || 'N/A';
      },
    },
    {
      key: 'ContactPerson',
      header: 'Contact Person',
      sortable: true,
    },
    {
      key: 'PhoneNumber',
      header: 'Phone',
      sortable: true,
    },
    {
      key: 'MobileNumber',
      header: 'Mobile',
      sortable: true,
    },
    {
      key: 'EmailAddress',
      header: 'Email',
      sortable: true,
    },
    {
      key: 'Website',
      header: 'Website',
      sortable: true,
      render: (value) => value || 'No website',
    },
    {
      key: 'StreetAddress',
      header: 'Street Address',
      sortable: true,
    },
    {
      key: 'BarangayID',
      header: 'Barangay',
      sortable: true,
      render: (value) => {
        const barangay = barangays.find((b) => b.ID == value);
        return barangay?.Name || 'N/A';
      },
    },
    {
      key: 'MunicipalityID',
      header: 'Municipality',
      sortable: true,
      render: (value) => {
        const municipality = municipalities.find((m) => m.ID == value);
        return municipality?.Name || 'N/A';
      },
    },
    {
      key: 'ProvinceID',
      header: 'Province',
      sortable: true,
      render: (value) => {
        const province = provinces.find((p) => p.ID == value);
        return province?.Name || 'N/A';
      },
    },
    {
      key: 'RegionID',
      header: 'Region',
      sortable: true,
      render: (value) => {
        const region = regions.find((r) => r.ID == value);
        return region?.Name || 'N/A';
      },
    },
    {
      key: 'ZIPCode',
      header: 'ZIP Code',
      sortable: true,
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
                <Building className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">Vendor Details</h1>
                <p className="text-sm text-neutral-600 mt-0.5">
                  Manage vendor profiles, tax settings, and payment preferences
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
                Add Vendor Details
              </button>
            )}
          </div>
        </div>

        {/* Summary cards
        {!isLoading && vendorDetails?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">Total Vendors</p>
                  <p className="text-2xl font-bold text-blue-900">{summaryStats.total}</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-lg">
                  <Building className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">Vatable Vendors</p>
                  <p className="text-2xl font-bold text-green-900">{summaryStats.vatable}</p>
                </div>
                <div className="p-3 bg-green-200 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-1">Vendor Types</p>
                  <p className="text-2xl font-bold text-purple-900">{summaryStats.types}</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* Summary cards */}
        {!isLoading && vendorDetails?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Total Vendors */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">Total Vendors</p>
                  <p className="text-2xl font-bold text-blue-900">{summaryStats.total}</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-lg">
                  <Building className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </div>

            {/* Vatable vs Non‑Vatable */}
            <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 border border-emerald-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    Vatable vs Non‑Vatable
                  </p>
                  <p className="text-xs text-emerald-700/80">
                    Tax status distribution of vendors
                  </p>
                </div>
                <div className="p-3 bg-emerald-200 rounded-xl shadow-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-800" />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 bg-white/60 rounded-lg px-3 py-2 border border-emerald-100">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-medium text-emerald-800">
                        Vatable
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-emerald-900">
                      {summaryStats.vatableCount}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-emerald-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{
                        width:
                          summaryStats.total > 0
                            ? `${(summaryStats.vatableCount / summaryStats.total) * 100}%`
                            : '0%',
                      }}
                    />
                  </div>
                </div>

                <div className="flex-1 bg-white/60 rounded-lg px-3 py-2 border border-emerald-100">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      <span className="text-xs font-medium text-amber-800">
                        Non‑Vatable
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-amber-900">
                      {summaryStats.nonVatableCount}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-amber-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{
                        width:
                          summaryStats.total > 0
                            ? `${(summaryStats.nonVatableCount / summaryStats.total) * 100}%`
                            : '0%',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Vendors per Type */}
            <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100 border border-purple-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-purple-900">
                    Vendors per Type
                  </p>
                  <p className="text-xs text-purple-700/80">
                    Count of vendors for each type
                  </p>
                </div>
                <div className="p-3 bg-purple-200 rounded-xl shadow-sm">
                  <FileText className="h-5 w-5 text-purple-900" />
                </div>
              </div>

              {summaryStats.typeCounts.length === 0 ? (
                <p className="text-sm text-purple-700/80 mt-1">
                  No vendor types available.
                </p>
              ) : (
                <div className="mt-1 space-y-1.5">
                  {summaryStats.typeCounts.slice(0, 4).map((t, index) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between text-xs bg-white/70 border border-purple-100 rounded-md px-2.5 py-1.5"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            index === 0
                              ? 'bg-purple-700'
                              : index === 1
                              ? 'bg-fuchsia-500'
                              : index === 2
                              ? 'bg-violet-500'
                              : 'bg-purple-400'
                          }`}
                        />
                        <span className="text-[11px] text-neutral-800 truncate max-w-[7.5rem]">
                          {t.name}
                        </span>
                      </div>
                      <span className="font-semibold text-purple-900">
                        {t.count}
                      </span>
                    </div>
                  ))}

                  {summaryStats.typeCounts.length > 4 && (
                    <p className="text-[11px] text-purple-800/80 mt-1">
                      + {summaryStats.typeCounts.length - 4} more type
                      {summaryStats.typeCounts.length - 4 > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <h2 className="text-lg font-semibold text-neutral-900">
            Vendor Records
            <span className="ml-2 text-sm font-normal text-neutral-600">
              ({vendorDetails?.length || 0}{' '}
              {(vendorDetails?.length || 0) === 1 ? 'record' : 'records'})
            </span>
          </h2>
        </div>
        <DataTable
          columns={columns}
          data={vendorDetails || []}
          actions={actions}
          loading={isLoading}
          pagination={true}
          emptyMessage="No vendor details found. Click 'Add Vendor Details' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentVendorDetails ? 'Edit Vendor Details' : 'Add Vendor Details'}
      >
        <VendorDetailsForm
          initialData={currentVendorDetails}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          provinces={provinces}
          municipalities={municipalities}
          barangays={barangays}
          regionOptions={regionOptions}
          provinceOptions={provinceOptions}
          municipalityOptions={municipalityOptions}
          barangayOptions={barangayOptions}
          vendorTypeOptions={vendorTypeOptions}
          industryOptions={industryOptions}
          taxCodeOptions={taxCodeOptions}
          paymentTermsOptions={paymentTermsOptions}
          modeOfPaymentOptions={modeOfPaymentOptions}
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
            Are you sure you want to delete the vendor details "
            {vendorDetailsToDelete?.Name}"?
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

