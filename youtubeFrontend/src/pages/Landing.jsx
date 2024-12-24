import React from 'react';
import HorizontalScroll from '@/components/Category/Category';
import VideoCardList from '@/components/Video/VideoCardList';
import { useSelector } from 'react-redux';

const Landing = () => {
    const isExpanded = useSelector((state) => state.sidebar.isExpanded);
    return (
        <div className={`h-screen ${isExpanded ? 'lg:ml-36' : 'lg:ml-0'}`}>
            <HorizontalScroll />
            <VideoCardList />
        </div>
    );
}

export default Landing;
