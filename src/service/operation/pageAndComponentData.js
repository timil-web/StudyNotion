import {toast} from "react-hot-toast"
import { apiconnector } from '../apiconnector';
import { catalogData } from '../apis';

export const getCatalogaPageData = async(categoryId) => {
    const toastId = toast.loading("Loading...");
    let result = [];
    try{
		console.log("????/",categoryId);
        const response = await apiconnector("POST", catalogData.CATALOGPAGEDATA_API, 
        {categoryId: categoryId,});

		console.log("????/",response);
        if(!response?.data?.success)
            throw new Error("Could not Fetch Category page data");

        result = response?.data;
		console.log("done");
    }
    catch(error) {
		console.log("CATALOG PAGE DATA API ERROR....", error);
		toast.error(error.message);
		result = error.response?.data;
    }
    toast.dismiss(toastId);
    return result;
}
