import logoAvatar from "../assets/images/logo-avatar.webp";

export function getAvatar(avatar) {
  if (
    avatar == undefined ||
    avatar == null ||
    avatar == "null" ||
    avatar == "default" ||
    avatar == ""
  ) {
    return logoAvatar;
  }
  if (!avatar.includes("/storage/profile/")) {
    return avatar;
  } else {
    return import.meta.env.VITE_APP_ASSET_URL + avatar;
  }
}

export function getAsset(path) {
  if (path != null) {
    if (path[0] != "/") {
      return import.meta.env.VITE_APP_ASSET_URL + "/" + path;
    } else {
      return import.meta.env.VITE_APP_ASSET_URL + path;
    }
  } else {
    return "#";
  }
}

export function getStorage(path) {
  if (path != null) {
    return import.meta.env.VITE_APP_ASSET_URL + path;
  } else {
    return "#";
  }
}

export function getCsv(path, file_name) {
  if (path != null) {
    let base_url = import.meta.env.VITE_APP_ASSET_URL;
    return (
      base_url + "/download-csv" + "?path=" + path + "&file_name=" + file_name
    );
  } else {
    return "#";
  }
}
