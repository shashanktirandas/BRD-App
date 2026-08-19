import React from 'react';
import './pageNotFound.css';

const NotFoundPage = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <>
    <div className="not-found-page">
      <div className=" container container-star">
        {Array.from({ length: 30 }).map((_, index) => (
          <div key={`star-1-${index}`} className="star-1"></div>
        ))}
        {Array.from({ length: 30 }).map((_, index) => (
          <div key={`star-2-${index}`} className="star-2"></div>
        ))}
      </div>

      <div className="container container-bird">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`bird-${index}`} className="bird bird-anim">
            <div className="bird-container">
              <div className="wing wing-left">
                <div className="wing-left-top"></div>
              </div>
              <div className="wing wing-right">
                <div className="wing-right-top"></div>
              </div>
            </div>
          </div>
        ))}

        <div className="container-title">
          <div className="title">
            <div className="number">4</div>
            <div className="moon">
              <div className="face">
                <div className="mouth"></div>
                <div className="eyes">
                  <div className="eye-left"></div>
                  <div className="eye-right"></div>
                </div>
              </div>
            </div>
            <div className="number">4</div>
          </div>
          <div className="subtitle">Oops. Looks like you took a wrong turn.</div>
          <button onClick={handleGoBack}>Go back</button>
        </div>
      </div>
      </div>
    </>
  );
};

export default NotFoundPage;