import { Formik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

// Mock data for Tax Type select
const mockTaxTypes = [
  { value: 'vat', label: 'VAT' },
  { value: 'ewt', label: 'EWT' },
  { value: 'other', label: 'Other' },
];

function TaxCodeForm({ initialData, onSubmit, onClose }) {
  const validationSchema = Yup.object({
    type: Yup.string().required('Type is required'),
    code: Yup.string().required('Code is required'),
    natureOfPayment: Yup.string().required('Nature of Payment is required'),
    rate: Yup.number()
      .required('Rate is required')
      .min(0, 'Rate cannot be negative')
      .max(100, 'Rate cannot exceed 100%'),
  });

  return (
    <Formik
      initialValues={initialData || {
        type: '',
        code: '',
        natureOfPayment: '',
        rate: 0,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Type"
            name="type"
            type="select"
            options={mockTaxTypes}
            value={values.type}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.type}
            touched={touched.type}
            required
          />
          <FormField
            label="Code"
            name="code"
            type="text"
            value={values.code}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.code}
            touched={touched.code}
            required
          />
          <FormField
            label="Nature of Payment"
            name="natureOfPayment"
            type="text"
            value={values.natureOfPayment}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.natureOfPayment}
            touched={touched.natureOfPayment}
            required
          />
          <FormField
            label="Rate (%)"
            name="rate"
            type="number"
            step="0.01"
            value={values.rate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.rate}
            touched={touched.rate}
            required
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
}

export default TaxCodeForm;
