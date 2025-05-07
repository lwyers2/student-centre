import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Table from '../../components/Table'

const mockProps = {
  labels: { title: 'Test Table' },
  content: {
    headers: ['Name', 'Age'],
    data: [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
    ],
    view: '/details'
  },
}

const renderTable = () => {
  render(
    <BrowserRouter>
      <Table {...mockProps} />
    </BrowserRouter>
  )
}

describe('<Table />', () => {
  test('renders table with title and headers', () => {
    renderTable()

    expect(screen.getByText(/Test Table/)).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
  })

  test('renders correct number of rows and data', () => {
    renderTable()

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()

    const viewButtons = screen.getAllByText('View')
    expect(viewButtons).toHaveLength(2)
  })

  test('toggle button hides and shows the table', () => {
    renderTable()

    const toggleButton = screen.getByRole('button', { name: /hide/i })
    expect(toggleButton).toBeInTheDocument()

    // Hide table
    fireEvent.click(toggleButton)
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()

    // Show table again
    fireEvent.click(screen.getByRole('button', { name: /show/i }))
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })
})
