import React, { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'
import Modal from '../../components/common/Modal'
import BudgetFundTransferForm from '../../components/forms/BudgetFundTransferForm'

const BudgetFundTransferPage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeRow, setActiveRow] = useState(false)

  const columns = [
    'Code',
    'Name',
    'Description',
    'Original Amount',
    'Balance',
    'Total'
  ]

  const data = [
    {
      Code: '100',
      Name: 'General Fund',
      Description: 'The general fund.',
      OriginalAmount: '50,10,00,00,050.00',
      Balance: '50,10,00,00,050.00',
      Total: '50,10,00,00,050.00'
    },
    {
      Code: '300',
      Name: 'Trust Fund',
      Description: 'The trust fund.',
      OriginalAmount: '1,99,950.00',
      Balance: '3,00,000.00',
      Total: '3,00,000.00'
    },
    {
      Code: '200',
      Name: 'Special Education Fund',
      Description: 'The special education fund.',
      OriginalAmount: '2,00,000.00',
      Balance: '2,00,000.00',
      Total: '2,00,000.00'
    },
    {
      Code: '000',
      Name: 'Test Fund',
      Description: 'This is just a test fund. This will also be deleted.',
      OriginalAmount: '1,00,000.00',
      Balance: '1,00,000.00',
      Total: '1,00,000.00'
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
        <h1 className='text-xl font-semibold text-gray-800'>Fund Transfer</h1>
        <div className='space-y-4'>
          {/* HEADER */}
          <div className='flex flex-wrap gap-4 items-center justify-between'>
            <div>
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
                          {item.Code}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Name}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Description}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.OriginalAmount}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Balance}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Total}
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
        title={activeRow ? 'Edit Fund Transfer' : 'Add Fund Transfer'}
      >
        <BudgetFundTransferForm
          onSubmit={handleSubmit}
          initialData={activeRow}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </>
  )
}

export default BudgetFundTransferPage
