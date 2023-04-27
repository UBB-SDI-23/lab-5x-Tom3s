import React, { useEffect } from 'react';
import { apiAccess } from '../models/endpoints';
import { Wrapper } from '../models/entities';
import listElementFromEnity from './ListElement';

function DisplayWrappers() {
  const [wrappers, setWrappers] = React.useState([]);


  useEffect(() => {
    const emptyWrapper = {
      _id: "",
      length: 0,
      width: 0,
      pattern: "",
      color: "",
      complementaryColor: ""
    };
    const emptyWrapperArray: any = [emptyWrapper, emptyWrapper, emptyWrapper, emptyWrapper, emptyWrapper, emptyWrapper];
    setWrappers(emptyWrapperArray);
    fetch(new apiAccess().wrappers().url)
      .then(response => response.json())
      .then(data => setWrappers(data));
  }, []);
  return (
    <div className="display-list-div">
			<div className="display-list">
        {wrappers.map((wrapper: Wrapper) => listElementFromEnity(wrapper))}
      </div>
    </div>
  );
}

export default DisplayWrappers;
