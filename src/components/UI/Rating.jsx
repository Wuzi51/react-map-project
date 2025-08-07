const Rating = ({ value = 0, max = 5, size = 'medium', readonly = true, onChange }) => {
  const sizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-xl'
  };

  const handleStarClick = (rating) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className={`flex items-center ${sizes[size]}`}>
      <div className="flex items-center space-x-0.5 flex-shrink-0">
        {[...Array(max)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= value;
          const isHalfFilled = value > index && value < starValue;
          
          return (
            <button
              key={index}
              onClick={() => handleStarClick(starValue)}
              disabled={readonly}
              className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform flex-shrink-0`}
            >
              {isHalfFilled ? (
                <span className="relative inline-block">
                  <span className="text-gray-300">★</span>
                  <span className="absolute inset-0 text-yellow-400 overflow-hidden" style={{ width: '50%' }}>★</span>
                </span>
              ) : (
                <span className={isFilled ? 'text-yellow-400' : 'text-gray-300'}>★</span>
              )}
            </button>
          );
        })}
      </div>
      <span className="ml-2 text-gray-600 flex-shrink-0 whitespace-nowrap">({value.toFixed(1)})</span>
    </div>
  );
};

export default Rating;