import React from 'react';
import { render } from '@testing-library/react-native';
import { BourbonCard } from '../bourbon-card';
import type { Bourbon } from '@/lib/db/client';

describe('BourbonCard', () => {
  const mockBourbon: Bourbon = {
    id: 1,
    name: 'Buffalo Trace',
    distillery: 'Buffalo Trace Distillery',
    type: 'bourbon',
    proof: 90,
    age_statement: '8 years',
    msrp: 25.99,
    rarity: 'common',
    description: 'A smooth, complex bourbon',
    image_url: 'https://example.com/image.jpg',
    created_at: '2025-01-01',
    updated_at: '2025-01-01',
  };

  it('should render bourbon name', () => {
    const { getByText } = render(<BourbonCard bourbon={mockBourbon} />);
    expect(getByText('Buffalo Trace')).toBeTruthy();
  });

  it('should render distillery name', () => {
    const { getByText } = render(<BourbonCard bourbon={mockBourbon} />);
    expect(getByText('Buffalo Trace Distillery')).toBeTruthy();
  });

  it('should render proof', () => {
    const { getByText } = render(<BourbonCard bourbon={mockBourbon} />);
    expect(getByText('90°')).toBeTruthy();
  });

  it('should render price when provided', () => {
    const { getByText } = render(<BourbonCard bourbon={mockBourbon} />);
    expect(getByText('$25.99')).toBeTruthy();
  });

  it('should render description', () => {
    const { getByText } = render(<BourbonCard bourbon={mockBourbon} />);
    expect(getByText('A smooth, complex bourbon')).toBeTruthy();
  });

  it('should show rarity badge when showRarity is true', () => {
    const { getByText } = render(<BourbonCard bourbon={mockBourbon} showRarity={true} />);
    expect(getByText('common')).toBeTruthy();
  });

  it('should hide rarity badge when showRarity is false', () => {
    const { queryByText } = render(<BourbonCard bourbon={mockBourbon} showRarity={false} />);
    expect(queryByText('common')).toBeNull();
  });
});
