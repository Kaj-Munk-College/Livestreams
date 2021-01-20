import firebase from "firebase/app";
import "firebase/storage";

/**
 * @param {string} userId user id of user got from firebase auth
 * @param {File} image
 * @returns Promise
 */
export function uploadImage(userId, image) {
  var storage = firebase.storage();

  var storageRef = storage.ref("uploads/" + userId);
  var imageRef = storageRef.child(makeid + image.type);

  return ref.put(image);
}

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
