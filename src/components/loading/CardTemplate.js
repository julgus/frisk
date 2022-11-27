import React from 'react'; 
import '../../App.css';

/* HTML skeleton code was obtained from https://github.com/WebDevSimplified/skeleton-loading */ 

function CardTemplate(props) {
    return (
            <div className="skeleton-card">
            <div className="skeleton-header">
                <div className="skeleton-title" data-title>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text"></div>
                </div>
            </div>
            <div data-body>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text"></div>
                <div className="skeleton skeleton-text"></div>
            </div>
            </div>
              )
}

export default CardTemplate;