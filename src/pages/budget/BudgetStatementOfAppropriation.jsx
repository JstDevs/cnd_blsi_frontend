import React, { useState } from 'react'
import Modal from '../../components/common/Modal'
import BudgetForm from '../../components/forms/BudgetForm'

const BudgetStatementOfAppropriation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeRow, setActiveRow] = useState(false)

  const columns = [
    'Fund',
    'Year',
    'MonthEnd',
    'AccountCode',
    'ID',
    'Category',
    'Name',
    'Appropriation',
    'Allotment',
    'Obligation',
    'UnobligatedAppropriation',
    'UnobligatedAllotment',
    'Municipality',
    'Province',
    'RequestedBy',
    'Position'
  ]

  const data = [
    {
      Fund: 'General Fund',
      Year: '2025',
      MonthEnd: '03-31-2025',
      AccountCode: '10101020',
      ID: 'A001',
      Category: 'Cash',
      Name: 'Petty Cash',
      Appropriation: '500,000.00',
      Allotment: '400,000.00',
      Obligation: '350,000.00',
      UnobligatedAppropriation: '150,000.00',
      UnobligatedAllotment: '50,000.00',
      Municipality: 'SAN DIONISIO',
      Province: 'ILOILO',
      RequestedBy: 'Juan Dela Cruz',
      Position: 'Budget Officer'
    },
    {
      Fund: 'Special Education Fund',
      Year: '2025',
      MonthEnd: '03-31-2025',
      AccountCode: '10301040',
      ID: 'A002',
      Category: 'Receivables',
      Name: 'Notes Receivable',
      Appropriation: '200,000.00',
      Allotment: '150,000.00',
      Obligation: '120,000.00',
      UnobligatedAppropriation: '80,000.00',
      UnobligatedAllotment: '30,000.00',
      Municipality: 'SAN DIONISIO',
      Province: 'ILOILO',
      RequestedBy: 'Maria Santos',
      Position: 'Accounting Clerk'
    },
    {
      Fund: 'Trust Fund',
      Year: '2025',
      MonthEnd: '03-31-2025',
      AccountCode: '10205020',
      ID: 'A003',
      Category: 'Investments',
      Name: 'Guaranty Deposits',
      Appropriation: '300,000.00',
      Allotment: '250,000.00',
      Obligation: '200,000.00',
      UnobligatedAppropriation: '100,000.00',
      UnobligatedAllotment: '50,000.00',
      Municipality: 'SAN DIONISIO',
      Province: 'ILOILO',
      RequestedBy: 'Carlos Reyes',
      Position: 'Treasurer'
    },
    {
      Fund: 'General Fund',
      Year: '2025',
      MonthEnd: '03-31-2025',
      AccountCode: '10403030',
      ID: 'A004',
      Category: 'Inventories',
      Name: 'Finished Goods Inventory',
      Appropriation: '100,000.00',
      Allotment: '80,000.00',
      Obligation: '70,000.00',
      UnobligatedAppropriation: '30,000.00',
      UnobligatedAllotment: '10,000.00',
      Municipality: 'SAN DIONISIO',
      Province: 'ILOILO',
      RequestedBy: 'Ana Lopez',
      Position: 'Supply Officer'
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
          Statement of Appropriations, Allotment, Obligations and Balances
        </h1>
        <div className='space-y-4'>
          {/* HEADER */}
          <div className='w-full flex flex-wrap items-end gap-3'>
            <div className='w-full md:w-44'>
              <label htmlFor='startDate'>Start Date</label>
              <input type='date' placeholder='Select start date' />
            </div>
            <div className='w-full md:w-44'>
              <label htmlFor='endDate'>End Date</label>
              <input type='date' placeholder='Select start date' />
            </div>
            <div className='w-full md:w-36'>
              <label htmlFor='fund'>Select Fund</label>
              <select name='fund' id='fund'>
                <option value=''>-- Select --</option>
                <option value='operation'>Operation</option>
                <option value='management'>Management</option>
              </select>
            </div>
            <div className='w-full md:w-36'>
              <label htmlFor='fiscalYear'>Fiscal Year</label>
              <select name='fiscalYear' id='fiscalYear'>
                <option value=''>Select -- </option>
                <option value='feb-aug'>Feb Aug</option>
                <option value='mar-aug'>Mar Aug</option>
              </select>
            </div>
            <div className='w-full md:w-36'>
              <label htmlFor='department'>Department</label>
              <select name='department' id='department'>
                <option value=''>Select --</option>
                <option value='operation'>Operation</option>
                <option value='management'>Management</option>
              </select>
            </div>
            <div className='space-x-3'>
              <button className='btn'>View</button>
              <button className='btn'>View SAO</button>
              <button className='btn'>Generate SAAOB</button>
              <button className='btn'>Generate SAO</button>
              <button className='btn'>Export to Excel</button>
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
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {data.map((item, index) => (
                      <tr key={index}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Fund}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Year}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.MonthEnd}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.AccountCode}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.ID}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Category}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Name}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Appropriation}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Allotment}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Obligation}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.UnobligatedAppropriation}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.UnobligatedAllotment}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Municipality}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Province}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.RequestedBy}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {item.Position}
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

export default BudgetStatementOfAppropriation
