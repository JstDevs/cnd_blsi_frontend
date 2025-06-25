import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import Button from '../common/Button';
import { Trash2 } from 'lucide-react';
import Select from 'react-select';

function JournalEntryForm({ initialData, onSubmit, onClose, typeOptions, fundOptions, centerOptions, accountOptions }) {
  const validationSchema = Yup.object({
    Type: Yup.string().required('Type is required'),
    Fund: Yup.string().required('Fund is required'),
    Date: Yup.date().required('Date is required'),
    DVNo: Yup.string().required('DV No is required'),
    Particulars: Yup.string().required('Particulars are required'),
    Payee: Yup.string().required('Payee is required'),
    OBRNo: Yup.string(),
    CheckNo: Yup.string(),
    CheckDate: Yup.date(),
    AccountingEntries: Yup.array().of(
      Yup.object({
        ResponsibilityCenter: Yup.string().required('Required'),
        Account: Yup.string().required('Required'),
        PR: Yup.string(),
        Debit: Yup.number().nullable().typeError('Must be a number'),
        Credit: Yup.number().nullable().typeError('Must be a number'),
      })
    ).min(1, 'At least one entry is required'),
  });

  const formik = useFormik({
    initialValues: initialData || {
      Type: '',
      Fund: '',
      Date: '',
      DVNo: '',
      Particulars: '',
      Payee: '',
      OBRNo: '',
      CheckNo: '',
      CheckDate: '',
      AccountingEntries: [{ ResponsibilityCenter: '', Account: '', PR: '', Debit: '', Credit: '' }],
    },
    validationSchema,
    onSubmit,
  });

  const { values, handleChange, handleBlur, errors, touched } = formik;

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="space-y-4">

        {/* Row 1 */}
        <div className="grid grid-cols-3 gap-4">
          <FormField
            type="select"
            label="Type"
            name="Type"
            options={typeOptions}
            value={values.Type}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Type}
            touched={touched.Type}
            required
          />
          <FormField
            type="select"
            label="Fund"
            name="Fund"
            options={fundOptions}
            value={values.Fund}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Fund}
            touched={touched.Fund}
            required
          />
          <FormField
            type="date"
            label="Date"
            name="Date"
            value={values.Date}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Date}
            touched={touched.Date}
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            type="text"
            label="DV No"
            name="DVNo"
            value={values.DVNo}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.DVNo}
            touched={touched.DVNo}
            required
          />
          <FormField
            type="text"
            label="Particulars"
            name="Particulars"
            value={values.Particulars}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Particulars}
            touched={touched.Particulars}
            required
          />
          <FormField
            type="text"
            label="Payee"
            name="Payee"
            value={values.Payee}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Payee}
            touched={touched.Payee}
            required
          />
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-3 gap-4">
          <FormField
            type="text"
            label="OBR No"
            name="OBRNo"
            value={values.OBRNo}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.OBRNo}
            touched={touched.OBRNo}
          />
          <FormField
            type="text"
            label="Check No"
            name="CheckNo"
            value={values.CheckNo}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.CheckNo}
            touched={touched.CheckNo}
          />
          <FormField
            type="date"
            label="Check Date"
            name="CheckDate"
            value={values.CheckDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.CheckDate}
            touched={touched.CheckDate}
          />
        </div>

        <hr />

        {/* Accounting Entries Section */}
        <FieldArray
          name="AccountingEntries"
          render={({ remove, push }) => (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium">Accounting Entries</label>
                <Button
                  type="button"
                  onClick={() => push({ ResponsibilityCenter: '', Account: '', PR: '', Debit: '', Credit: '' })}
                  className="btn btn-sm btn-primary"
                >
                  + Add
                </Button>
              </div>

              {values.AccountingEntries.map((entry, index) => (
                <div key={index} className="space-y-2 border p-4 rounded-md bg-neutral-50">
                  <div className="flex flex-wrap gap-2 w-full">
                    <FormField
                    className='flex-1 min-w-[200px]'
                      type="select"
                      label="Responsibility Center"
                      name={`AccountingEntries[${index}].ResponsibilityCenter`}
                      options={centerOptions}
                      value={entry.ResponsibilityCenter}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.AccountingEntries?.[index]?.ResponsibilityCenter}
                      touched={touched.AccountingEntries?.[index]?.ResponsibilityCenter}
                      required
                    />
                    <div className='flex-1 min-w-[200px]'>
                      <div><label className='form-label'>Accounts and Explanation</label></div>
                      <Select
                        label="Accounts and Explanation"
                        options={accountOptions}
                        placeholder="Select an account..."
                        isSearchable={true}
                        onChange={(selected) => console.log(selected)}
                        required
                        name={`AccountingEntries[${index}].AccountExplanation`}
                        value={entry.AccountExplanation}
                        onBlur={handleBlur}
                      />
                    </div>
                    <FormField
                    className='flex-1 max-w-[150px]'
                      type="text"
                      label="PR"
                      name={`AccountingEntries[${index}].PR`}
                      value={entry.PR}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.AccountingEntries?.[index]?.PR}
                      touched={touched.AccountingEntries?.[index]?.PR}
                      required
                    />
                    <FormField
                      className='flex-1 max-w-[150px]'
                      type="number"
                      label="Debit"
                      name={`AccountingEntries[${index}].Debit`}
                      value={entry.Debit}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.AccountingEntries?.[index]?.Debit}
                      touched={touched.AccountingEntries?.[index]?.Debit}
                      required
                    />
                    <FormField
                      className='flex-1 max-w-[150px]'
                      type="number"
                      label="Credit"
                      name={`AccountingEntries[${index}].Credit`}
                      value={entry.Credit}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.AccountingEntries?.[index]?.Credit}
                      touched={touched.AccountingEntries?.[index]?.Credit}
                      required
                    />
                  </div>

                  <div className="flex justify-end pt-0">
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      className="bg-red-600 hover:bg-red-700 text-white p-1"
                      disabled={values.AccountingEntries.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                
              ))}


              {/* ✅ Totals Row */}
              <div className="grid grid-cols-6 gap-4 border-t pt-4 font-semibold">
                <div className="col-span-2 text-right">Total:</div>

                <div className='col-span-2 text-right'>
                  <div className="text-green-600 font-bold">
                    {values.AccountingEntries.reduce(
                      (sum, e) => sum + (parseFloat(e.Debit) || 0),
                      0
                    ).toFixed(2)}{' '}
                    <span className="text-sm font-normal text-gray-500">(debit)</span>
                  </div>
                </div>

                <div className='col-span-2 text-right'>
                  <div className="text-red-600 font-bold">
                    {values.AccountingEntries.reduce(
                      (sum, e) => sum + (parseFloat(e.Credit) || 0),
                      0
                    ).toFixed(2)}{' '}
                    <span className="text-sm font-normal text-gray-500">(credit)</span>
                  </div>
                </div>
              </div>


            </div>
          )}
        />

        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
          <Button type="button" onClick={onClose} className="btn btn-outline">
            Cancel
          </Button>
          <Button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </FormikProvider>
  );
}

export default JournalEntryForm;
