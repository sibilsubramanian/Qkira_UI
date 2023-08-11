
import { toast } from 'react-toastify';

import * as URL from './endpoints';
import { axiosInstance } from './axios';
import { setCookie } from './cookie';

const config = { headers: { "content-type": "application/json", "Access-Control-Allow-Origin": '*'}};

export const signUp = async(email, password, confirmPassword, firstName, lastName, referrerCode) => {
    let payload = { email, password, confirmPassword, firstName, lastName };
    if(referrerCode) {
        payload = {
            ...payload,
            referrerCode
        };
    }
    try {
        const response = await axiosInstance.post(URL.SIGN_UP, payload, config);
        if (response.status === 200) {
            return response.data;
        }
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
    }
}

export const activateAccount = async(email, code) => {
    const payload = { email, code };
    try {
        const response = await axiosInstance.patch(URL.USER_ACTIVATE, payload, config);
        if (response.status === 200) {
            return response.data;
        }
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
    }
}

export const login = async(email, password) => {
    const payload = { email, password };
    try {
        const response = await axiosInstance.post(URL.LOGIN, payload, config);
        if (response.status === 200) {
            if (response.data.success) {
                const { message, accessToken} = response.data;
                toast.success(message);
                setCookie("accessToken", accessToken, 1)
            } else if(response.data.error) {
                toast.error("Invalid credentials!");
            }
            return response.data;
        }
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
    }
};

export const logout = async(email) => {
    let payload = { email };
    try {
        const response = await axiosInstance.post(URL.LOGOUT, payload, config);
        if (response.status === 200) {
            if (response.data.success) {
                const { message} = response.data;
                setCookie('accessToken', '', 0);
                toast.success(message);
            }
            return response.data;
        }
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
    }
};

export const forgotPassword = async(email) => {
    let payload = { email };
    try {
        const response = await axiosInstance.patch(URL.FORGOT_PASSWORD, payload, config);
        if (response.status === 200) {
            if (response.data.success) {
                toast.success(response.data.message);
            } else if (response.data.error) {
                toast.error("Invalid email!");
            }
            return response.data;
        }
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
    } 
}

export const resetPassword = async(code, newPassword, confirmPassword, email) => {
    let payload = { code, newPassword, confirmPassword, email};
    try {
        const response = await axiosInstance.patch(URL.RESET_PASSWORD, payload, config);
        if (response.status === 200) {
            if (response.data.success) {
                toast.success(response.data.message);
            }
            return response.data;
        }
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
    }
}

export const getUserInfo = async() => {
    try {
        const response = await axiosInstance.get(URL.USER_INFO, config);
        return response.data;
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
    }
}

export const getSignedUrlForUpload = async(payload) => {
    try {
        const response = await axiosInstance.post(URL.GET_SIGNED_URL_FOR_UPLOAD, payload, config);
        return response.data;
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
        return { error: true };
    }
}

export const getSignedUrlForThumbnail = async(payload) => {
    try {
        const response = await axiosInstance.post(URL.GET_SIGNED_URL_FOR_THUMBNAIL, payload, config);
        return response.data;
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
        return { error: true };
    }
}
 
export const uploadVideoToS3 = async(url, header, payload) => {
    try {
        const response = await axiosInstance.post(url, payload, header);
        return response.data;
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
        return { error: true };
    }
}

export const saveMetaData = async(payload) =>{
    try {
        const response = await axiosInstance.post(URL.SAVE_META_DATA, payload, config);
        toast.success("New record added successfully");
        return {...response.data, success: true};
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
    }
}

export const getUnpublishedVideos = async(categoryName, limit = 10, indexKey = null) => {
    try {
        let url = `${URL.GET_UN_PUBLISHED_VIDEOS}/${categoryName}?limit=${limit}`;
        if (indexKey !== null) {
            url = `${URL.GET_UN_PUBLISHED_VIDEOS}/${categoryName}?limit=${limit}&indexKey=${indexKey}`;
        }
        const response = await axiosInstance.get(url, config);
        return response.data;
    } catch (e) {
        console.info(e);
        toast.error(e.response.data.message);
        return { items: []};
    }
}

export const getVideo = async(key) => {
    try {
        const url = `${URL.GET_META_VIDEO}/${key}`;
        const response = await axiosInstance.get(url, config);
        return response.data;
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
        return { error: true };
    }
}

