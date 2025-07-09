import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const API_URL = import.meta.env.VITE_API_URL

const BudgetSummaryPage = () => {
  const { departments } = useSelector((state) => state.departments)
  const { subdepartments } = useSelector((state) => state.subdepartments)
  const { accounts } = useSelector((state) => state.chartOfAccounts)

  const [data, setData] = useState([])

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

  const fetchBudgetSummaries = async () => {
    try {
      const response = await fetch(`${API_URL}/budget/budgetlist`, {
        method: 'GET'
      })
      const res = await response.json()
      if (res.success) {
        setData(res.data || [])
      } else {
        console.log('Something went wrong')
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  useEffect(() => {
    if (data?.length === 0) {
      fetchBudgetSummaries()
    }
  }, [data])

  return (
    <>
      <section className='space-y-8'>
        {/* TITLE */}
        <h1 className='text-xl font-semibold text-gray-800'>Budget Summary</h1>
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
            <div></div>
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
                          key={index}
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider'
                        >
                          {item}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {data?.map((person) => (
                      <tr key={person.email}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.Name || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.FiscalYearID || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.Department?.Name || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.SubDepartment?.Name || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.ChartOfAccounts || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.Funds?.Name || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.Project?.Name || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.Appropriation || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.AppropriationBalance || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.TotalAmount || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.ChargedAllotment || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.AllotmentBalance || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.Charges || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.PreEncumbrance || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.Encumbrance || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.January || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.February || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.March || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.April || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.May || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.June || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.June || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.August || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.September || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.October || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.November || 'N/A'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {person?.December || 'N/A'}
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
    </>
  )
}

export default BudgetSummaryPage
