import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import { TrashIcon } from 'lucide-react';
import { DocumentIcon } from '@heroicons/react/24/outline';

const MARRIAGE_SERVICE_RECEIPT_SCHEMA = Yup.object().shape({
  invoiceNumber: Yup.string().required('Invoice number is required'),
  customer: Yup.string().required('Customer is required'),
  customerAge: Yup.number()
    .required('Age is required')
    .positive('Age must be positive')
    .integer('Age must be a whole number'),
  remarks: Yup.string().required('Remarks are required'),
  invoiceDate: Yup.date().required('Invoice date is required'),
  cenomar: Yup.string().required('CENOMAR is required'),
  marryTo: Yup.string().required('"Marry to" is required'),
  marryToAge: Yup.number()
    .required('Age is required')
    .positive('Age must be positive')
    .integer('Age must be a whole number'),
  registerNumber: Yup.string().required('Register number is required'),
  price: Yup.number()
    .required('Price is required')
    .min(0, 'Price cannot be negative'),
  remainingBalance: Yup.number()
    .required('Balance is required')
    .min(0, 'Balance cannot be negative'),
  amountReceived: Yup.number()
    .required('Amount received is required')
    .min(0, 'Amount cannot be negative'),
});

function MarriageServiceReceiptForm({ initialData, onClose, onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const initialValues = initialData || {
    invoiceNumber: 'MA-RE-30GE-CEIPT',
    customer: '',
    customerAge: '',
    remarks: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    cenomar: '',
    marryTo: '',
    marryToAge: '',
    registerNumber: '',
    price: 1002,
    remainingBalance: 0,
    amountReceived: 0,
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDeleteFile = (id) => {
    setSelectedFiles((prev) => prev.filter((file) => file.id !== id));
  };
  // Helper function to format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  const marryToOptions = [
    { label: 'Marry to 1', value: 'Marry to 1' },
    { label: 'Marry to 2', value: 'Marry to 2' },
    { label: 'Marry to 3', value: 'Marry to 3' },
    { label: 'Marry to 4', value: 'Marry to 4' },
    { label: 'Marry to 5', value: 'Marry to 5' },
  ];
  return (
    <div className="space-y-4">
      <div className="w-full pt-4 flex justify-end gap-4 items-center">
        <button
          type="button"
          // onClick={handleShowList}
          className="btn btn-secondary flex-initial"
        >
          Show List
        </button>
        <button className="btn btn-outline flex-initial">Print</button>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={MARRIAGE_SERVICE_RECEIPT_SCHEMA}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form className="space-y-4">
            {/* Attachments Section */}
            <div className="mb-4">
              <div>
                <h2 className="font-bold mb-2">Attachments</h2>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
                />
              </div>
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">
                    Selected Files:
                  </h3>
                  <ul className="divide-y divide-gray-200">
                    {selectedFiles.map((file) => (
                      <li
                        key={file.id}
                        className="py-2 flex justify-between items-center"
                      >
                        <div className="flex items-center space-x-2">
                          <DocumentIcon className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-600 truncate max-w-xs">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({formatFileSize(file.size)})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Invoice Number */}
            <FormField
              label="Invoice Number"
              name="invoiceNumber"
              type="text"
              required
              value={values.invoiceNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.invoiceNumber}
              touched={touched.invoiceNumber}
            />

            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Customer"
                name="customer"
                type="text"
                required
                value={values.customer}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.customer}
                touched={touched.customer}
              />
              <FormField
                label="Age"
                name="customerAge"
                type="number"
                required
                value={values.customerAge}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.customerAge}
                touched={touched.customerAge}
                min="1"
              />
            </div>

            {/* Remarks */}
            <FormField
              label="Remarks"
              name="remarks"
              type="textarea"
              rows={3}
              required
              value={values.remarks}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.remarks}
              touched={touched.remarks}
            />

            {/* Invoice Date */}
            <FormField
              label="Invoice Date"
              name="invoiceDate"
              type="date"
              required
              value={values.invoiceDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.invoiceDate}
              touched={touched.invoiceDate}
            />

            {/* Marriage Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="CENOMAR"
                name="cenomar"
                type="text"
                required
                value={values.cenomar}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.cenomar}
                touched={touched.cenomar}
              />
              <FormField
                label="Marry to"
                name="marryTo"
                type="select"
                required
                options={marryToOptions}
                value={values.marryTo}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.marryTo}
                touched={touched.marryTo}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Age"
                name="marryToAge"
                type="number"
                required
                value={values.marryToAge}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.marryToAge}
                touched={touched.marryToAge}
                min="1"
              />
              <FormField
                label="Register Number"
                name="registerNumber"
                type="text"
                required
                value={values.registerNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.registerNumber}
                touched={touched.registerNumber}
              />
            </div>

            {/* Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Price"
                name="price"
                type="number"
                required
                value={values.price}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.price}
                touched={touched.price}
                min="0"
              />
              <FormField
                label="Remaining Balance"
                name="remainingBalance"
                type="number"
                required
                value={values.remainingBalance}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.remainingBalance}
                touched={touched.remainingBalance}
                min="0"
              />
              <FormField
                label="Amount Received"
                name="amountReceived"
                type="number"
                required
                value={values.amountReceived}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.amountReceived}
                touched={touched.amountReceived}
                min="0"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {initialData ? 'Update' : 'Create'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default MarriageServiceReceiptForm;
