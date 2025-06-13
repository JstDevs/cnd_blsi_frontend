import { Formik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

function FinancialStatementForm({ initialData, onSubmit, onClose }) {
  const validationSchema = Yup.object({
    code: Yup.string().required('Code is required'),
    name: Yup.string().required('Name is required'),
  });

  return (
    <Formik
      initialValues={initialData || { code: '', name: '' }}
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
            label="Name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
            touched={touched.name}
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

export default FinancialStatementForm;
