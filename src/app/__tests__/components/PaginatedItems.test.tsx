import { render, screen, fireEvent } from '@testing-library/react';
import PaginatedItems from '@/app/components/PaginatedItems';

describe('PaginatedItems', () => {
  const items = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);
  const renderItem = (item: string) => <span>{item}</span>;

  it('初期表示で itemsPerPage の数だけアイテムが表示される', () => {
    render(<PaginatedItems items={items} itemsPerPage={3} renderItem={renderItem} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
    expect(screen.queryByText('Item 4')).not.toBeInTheDocument();
  });

  it('次ページに移動すると正しいアイテムが表示される', () => {
    render(<PaginatedItems items={items} itemsPerPage={3} renderItem={renderItem} />);
    
    const nextButton = screen.getByText('進む');
    fireEvent.click(nextButton);

    expect(screen.getByText('Item 4')).toBeInTheDocument();
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
  });
});
