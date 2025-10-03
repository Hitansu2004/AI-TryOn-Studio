export default function ProductsLoading() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="h-8 w-48 bg-muted rounded mb-2 animate-pulse" />
        <div className="h-5 w-96 bg-muted rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-lg h-80 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
