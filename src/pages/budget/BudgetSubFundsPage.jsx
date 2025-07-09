import React, { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'
import Modal from '../../components/common/Modal'
import BudgetFundForm from '../../components/forms/BudgetFundForm'
import BudgetSubFundsForm from '../../components/forms/BudgetSubFundsForm'

const BudgetSubFundsPage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeRow, setActiveRow] = useState(false)

  const columns = ['Fund', 'Code', 'Name', 'Description', 'Amount']

  const data = [
    {
      Fund: 'General Fund',
      Code: '20%',
      Name: '20% Fund',
      Description: 'The twenty percent fund.',
      Amount: '12,000.00'
    },
    {
      Fund: 'General Fund',
      Code: 'GF',
      Name: 'General Fund',
      Description: 'The main general fund.',
      Amount: '20,000.00'
    },
    {
      Fund: 'Special Education Fund',
      Code: 'SEF',
      Name: 'Special Education Fund',
      Description: 'The main special education fund.',
      Amount: '35,000.00'
    },
    {
      Fund: 'Trust Fund',
      Code: 'TF',
      Name: 'Trust Fund',
      Description: 'The main trust fund.',
      Amount: '25,000.00'
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
        <h1 className='text-xl font-semibold text-gray-800'>Sub Funds</h1>
        <div className='space-y-4'>
          {/* HEADER */}
          <div className='flex flex-wrap gap-4 items-center justify-between'>
            <div className='flex flex-wrap gap-3'>
              <div className='w-full md:w-56'>
                <input type='text' placeholder='Search...' />
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
                    {data.map((item, index) => (
                      <tr key={index}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Fund}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Code}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Name}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Description}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Amount}
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
        size='sm'
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={activeRow ? 'Edit Sub-Fund' : 'Add New Sub-Fund'}
      >
        <BudgetSubFundsForm
          onSubmit={handleSubmit}
          initialData={activeRow}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </>
  )
}

export default BudgetSubFundsPage
