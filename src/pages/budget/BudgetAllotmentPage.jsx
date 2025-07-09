import React, { useEffect, useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'
import Modal from '../../components/common/Modal'
import BudgetAllotmentForm from '../../components/forms/BudgetAllotmentForm'
import { useSelector } from 'react-redux'

const API_URL = import.meta.env.VITE_API_URL

const BudgetAllotmentPage = () => {
  const { user } = useSelector((state) => state.auth)

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
    'Allotment Balance'
  ]

  const fetchBudgetAllotments = async () => {
    try {
      const response = await fetch(`${API_URL}/getAllotmentList`, {
        method: 'GET'
      })
      const res = await response.json()
      if (res?.status) {
        const { data, status } = res || {}
        setData(data || [])
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
        fetchBudgetAllotments()
        toast.success('Allotment deleted successfully')
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const handleCreate = async (values) => {
    try {
      const response = await fetch(
        `${API_URL}/budget/createOrUpdateBudgetAllotment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            IsNew: 'true',
            AppropriationBalance: 123.45,
            budgetId: 2,
            amount: 100,
            remarks: 'this is ok',
            linkID: '',
            attachments: '',
            fiscalYear: 8,
            departmentId: 1,
            subDepartmentId: 1,
            projectName: 'dfsaf',
            fundSource: '2',
            userId: user?.ID,
            ChartofAccountsID: 123,
            Appropriation: 123.45,
            TotalAmount: 123.45,
            Change: 123.45,
            Supplemental: 123.45,
            Transfer: 123.45,
            Released: 123.45,
            isNew: 'true',
            AllotmentBalance: 123.45,
            ChargedAllotment: 123.45
          })
        }
      )
      const res = await response.json()
      if (res) {
        fetchBudgetAllotments()
        setIsOpen(false)
        toast.success('Allotment added successfully')
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
          IsNew: 'true',
          AppropriationBalance: 123.45,
          budgetId: 2,
          amount: 100,
          remarks: 'this is ok',
          linkID: '',
          attachments: '',
          fiscalYear: 8,
          departmentId: 1,
          subDepartmentId: 1,
          projectName: 'dfsaf',
          fundSource: '2',
          userId: user?.ID,
          ChartofAccountsID: 123,
          Appropriation: 123.45,
          TotalAmount: 123.45,
          Change: 123.45,
          Supplemental: 123.45,
          Transfer: 123.45,
          Released: 123.45,
          isNew: 'true',
          AllotmentBalance: 123.45,
          ChargedAllotment: 123.45
        })
      })
      const res = await response.json()
      if (res) {
        fetchBudgetAllotments()
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
      fetchBudgetAllotments()
    }
  }, [data])

  return (
    <>
      <section className='space-y-8'>
        {/* TITLE */}
        <h1 className='text-xl font-semibold text-gray-800'>
          Budget Allotment
        </h1>
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
                  <option value='operation'>Operation</option>
                  <option value='management'>Management</option>
                </select>
              </div>
              <div>
                <select name='subDepartment' id='subDepartment'>
                  <option value=''>Select Sub Department</option>
                  <option value='operation'>Operation</option>
                  <option value='management'>Management</option>
                </select>
              </div>
              <div>
                <select name='chartOfAccounts' id='chartOfAccounts'>
                  <option value=''>Select Account</option>
                  <option value='operation'>Operation</option>
                  <option value='management'>Management</option>
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
          <div className='overflow-x-auto'>
            <div className='py-2 align-middle inline-block min-w-full '>
              <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      {columns?.map((item, index) => (
                        <th
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
                    {data.map((person) => (
                      <tr key={person.email}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person.Name}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person.FiscalYear}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person.Department}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person.SubDepartment}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person.ChartOfAccounts}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person.Fund}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person.Project}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person.Appropriation}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person.AppropriationBalance}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person.TotalAmount}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person.Allotment}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person.AllotmentBalance}
                        </td>
                        <td className='px-6 py-4 flex items-center space-x-4 text-right text-sm font-medium'>
                          <button
                            onClick={() => handleEdit(item)}
                            className='text-indigo-600 hover:text-indigo-900 cursor-pointer'
                          >
                            Edit
                          </button>
                          <button className='hidden text-indigo-600 hover:text-indigo-900 cursor-pointer'>
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
        </div>
      </section>

      <Modal
        size='md'
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={activeRow ? 'Edit Allotment' : 'Add New Allotment'}
      >
        <BudgetAllotmentForm
          onSubmit={handleSubmit}
          initialData={activeRow}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </>
  )
}

export default BudgetAllotmentPage
