import { Formik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

function FiscalYearForm({ initialData, onSubmit, onClose }) {
  const validationSchema = Yup.object({
    startDate: Yup.date().required('Start Date is required'),
    endDate: Yup.date()
      .required('End Date is required')
      .min(Yup.ref('startDate'), 'End Date must be after Start Date'),
  });

  return (
    <Formik
      initialValues={initialData || { startDate: '', endDate: '' }}
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
            label="Start Date"
            name="startDate"
            type="date"
            value={values.startDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.startDate}
            touched={touched.startDate}
            required
          />
          <FormField
            label="End Date"
            name="endDate"
            type="date"
            value={values.endDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.endDate}
            touched={touched.endDate}
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

export default FiscalYearForm;
