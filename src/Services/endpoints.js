
// User APIs
export const LOGIN = 'users/login';
export const LOGOUT = 'users/logout';
export const SIGN_UP = 'users/signup';
export const USER_INFO = 'users/userInfo';
export const RESET_PASSWORD = 'users/reset';
export const USER_ACTIVATE = 'users/activate';
export const FORGOT_PASSWORD = 'users/forgot';
export const RESEND_VERIFICATION_CODE = 'users/resendCode'

export const GET_SIGNED_URL_FOR_UPLOAD = 'media/getSignedUrl/video';
export const GET_SIGNED_URL_FOR_THUMBNAIL = 'media/GetSignedUrl/thumbnail';
export const SAVE_META_DATA = 'media/metaData';

export const GET_UN_PUBLISHED_VIDEOS = 'control/getUnPublishedData';
export const GET_META_VIDEO = 'meta/getVideoDetails';

export const PUBLISH = 'control/publishVideo';
export const UN_PUBLISH = 'control/unPublishVideo';
export const GET_PUBLISHED_VIDEOS= 'media/home/getVideoMeta';

export const GET_CATEGORIES = 'control/getCategories';
export const CREATE_CATEGORIES = 'control/saveCategory';
export const DELETE_CATEGORIES = 'control/deleteCategory';

export const MY_PUBLISHED_VIDEOS = 'video/myVideosPublished';
export const MY_UNPUBLISHED_VIDEOS = 'video/myVideosUnPublished';

export const DELETE_BY_USER_RECORD = 'video/myVideos/deleteVideo';

export const DELETE_RECORD = 'control/removeVideo';

export const ADD_COMMENTS = 'meta/addComment';
export const FETCH_COMMENTS = 'meta/getComments';
export const GET_USER_META_VIDEO = 'meta/getUserMetaVideo';
export const LIKE_INTERACTION = 'meta/likeInteraction';
export const SEARCH_VIDEO = 'meta/search';

export const UPDATE_VIEWS = 'meta/videoView';
