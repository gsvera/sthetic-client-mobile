import * as FileSystem from 'expo-file-system';
import CryptoJS from "crypto-js";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"; 
import { Linking, Platform } from 'react-native';

const secretKeyPass = process.env.EXPO_PUBLIC_SECRET_KEY;
dayjs.extend(customParseFormat);

/**
 * Funcion para encryptar el password para antes de enviarlo a cual quier peticion de servicios, el @param secretKeyPass debe ser el mismo que el de back
 * @param text 
 * @returns 
 */
export const parsePasswordEncrypt = (text:string) => {
  if(!secretKeyPass) {
    throw new Error("Secret key is not defined");
  }
  
  const key = CryptoJS.enc.Utf8.parse(secretKeyPass);

  // Cifrar el texto
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};

/**
 * Convierte un valor numerico a formato de moneda, @param digits hace referencia al numero de digitos a utilizar por default es 2
 * @param n @type number | undefined
 * @param digits @type number
 * @returns 
 */
export const convertCurrency = (n:number | undefined, digits: number = 2) => {
  if(n) {
    let currencyLocal = Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: digits
    });
  
    return currencyLocal.format(n);
  }
};

/**
 * Convierte a base 64 los videos
 * @param uri 
 * @returns 
 */
export const getBase64FromVideo = async (uri:any) => {
    return await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  };

  /**
   * Convierte un string de fecha a formato fecha dependiendo el "formatString" por default es "DD/MM/YYYY"
   * @param date 
   * @param formatString
   * @returns 
   */
export const convertDateToGeneralFormat = (date:string | undefined, formatString: string = "DD/MM/YYYY") => {
  if(date) return dayjs(date).format(formatString)
}

/**
 * Convierte un string de hora y minuto a formato AM o PM 
 * @param hour en formato HH:MM A
 * @returns 
 */
export const convertHourToAMorPM = (hour: string) => {
  return dayjs(hour, "HH:mm").format("hh:mm A");
}

/**
 * @description Abre un link proporcionado en otra ventana
 * @param url 
 *  
 */
export async function openLink (url: string){
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

/**
 * @description abre el mapa del dispositivo y puntea en el mapa en base a la latitu y longitud proporcionada
 * @param latitude 
 * @param longitude 
 * @param label 
 * @returns 
 */
export const openMap = (
    latitude: number | undefined,
    longitude: number | undefined,
    label = "Ubicación" 
  ) => {
  if(!latitude || !longitude) return
  const latLng = `${latitude},${longitude}`;

  const url = Platform.select({
    ios: `http://maps.apple.com/?ll=${latLng}&q=${label}`,
    android: `geo:${latLng}?q=${latLng}(${label})`,
  });

  Linking.openURL(url!).catch((err) =>
    console.error("Error abriendo mapa", err)
  );
};