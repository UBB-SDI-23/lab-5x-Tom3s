import React, { useEffect } from 'react';
import './Boxes.css';
import { apiAccess } from '../models/endpoints';
import { Box } from '../models/entities';
import listElementFromEnity from './ListElement';

function DisplayBoxes() {
  const [boxes, setBoxes] = React.useState([]);

  useEffect(() => {
    const emptyBox = {
      _id: "",
      length: 0,
      width: 0,
      height: 0,
      material: "",
      color: ""
    };
    const emptyBoxArray: any = [emptyBox, emptyBox, emptyBox, emptyBox, emptyBox, emptyBox];
    setBoxes(emptyBoxArray);
    fetch(new apiAccess().boxes().url)
      .then(response => response.json())
      .then(data => setBoxes(data));
  }, []);
  return (
    <div className="display-list-div">
			<div className="display-list">
        {boxes.map((box: Box) => listElementFromEnity(box, new apiAccess().boxes().url))}
      </div>
    </div>
  );
}

export default DisplayBoxes;
