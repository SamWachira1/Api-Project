import spotTileStyle from './SpotTile.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect} from 'react';
import { getSpotReviewsThunk } from '../../store/review';
import { useNavigate } from "react-router-dom";
import OpenModalDelete from './OpenModelDelete';
import ConfirmationModal from './ConfirmationDelete';

const SpotTile = ({ spot, showButtons = false, isOwner}) => {
  const dispatch = useDispatch()
  const nav = useNavigate()
  

 

  const formattedPrice = spot.price ? `$${spot.price.toFixed(2)}` : 'Price not available';


  const handleUpdate = () => {
    if (isOwner) {
      nav(`/spots/${spot.id}/edit`);

    } else {
      // Handle the case where the user is not the owner
      alert("You are not authorized to update this spot.");
    }
  };




  return (

    <>

      <div className="spot-tile" onClick={() => nav(`/spots/${spot.id}`)}>
        <img className={spotTileStyle.imgTile} src={spot.previewImage} alt={spot.name} title={spot.name} />
        <div className="spot-details">
          <p>{spot.city}, {spot.state}</p>
          <p>Price: {formattedPrice} per night</p>

        </div>
      </div>

      <div>

        {showButtons && isOwner && (
          <div className={spotTileStyle.updateButtonContainer}>
            <button className={spotTileStyle.buttonUpdate} onClick={handleUpdate}>Update Spot</button>
          </div>

        )}

      </div>


      <div>
        {showButtons && isOwner && (
          <ul className={spotTileStyle.updateButtonContainer}>
            {/* Use OpenModalDelete component to open the confirmation modal */}
            <OpenModalDelete 
              modalComponent={<ConfirmationModal spot={spot} />} // Pass the confirmation modal component
              itemText="Delete Spot" // Text of the menu item that opens the modal
            />
          </ul>
        )}
      </div>


    </>



  );


};

export default SpotTile;
