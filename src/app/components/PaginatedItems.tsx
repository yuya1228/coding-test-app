import { useState } from "react";
import ReactPaginate from "react-paginate";

type PaginatedProps<T> = {
  items: T[];
  itemsPerPage: number;
  renderItem: (item: T) => React.ReactNode;
};

export default function PaginatedItems<T>({
  items,
  itemsPerPage,
  renderItem,
}: PaginatedProps<T>) {
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    setItemOffset((event.selected * itemsPerPage) % items.length);
  };

  return (
    <>
      {currentItems.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      ))}
      <ReactPaginate
        breakLabel="..."
        nextLabel="進む"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="戻る"
        renderOnZeroPageCount={null}
        // ===== css =====
        containerClassName="flex items-center gap-2 justify-center" // 全体を横並び中央
        pageLinkClassName="" // 各ページ番号
        activeLinkClassName="" // アクティブページ
        previousLinkClassName="" // < previous
        nextLinkClassName="" // next >
      />
    </>
  );
}
