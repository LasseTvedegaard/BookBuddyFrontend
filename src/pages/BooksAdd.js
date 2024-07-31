import BookCreateForm from "../components/Book/BookCreateForm";

export default function AddBookPage() {
  return (
    <>
      <div className="flex flex-col space-y-4 lg:space-y-0 lg:gap-4 lg:flex-row">
        <div className="lg:w-full">
          <div className="pb-4">
            <span className="text-3xl font-semibold text-gray-900 dark:text-white">
              Create new book
            </span>
            <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
              Fill in the form below to create a new book.
            </p>
          </div>
          <BookCreateForm />
        </div>
      </div>
    </>
  );
}
