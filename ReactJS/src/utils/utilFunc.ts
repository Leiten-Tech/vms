import * as CryptoJS from "crypto-js";
import { jwtDecode } from "jwt-decode";



// Encryption/ Decryption 
const encryptionKeyBase64 = "Lya+xesyf6A5T7OS4W/DSmeCjOa3pwI5E8ODgoKSPnw=";

// Helper function to encode to Base64Url
function base64UrlEncode(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Helper function to decode from Base64Url
function base64UrlDecode(base64Url) {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4;
  if (padding) {
    base64 += '='.repeat(4 - padding);
  }
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Generate token (encrypt)
export async function generateToken(text) {
  try {
    // Convert Base64 key to ArrayBuffer
    const keyBuffer = Uint8Array.from(
      atob(encryptionKeyBase64),
      c => c.charCodeAt(0)
    ).buffer;

    // Import key
    const key = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-CBC' },
      false,
      ['encrypt']
    );

    // Initialize IV with zeros
    const iv = new Uint8Array(16);

    // Encrypt the text
    const encodedText = new TextEncoder().encode(text);
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-CBC', iv },
      key,
      encodedText
    );

    // Return Base64Url encoded ciphertext
    return base64UrlEncode(encryptedBuffer);
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
}

// Decrypt token
export async function decryptToken(encryptedText) {
  try {
    // Convert Base64 key to ArrayBuffer
    const keyBuffer = Uint8Array.from(
      atob(encryptionKeyBase64),
      c => c.charCodeAt(0)
    ).buffer;

    // Import key
    const key = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-CBC' },
      false,
      ['decrypt']
    );

    // Initialize IV with zeros
    const iv = new Uint8Array(16);

    // Decode Base64Url and decrypt
    const encryptedData = base64UrlDecode(encryptedText);
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv },
      key,
      encryptedData
    );

    // Convert decrypted buffer to text
    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
}

// Encryption/ Decryption 


export const tLDS = (value) => {
  if (typeof value == "string") {
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } else {
    return value.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
};

export function blobToURL(file) {
  if (file) {
    const blob = new Blob([file], { type: file.type });
    const url = URL.createObjectURL(blob);
    return url;
  } else {
    console.error("No file selected.");
  }
}

export async function blobUrlToFile(blobUrl) {
  const response = await fetch(blobUrl);
  const blob = await response.blob();

  const urlParts = blobUrl.split("/");
  const fileName = urlParts[urlParts.length - 1] + ".png"; // Add .png extension

  const file = new File([blob], fileName, { type: "image/png" });

  return file;
}

// export function urlToFile(url) {
//   if (url) {
//     const filename = url.substring(url.lastIndexOf("/") + 1);
//     const type = filename.substring(filename.lastIndexOf(".") + 1);
//     return fetch(url)
//       .then((res) => res.blob())
//       .then((blob) => new File([blob], filename, { type: `image/${type}` }));
//   } else {
//     console.error("No URL provided.");
//     return null;
//   }
// }

export function urlToFile(url) {
  if (url) {
    const filename = url.substring(url.lastIndexOf("/") + 1);
    const extension = filename
      .substring(filename.lastIndexOf(".") + 1)
      .toLowerCase();

    // Map extensions to MIME types
    const mimeTypes = {
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      txt: "text/plain",
      doc: "application/msword",
      docx:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };

    const mimeType = mimeTypes[extension] || "application/octet-stream"; // Default to binary data

    return fetch(url)
      .then((res) => res.blob())
      .then((blob) => new File([blob], filename, { type: mimeType }));
  } else {
    console.error("No URL provided.");
    return null;
  }
}

export function fileToBlobURL(file) {
  if (file instanceof File) {
    const blob = new Blob([file], { type: file.type });
    const url = URL.createObjectURL(blob);
    return url;
  } else {
    console.error("Input is not a File object.");
    return null;
  }
}

export function formConvertion(
  input: any,
  companyFiles: any[],
  workerFiles: any[]
) {
  const formData: FormData = new FormData();

  for (var x in companyFiles) {
    formData.append("companyFiles", companyFiles[x], companyFiles[x].FileName);
  }
  for (var x in workerFiles) {
    formData.append(
      "workerFiles",
      workerFiles[x],
      workerFiles[x].FileName || workerFiles[x].DocumentName
    );
  }

  var WorkPermit = JSON.stringify(input);
  for (var pair of formData.entries()) {
  }

  formData.append("input", WorkPermit);
  return formData;
}

export function decodeToken(token: any) {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

export const checkTrial = () => {
  if (
    localStorage.getItem("data_AuthToken") &&
    localStorage.getItem("data_AuthToken") != null &&
    localStorage.getItem("data_AuthToken") != "null"
  ) {
    let decodedTokenVal: any = decodeToken(
      localStorage.getItem("data_AuthToken")
    );
    let trialLic = JSON.parse(decodedTokenVal.TrialLicense);
    return trialLic.transtatus
  }
  return false;
};

export function generateUniqueName(file) {
  const timestamp = Date.now();

  const sanitizedFileName = file.name.replace(/\s+/g, "_");

  return `${timestamp}_${sanitizedFileName}`;
}

export const genErr = (err: any) => {
  return JSON.stringify(err) || "Something Went Wrong, Please Logout & Login Again."
}