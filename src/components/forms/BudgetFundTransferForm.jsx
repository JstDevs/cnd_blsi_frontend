import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import FormField from '../common/FormField'
import { useEffect, useState } from 'react'

const validationSchema = Yup.object({
  sourceCode: Yup.string().required('Code is required'),
  sourceFundName: Yup.string().required('Name is required'),
  sourceBalance: Yup.number()
    .required('Balance is required')
    .min(0, 'Balance must be positive'),
  sourceTransfer: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be positive'),
  targetRemarks: Yup.string().required('Year is required'),
  targetCode: Yup.string().required('Code is required'),
  targetFundName: Yup.string().required('Name is required'),
  targetBalance: Yup.number()
    .required('Balance is required')
    .min(0, 'Balance must be positive'),
  targetTransfer: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be positive'),
})

const initialValues = {
  sourceCode: '',
  sourceFundName: '',
  sourceBalance: 0,
  sourceTransfer: 0,
  sourceRemarks: '',
  targetCode: '',
  targetFundName: '',
  targetBalance: 0,
  targetTransfer: 0,
  targetRemarks: ''
}

function BudgetFundTransferForm({ initialData, onSubmit, onClose }) {
  const [formData, setFormData] = useState({ ...initialValues })

  const handleSubmit = (values, { setSubmitting }) => {
    onSubmit(values)
    setSubmitting(false)
    console.log('Form submitted with values:', values)
  }

  useEffect(() => {
    if (initialData?.ID) {
      setFormData({
        id: initialData?.ID,
        budgetName: initialData?.Name,
        fiscalYear: initialData?.FiscalYearID,
        department: initialData?.DepartmentID,
        subDepartment: initialData?.SubDepartmentID,
        chartOfAccounts: initialData?.ChartofAccountsID,
        fund: initialData?.FundID,
        project: initialData?.ProjectID,
        appropriation: initialData?.Appropriation,
        charges: initialData?.Charges,
        totalAmount: initialData?.TotalAmount,
        balance: initialData?.AppropriationBalance,
        january: initialData?.January,
        february: initialData?.February,
        march: initialData?.March,
        april: initialData?.April,
        may: initialData?.May,
        june: initialData?.June,
        july: initialData?.July,
        august: initialData?.August,
        september: initialData?.September,
        october: initialData?.October,
        november: initialData?.November,
        december: initialData?.December
      })
    } else {
      setFormData(initialValues)
    }
  }, [initialData])

  return (
    <Formik
      enableReinitialize
      onSubmit={handleSubmit}
      initialValues={formData}
      validationSchema={validationSchema}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting
      }) => (
        <Form className='space-y-4'>
          <div className='space-y-4'>
            <p className='font-medium'>Fund Source</p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <FormField
                label='Code'
                name='targeteCode'
                type='text'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.targeteCode}
                error={errors.targetCode}
                touched={touched.targetCode}
                required
              />
              <FormField
                label='Name'
                name='targetFundName'
                type='text'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.targetFundName}
                error={errors.targetFundName}
                touched={touched.targetFundName}
                required
              />
              <FormField
                label='Balance'
                name='targetBalance'
                type='text'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.targetBalance}
                error={errors.targetBalance}
                touched={touched.targetBalance}
                required
              />
              <FormField
                label='Transfer'
                name='targetTransfer'
                type='text'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.targetTransfer}
                error={errors.targetTransfer}
                touched={touched.targetTransfer}
                required
              />
              <FormField
                name='targetRemarks'
                type='textarea'
                label='Remarks'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.targetRemarks}
                error={errors.targetRemarks}
                touched={touched.targetRemarks}
                required
              />
            </div>
          </div>

          <div className='space-y-4'>
            <p className='font-medium'>Fund Target</p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <FormField
                label='Code'
                name='code'
                type='text'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.sourceCode}
                error={errors.sourceCode}
                touched={touched.sourceCode}
                required
              />
              <FormField
                label='Name'
                name='name'
                type='text'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.sourceFundName}
                error={errors.sourceFundName}
                touched={touched.sourceFundName}
                required
              />
              <FormField
                label='Balance'
                name='sourceBalance'
                type='text'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.sourceBalance}
                error={errors.sourceBalance}
                touched={touched.sourceBalance}
                required
              />
              <FormField
                label='Transfer'
                name='sourceTransfer'
                type='text'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.sourceTransfer}
                error={errors.sourceTransfer}
                touched={touched.sourceTransfer}
                required
              />
              <FormField
                name='sourceRemarks'
                type='textarea'
                label='Remarks'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.sourceRemarks}
                error={errors.sourceRemarks}
                touched={touched.sourceRemarks}
                required
              />
            </div>
          </div>

          <div className='flex justify-end space-x-3'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              {initialData ? 'Update' : 'Save'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default BudgetFundTransferForm
