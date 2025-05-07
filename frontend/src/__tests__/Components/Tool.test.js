import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Tool from '../../components/Tool'

describe('<Tool />', () => {
  const props = {
    linkTo: '/test-path',
    titleLabel: 'Test Tool',
    desLabel: 'This is a test description',
    img: '/test-image.png',
    imgAlt: 'Test Image'
  }

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <Tool {...props} />
      </BrowserRouter>
    )
  }

  test('renders image, title, description, and link correctly', () => {
    renderComponent()

    // Check the image
    const image = screen.getByAltText(props.imgAlt)
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', props.img)

    // Check title and description
    expect(screen.getByText(props.titleLabel)).toBeInTheDocument()
    expect(screen.getByText(props.desLabel)).toBeInTheDocument()

    // Check the link (by href)
    const link = screen.getByRole('link', { name: /Test Tool/i })
    expect(link).toHaveAttribute('href', props.linkTo)
  })
})
