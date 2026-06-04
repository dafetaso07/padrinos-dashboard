interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 p-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg w-full text-center">
        <div className="text-red-500 text-4xl mb-3">⚠️</div>
        <h3 className="text-red-800 font-semibold text-lg mb-2">Error al cargar datos</h3>
        <p className="text-red-600 text-sm mb-4">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm cursor-pointer"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