export const approveRecord = async(paylaod) => {
    try {
        const response = await axiosInstance.post(URL.PUBLISH, paylaod, config);
        toast.success("Approved Successfully!");
        return response.data;
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
    }
}

export const rejectRecord = async(payload) => {
    try {
        const response = await axiosInstance.post(URL.UN_PUBLISH, payload, config);
        toast.success("Reject Successfully!");
        return response.data;
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
    }
}

export const getPublishedVideos = async(categoryName, limit = 10, indexKey = null) => {
    try {
        let url = `${URL.GET_PUBLISHED_VIDEOS}/${categoryName}?limit=${limit}`;
        if (indexKey !== null) {
            url = `${URL.GET_PUBLISHED_VIDEOS}/${categoryName}?limit=${limit}&indexKey=${indexKey}`;
        }
        const response = await axiosInstance.get(url, config);
        return response.data;
    } catch (e) {
        // toast.error(e.response.data.message);
        console.info(e);
        return { items: []};
    }
}

export const getCategories = async() => {
    try {
        const response = await axiosInstance.get(URL.GET_CATEGORIES, config);
        return response.data;
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
    }
}

export const createCategories = async(payload) => {
    try {
        const response = await axiosInstance.post(URL.CREATE_CATEGORIES, payload, config);
        toast.success("New Category got added Successfully!");
        return response.data;
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
    }
}

export const addComments = async(payload) => {
    try {
        const response = await axiosInstance.post(URL.ADD_COMMENTS, payload, config);
        toast.success("Comment added Successfully");
        return response.data;
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
    }
}

export const getComments = async(paylaod) => {
    try {
        const response = await axiosInstance.post(URL.FETCH_COMMENTS, paylaod, config);
        return response.data;
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
    }
}

export const likeAction = async(paylaod) => {
    try {
        const response = await axiosInstance.post(URL.LIKE_INTERACTION, paylaod, config);
        return response.data;
    } catch (e) {
        console.info(e);
    }
}

export const deleteCategory = async(paylaod) => {
    try {
        const response = await axiosInstance.delete(URL.DELETE_CATEGORIES, {...config, data: paylaod});
        toast.success(`Category: ${paylaod.categoryName} got deleted Successfully!`);
        return response.data;
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
    }
}

export const deleteVideoByAdmin = async(payload) => {
    try {
        const response = await axiosInstance.delete(URL.DELETE_RECORD, {...config, data: payload});
        toast.success("Record got deleted Successfully");
        return response.data;
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
    }
}

export const deleteVideoByUser = async(payload) => {
    try {
        const response = await axiosInstance.delete(URL.DELETE_BY_USER_RECORD, {...config, data: payload});
        toast.success("Record got deleted Successfully");
        return response.data;
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
    }
}

export const getUserMetaVideoDetails = async(key) => {
    try {
        const url = `${URL.GET_USER_META_VIDEO}/${key}`;
        const response = await axiosInstance.get(url, config);
        return response.data;
    } catch (e) {
        console.info(e);
        return null;
    }
}

export const getMyPublishedVideos = async(categoryName) => {
    try {
        const url = `${URL.MY_PUBLISHED_VIDEOS}/${categoryName}`;
        const response = await axiosInstance.get(url, config);
        return response.data;
    } catch (e) {
        console.info(e);
        return [];
    }
}

export const getMyUnPublishedVideos = async(categoryName) => {
    try {
        const url = `${URL.MY_UNPUBLISHED_VIDEOS}/${categoryName}`;
        const response = await axiosInstance.get(url, config);
        return response.data;
    } catch (e) {
        console.info(e);
        return [];
    }
}

export const getSearchData = async(searchText) => {
    try {
        const url = `${URL.SEARCH_VIDEO}/${searchText}`;
        const response = await axiosInstance.get(url, config);
        return response.data;
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
        return [];
    }
}

export const resendVerificationCode = async(email) => {
    let payload = { email };
    try {
        const response = await axiosInstance.patch(URL.RESEND_VERIFICATION_CODE, payload, config);
        if (response.status === 200) {
            if (response.data.success) {
                toast.success(response.data.message);
            }
            return response.data;
        }
    } catch (e) {
        toast.error(e.response.data.message);
        console.info(e);
    } 
}

export const updateViewCount = async(key) => {
    try {
        const url = `${URL.UPDATE_VIEWS}/${key}`;
        const response = await axiosInstance.put(url, config);
        return response.data;
    } catch (e) {
        console.info(e);
        return null;
    }
}