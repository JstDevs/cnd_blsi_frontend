import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

function IndustryForm({ initialData, onSubmit, onClose }) {
  const validationSchema = Yup.object({
    industryType: Yup.string().required('Industry Type is required'),
  });

  const formik = useFormik({
    initialValues: initialData || {
      industryType: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <FormField
        label="Industry Type"
        name="industryType"
        type="text"
        value={formik.values.industryType}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.industryType}
        touched={formik.touched.industryType}
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

export default IndustryForm;
