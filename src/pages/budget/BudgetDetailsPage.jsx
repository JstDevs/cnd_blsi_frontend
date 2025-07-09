import React, { useEffect, useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'
import Modal from '../../components/common/Modal'
import BudgetForm from '../../components/forms/BudgetForm'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import NoRecord from '../../components/Misc/NoRecord'

const API_URL = import.meta.env.VITE_API_URL

const BudgetDetailsPage = () => {
  const { user } = useSelector((state) => state.auth)
  const { departments } = useSelector((state) => state.departments)
  const { subdepartments } = useSelector((state) => state.subdepartments)
  const { accounts } = useSelector((state) => state.chartOfAccounts)

  const [data, setData] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeRow, setActiveRow] = useState(false)

  const columns = [
    'Name',
    'Fiscal Year',
    'Department',
    'Sub Department',
    'Chart of Accounts',
    'Fund',
    'Project',
    'Appropriation',
    'Appropriation Balance',
    'Total Amount',
    'Allotment',
    'Allotment Balance',
    'Charges',
    'Pre Encumbr',
    'Encumbrance',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const fetchBudgetDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/budget`, { method: 'GET' })
      const res = await response.json()
      if (res?.status) {
        const { items, status, ...rest } = res || {}
        setData(res?.items || [])
      } else {
        console.log('Something went wrong')
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/budget/${id}`, {
        method: 'DELETE'
      })
      const res = await response.json()
      if (res) {
        fetchBudgetDetails()
        toast.success('Budget deleted successfully')
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const handleCreate = async (values) => {
    try {
      const response = await fetch(`${API_URL}/budget`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          FiscalYearID: values?.fiscalYear,
          FundID: values?.fund,
          ProjectID: values?.project,
          Name: values?.budgetName,
          DepartmentID: values?.department,
          SubDepartmentID: values?.subDepartment,
          ChartofAccountsID: values?.chartOfAccounts,
          Appropriation: values?.appropriation,
          TotalAmount: values?.totalAmount,
          AppropriationBalance: values?.charges,
          Charges: values?.charges,
          January: values?.january,
          February: values?.february,
          March: values?.march,
          April: values?.april,
          May: values?.may,
          June: values?.june,
          July: values?.july,
          August: values?.august,
          September: values?.september,
          October: values?.october,
          November: values?.november,
          December: values?.december,
          CreatedBy: user?.UserName,
          CreatedDate: new Date().toISOString(),
          ModifyBy: user?.UserName,
          ModifyDate: new Date().toISOString()
        })
      })
      const res = await response.json()
      if (res) {
        fetchBudgetDetails()
        setIsOpen(false)
        toast.success('Budget added successfully')
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const handleUpdate = async (values) => {
    try {
      const response = await fetch(`${API_URL}/budget/${values?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          FiscalYearID: values?.fiscalYear,
          FundID: values?.fund,
          ProjectID: values?.project,
          Name: values?.budgetName,
          DepartmentID: values?.department,
          SubDepartmentID: values?.subDepartment,
          ChartofAccountsID: values?.chartOfAccounts,
          Appropriation: values?.appropriation,
          TotalAmount: values?.totalAmount,
          AppropriationBalance: values?.charges,
          Charges: values?.charges,
          January: values?.january,
          February: values?.february,
          March: values?.march,
          April: values?.april,
          May: values?.may,
          June: values?.june,
          July: values?.july,
          August: values?.august,
          September: values?.september,
          October: values?.october,
          November: values?.november,
          December: values?.december,
          CreatedBy: user?.UserName,
          CreatedDate: new Date().toISOString(),
          ModifyBy: user?.UserName,
          ModifyDate: new Date().toISOString()
        })
      })
      const res = await response.json()
      if (res) {
        fetchBudgetDetails()
        setIsOpen(false)
        toast.success('Budget updated successfully')
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const handleSubmit = (values) => {
    if (activeRow) {
      handleUpdate(values)
    } else {
      handleCreate(values)
    }
  }

  const handleEdit = (data) => {
    setActiveRow(data)
    setIsOpen(true)
  }

  useEffect(() => {
    if (data?.length === 0) {
      fetchBudgetDetails()
    }
  }, [data])

  return (
    <>
      <section className='space-y-8'>
        {/* TITLE */}
        <h1 className='text-xl font-semibold text-gray-800'>Budget Details</h1>

        <div className='space-y-4'>
          {/* HEADER */}
          <div className='flex flex-wrap gap-4 items-center justify-between'>
            <div className='flex flex-wrap gap-3'>
              <div className='w-full md:w-56'>
                <input type='text' placeholder='Search...' />
              </div>
              <div>
                <select name='department' id='department'>
                  <option value=''>Select Department</option>
                  {departments?.map((item) => (
                    <option key={item?.ID} value={item?.ID}>
                      {item?.Name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select name='subDepartment' id='subDepartment'>
                  <option value=''>Select Sub Department</option>
                  {subdepartments?.map((item) => (
                    <option key={item?.ID} value={item?.ID}>
                      {item?.Name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select name='chartOfAccounts' id='chartOfAccounts'>
                  <option value=''>Select Account</option>
                  {accounts?.map((item) => (
                    <option key={item?.ID} value={item?.ID}>
                      {item?.Name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <button onClick={() => handleEdit(null)} className='btn'>
                <PlusIcon className='-ml-0.5 mr-2 h-5 w-5' aria-hidden='true' />
                Add
              </button>
            </div>
          </div>
          {/* COLUMNS */}
          {data?.length > 0 ? (
            <div className='overflow-x-auto'>
              <div className='py-2 align-middle inline-block min-w-full '>
                <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        {columns?.map((item, index) => (
                          <th            
                            key={item}
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'
                          >
                            {item}
                          </th>
                        ))}
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {data.map((item, index) => (
                        <tr key={index}>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.Name || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.FiscalYear || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.Department?.Name || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.SubDepartment?.Name || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.ChartofAccounts?.Name || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.FundId || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.ProjectID || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.Appropriation || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.AppropriationBalance || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.TotalAmount || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.Allotment || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.AllotmentBalance || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.ChargedAllotment || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.PreEncumbrance || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.Encumbrance || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.January || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.February || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.March || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.April || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.May || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.June || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.June || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.August || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.September || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.October || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.November || 'N/A'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                            {item?.December || 'N/A'}
                          </td>
                          <td className='px-6 py-4 flex items-center space-x-4 text-right text-sm font-medium'>
                            <button
                              onClick={() => handleEdit(item)}
                              className='text-indigo-600 hover:text-indigo-900 cursor-pointer'
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item?.ID)}
                              className='text-indigo-600 hover:text-indigo-900 cursor-pointer'
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <NoRecord />
          )}
        </div>
      </section>

      <Modal
        size='md'
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={activeRow ? 'Edit Budget' : 'Add New Budget'}
      >
        <BudgetForm
          onSubmit={handleSubmit}
          initialData={activeRow}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </>
  )
}

export default BudgetDetailsPage
