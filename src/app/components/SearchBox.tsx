
export default function SearchBox() {
  return (
    <>
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="bg-white p-0.5 mt-2 w-2xs rounded text-black placeholder-gray-400"
            placeholder="リポジトリ名を入力してください"
          />
          <button className="bg-blue-500 text-white rounded-md px-4 py-1 mt-2">
            検索
          </button>
        </div>
      </div>
    </>
  );
}
