import React, { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'
import Modal from '../../components/common/Modal'
import BudgetSupplementalForm from '../../components/forms/BudgetSupplementalForm'

const BudgetSupplementalPage = () => {
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

  const data = [
    {
      Name: 'Travelling E...',
      FiscalYear: 'january to d...',
      Department: 'Municipal Di...',
      SubDepartment: 'Network Op...',
      ChartOfAccounts: 'Travelling E...',
      Fund: 'General Fund',
      Project: 'No Project',
      Appropriation: '1,00,000.00',
      AppropriationBalance: '-8,45,000.00',
      TotalAmount: '1,55,000.00',
      Allotment: '1,00,000.00',
      AllotmentBalance: '1,00,000.00'
    },
    {
      Name: 'Accountable...',
      FiscalYear: 'january to d...',
      Department: 'Accounting',
      SubDepartment: 'Network Op...',
      ChartOfAccounts: 'Accountable...',
      Fund: 'General Fund',
      Project: 'No Project',
      Appropriation: '21.00',
      AppropriationBalance: '0.00',
      TotalAmount: '21.00',
      Allotment: '250.00',
      AllotmentBalance: '250.00'
    },
    {
      Name: 'Investments',
      FiscalYear: 'feb aug',
      Department: 'Accounting',
      SubDepartment: 'Payroll',
      ChartOfAccounts: 'Investments',
      Fund: 'General Fund',
      Project: 'No Project',
      Appropriation: '60,000.00',
      AppropriationBalance: '60,000.00',
      TotalAmount: '60,000.00',
      Allotment: '0.00',
      AllotmentBalance: '0.00'
    },
    {
      Name: 'Cash - Local...',
      FiscalYear: 'january to d...',
      Department: 'Office of the...',
      SubDepartment: 'Network Op...',
      ChartOfAccounts: 'Cash - Local...',
      Fund: 'General Fund',
      Project: 'No Project',
      Appropriation: '0.00',
      AppropriationBalance: '0.00',
      TotalAmount: '10.00',
      Allotment: '0.00',
      AllotmentBalance: '0.00'
    },
    {
      Name: 'Allowance f...',
      FiscalYear: 'january to d...',
      Department: 'Office of the...',
      SubDepartment: 'Network Op...',
      ChartOfAccounts: 'Allowance f...',
      Fund: 'General Fund',
      Project: 'No Project',
      Appropriation: '10,00,000.00',
      AppropriationBalance: '7,20,000.00',
      TotalAmount: '9,70,000.00',
      Allotment: '2,50,000.00',
      AllotmentBalance: '2,50,000.00'
    },
    {
      Name: 'Due to LGUs',
      FiscalYear: 'feb aug',
      Department: 'Accounting',
      SubDepartment: 'Payroll',
      ChartOfAccounts: 'Due to LGUs',
      Fund: 'General Fund',
      Project: 'No Project',
      Appropriation: '0.00',
      AppropriationBalance: '0.00',
      TotalAmount: '0.00',
      Allotment: '1,00,000.00',
      AllotmentBalance: '1,00,000.00'
    }
  ]

  const handleSubmit = (values) => {
    if (activeRow) {
      console.log('Updated')
    } else {
      console.log('Created')
    }
  }

  const handleEdit = (data) => {
    setActiveRow(data)
    setIsOpen(true)
  }

  return (
    <>
      <section className='space-y-8'>
        {/* TITLE */}
        <h1 className='text-xl font-semibold text-gray-800'>
          Budget Supplemental
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
              <button onClick={() => setIsOpen(true)} className='btn'>
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
                          <button className='text-indigo-600 hover:text-indigo-900 cursor-pointer'>
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
        title={activeRow ? 'Edit Request' : 'Add New Request'}
      >
        <BudgetSupplementalForm
          onSubmit={handleSubmit}
          initialData={activeRow}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </>
  )
}

export default BudgetSupplementalPage
