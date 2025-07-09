import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import FormField from '../common/FormField'
import { useEffect, useState } from 'react'

const validationSchema = Yup.object({
  sourceBudgetName: Yup.string().required('Code is required'),
  sourceFiscalYear: Yup.string().required('Code is required'),
  sourceDepartment: Yup.string().required('Code is required'),
  sourceSubDepartment: Yup.string().required('Code is required'),
  sourceAccounts: Yup.string().required('Code is required'),
  sourceFund: Yup.string().required('Code is required'),
  sourceProject: Yup.string().required('Code is required'),
  sourceTransfer: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be positive'),
  sourceRemarks: Yup.string().required('Year is required'),
  sourceAppropriation: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be positive'),
  sourceAppropriationBalance: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be positive'),
  sourceReleasedAllotments: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be positive'),
  sourceAllotmentBalance: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be positive'),
  targetBudgetName: Yup.string().required('Code is required'),
  targetFiscalYear: Yup.string().required('Code is required'),
  targetDepartment: Yup.string().required('Code is required'),
  targetSubDepartment: Yup.string().required('Code is required'),
  targetAccounts: Yup.string().required('Code is required'),
  targetFund: Yup.string().required('Code is required'),
  targetProject: Yup.string().required('Code is required'),
  targetTransfer: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be positive'),
  targetRemarks: Yup.string().required('Year is required'),
  targetAppropriation: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be positive'),
  targetAppropriationBalance: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be positive'),
  targetReleasedAllotments: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be positive'),
  targetAllotmentBalance: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be positive')
})

const initialValues = {
  sourceBudgetName: '',
  sourceFiscalYear: '',
  sourceDepartment: '',
  sourceSubDepartment: '',
  sourceAccounts: '',
  sourceFund: '',
  sourceProject: '',
  sourceTransfer: 0,
  sourceRemarks: '',
  sourceAppropriation: 0,
  sourceAppropriationBalance: 0,
  sourceReleasedAllotments: 0,
  sourceAllotmentBalance: 0,
  targetBudgetName: '',
  targetFiscalYear: '',
  targetDepartment: '',
  targetSubDepartment: '',
  targetAccounts: '',
  targetFund: '',
  targetProject: '',
  targetTransfer: 0,
  targetRemarks: '',
  targetAppropriation: 0,
  targetAppropriationBalance: 0,
  targetReleasedAllotments: 0,
  targetAllotmentBalance: 0
}

function BudgetTransferForm({ initialData, onSubmit, onClose }) {
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
          <div className='space-y-6'>
            <p className='font-medium'>Account Source</p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <FormField
                label='Budget Name'
                name='sourceBudgetName'
                type='text'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.sourceBudgetName}
                error={errors.sourceBudgetName}
                touched={touched.sourceBudgetName}
                required
              />
              <FormField
                label='Fiscal Year'
                name='sourceFiscalYear'
                type='text'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.sourceFiscalYear}
                error={errors.sourceFiscalYear}
                touched={touched.sourceFiscalYear}
                required
              />
              <FormField
                label='Department'
                name='sourceDepartment'
                type='text'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.sourceDepartment}
                error={errors.sourceDepartment}
                touched={touched.sourceDepartment}
                required
              />
              <FormField
                label='Sub Department'
                name='sourceSubDepartment'
                type='text'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.sourceSubDepartment}
                error={errors.sourceSubDepartment}
                touched={touched.sourceSubDepartment}
                required
              />
              <FormField
                name='sourceAccounts'
                type='text'
                label='Chat of Accounts'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.sourceAccounts}
                error={errors.sourceAccounts}
                touched={touched.sourceAccounts}
                required
              />
              <FormField
                name='sourceFund'
                type='text'
                label='Fund'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.sourceFund}
                error={errors.sourceFund}
                touched={touched.sourceFund}
                required
              />
              <FormField
                name='sourceProject'
                type='text'
                label='Project'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.sourceProject}
                error={errors.sourceProject}
                touched={touched.sourceProject}
                required
              />
              <FormField
                name='sourceTransfer'
                type='number'
                label='Transfer'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.sourceTransfer}
                error={errors.sourceTransfer}
                touched={touched.sourceTransfer}
                required
              />
              <FormField
                name='sourceAppropriation'
                type='number'
                label='Appropriation'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.sourceAppropriation}
                error={errors.sourceAppropriation}
                touched={touched.sourceAppropriation}
                required
              />{' '}
              <FormField
                name='sourceAppropriationBalance'
                type='number'
                label='Appropriation Balance'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.sourceAppropriationBalance}
                error={errors.sourceAppropriationBalance}
                touched={touched.sourceAppropriationBalance}
                required
              />
              <FormField
                name='Remarks'
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

          <div className='space-y-6'>
            <p className='font-medium'>Account Target</p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <FormField
                label='Budget Name'
                name='targetBudgetName'
                type='text'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.targetBudgetName}
                error={errors.targetBudgetName}
                touched={touched.targetBudgetName}
                required
              />
              <FormField
                label='Fiscal Year'
                name='targetFiscalYear'
                type='text'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.targetFiscalYear}
                error={errors.targetFiscalYear}
                touched={touched.targetFiscalYear}
                required
              />
              <FormField
                label='Department'
                name='targetDepartment'
                type='text'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.targetDepartment}
                error={errors.targetDepartment}
                touched={touched.targetDepartment}
                required
              />
              <FormField
                label='Sub Department'
                name='targetSubDepartment'
                type='text'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.targetSubDepartment}
                error={errors.targetSubDepartment}
                touched={touched.targetSubDepartment}
                required
              />
              <FormField
                name='targetAccounts'
                type='text'
                label='Chat of Accounts'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.targetAccounts}
                error={errors.targetAccounts}
                touched={touched.targetAccounts}
                required
              />
              <FormField
                name='targetFund'
                type='text'
                label='Fund'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.targetFund}
                error={errors.targetFund}
                touched={touched.targetFund}
                required
              />
              <FormField
                name='targetProject'
                type='text'
                label='Project'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.targetProject}
                error={errors.targetProject}
                touched={touched.targetProject}
                required
              />
              <FormField
                name='targetTransfer'
                type='number'
                label='Transfer'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.targetTransfer}
                error={errors.targetTransfer}
                touched={touched.targetTransfer}
                required
              />
              <FormField
                name='targetAppropriation'
                type='number'
                label='Appropriation'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.targetAppropriation}
                error={errors.targetAppropriation}
                touched={touched.targetAppropriation}
                required
              />{' '}
              <FormField
                name='targetAppropriationBalance'
                type='number'
                label='Appropriation Balance'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.targetAppropriationBalance}
                error={errors.targetAppropriationBalance}
                touched={touched.targetAppropriationBalance}
                required
              />
              <FormField
                name='targetRemarks '
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

export default BudgetTransferForm
