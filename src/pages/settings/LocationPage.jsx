import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import {
  regionSchema,
  provinceSchema,
  municipalitySchema,
  barangaySchema,
} from '../../utils/validationSchemas';

function LocationPage() {
  const [activeTab, setActiveTab] = useState('region');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

  const mockData = {
    regions: [
      { id: 1, name: 'Region I' },
      { id: 2, name: 'Region II' },
    ],
    provinces: [
      { id: 1, name: 'Ilocos Norte', regionId: 1, regionName: 'Region I' },
      { id: 2, name: 'Ilocos Sur', regionId: 1, regionName: 'Region I' },
    ],
    municipalitys: [
      { id: 1, name: 'Laoag City', provinceId: 1, provinceName: 'Ilocos Norte', regionId: 1, regionName: 'Region I' },
      { id: 2, name: 'Batac City', provinceId: 1, provinceName: 'Ilocos Norte', regionId: 1, regionName: 'Region I' },
    ],
    barangays: [
      { id: 1, name: 'Barangay 1', provinceId: 1, provinceName: 'Ilocos Norte', municipalityId: 1, municipalityName: 'Laoag City', regionId: 1, regionName: 'Region I' },
      { id: 2, name: 'Barangay 2', provinceId: 1, provinceName: 'Ilocos Norte', municipalityId: 1, municipalityName: 'Laoag City', regionId: 1, regionName: 'Region I' },
    ],
  };

  const getValidationSchema = () => {
    switch (activeTab) {
      case 'region':
        return regionSchema;
      case 'province':
        return provinceSchema;
      case 'municipality':
        return municipalitySchema;
      case 'barangay':
        return barangaySchema;
      default:
        return regionSchema;
    }
  };

  const getColumns = () => {
    switch (activeTab) {
      case 'region':
        return [{ key: 'name', header: 'Region', sortable: true }];
      case 'province':
        return [
          { key: 'regionName', header: 'Region', sortable: true },
          { key: 'name', header: 'Province', sortable: true },
        ];
      case 'municipality':
        return [
          { key: 'regionName', header: 'Region', sortable: true },
          { key: 'provinceName', header: 'Province', sortable: true },
          { key: 'name', header: 'Municipality', sortable: true },
        ];
      case 'barangay':
        return [
          { key: 'regionName', header: 'Region', sortable: true },
          { key: 'provinceName', header: 'Province', sortable: true },
          { key: 'municipalityName', header: 'Municipality', sortable: true },
          { key: 'name', header: 'Barangay', sortable: true },
        ];
      default:
        return [];
    }
  };

  const getData = () => mockData[`${activeTab}s`] || [];

  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: (location) => handleEditLocation(location),
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: TrashIcon,
      title: 'Delete',
      onClick: (location) => handleDeleteLocation(location),
      className: 'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50'
    },
  ];

  const handleCreateLocation = () => {
    setCurrentLocation(null);
    setIsModalOpen(true);
  };

  const handleEditLocation = (location) => {
    setCurrentLocation(location);
    setIsModalOpen(true);
  };

  const handleDeleteLocation = (location) => {
    setLocationToDelete(location);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (locationToDelete) {
      setIsDeleteModalOpen(false);
      setLocationToDelete(null);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      formik.resetForm({
        values: currentLocation || {
          name: '',
          regionId: '',
          provinceId: '',
          municipalityId: '',
        }
      });
    }
  }, [isModalOpen, currentLocation]);

  const formik = useFormik({
    initialValues: currentLocation || {
      name: '',
      regionId: '',
      provinceId: '',
      municipalityId: '',
    },
    enableReinitialize: true,
    validationSchema: getValidationSchema(),
    // onSubmit: (values) => {
    //   console.log('Submitted:', values);
    //   setIsModalOpen(false);
    // },
    onSubmit: async (values, { setSubmitting }) => {
    console.log('Submitted:', values);
    setIsModalOpen(false);
    setSubmitting(false);
  },
  });

  const getFormFields = () => {
    const commonProps = {
      formik,
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      required: true,
    };

    switch (activeTab) {
      case 'region':
        return (
          <FormField
            label="Region"
            name="name"
            type="text"
            placeholder="Enter region name"
            value={formik.values.name}
            error={formik.errors.name}
            touched={formik.touched.name}
            {...commonProps}
          />
        );
      case 'province':
        return (
          <>
            <FormField
              label="Province"
              name="name"
              type="text"
              placeholder="Enter province name"
              value={formik.values.name}
              error={formik.errors.name}
              touched={formik.touched.name}
              {...commonProps}
            />
            <FormField
              label="Region"
              name="regionId"
              type="select"
              options={mockData.regions.map(r => ({ value: r.id, label: r.name }))}
              value={formik.values.regionId}
              error={formik.errors.regionId}
              touched={formik.touched.regionId}
              {...commonProps}
            />
          </>
        );
      case 'municipality':
        return (
          <>
            <FormField
              label="Municipality"
              name="name"
              type="text"
              value={formik.values.name}
              error={formik.errors.name}
              touched={formik.touched.name}
              placeholder="Enter municipality name"
              {...commonProps}
            />
            <FormField
              label="Province"
              name="provinceId"
              type="select"
              options={mockData.provinces.map(p => ({ value: p.id, label: p.name }))}
              value={formik.values.provinceId}
              error={formik.errors.provinceId}
              touched={formik.touched.provinceId}
              {...commonProps}
            />
            <FormField
              label="Region"
              name="regionId"
              type="select"
              options={mockData.regions.map(r => ({ value: r.id, label: r.name }))}
              value={formik.values.regionId}
              error={formik.errors.regionId}
              touched={formik.touched.regionId}
              {...commonProps}
            />
          </>
        );
      case 'barangay':
        return (
          <>
            <FormField
              label="Barangay"
              name="name"
              type="text"
              value={formik.values.name}
              error={formik.errors.name}
              touched={formik.touched.name}
              placeholder="Enter barangay name"
              {...commonProps}
            />
            <FormField
              label="Municipality"
              name="municipalityId"
              type="select"
              options={mockData.municipalitys.map(m => ({ value: m.id, label: m.name }))}
              value={formik.values.municipalityId}
              error={formik.errors.municipalityId}
              touched={formik.touched.municipalityId}
              {...commonProps}
            />
            <FormField
              label="Province"
              name="provinceId"
              type="select"
              options={mockData.provinces.map(p => ({ value: p.id, label: p.name }))}
              value={formik.values.provinceId}
              error={formik.errors.provinceId}
              touched={formik.touched.provinceId}
              {...commonProps}
            />
            <FormField
              label="Region"
              name="regionId"
              type="select"
              options={mockData.regions.map(r => ({ value: r.id, label: r.name }))}
              value={formik.values.regionId}
              error={formik.errors.regionId}
              touched={formik.touched.regionId}
              {...commonProps}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Locations</h1>
            <p>Manage regions, provinces, municipalities, and barangays</p>
          </div>
          <button
            type="button"
            onClick={handleCreateLocation}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </button>
        </div>
      </div>

      <div className="flex mb-6 border-b border-neutral-200">
        <nav className="-mb-px flex flex-wrap gap-x-10 gap-y-0">
          {['region', 'province', 'municipality', 'barangay'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}s
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-4">
        <DataTable
          columns={getColumns()}
          data={getData()}
          actions={actions}
          pagination={true}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentLocation ? `Edit ${activeTab}` : `New ${activeTab}`}
      >
        <form onSubmit={formik.handleSubmit} className="p-4 space-y-4">
          {getFormFields()}
          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Saving...' : currentLocation ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="p-4">
          <p className="text-neutral-700">
            Are you sure you want to delete this {activeTab}?
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-neutral-200">
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
        </div>
      </Modal>
    </div>
  );
}

export default LocationPage;
