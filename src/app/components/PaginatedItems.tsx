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
        containerClassName="flex items-center justify-center gap-2 mt-6"
        pageClassName="rounded-md"
        pageLinkClassName="px-3 py-1 block border border-gray-300 text-gray-700 bg-white hover:bg-blue-50 transition cursor-pointer"
        activeLinkClassName="bg-blue-500 text-gray-100 border-blue-500 hover:bg-blue-600"
        previousLinkClassName="px-3 py-1 border border-gray-300 text-gray-700 bg-white hover:bg-blue-50 rounded-md transition cursor-pointer"
        nextLinkClassName="px-3 py-1 border border-gray-300 text-gray-700 bg-white hover:bg-blue-50 rounded-md transition cursor-pointer"
        breakClassName="px-3 py-1 text-gray-500"
      />
    </>
  );
}
