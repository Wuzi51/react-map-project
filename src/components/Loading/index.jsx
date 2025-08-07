const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin border-2 border-t-transparent border-blue-500 rounded-full ${sizes[size]} ${className}`} />
  );
};

const Loading = ({ 
  message = '載入中...', 
  fullScreen = false, 
  size = 'medium',
  className = '' 
}) => {
  const containerClass = fullScreen 
    ? 'fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50'
    : 'flex flex-col items-center justify-center p-8';

  return (
    <div className={`${containerClass} ${className}`}>
      <LoadingSpinner size={size} />
      <p className="mt-2 text-gray-600">{message}</p>
    </div>
  );
};

export default Loading;
export { LoadingSpinner };