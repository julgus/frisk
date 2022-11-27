import React from 'react'; 
import '../../App.css';
import CardTemplate from './CardTemplate';

/* HTML skeleton code was obtained from https://github.com/WebDevSimplified/skeleton-loading */ 

function PageSkeleton(props) {
    if (props.display == "grid") {
        return (
            <div className={'skeleton-grid'}>
                <CardTemplate/>
                <CardTemplate/>
                <CardTemplate/>
                <CardTemplate/>
                <CardTemplate/>
                <CardTemplate/>
                <CardTemplate/>
                <CardTemplate/>
                <CardTemplate/>
            </div>
        ); 
    } else {
        return (
            <div className={'skeleton-row'}>
                <CardTemplate/>
                <CardTemplate/>
                <CardTemplate/>
            </div>
        );
    }
}

export default PageSkeleton;