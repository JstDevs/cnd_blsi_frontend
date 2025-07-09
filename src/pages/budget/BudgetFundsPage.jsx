import React, { useEffect, useState } from 'react'
import Modal from '../../components/common/Modal'
import BudgetFundForm from '../../components/forms/BudgetFundForm'
import { toast } from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL

const BudgetFundsPage = () => {
  const [data, setData] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeRow, setActiveRow] = useState(false)

  const columns = ['Code', 'Name', 'Description', 'Original Amount']

  const fetchBudgetFunds = async () => {
    try {
      const response = await fetch(`${API_URL}/funds`, { method: 'GET' })
      const res = await response.json()
      if (res) {
        setData(res || [])
      } else {
        console.log('Something went wrong')
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/funds/${id}`, {
        method: 'DELETE'
      })
      const res = await response.json()
      if (res) {
        fetchBudgetFunds()
        toast.success('Fund deleted successfully')
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const handleCreate = async (values) => {
    try {
      const response = await fetch(`${API_URL}/funds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          LinkID: 1,
          Code: values?.code,
          Name: values?.name,
          Description: values?.desc,
          OriginalAmount: values?.amount
        })
      })
      const res = await response.json()
      if (res) {
        fetchBudgetFunds()
        setIsOpen(false)
        toast.success('Fund added successfully')
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const handleUpdate = async (values) => {
    try {
      const response = await fetch(`${API_URL}/funds/${values?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          LinkID: 1,
          Code: values?.code,
          Name: values?.name,
          Description: values?.desc,
          OriginalAmount: values?.amount
        })
      })
      const res = await response.json()
      if (res) {
        fetchBudgetFunds()
        setIsOpen(false)
        toast.success('Fund updated successfully')
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
      fetchBudgetFunds()
    }
  }, [data])

  return (
    <>
      <section className='space-y-8'>
        {/* TITLE */}
        <h1 className='text-xl font-semibold text-gray-800'>Budget Fund</h1>
        {/* HEADER */}
        <div className='flex flex-wrap gap-4 items-center justify-between'>
          <div className='flex flex-wrap gap-3'>
            <div className='w-full md:w-56'>
              <input type='text' placeholder='Search...' />
            </div>
          </div>
          <div>
            <button onClick={() => handleEdit(null)} className='btn'>
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
                        {item?.Code || 'N/A'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                        {item?.Name || 'N/A'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                        {item?.Description || 'N/A'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                        {item?.OriginalAmount || 'N/A'}
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
      </section>

      <Modal
        size='sm'
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={activeRow ? 'Edit Fund' : 'Add New Fund'}
      >
        <BudgetFundForm
          onSubmit={handleSubmit}
          initialData={activeRow}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </>
  )
}

export default BudgetFundsPage
