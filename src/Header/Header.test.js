import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import Header from './index';

describe('Header Component', () => {
  
  test('renders logo image with alt text "Cora"', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const logo = screen.getByAltText(/Cora/i);
    expect(logo).toBeInTheDocument();
  });

  test('renders the main heading', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const mainHeading = screen.getByText(/Hey There/i);
    expect(mainHeading).toBeInTheDocument();
  });

  test('renders the subheading with correct text', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const subHeading = screen.getByText(/Tenha um ótimo teste/i);
    expect(subHeading).toBeInTheDocument();
  });

  test('renders TO-DO LIST link with correct path', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const todoLink = screen.getByRole('link', { name: /TO-DO LIST/i });
    expect(todoLink).toBeInTheDocument();
    expect(todoLink.getAttribute('href')).toBe('/todo');
  });

  test('renders IBANKING link with correct path', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const ibankingLink = screen.getByRole('link', { name: /IBANKING/i });
    expect(ibankingLink).toBeInTheDocument();
    expect(ibankingLink.getAttribute('href')).toBe('/ibanking');
  });

  test('renders disclaimer text with error warning', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const disclaimer = screen.getByText((content, element) => 
        content.includes("Você pode encontrar alguns")
    );
    expect(disclaimer).toBeInTheDocument();
      
      
  });
});
