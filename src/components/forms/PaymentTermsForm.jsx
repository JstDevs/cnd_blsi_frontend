import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

function PaymentTermsForm({ initialData, onSubmit, onClose }) {
  const validationSchema = Yup.object({
    code: Yup.string().required('Code is required'),
    name: Yup.string().required('Name is required'),
    numberOfDays: Yup.number()
      .required('Number of Days is required')
      .integer('Number of Days must be an integer')
      .min(0, 'Number of Days cannot be negative'),
  });

  const formik = useFormik({
    initialValues: initialData || {
      code: '',
      name: '',
      numberOfDays: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <FormField
        label="Code"
        name="code"
        type="text"
        value={formik.values.code}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.code}
        touched={formik.touched.code}
        required
      />
      <FormField
        label="Name"
        name="name"
        type="text"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.name}
        touched={formik.touched.name}
        required
      />
      <FormField
        label="Number of Days"
        name="numberOfDays"
        type="number"
        value={formik.values.numberOfDays}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.numberOfDays}
        touched={formik.touched.numberOfDays}
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
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export default PaymentTermsForm;
