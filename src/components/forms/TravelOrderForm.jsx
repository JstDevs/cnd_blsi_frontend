import { useFormik, FieldArray, FormikProvider, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Button from '../common/Button';

function TravelOrderForm({ initialData, onSubmit, onClose, officeOptions, employeeOptions }) {
  const validationSchema = Yup.object({
    // OfficeID: Yup.string().required('Office is required'),
    // StartDate: Yup.date().required('Start Date is required'),
    // EndDate: Yup.date().required('End Date is required'),
    // Place: Yup.string().required('Place/Office to be visited is required'),
    // Venue: Yup.string().required('Venue/Destination is required'),
    // Remarks: Yup.string(),
    // Purpose: Yup.string().required('Purpose of Travel is required'),
    // Transportation: Yup.array().of(Yup.string()).min(1, 'At least one transportation method is required'),
    // Travelers: Yup.array().of(
    //   Yup.object({
    //     EmployeeID: Yup.string().required('Employee is required')
    //   })
    // ).min(1, 'At least one traveler is required'),
    // Expenses: Yup.array().of(
    //   Yup.object({
    //     Amount: Yup.number().required('Amount is required'),
    //     SourceID: Yup.string().required('Source of Fund is required'),
    //     Type: Yup.string().required('Type is required')
    //   })
    // ).min(1, 'At least one expense is required'),
    // Documents: Yup.array().of(
    //   Yup.object({
    //     Name: Yup.string().required('Document name is required')
    //   })
    // ).min(1, 'At least one document is required'),
  });

  const formik = useFormik({
    initialValues: initialData || {
      OfficeID: '',
      StartDate: '',
      EndDate: '',
      Place: '',
      Venue: '',
      Remarks: '',
      Purpose: '',
      Transportation: [],
      Travelers: [{ EmployeeID: '' }],
      Expenses: [{ Amount: '', SourceID: '', Type: '' }],
      Documents: [{ Name: '' }],
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const { values, handleChange, handleBlur, errors, touched, isSubmitting } = formik;

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <FormField
          type="select"
          label="Office"
          name="OfficeID"
          options={officeOptions}
          value={values.OfficeID}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.OfficeID}
          touched={touched.OfficeID}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Start Date"
            name="StartDate"
            type="date"
            value={values.StartDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.StartDate}
            touched={touched.StartDate}
            required
          />
          <FormField
            label="End Date"
            name="EndDate"
            type="date"
            value={values.EndDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.EndDate}
            touched={touched.EndDate}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Place/Office to be visited"
            name="Place"
            type="text"
            value={values.Place}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Place}
            touched={touched.Place}
            required
          />
          <FormField
            label="Venue/Destination"
            name="Venue"
            type="text"
            value={values.Venue}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Venue}
            touched={touched.Venue}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            type="textarea"
            label="Remarks"
            name="Remarks"
            value={values.Remarks}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Remarks}
            touched={touched.Remarks}
          />
          <FormField
            type="textarea"
            label="Purpose of Travel"
            name="Purpose"
            value={values.Purpose}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Purpose}
            touched={touched.Purpose}
            required
          />
        </div>

        <div>
          <label className="font-medium block mb-2">Means of Transportation</label>
          <div className="grid grid-cols-2 gap-2">
            {['Plane', 'Ship/Boat', 'PUV', 'LGU Service Vehicle', 'Vehicle for Rent'].map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="Transportation"
                  value={option}
                  checked={values.Transportation.includes(option)}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    const newValue = isChecked
                      ? [...values.Transportation, option]
                      : values.Transportation.filter((val) => val !== option);
                    formik.setFieldValue('Transportation', newValue);
                  }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {touched.Transportation && errors.Transportation && (
            <p className="text-red-500 text-sm mt-1">{errors.Transportation}</p>
          )}
        </div>

        <hr />

        <FieldArray
          name="Travelers"
          render={({ remove, push }) => (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium">Travelers</label>
                <Button
                  type="button"
                  onClick={() => push({ EmployeeID: '' })}
                  className="btn btn-sm btn-primary"
                >
                  + Add
                </Button>
              </div>
              {values.Travelers.map((traveler, index) => (
                <div key={index} className="flex items-center space-x-4 mb-2">
                  <FormField
                    type="select"
                    label={`Traveler ${index + 1}`}
                    name={`Travelers[${index}].EmployeeID`}
                    options={employeeOptions}
                    value={traveler.EmployeeID}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.Travelers?.[index]?.EmployeeID}
                    touched={touched.Travelers?.[index]?.EmployeeID}
                    className="min-w-[300px]"
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="bg-red-600 hover:bg-red-700 text-white p-1"
                    disabled={values.Travelers.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        />

        <hr />

        <FieldArray
          name="Expenses"
          render={({ remove, push }) => (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium">Expenses</label>
                <Button
                  type="button"
                  onClick={() => push({ Amount: '', SourceID: '', Type: '' })}
                  className="btn btn-sm btn-primary"
                >
                  + Add
                </Button>
              </div>

              {values.Expenses?.map((expense, index) => (
                <div key={index} className="flex flex-wrap items-center items-end gap-4 mb-2">
                  {/* Amount */}
                  <FormField
                    type="number"
                    label="Amount"
                    name={`Expenses[${index}].Amount`}
                    value={expense.Amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.Expenses?.[index]?.Amount}
                    touched={touched.Expenses?.[index]?.Amount}
                    className="max-w-[180px] flex-1"
                    required
                  />

                  {/* Source of Fund */}
                  <FormField
                    type="select"
                    label="Source of Fund"
                    name={`Expenses[${index}].SourceID`}
                    options={officeOptions} // Replace with actual sourceOptions if different
                    value={expense.SourceID}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.Expenses?.[index]?.SourceID}
                    touched={touched.Expenses?.[index]?.SourceID}
                    className="min-w-[200px] flex-1"
                    required
                  />

                  {/* Type */}
                  <FormField
                    type="select"
                    label="Type"
                    name={`Expenses[${index}].Type`}
                    options={[
                      { label: 'One Time Payment', value: 'One Time Payment' },
                      { label: 'Per Day', value: 'Per Day' },
                    ]}
                    value={expense.Type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.Expenses?.[index]?.Type}
                    touched={touched.Expenses?.[index]?.Type}
                    className="min-w-[100px] flex-1"
                    required
                  />

                  {/* Remove Button */}
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="bg-red-600 hover:bg-red-700 text-white p-1 mt-2"
                    disabled={values.Expenses.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}


              {/* Total Row */}
              <div className="flex justify-end text-right mt-4">
                <label className="font-semibold mr-2">Total:</label>
                <span className="">
                  {values.Expenses?.reduce((sum, exp) => {
                    const amt = parseFloat(exp.Amount);
                    return sum + (isNaN(amt) ? 0 : amt);
                  }, 0).toFixed(2)}
                </span>
              </div>

            </div>
          )}
        />


        <hr />

        <FieldArray
          name="Documents"
          render={({ remove, push }) => (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium">Documents Required</label>
                <Button
                  type="button"
                  onClick={() => push({ Name: '' })}
                  className="btn btn-sm btn-primary"
                >
                  + Add
                </Button>
              </div>

              {values.Documents?.map((doc, index) => (
                <div key={index} className="flex items-center gap-4 mb-2">
                  <FormField
                    type="text"
                    label={`Document ${index + 1}`}
                    name={`Documents[${index}].Name`}
                    value={doc.Name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.Documents?.[index]?.Name}
                    touched={touched.Documents?.[index]?.Name}
                    className="flex-1 min-w-[300px]"
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="bg-red-600 hover:bg-red-700 text-white p-1"
                    disabled={values.Documents.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        />


        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
          <Button
            type="button"
            onClick={onClose}
            className="btn btn-outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </FormikProvider>
  );
}

export default TravelOrderForm;
