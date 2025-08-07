const Divider = ({ children, className = '' }) => {
  if (children) {
    return (
      <div className={`flex items-center my-4 ${className}`}>
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-600 font-medium">{children}</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
    );
  }

  return <hr className={`border-gray-300 my-4 ${className}`} />;
};

export default Divider;