// frontend/src/__tests__/Components/Utils/LinkCard.test.js
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import LinkCard from '../../../components/Utils/LinkCard'

describe('<LinkCard />', () => {
  const mockOnClick = jest.fn()

  beforeEach(() => {
    render(<LinkCard title="Dashboard" onClick={mockOnClick} />)
  })

  test('renders the title correctly', () => {
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  test('calls onClick when clicked', () => {
    fireEvent.click(screen.getByText('Dashboard'))
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})
