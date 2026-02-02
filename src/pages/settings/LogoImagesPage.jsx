import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Building,
  Edit as EditIcon,
  X,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  Save,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import FormField from '../../components/common/FormField';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

const LogoImagesPage = () => {
  const dispatch = useDispatch();
  // ---------------------USE MODULE PERMISSIONS------------------START (PpeSuppliersPage - MODULE ID = 96 )
  const { Edit } = useModulePermissions(58);
  useEffect(() => { fetchLogoImages() }, [dispatch]);

  const API_URL = import.meta.env.VITE_API_URL;
  const fetchLogoImages = async () => {
    try {
      const token = sessionStorage.getItem('token');

      const response = await fetch(`${API_URL}/logoImages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch Logo and Images info');
      }
      const data = await response.json();
      console.log('Logo and Images info received:', data); // Debug log
      setLogoImages(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Error loading Logo and Images info:', error);
      toast.error('Failed to load Logo and Images info');
    }
  };

  const updateLogoImages = async (values) => {
    try {
      const token = sessionStorage.getItem('token');
      const isNew = !values.ID;
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? `${API_URL}/logoImages` : `${API_URL}/logoImages/${values.ID}`;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText); // Debug log
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || 'Failed to update Logo and Images' };
        }
        throw new Error(errorData.message || 'Failed to update Logo and Images');
      }

      const updated = await response.json();
      console.log('Update response:', updated); // Debug log

      setLogoImages(updated);
      return true;
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update Logo and Images. Please try again.');
      return false;
    }
  };

  const [logoimages, setLogoImages] = useState({
    ID: null,
    ImageOne: '',
    ImageTwo: '',
    ImageThree: '',
    ImageFour: '',
    ImageFive: '',
    ImageSix: '',
    ImageSeven: '',
    ImageEight: '',
    ImageNine: '',
    ImageTen: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const formik = useFormik({
    initialValues: logoimages,
    enableReinitialize: true,

    onSubmit: async (values, { setSubmitting }) => {
      const success = await updateLogoImages(values);
      if (success) {
        setIsEditing(false);
        toast.success('Logo and Images updated successfully');
        fetchLogoImages();
      }
      setSubmitting(false);
    },
  });

  const handleCancelEdit = () => {
    formik.resetForm();
    setIsEditing(false);
    fetchLogoImages();
  };


  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              {/* <div className="p-2 bg-primary-100 rounded-lg">
                  <Building className="h-6 w-6 text-primary-600" />
                </div> */}
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  Logo and Images
                </h1>
                <p className="text-sm text-neutral-600 mt-0.5">
                  Manage the logos and images that appears in the system
                </p>
              </div>
            </div>
          </div>
          {Edit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
            >
              <EditIcon className="h-5 w-5" />
              Edit Image
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-neutral-900">
                Report Logo and Images
              </h2>
            </div>
            {isEditing && (
              <button
                onClick={handleCancelEdit}
                className="text-neutral-600 hover:text-neutral-900 flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {isEditing ? (
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <FormField
                  label="Image One"
                  name="ImageOne"
                  value={formik.values.ImageOne}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.ImageOne}
                  touched={formik.touched.ImageOne}
                />
                <FormField
                  label="Image Two"
                  name="ImageTwo"
                  value={formik.values.ImageTwo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.ImageTwo}
                  touched={formik.touched.ImageTwo}
                />
                <FormField
                  label="Image Three"
                  name="ImageThree"
                  value={formik.values.ImageThree}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.ImageThree}
                  touched={formik.touched.ImageThree}
                />
                <FormField
                  label="Image Four"
                  name="ImageFour"
                  value={formik.values.ImageFour}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.ImageFour}
                  touched={formik.touched.ImageFour}
                />
                <FormField
                  label="Image Five"
                  name="ImageFive"
                  value={formik.values.ImageFive}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.ImageFive}
                  touched={formik.touched.ImageFive}
                />
                <FormField
                  label="Image Six"
                  name="ImageSix"
                  value={formik.values.ImageSix}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.ImageSix}
                  touched={formik.touched.ImageSix}
                />

                <FormField
                  label="Image Seven"
                  name="ImageSeven"
                  value={formik.values.ImageSeven}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.ImageSeven}
                  touched={formik.touched.ImageSeven}
                />

                <FormField
                  label="Image Eight"
                  name="ImageEight"
                  value={formik.values.ImageEight}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.ImageEight}
                  touched={formik.touched.ImageEight}
                />

                <FormField
                  label="Image Nine"
                  name="ImageNine"
                  value={formik.values.ImageNine}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.ImageNine}
                  touched={formik.touched.ImageNine}
                />

                <FormField
                  label="Image Ten"
                  name="ImageTen"
                  value={formik.values.ImageTen}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.ImageTen}
                  touched={formik.touched.ImageTen}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200 col-span-full">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center gap-2"
                  disabled={formik.isSubmitting}
                >
                  <Save className="h-4 w-4" />
                  {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Image One</p>
                    <p className="text-base font-semibold text-neutral-900">{logoimages.ImageOne || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Image Two</p>
                    <p className="text-base font-semibold text-neutral-900">{logoimages.ImageTwo || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Image Three</p>
                    <p className="text-base font-semibold text-neutral-900">{logoimages.ImageThree || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Image Four</p>
                    <p className="text-base font-semibold text-neutral-900">{logoimages.ImageFour || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Image Five</p>
                    <p className="text-base font-semibold text-neutral-900">{logoimages.ImageFive || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Image Six</p>
                    <p className="text-base font-semibold text-neutral-900">{logoimages.ImageSix || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Image Seven</p>
                    <p className="text-base font-semibold text-neutral-900">{logoimages.ImageSeven || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Image Eight</p>
                    <p className="text-base font-semibold text-neutral-900">{logoimages.ImageEight || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Image Nine</p>
                    <p className="text-base font-semibold text-neutral-900">{logoimages.ImageNine || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Image Ten</p>
                    <p className="text-base font-semibold text-neutral-900">{logoimages.ImageTen || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoImagesPage;

