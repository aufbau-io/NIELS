import { mouseOnLink } from '$lib/store/store';

let setMouseOnLink = () => {
	mouseOnLink.set(true);
};

let setMouseOffLink = () => {
	mouseOnLink.set(false);
};

export { setMouseOnLink, setMouseOffLink };
