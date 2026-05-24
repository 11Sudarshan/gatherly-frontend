import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const FeedbackPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const eventName = location.state?.eventName || 'the event';
  
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return; // Prevent submission without a rating

    setIsSubmitting(true);

    // --- MOCK API CALL TO feedback-service ---
    await new Promise(resolve => setTimeout(resolve, 1500));
    // -----------------------------------------

    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      navigate('/profile');
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-surface p-8 rounded-xl shadow-md border border-outline text-center max-w-sm">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-on-surface mb-2">Thank You!</h2>
          <p className="text-secondary">Your feedback has been successfully submitted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 text-sm font-semibold text-secondary hover:text-primary transition-colors flex items-center"
      >
        ← Back to Profile
      </button>

      <div className="bg-surface border border-outline rounded-xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-primary mb-2">Rate Your Experience</h1>
        <p className="text-secondary mb-8">How was <span className="font-semibold text-on-surface">{eventName}</span>?</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Interactive Star Rating */}
          <div className="flex flex-col items-center p-6 border border-outline rounded-lg bg-background">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="text-4xl focus:outline-none transition-colors"
                >
                  <span className={`${star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>
                    ★
                  </span>
                </button>
              ))}
            </div>
            <p className="text-sm font-medium mt-3 text-secondary">
              {rating === 0 ? 'Select a rating' : `${rating} out of 5 stars`}
            </p>
          </div>

          {/* Written Review */}
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              Additional Comments (Optional)
            </label>
            <textarea
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full px-4 py-3 border border-outline rounded-md bg-background text-on-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="What did you love? What could be improved?"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={rating === 0 || isSubmitting}
            className="w-full py-3 bg-primary text-on-primary rounded-md font-bold text-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex justify-center items-center"
          >
            {isSubmitting ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            ) : (
              'Submit Feedback'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;