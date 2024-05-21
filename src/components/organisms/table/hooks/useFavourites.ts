import { useEffect, SetStateAction, Dispatch } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addFavourite, removeFavourite } from '@/redux/slices/legislationSlice';
import { ReduxState, Bill } from '../data-table';

export function useFavourites(
  setSnackbarOpen: Dispatch<SetStateAction<boolean>>,
  setSnackbarMessage: Dispatch<SetStateAction<string>>,
) {
  const dispatch = useDispatch();
  const favouritesSelector = useSelector((state: ReduxState) => state.legislation.favourites);

  useEffect(() => {
    const loadedFavourites = localStorage.getItem('favourites');
    if (loadedFavourites) {
      JSON.parse(loadedFavourites).forEach((favourite: Bill) => dispatch(addFavourite(favourite)));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favouritesSelector));
  }, [favouritesSelector]);

  const handleFavourite = (e: MouseEvent, bill: Bill) => {
    e.preventDefault();
    e.stopPropagation();
    const isFavourite = favouritesSelector.some((fav) => fav.uri === bill.uri);
    dispatch(isFavourite ? removeFavourite(bill) : addFavourite(bill));
    setSnackbarOpen(true);
    setSnackbarMessage(isFavourite ? 'Removed from favourites' : 'Added to favourites');
  };

  return { favourites: favouritesSelector, handleFavourite };
}
